import Link from "next/link";
import Navbar from "../components/NavBar";



export default function advisor() {

    return(
        <main className="bg-gray-100 min-h-screen">
            <Navbar />
            <p className="text-black text-center mb-10">This is advisor page</p>
            <ul>
                <li className="text-black mb-10">
                    John Dao <Link href="#">First Message</Link>
                </li>
            </ul>
        </main>
    );
}