"use client";

import MemberNavbar from "@/app/components/MemberNavBar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { RxCross2 } from "react-icons/rx";
import Button from "@/app/components/ui/Button";
import { useUser } from "@clerk/nextjs";


export default function CheckAvailabilityPage({ params }) {

    const [advisoryAvailability, setAdvisoryAvailability] = useState([]);
    const [isClicked, setIsClicked] = useState(false);
    const [bookingId, setBookingId] = useState(Number);
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [message, setMessage] = useState("");

    const router = useRouter();
    const { advisorID } = use(params);

    const userContext = useUser();
    const userID = userContext?.user?.id;

    useEffect(() => {

        if (!advisorID) return;
    
        getAvailability();
        
    }, [advisorID]);

    const getAvailability = async () => {
        if (!advisorID) return;

        try {
            const res = await fetch(
                `/api/advisory_bookings/advisor?advisorId=${encodeURIComponent(advisorID)}`
            );
            if (!res.ok) {console.error("Failed to fetch events"); return;}
        
            const data = await res.json();

            const mappedEvents = data
                .filter(event => event.status === 'open')   // only 'open' time slots are showing up
                .map(event => ({
                id: event.booking_id,
                title: event.status,
                date: event.date,
                start_time: event.starttime,
                end_time: event.endtime,
                description: event.description,
                type: event.status,
            }));

            setAdvisoryAvailability(mappedEvents);
            // console.log("Mapped Event: ", mappedEvents);
        } catch (error) {
            console.error("Fetch error: ", error);
        }
    }
    
    const handleBackToAdvisorList = () => {
        router.push('/advisor');
    }

    const handleBooking = (e) => {
        // open the window
        setIsClicked(true);

        // get the bookingId
        setBookingId(e.event.id);

        // get the date, start and end time
        const date = DateTime.fromJSDate(e.event.start).toLocaleString(DateTime.DATE_MED);
        const start = DateTime.fromJSDate(e.event.start).toFormat("h:mm a");
        const end = DateTime.fromJSDate(e.event.end).toFormat("h:mm a");
        setDate(date);
        setStartTime(start);
        setEndTime(end);
        console.log("userID type:", typeof userID, "value:", userID);
        console.log("bookingId type:", typeof e.event.id, "value:", e.event.id);
    }

    const handleCloseWindow = () => setIsClicked(false);

    const handleConfirmBooking = async (e) => {
        setMessage(e.target.value);
        console.log("message: ", message);

        const booking = {
            bookingId: bookingId,
            clientId: userID,
            description: message,
        }
        console.log("booking: ", booking);

        try {
            const res = await fetch('/api/advisory_bookings', {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(booking)
                });

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error in booking (api):", errorData.error);
                return;
            }

        getAvailability(); // refresh the calendar

        } catch (error) {
            console.error("Error in booking: ", error);
            alert("Booking Failed. Please try again later.");
            return;
        }

        alert("Booking Confirmed!");

        // close the window
        setIsClicked(false);
    }
    return(
        <main className='bg-gradient-to-br from-[#f8eae2] to-white min-h-screen pb-10'>        
            <MemberNavbar />

            <div className='w-4/5 mx-auto mt-10'>
                {/* Page Navigator */}
                <button onClick={handleBackToAdvisorList} className="text-[20px] text-black font-semibold mb-2">&lt; Back to Advisor List</button>

                {/* header */}
                <div className='mb-10 text-center'>
                    <h1 className="text-3xl font-bold text-[#E55B3C]">Check Availability</h1>
                </div>

                <div className="p-10 rounded-xl bg-white shadow">
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
                    eventClick={handleBooking}
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
                </div>

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

            {isClicked===true &&
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
                >
                    <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white p-6 rounded-xl shadow-xl text-black relative w-full max-w-lg mx-auto">
                            <button onClick={handleCloseWindow} title="Close">
                                <RxCross2
                                    className="cursor-pointer text-gray-600 hover:text-black"
                                    size={20}
                                />
                            </button>
                            <div className="flex flex-col items-center">
                                <h1 className="text-2xl font-bold text-[#E55B3C] mb-2">
                                    Confirm Booking?
                                </h1>
                                <p className="text-gray-700">Date: {date}</p>
                                <p className="text-gray-700 mb-10">Time: {startTime} - {endTime}</p>
                                <p className="text-gray-700">Leave a message to your advisor</p>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded my-4 px-3 py-2"
                                    rows="4"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)} />
                                <div>
                                    <button
                                        onClick={handleCloseWindow}
                                        type="button"
                                        className="w-40 font-semibold px-6 py-2 rounded-md mr-8 bg-[#D9D9D9] transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95"
                                    >Cancel</button>
                                    <Button text="Confirm Booking" onClick={handleConfirmBooking} />
                                </div>
                                
                            </div>
                            
                        </div>
                    </div>
                </div>
            }
        </main>
    );
}