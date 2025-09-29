"use client";

import { useRouter } from "next/navigation";
import { getSession } from "@/lib/supabase_auth";
import { getUserByEmail } from "@/lib/user_crud";
import { createContext, use, useContext, useEffect, useState } from  "react";

const UserContext = createContext();

export const useUserContext = () => {

    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
}

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [role, setRole] = useState(null);

    const router = useRouter();

    const getCurrentSession = async () => {
        try {
            const session = await getSession();
            setEmail(session?.user?.email || '');
            if (!session) { 
                router.push('/signIn');
            } else {
                const p = await getUserByEmail(session?.user?.email);
                if (!p) {
                    setError("Signed in, but profile could not be created due to RLS.");
                    return;
                }
        
                // reflect on UI
                setUser(p);
            }
        } catch (error) {
            console.error("Error fetching session:", error);
            alert("Error", "Failed to fetch session. Please sign in again.");
        }
    };
    
    useEffect(() => {
        getCurrentSession();
    }, []);

    // useEffect(() => {
    //     setUser(user);
    //     if (user) {
    //         setEmail(user.email);
    //         setRole(user.role);
    //     }
    // }, [user]);

    return (
        <UserContext.Provider value={{ user, email, role, setUser, setEmail, setRole, getCurrentSession }}>
            {children}
        </UserContext.Provider>
    )
}