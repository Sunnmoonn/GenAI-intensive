export interface SubtitleLine {
  start: number;
  end: number;
  ru: string;
  en: string;
}

export interface Scene {
  id: number;
  videoUrl: string;
  subtitles: SubtitleLine[];
}

export const scenes: Scene[] = [
  {
    id: 1,
    videoUrl: "/videos/IMG_2165.MP4",
    subtitles: [
      { start: 0, end: 3.72, ru: "Был полным в школе, потом худел, потом приезжал в Москву,", en: "He used to be overweight at school, then lost weight, then moved to Moscow," },
      { start: 3.72, end: 9.36, ru: "раскабанел до 86 килограмм на фастфуде.", en: "and ballooned up to 86 kg on fast food." },
      { start: 9.36, end: 12.48, ru: "Потом снова сильно похудел. А ты прям быстро набираешь вес?", en: "Then lost a lot again. Do you gain weight really fast?" },
      { start: 12.48, end: 15.48, ru: "Очень быстро. Я за неделю набрал 12 килограмм.", en: "Very fast. I gained 12 kilograms in one week." },
      { start: 15.48, end: 16.48, ru: "Как это происходит?", en: "How does that happen?" },
      { start: 16.48, end: 18.48, ru: "Просто жрёшь как не в себя — и всё.", en: "You just eat like crazy — that's all." },
      { start: 18.48, end: 21.44, ru: "На съёмке пьёшь водичку, ешь по чуть-чуть,", en: "On set you drink water, eat tiny amounts," },
      { start: 21.44, end: 25.52, ru: "чтобы в кадре хорошо выглядеть, а потом берёшь всё и начинаешь жрать.", en: "to look good on camera — then you grab everything and go to town." },
      { start: 25.52, end: 29.08, ru: "Я помню, когда у нас были съёмки в Казахстане,", en: "I remember when we were filming in Kazakhstan," },
      { start: 29.16, end: 37.24, ru: "я съел за 10–12 часов съёмки около 10 порций обедов для команды.", en: "I ate about 10 crew meals in 10-12 hours of shooting." },
      { start: 37.24, end: 39.40, ru: "Ты же артист — ты работаешь в кадре.", en: "You're a performer — you work in front of the camera." },
      { start: 39.40, end: 44.32, ru: "Да. Как артист, я должен быть ответственным, следить за внешностью", en: "Yes. As a performer I should be responsible, take care of my appearance" },
      { start: 44.32, end: 48.08, ru: "и угождать всем. Но я не такой человек...", en: "and please everyone. But I'm not that kind of guy..." },
      { start: 48.08, end: 49.68, ru: "Ну это дико непрофессионально.", en: "That's wildly unprofessional." },
      { start: 49.68, end: 51.76, ru: "Я нигде не говорю, что я профессионал.", en: "I never claimed to be a professional." },
      { start: 52.96, end: 59.92, ru: "Понимаешь, я такой же человек, как и все.", en: "You know, I'm just like everyone else." },
    ],
  },
  {
    id: 2,
    videoUrl: "/videos/IMG_2166.MP4",
    subtitles: [
      { start: 0, end: 6.66, ru: "Не вздумайте в себе сомневаться,", en: "Don't you dare doubt yourself," },
      { start: 6.66, end: 13.04, ru: "когда кто-то говорит, что у вас что-то не получится,", en: "when someone tells you that you won't make it," },
      { start: 13.08, end: 16.36, ru: "что вы чего-то недостойны,", en: "that you're not worthy of something," },
      { start: 18.32, end: 20.32, ru: "что это слишком сложно —", en: "that it's too hard —" },
      { start: 22.64, end: 26.80, ru: "это никогда не должно вас останавливать от того, чего вы хотите.", en: "that should never stop you from what you truly want." },
      { start: 26.96, end: 29.56, ru: "Вы должны делать это всё, несмотря ни на что.", en: "You must do it all, no matter what." },
      { start: 31.00, end: 34.00, ru: "Если не получается — подойдите с другой стороны.", en: "If it doesn't work — approach it from a different angle." },
      { start: 35.00, end: 38.00, ru: "Если не получается — это не значит, что не получится никогда.", en: "If it doesn't work — it doesn't mean it'll never work." },
      { start: 38.00, end: 43.00, ru: "Это значит, что чуть-чуть не тот способ — вот и всё.", en: "It just means the approach is slightly off — that's all." },
      { start: 44.00, end: 49.00, ru: "Есть всегда другие углы, всегда можно зайти с другой стороны.", en: "There are always other angles — you can always come at it differently." },
      { start: 49.00, end: 57.00, ru: "Главное — не отказываться от мечты, потому что у кого-то её нет.", en: "The main thing is not to give up your dream, because some people don't have one." },
      { start: 57.00, end: 61.00, ru: "Если вам повезло так сильно, что у вас есть мечта —", en: "If you're lucky enough in life to have a dream —" },
      { start: 62.00, end: 65.00, ru: "отказываться от неё вы не имеете права.", en: "you have no right to give it up." },
    ],
  },
  {
    id: 3,
    videoUrl: "/videos/IMG_2167.MP4",
    subtitles: [
      { start: 0, end: 2, ru: "Я очень мечтала, чтобы он был мой первый и последний.", en: "I always dreamed he would be my first and last." },
      { start: 2, end: 5, ru: "Вот это вообще не интересно — больше не с кем знакомиться.", en: "That's just not interesting — no one else to meet." },
      { start: 6, end: 8, ru: "Конечно, я просила.", en: "Of course, I asked him." },
      { start: 8, end: 10, ru: "Я говорила: почему ты мне не делаешь предложение?", en: "I said: why won't you propose to me?" },
      { start: 10, end: 12, ru: "Потому что для меня всё понятно.", en: "Because for me everything is clear." },
      { start: 12, end: 15, ru: "Я поняла, что люблю его, — почти сразу.", en: "I realized I loved him — almost immediately." },
      { start: 15, end: 17, ru: "Мне не нужно было больше ничего.", en: "I needed nothing else." },
      { start: 17, end: 21, ru: "Я хотела отказаться от всего, лишь бы быть с ним.", en: "I was ready to give up everything just to be with him." },
      { start: 21, end: 25, ru: "Если мы любим друг друга — почему нет?", en: "If we love each other — then why not?" },
      { start: 25, end: 27, ru: "Ты говоришь мне, что любишь меня.", en: "You tell me you love me." },
      { start: 27, end: 31, ru: "Он говорит: да, конечно люблю, хочу с тобой быть.", en: "He says: yes, of course I love you, I want to be with you." },
      { start: 31, end: 35, ru: "Почему тогда ты не делаешь предложение?", en: "Then why won't you propose?" },
      { start: 35, end: 39, ru: "Чего ждать? Может, просто поживём вместе?", en: "What are we waiting for? Maybe we should just live together?" },
      { start: 39, end: 43, ru: "Пожили, пока работали? Пожили на карантине?", en: "Lived while we worked? Lived through quarantine?" },
      { start: 43, end: 45, ru: "И что он говорил на это?", en: "And what did he say to that?" },
      { start: 45, end: 47, ru: "Он говорит: не указывай мне.", en: "He says: don't tell me what to do." },
      { start: 45, end: 999, ru: "Я сам решу, когда тебе сделать предложение.", en: "I'll decide myself when to propose." },
    ],
  },
  {
    id: 4,
    videoUrl: "/videos/IMG_2168.MP4",
    subtitles: [
      { start: 0, end: 4.2, ru: "Очередные хейтеры появились у Ани,", en: "New haters showed up for Anya," },
      { start: 4.2, end: 6.32, ru: "которые обсуждают её поход в ночной клуб.", en: "discussing her trip to a night club." },
      { start: 6.32, end: 9.92, ru: "Там был смешной диалог: всё здорово, обалденный диджей —", en: "There was a funny exchange: everything was great, the DJ was awesome —" },
      { start: 9.92, end: 14.08, ru: "но на столе танцевать — ну это как-то странно.", en: "but dancing on the table — that's kind of weird." },
      { start: 14.08, end: 17.92, ru: "Она так со мной поспорила по этому поводу.", en: "She argued with me about it." },
      { start: 17.92, end: 21.92, ru: "А потом написала всей прессе: «Извини, может, он был прав».", en: "Then she messaged all the press: 'Sorry, maybe he was right.'" },
      { start: 21.92, end: 24.24, ru: "Я не то что был прав — она просто поняла то, о чём я говорил.", en: "It's not that I was right — she just understood what I was telling her." },
    ],
  },
  {
    id: 5,
    videoUrl: "/videos/IMG_2169.MP4",
    subtitles: [
      { start: 0, end: 3.52, ru: "А почему до сих пор сбываются предсказания Ванги и Нострадамуса?", en: "Why are Vanga's and Nostradamus's predictions said to come true?" },
      { start: 3.52, end: 4.52, ru: "Не сбываются.", en: "They don't." },
      { start: 4.52, end: 5.52, ru: "Ни одно не сбылось?", en: "Not a single one?" },
      { start: 5.52, end: 6.52, ru: "Нет.", en: "No." },
      { start: 6.52, end: 8.68, ru: "Список предсказаний Нострадамуса. Список предсказаний Ванги.", en: "List of Nostradamus's predictions. List of Vanga's predictions." },
      { start: 8.68, end: 11.32, ru: "Ноль попаданий. А почему все говорят, что...?", en: "Zero hits. So why does everyone say...?" },
      { start: 11.32, end: 17.16, ru: "Потому что люди подтягивали события под фейковые предсказания Ванги из газет.", en: "Because people squeezed events to fit fake Vanga predictions printed in newspapers." },
      { start: 17.16, end: 25.26, ru: "В газетах печатали ненастоящие предсказания, основанные на времени их выхода.", en: "Newspapers printed fake predictions based on the time they were published." },
      { start: 25.26, end: 26.26, ru: "Нострадамус — это вообще отдельная история.", en: "Nostradamus is a whole different story." },
      { start: 26.26, end: 32.12, ru: "Он писал настолько абстрактные вещи — любое совпадение надо сильно натянуть.", en: "He wrote such abstract things — any match requires a massive stretch." },
      { start: 32.12, end: 36.36, ru: "На самом деле — ноль из ста, я бы так назвал эти попадания.", en: "In reality — zero out of a hundred. That's how I'd rate those hits." },
    ],
  },
  {
    id: 6,
    videoUrl: "/videos/IMG_2170.MP4",
    subtitles: [
      { start: 0, end: 5, en: "All my best decisions came from asking: what would I do if I was the main character in my book?", ru: "Все мои лучшие решения приходили, когда я спрашивал: что бы я сделал, если бы был главным героем своей книги?" },
      { start: 5, end: 7, en: "The answer is always: you would take the risk.", ru: "Ответ всегда один — ты бы рискнул." },
      { start: 7, end: 9, en: "I used to read a lot when I was little.", ru: "В детстве я очень много читал." },
      { start: 9, end: 14, en: "I used to stay up way too late because I couldn't leave the characters in a bad spot.", ru: "Засиживался допоздна — не мог бросить героев в трудный момент." },
      { start: 14, end: 18, en: "And I realized: if I could start treating myself like that and my life like that,", ru: "И я понял: если начать относиться к себе так же," },
      { start: 18, end: 23, en: "I would be more likely to have a story I would want to watch or read.", ru: "то моя жизнь стала бы историей, которую захочется прочитать." },
      { start: 23, end: 25, en: "And you never know when you're going to arrive at the destination.", ru: "И никогда не знаешь, когда доберёшься до цели." },
      { start: 25, end: 29, en: "There is no telling how long the book is going to be while it's still being written.", ru: "Пока книга пишется — нельзя знать, сколько в ней будет страниц." },
      { start: 29, end: 38, en: "I don't think about their last page — it doesn't tell you much about their story and accomplishments.", ru: "Я не думаю об их последней странице — она мало говорит об их истории и достижениях." },
      { start: 38, end: 43, en: "It was just the last page.", ru: "Это была просто последняя страница." },
      { start: 43, end: 47, en: "I want my story to be interesting enough that when I've written my last page,", ru: "Я хочу, чтобы моя история была такой интересной, что когда я напишу последнюю страницу —" },
      { start: 47, end: 50, en: "people will want to read all the other pages.", ru: "людям захочется прочитать все остальные." },
    ],
  },
  {
    id: 7,
    videoUrl: "/videos/IMG_2171.MP4",
    subtitles: [
      { start: 0, end: 4, ru: "Их счастье зависит от действий других.", en: "Their happiness depends on the actions of others." },
      { start: 4, end: 8, ru: "Ты вкладываешься в то, что не можешь контролировать.", en: "You invest in something you can't control." },
      { start: 8, end: 10, ru: "И это никогда не может быть стабильно.", en: "And that can never be stable." },
      { start: 10, end: 15, ru: "Мои терапевты говорили мне о внутренней опоре.", en: "My therapists talked to me about my inner foundation." },
      { start: 15, end: 18, ru: "Я всегда хочу жить внутри себя,", en: "I always want to live within myself," },
      { start: 18, end: 23, ru: "зная, что когда я там — это нельзя отнять у меня.", en: "knowing that when I'm there — you can't take that away from me." },
      { start: 23, end: 999, ru: "Вот что это значит для меня.", en: "That's what it means to me." },
    ],
  },
  {
    id: 8,
    videoUrl: "/videos/IMG_2172.MP4",
    subtitles: [
      { start: 0, end: 7, ru: "Одна из самых больших ошибок — думать, что нужно меняться ради других.", en: "One of the biggest mistakes is thinking you need to change yourself for others." },
      { start: 7, end: 16, en: "I spent too much time trying to fit myself into other people's molds,", ru: "Я тратил слишком много времени, пытаясь вписаться в чужие рамки," },
      { start: 16, end: 23, en: "instead of finding people that fit mine.", ru: "вместо того чтобы найти людей, которые подойдут мне." },
      { start: 23, end: 36, en: "When you're deliberate about growing on your own, not relying on others,", ru: "Когда ты целенаправленно растёшь самостоятельно, не полагаясь на других," },
      { start: 36, end: 45, en: "you get a head start — you discover who you are.", ru: "ты получаешь фору — ты узнаёшь, кто ты есть." },
      { start: 45, end: 57, en: "And it gets easier to go after the things you love.", ru: "И становится намного легче идти за тем, что ты любишь." },
    ],
  },
  {
    id: 9,
    videoUrl: "/videos/IMG_2173.MP4",
    subtitles: [
      { start: 0, end: 999, ru: "Иногда молчание говорит больше, чем любые слова.", en: "Sometimes silence speaks louder than any words." },
    ],
  },
  {
    id: 10,
    videoUrl: "/videos/IMG_2174.MP4",
    subtitles: [
      { start: 0, end: 9, ru: "Я хотела вернуться к тому, в чём была хороша. Я знаю, что люблю это.", en: "I wanted to go back to something I knew I was good at. I know I love it." },
      { start: 9, end: 18, en: "I'm working on my voice and my instrument — I feel like I can do so much more than before.", ru: "Я работаю над голосом и инструментом — чувствую, что могу делать гораздо больше, чем раньше." },
      { start: 18, end: 21, ru: "И в итоге, парень, ты делаешь это — и это невероятно.", en: "And in the end, man, you're doing it — and it's incredible." },
      { start: 21, end: 25, ru: "Спасибо. Я правда не могла петь — реально не могла.", en: "Thank you. I really couldn't sing — I genuinely couldn't." },
      { start: 25, end: 30, ru: "Я помню то время, когда не могла петь.", en: "I remember when I couldn't sing." },
      { start: 30, end: 34, ru: "Но серьёзно начала работать над вокалом только недавно.", en: "But I only seriously started working on vocals recently." },
      { start: 34, end: 999, ru: "Я люблю этот проект — это обновлённая версия того, что я делала в начале.", en: "I love this project — it's an updated version of what I did at the very beginning." },
    ],
  },
];
