import Link from "next/link";
import Navbar from "../components/NavBar";



export default function advisor() {

    return(
        <main className="bg-gray-100 min-h-screen">
            <Navbar />
            <div>
                <h1 className="text-5xl font-bold text-center mt-10 text-black">Advisor Page</h1>
            </div>
        </main>
    );
}