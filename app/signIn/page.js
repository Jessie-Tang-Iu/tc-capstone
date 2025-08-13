import Navbar from "../components/NavBarBeforeSignIn";
import SupabaseAuth from "../components/supabaseAuth/supabaseSignIn";



export default function SignIn() {

    return(
        <main className="bg-gray-100 min-h-screen">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <SupabaseAuth />
            </div>
            
        </main>
    )
}