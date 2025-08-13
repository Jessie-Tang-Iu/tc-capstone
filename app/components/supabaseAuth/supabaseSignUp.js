'use client';


import { signUp } from "@/lib/supabase_auth";
import { addUser, getAllUsers } from "@/lib/user_crud";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";




const SupabaseAuthSignUp = () => {

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

    const registerUser = async (e) => {
        e.preventDefault();
        
        if ( !username || !firstName || !lastName || !email || !password ) {
            setError("* All required fields must be filled. ");
            return;
        }
        setLoading(true);
        setError(null);
        let newProfile = {
            username: username,
            firstname: firstName,
            lastname: lastName,
            email: email,
            phone: phone,
            birthdate: birthDate,
            date_closed: dateClosed,
            shortBio: shortBio,
            status: "active"
        };

        try {
            await signUp(email, password);
            await addUser(newProfile);
            router.push('/signIn');
        } catch (error) {
            setError(error.message || String(error));
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
        <form onSubmit={(e) => registerUser(e)}>
        <div className="bg-[#F3E1D5] rounded-2xl p-10 lg:w-200 justify-center items-center">
            <h1 className="text-[#DD5B45] text-2xl font-bold mb-7">Required Information</h1>
            {error && <p className="text-red-600 font-bold">{error}</p>}
            <div className="text-black">

                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <label className="text-black">Email Address</label>
                        <input
                        required
                                type="text" 
                                className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100" 
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
                                className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100" 
                                onChange={(e) => setPassword(e.target.value)} 
                                value={password}
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <label className="text-black">First Name</label>
                        <input
                        required
                                type="text" 
                                className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100" 
                                placeholder="First Name" 
                                onChange={(e) => setFirstName(e.target.value)} 
                                value={firstName}
                        />
                    </div>
                    
                    <div className="flex flex-col">
                        <label className="text-black">Last Name</label>
                        <input
                        required
                                type="text" 
                                className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100" 
                                placeholder="Last Name" 
                                onChange={(e) => setLastName(e.target.value)} 
                                value={lastName}
                        />
                    </div>
                </div>

                <div className="flex flex-row justify-between">
                    <div className="flex flex-col">
                        <label className="text-black">Username</label>
                        <input
                        required
                                type="text" 
                                className="px-2 py-1 mb-3 w-72 mr-5 rounded bg-[#E2B596] focus:bg-orange-100" 
                                placeholder="Username" 
                                onChange={(e) => setUsername(e.target.value)} 
                                value={username}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="text-black">Phone Number</label>
                        <input
                        required
                                type='number' 
                                className="px-2 py-1 mb-3 w-72 rounded bg-[#E2B596] focus:bg-orange-100" 
                                placeholder="1234567890" 
                                onChange={(e) => setPhone(e.target.value)} 
                                value={phone}
                        />
                    </div> 
                </div>

                <button
                    type="submit"
                    className="bg-black text-white rounded px-3 py-2 w-72 mt-10 hover:bg-green-500 active:bg-amber-400 mx-auto block"
                >Sign Up</button>
            </div>
        </div>

            {/* <button
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-gray-600">
                {isSignIn 
                        ? "Don't have an account? Sign Up" 
                        : 'Already have an account? Sign In'}
            </button> */}
        </form>
        </div>
    )
}

export default SupabaseAuthSignUp;