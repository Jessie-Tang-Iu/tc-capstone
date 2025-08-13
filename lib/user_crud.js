import { supabase } from "./supabaseClient";

export async function createUser(firstname, lastname, status = "active") {
  const { data, error } = await supabase
    .from("users")
    .insert([{ firstname, lastname, status }]);
  if (error) throw error;
  return data;
}

export async function getAllUsers() {
  const { data, error } = await supabase.from("users").select("*").order("id");
  if (error) throw error;
  return data;
}

export async function getUserById(id) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function addUser(item) {
  const {data, error} = await supabase
    .from("user")
    .insert([item]);
  console.log("Added User Information");
  if (error) throw error;
  return data;
}

export async function updateUser(id, updates) {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
  return data;
}

export async function deleteUser(id) {
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw error;
  return true;
}