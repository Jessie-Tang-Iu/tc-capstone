import { supabase } from "./supabaseClient";

// helpers
const norm = (s) => (s || "").trim().toLowerCase();

const toUiProfile = (row) =>
  row
    ? {
        id: row.id,
        email: row.email,
        username: row.username,
        firstName: row.firstname,
        lastName: row.lastname,
        status: row.status,
        role: row.role,
      }
    : null;

export async function createUser(
  firstname,
  lastname,
  status = "active",
  username = null
) {
  const {
    data: { user: authUser },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !authUser?.email) throw new Error("Not signed in");

  const payload = {
    email: norm(authUser.email),
    firstname,
    lastname,
    status,
    username,
  };

  const { data, error } = await supabase
    .from("user")
    .upsert(payload, { onConflict: "email", ignoreDuplicates: false })
    .select("*")
    .limit(1);

  if (error) throw error;
  return toUiProfile(data?.[0]);
}

export async function getAllUsers() {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .order("id", { ascending: true });
  if (error) throw error;
  return (data || []).map(toUiProfile);
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return toUiProfile(data);
}

export async function addUser(item) {
  const {
    data: { user: authUser },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !authUser?.email) throw new Error("Not signed in");

  const payload = {
    email: norm(authUser.email),
    firstname: item.firstName ?? item.firstname ?? "",
    lastname: item.lastName ?? item.lastname ?? "",
    username: item.username ?? "",
    status: item.status ?? "active",
  };

  const { data, error } = await supabase
    .from("user")
    .upsert(payload, { onConflict: "email", ignoreDuplicates: false })
    .select("*")
    .limit(1);

  if (error) throw error;
  return toUiProfile(data?.[0]);
}

// Update (only minimal fields)
export async function updateUser(id, updates) {
  const {
    data: { user: authUser },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !authUser?.email) throw new Error("Not signed in");

  const dbUpdates = {
    ...(updates.firstName !== undefined
      ? { firstname: updates.firstName }
      : {}),
    ...(updates.lastName !== undefined ? { lastname: updates.lastName } : {}),
    ...(updates.username !== undefined ? { username: updates.username } : {}),
    ...(updates.status !== undefined ? { status: updates.status } : {}),
  };

  const { data, error } = await supabase
    .from("user")
    .update(dbUpdates)
    .eq("id", id)
    .eq("email", norm(authUser.email))
    .select("*")
    .limit(1);

  if (error) throw error;
  return toUiProfile(data?.[0]);
}

export async function deleteUser(id) {
  const {
    data: { user: authUser },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !authUser?.email) throw new Error("Not signed in");

  const { error } = await supabase
    .from("user")
    .delete()
    .eq("id", id)
    .eq("email", norm(authUser.email));

  if (error) throw error;
  return true;
}

export async function ensureProfile(defaults = {}) {
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user?.email) throw new Error("Not signed in");

  const email = (user.email || "").trim().toLowerCase();
  const meta = user.user_metadata || {};
  const nonEmpty = (v) =>
    v !== undefined && v !== null && String(v).trim() !== "";

  // 1) Look for an existing row
  let { data: existing, error: fetchErr } = await supabase
    .from("user")
    .select("*")
    .eq("email", email)
    .limit(1);
  if (fetchErr) throw fetchErr;
  if (existing && existing.length) return toUiProfile(existing[0]);

  // 2) Create minimal row, preferring metadata over empty defaults
  await addUser({
    username:
      (nonEmpty(defaults.username) && defaults.username) ||
      meta.username ||
      email.split("@")[0] ||
      "",
    firstName:
      (nonEmpty(defaults.firstName) && defaults.firstName) ||
      (nonEmpty(meta.firstName) && meta.firstName) ||
      "",
    lastName:
      (nonEmpty(defaults.lastName) && defaults.lastName) ||
      (nonEmpty(meta.lastName) && meta.lastName) ||
      "",
    status: nonEmpty(defaults.status) ? defaults.status : "active",
  });

  // 3) Read back
  let { data: created, error: createErr } = await supabase
    .from("user")
    .select("*")
    .eq("email", email)
    .limit(1);
  if (createErr) throw createErr;
  return created && created.length ? toUiProfile(created[0]) : null;
}
