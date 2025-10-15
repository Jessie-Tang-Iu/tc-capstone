import Navbar from "../components/NavBarBeforeSignIn";
import ClerkSignUp from "../components/auth/memberSignUp";



export default function SignUp() {
    return(
        <main className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-4xl text-[#DD5B45] text-center font-bold mt-20 mb-2">Create Your Account</h1>
                <p className="text-black text-center mb-10">Connect with Alberta top tech professionals.</p>
                <ClerkSignUp />
            </div>
        </main>
    )
}