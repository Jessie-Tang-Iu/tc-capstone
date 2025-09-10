import React from 'react';
import Navbar from '../../components/MemberNavBar'
import advisors from '../../data/advisors.json'

export default function AdvisorPage({ params }) {
    const { advisorID } = params;

    const id = Number(advisorID);
    const advisor = advisors.find((c) => c.advisorID === id);


    return (
        <main className="bg-gray-100 min-h-screen text-black">
            <Navbar />
            <div className="mx-12 my-8 p-6 bg-white rounded-lg shadow-md">
                <h1 className="">{advisor.name}</h1>
                <p>{advisor.description}</p>

                <div>
                    <h2>Contact Information</h2>
                    <p>Phone: {advisor.phone}</p>
                    <p>Email: {advisor.email}</p>
                </div>

                <div>
                    <h2>Availability</h2>
                    <ul>
                        {Object.entries(advisor.availability).map(([day, hours]) => (
                            <li key={day}>
                                {day}: {hours ? `${hours.from} - ${hours.to}` : "Not Available"}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </main>
    );
}