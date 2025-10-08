"use client";

import MemberNavbar from "@/app/components/MemberNavBar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRouter } from "next/navigation";

// dummy data
const dummyEvents = [
  {
    title: "Open",
    start: "2025-10-08T10:00:00",
    end: "2025-10-08T11:00:00",
  },
  {
    title: "Booked",
    start: "2025-10-09T14:00:00",
    end: "2025-10-09T15:00:00",
  },
  {
    title: "Open",
    start: "2025-10-10T09:30:00",
    end: "2025-10-10T10:00:00",
  }
];


export default function CheckAvailabilityPage() {

    const router = useRouter();

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
                    events={dummyEvents}
                    eventContent={(eventInfo) => {
                        const type = eventInfo.event.title.toLowerCase();
                        const colorClass =
                            type === 'open' ? '#B4DDFF' : '#64D991';

                        const startTime = new Date(eventInfo.event.start).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
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