import os
import json
import subprocess
import sys
import gspread
from google.oauth2.service_account import Credentials
from youtube_comment_downloader import YoutubeCommentDownloader, SORT_BY_POPULAR
from youtube_transcript_api import YouTubeTranscriptApi, NoTranscriptFound, TranscriptsDisabled

# ── Config ────────────────────────────────────────────────────────────────────
CREDS_PATH = "/Users/alsuabdulmanova/Downloads/affable-ace-493116-d1-07d992ca4e44.json"
SHEET_ID   = "1gMPeHlAEfSWazokkwvISiKqF0ITSZivTS-nRsyGOBdA"
VIDEOS = [
    "https://youtube.com/shorts/M0eEvFpfIMo",
    "https://youtube.com/shorts/g-nCoCmYx5s",
    "https://youtube.com/shorts/0HgnU6YDppI",
]
MAX_COMMENTS = 200   # cap per video to stay fast

PYTHON = sys.executable
YT_DLP  = os.path.expanduser("~/Library/Python/3.9/bin/yt-dlp")

# ── Google Sheets ─────────────────────────────────────────────────────────────
def get_sheet():
    scopes = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_file(CREDS_PATH, scopes=scopes)
    gc = gspread.authorize(creds)
    sh = gc.open_by_key(SHEET_ID)
    ws = sh.sheet1
    ws.clear()
    ws.append_row(["Video Title", "Description", "Transcription", "All Comments", "Pain Points Summary"])
    ws.format("A1:E1", {"textFormat": {"bold": True}})
    return ws

# ── Metadata ──────────────────────────────────────────────────────────────────
def get_metadata(url):
    result = subprocess.run(
        [YT_DLP, "--dump-json", "--no-playlist", url],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"  [warn] yt-dlp metadata failed: {result.stderr[:200]}")
        return "N/A", "N/A"
    data = json.loads(result.stdout)
    title = data.get("title", "N/A")
    desc  = data.get("description", "N/A") or "N/A"
    return title, desc

# ── Transcription ─────────────────────────────────────────────────────────────
def extract_video_id(url):
    # handles /shorts/ID and ?v=ID forms
    if "/shorts/" in url:
        return url.split("/shorts/")[1].split("?")[0]
    if "v=" in url:
        return url.split("v=")[1].split("&")[0]
    return url.split("/")[-1].split("?")[0]

def transcribe(url):
    video_id = extract_video_id(url)
    try:
        api = YouTubeTranscriptApi()
        transcript_list = api.list(video_id)
        transcript = next(iter(transcript_list))
        fetched = transcript.fetch()
        text = " ".join(e.text for e in fetched)
        return text.strip()
    except (NoTranscriptFound, TranscriptsDisabled) as e:
        print(f"  [warn] No transcript available: {e}")
        return "No transcript available for this video."
    except Exception as e:
        print(f"  [warn] Transcript fetch failed: {e}")
        return "N/A"

# ── Comments ──────────────────────────────────────────────────────────────────
def get_comments(url):
    downloader = YoutubeCommentDownloader()
    comments = []
    try:
        for c in downloader.get_comments_from_url(url, sort_by=SORT_BY_POPULAR):
            comments.append(c.get("text", ""))
            if len(comments) >= MAX_COMMENTS:
                break
    except Exception as e:
        print(f"  [warn] comment fetch failed: {e}")
    return comments

# ── Pain Points Summary ───────────────────────────────────────────────────────
def summarize_pains(comments):
    """
    Simple extractive summary: pick top comments with highest engagement signals
    (question marks, pain keywords) and format as bullet points.
    """
    pain_keywords = [
        "problem", "issue", "hard", "difficult", "struggle", "hate", "fail",
        "broken", "can't", "cannot", "never", "always", "why", "please",
        "fix", "bug", "annoying", "frustrated", "lost", "confused", "help",
        "bad", "terrible", "worst", "disappointed", "expensive", "slow",
    ]
    scored = []
    for c in comments:
        lower = c.lower()
        score = sum(1 for kw in pain_keywords if kw in lower)
        if "?" in c:
            score += 1
        if score > 0:
            scored.append((score, c))

    scored.sort(key=lambda x: -x[0])
    top = [c for _, c in scored[:10]]

    if not top:
        return "• No clear pain points detected in top comments."

    bullets = "\n".join(f"• {c.strip()[:200]}" for c in top)
    return bullets

# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    print("Connecting to Google Sheets…")
    ws = get_sheet()
    print("Connected.\n")

    for i, url in enumerate(VIDEOS, 1):
        print(f"[{i}/{len(VIDEOS)}] Processing: {url}")

        print("  Fetching metadata…")
        title, desc = get_metadata(url)
        print(f"  Title: {title[:80]}")

        print("  Downloading audio & transcribing…")
        transcript = transcribe(url)

        print("  Fetching comments…")
        comments = get_comments(url)
        print(f"  Got {len(comments)} comments.")

        all_comments_text = "\n---\n".join(comments)
        summary = summarize_pains(comments)

        row = [title, desc, transcript, all_comments_text, summary]
        ws.append_row(row)
        print(f"  Written to sheet.\n")

    print("Done! Open your Google Sheet to see the results.")

if __name__ == "__main__":
    main()
