import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const UserContext = createContext();

export const useUsercontext = () => {
    const context = useContext(UserContext);
    if(!contact) {
        Alert.alert("Session expired", "Please sign in again.");
        router.push("./signIn");
        throw new Error("");
    }
    return context;
}

export const UserContextProvider = ({ children }) => {

    const [user, setUser] = useState();
    const [session, setSession] = useState();
    const [profile, setProfile] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();

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
                    fetchProfile(session.user.id);
                } else {
                    setProfile(null);
                }
            }
        );

        initializeAuth();

        return () => { subscription.unsubscribe(); };
    }, []);

    const fetchProfile = async (id) => {
        try {
            const { data, error } = await supabase
            .from("user")
            .select("id, username, firstName, lastName, email, phone, birthDate, dateClosed, shortBio, status")
            .eq("id", id)
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

    const signIn = async (username, password) => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({username, password});
            if(error) {
                throw new Error(error.message);
            }

            setSession(data.session);
            setUser(data.user);
            await fetchProfile(data.user.id);

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

    const contextValue = { user, session, profile, isLoading, signIn, signOut, updateProfile };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    )
}