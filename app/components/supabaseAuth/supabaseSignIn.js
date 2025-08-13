'use client';


import { signIn, signUp } from "@/lib/supabase_auth";
import { addUser, getAllUsers } from "@/lib/user_crud";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";




const SupabaseAuth = () => {

    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState();
    const [dateClosed, setDateClosed] = useState();
    const [shortBio, setShortBio] = useState("");
    const [status, setStatus] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSignIn, setIsSignIn] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [profile, setProfile] = useState();
    const [users, setUsers] = useState([]);

    const router = useRouter();

    const handleAuth = async (e) => {
        e.preventDefault();

        if(!email || !password) {
            setError("Email and password are required");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (isSignIn) {
                await signIn(email, password);
                setIsAuthenticated(true);
                console.log("Successfully signed in. Redirecting...");
                router.push('/');   // Redirect to home on successful sign in
            } 
        } catch (error) {
            console.log(error);
            setError(error?.message || String(error));
        } finally {
            setLoading(false);
        }
    };

    const fetchAllUsers = async (e) => {
        try {
            setLoading(true);
            const data = await getAllUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching all users: ', error);
            Alert.alert('Error ', 'Failed to load all users data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllUsers();
    }, [isAuthenticated]);

    useEffect(() => {
        const getProfile = () => {
            const thisProfile = users.find((user) => user.email === email) || null;
            setProfile(thisProfile);
        };
        getProfile();
    }, [users])

    useEffect(() => {
        setFirstName(`${profile?.firstName}` || "Guest");
        setLastName(`${profile?.lastName}` || "Guest");
        setStatus(`${profile?.status}` || "Guest");
    }, [profile])


    return (
        <div className="flex justify-center items-center">
        <form onSubmit={(e) => handleAuth(e)}>
        <div className="bg-[#F3E1D5] rounded-2xl p-10 flex flex-row lg:w-250 justify-center items-center">
            <div className="text-[#DD5B45] font-bold p-5 flex-2/3">
                <img src="/logo.jpeg" alt="Logo" className="w-40 h-40 rounded-2xl shadow-2xl mb-7 mx-auto" />
                <p className=" text-5xl">Hello!</p>
                <p className=" text-2xl">Community.</p>
                <p className=" text-2xl">Purpose.</p>
                <p className=" text-2xl mb-10">People First.</p>
                <p className="text-black font-normal">Imagine a world where Tech Talent, Job Seeker, and Entrepreneurs support each other</p>
            </div>
            <div className="w-px bg-gray-400 h-130 mx-4" />
            <div className="p-5 flex-1/3">
                <p className="text-black font-bold text-2xl mb-5">Welcome Back!</p>
                <p className="text-black text-sm">Do not have an account? <Link href="/signUp" className=" underline hover:text-blue-400">Create an account now</Link></p>
                <p className="text-black text-sm mb-2">It is FREE!</p>
                {error && <p className="text-red-600 font-bold">{error}</p>}
                <div className="flex flex-col">
                    <label className="text-black">Email Address</label>
                    <input
                    required
                            type="text" 
                            className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100 text-black" 
                            placeholder="Email Address" 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-black">Password</label>
                    <input
                    required
                            type="password" 
                            className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100  text-black" 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password}
                    />
                </div>                

                <button
                    type="submit"
                    className="bg-black text-white rounded px-3 py-2 w-72 hover:bg-green-500 active:bg-amber-400"
                >{isSignIn ? 'Sign In' : 'Sign Up'}</button>

                <p className="text-gray-600 text-sm mt-2 text-center">Forget Password? <Link href="#" className=" underline hover:text-blue-400">Click Here</Link></p>
            </div>
        </div>
        </form>
        </div>
    )
}

export default SupabaseAuth;