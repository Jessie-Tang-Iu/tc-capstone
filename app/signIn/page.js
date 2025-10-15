import { Suspense } from "react";
import Navbar from "../components/NavBarBeforeSignIn";
import SignInTab from "../components/auth/SignIn";



export default function SignIn() {

    return(
        <main className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <Suspense fallback={<div>Loading...</div>}>
                    <SignInTab />
                </Suspense>
            </div>
        </main>
    )
}