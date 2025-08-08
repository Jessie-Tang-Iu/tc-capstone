import { serve } from "https://deno.land/std@0.168.0/http/server.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase
    .from("workshop")
    .update({ status: "completed" })
    .lt("date", today)
    .eq("status", "active");

  if (error) {
    console.error("Update failed:", error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ message: "Workshops auto-updated." }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});

// still working on this file, not ready for production
