"use client";

import { useRouter } from "next/navigation";
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

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setRole(user.role);
            switch (user.role) {
            case "admin":
                router.push("/adminDashboard/message");
                break;
            case "member":
                router.push("/memberFlow");
                break;
            case "employer":
                router.push("/employerDashboard/application");
                break;
            case "advisor":
                router.push("/advisorFlow");
                break;
            }
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, email, role, setUser, setEmail, setRole }}>
            {children}
        </UserContext.Provider>
    )
}