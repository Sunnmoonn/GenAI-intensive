import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

interface WebhookPayload {
  user_id: string;
  claims: Record<string, unknown>;
}

Deno.serve(async (req: Request) => {
  const payload: WebhookPayload = await req.json();

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data, error } = await supabase
    .from("profiles")
    .select("org_id, role")
    .eq("id", payload.user_id)
    .single();

  if (error || !data) {
    // Auth Hook must always return claims — return them without org_id,
    // OrgResolver will handle the fallback
    console.error("Auth Hook: profile not found for", payload.user_id, error);
    return Response.json({ claims: payload.claims });
  }

  return Response.json({
    claims: {
      ...payload.claims,
      org_id: data.org_id,
      user_role: data.role,
    },
  });
});
