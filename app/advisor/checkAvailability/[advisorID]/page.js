"use client";

import MemberNavbar from "@/app/components/MemberNavBar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { DateTime } from "luxon";


export default function CheckAvailabilityPage({ params }) {

    const [advisoryAvailability, setAdvisoryAvailability] = useState([]);

    const router = useRouter();
    const { advisorID } = use(params);

    useEffect(() => {

        if (!advisorID) return;
    
            (async () => {
                try {
                    const res = await fetch(
                        `/api/advisory_bookings/advisor?advisorId=${encodeURIComponent(advisorID)}`
                    );
                    if (!res.ok) {console.error("Failed to fetch events"); return;}
              
                    const data = await res.json();
    
                    const mappedEvents = data.map(event => ({
                        id: event.booking_id,
                        title: event.status,
                        date: event.date,
                        start_time: event.starttime,
                        end_time: event.endtime,
                        description: event.description,
                        type: event.status,
                    }));
    
                    setAdvisoryAvailability(mappedEvents);
                    console.log("Mapped Event: ", mappedEvents);
                } catch (error) {
                    console.error("Fetch error: ", error);
                }
            })();
        
    }, [advisorID]);
    
    const handleBackToAdvisorList = () => {
        router.push('/advisor');
    }

    return(
        <main className='bg-gray-100 min-h-screen'>
            <MemberNavbar />
            <div className="max-w-6xl mx-auto px-6 py-10">
                <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-2">&lt; Back to Advisor List</button>
                {/* header */}
                <div className='mb-10 text-center'>
                    <h1 className="text-3xl font-bold text-[#E55B3C]">Check Availability</h1>
                </div>

                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridWeek"
                    events={advisoryAvailability.map(event => {
                        const dateOnly = event.date.split("T")[0];
                        return {
                            ...event,
                            start: `${dateOnly}T${event.start_time}`,
                            end: `${dateOnly}T${event.end_time}`
                        };
                    })}
                    eventContent={(eventInfo) => {
                        const type = eventInfo.event.extendedProps.type;
                        const colorClass =
                            type === 'open' ? '#B4DDFF' : '#64D991';
    
                        const startTime = DateTime.fromJSDate(eventInfo.event.start).toFormat("h:mm a");
                        return (
                            <div 
                                style={{ backgroundColor: colorClass }} 
                                className="w-full px-4 py-2 rounded text-sm text-black flex flex-col"
                            >
                                <div>
                                    {startTime}
                                </div>
                                    {eventInfo.event.title}
                            </div>
                        )
                    }}
                />

                {/* Calendar Style */}
                <style jsx global>
                    {`.fc {
                    font-family: 'Inter', sans-serif;
                    color: black;
                    height: 750px;
                    }

                    .fc .fc-daygrid-day-frame {
                    padding: 3px;
                    min-height: 100px;
                    min-width: 90px;
                    }

                    .fc-daygrid-day:hover {
                    background-color: #f3f4f6; /* Tailwind's gray-100 */
                    }

                    .fc .fc-button {
                    background-color: #E55B3C;
                    color: white;
                    border: none;
                    }

                    .fc-toolbar {
                    color: #E55B3C;
                    }
                    `}
                </style>
            </div>
        </main>
    );
}