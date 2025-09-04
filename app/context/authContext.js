import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ensureProfile } from "@/lib/user_crud";
import { signIn } from "@/lib/supabase_auth";

const AuthContext = createContext();

export const useUserAuth = () => {
    const context = useContext(AuthContext);
    if(!context) {
        Alert.alert("Session expired", "Please sign in again.");
        router.push("./signIn");
        throw new Error("");
    }
    return context;
}

export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    // const [session, setSession] = useState();
    // const [profile, setProfile] = useState();
    const [role, setRole] = useState("");

    const router = useRouter();

    const signIn = async (username, password) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({username, password});
            if(error) {
                throw new Error(error.message);
            }

            setSession(data.session);
            setUser(data.user);
            await fetchProfile(data.user.email);

        } catch (error) {
            console.log(error);
        }  finally {
            setIsLoading(false);
        }
    };

    const signOut = async () => {
        setIsLoading(true);
        try {
            const {error} = await supabase.auth.signOut();

            if(error) {
                throw new Error(error.message);
            }

            setSession(null);
            setUser(null);
            setProfile(null);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const initializeAuth = async () => {
            setIsLoading(true);
            const {data : {session}} = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            if(session?.user) {
                await fetchProfile(session.user.id);
            } else {
                router.push("./signIn");
            }
            setIsLoading(false);
        };

        const {data : {subscription}} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                if(session?.user) {
                    fetchProfile(session.user.user_metadata.email);
                } else {
                    setProfile(null);
                }
            }
        );

        initializeAuth();

        return () => { subscription.unsubscribe(); };
    }, []);

    const fetchProfile = async (email) => {
        try {
            const { data, error } = await supabase
            .from("user")
            .select("*")
            .eq("email", email)
            .single();

            if (error) {
                console.log("Error fetching profile: ", error);
                return; 
            }

            setProfile(data);

        } catch (error) {
            console.log(error);
        }
    };

    const updateProfile = async (updates) => {
        
        if(!user) {
            throw new Error("No user is signed in.");
        }

        setIsLoading(true);

        try {
            const {error} = await supabase
            .from("user")
            .update(updates)
            .eq("id", user.id);

            if(error) {
                throw new Error(error.message);
            }

            setProfile((prev) => (prev ? { ...prev, ...updates } : null));
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    const contextValue = { user, profile, signIn, signOut, updateProfile };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}