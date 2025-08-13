// lib/supabase_auth.js
import { supabase } from "./supabaseClient";

const redirectOrigin =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || "";

// ---- Helpers ----
const normEmail = (email) => (email || "").trim().toLowerCase();
const throwIf = (error) => {
  if (error) {
    const msg = error.message || String(error);
    throw new Error(msg);
  }
};

// ---- Auth APIs ----
export const signUp = async (email, password, extraOptions = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email: (email || "").trim().toLowerCase(),
    password,
    options: {
      emailRedirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback`
          : process.env.NEXT_PUBLIC_SITE_URL
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
          : undefined,
      ...extraOptions, // <-- allows data: { ... }
    },
  });
  if (error) throw error;
  return data;
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: normEmail(email),
    password,
  });
  throwIf(error);
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  throwIf(error);
  return true;
};

export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  throwIf(error);
  return data.session || null;
};

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  throwIf(error);
  return data.user || null;
};

export const getAccessToken = async () => {
  const session = await getSession();
  return session?.access_token || null;
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(
    normEmail(email),
    {
      // This route should render a form that calls updatePassword()
      redirectTo: redirectOrigin ? `${redirectOrigin}/auth/reset` : undefined,
    }
  );
  throwIf(error);
  return data;
};

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  throwIf(error);
  return data;
};

// Optional: subscribe to auth changes (useful in _app or a client provider)
export const onAuthStateChange = (callback) => {
  const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
    callback?.(event, session);
  });
  return () => sub?.subscription?.unsubscribe?.();
};

export const signInMagic = async (email) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: normEmail(email),
    options: {
      emailRedirectTo: redirectOrigin
        ? `${redirectOrigin}/auth/callback`
        : undefined,
    },
  });
  throwIf(error);
  return data;
};
