import { supabase } from "./supabaseClient";

export const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });
    console.log("SIGNUP DATA:", data);
    console.log("SIGNUP ERROR:", error);
    if (error) {
        throw error;
    }
    return data;
};

export const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });
    console.log("SIGNIN DATA:", data);
    console.log("SIGNIN ERROR:", error);
    if (error) {
        throw error;
    }
    return data;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
};

export const getSession = async () => {
    const { data: {session}, error } = await supabase.auth.getSession();
    if (error) {
        throw error;
    }
    return session;
};

export const resetPassword = async (email , password) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
  return data;
}