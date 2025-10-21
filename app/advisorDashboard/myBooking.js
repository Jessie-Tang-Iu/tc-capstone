"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { useEffect, useState } from "react";
import CalenderSmallEvent from "../components/myCalender/calenderSmallEvent";
import { DateTime } from "luxon";
import CalendarBigEvent from "../components/myCalender/calenderBig";



export default function MyBookingPage({advisorId}) {

    const [isOpen, setIsOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        if (!advisorId) return;

        (async () => {
            try {
                const res = await fetch(
                    `/api/advisory_bookings/advisor?advisorId=${encodeURIComponent(advisorId)}`
                );
                if (!res.ok) {console.error("Failed to fetch events"); return;}
          
                const data = await res.json();

                // Filter data to only include booked events
                const bookedEvents = data.filter(event => event.status === "booked");

                const mappedEvents = bookedEvents.map(event => ({
                    id: event.booking_id,
                    title: `Advisory Session`,
                    date: event.date,
                    start_time: event.starttime,
                    end_time: event.endtime,
                    description: event.description,
                }));

                setEvents(mappedEvents);
                console.log(mappedEvents);
            } catch (error) {
                console.error("Fetch error: ", error);
            }
        })();
      }, [advisorId]);

    const handleEventClick = (e) => {
        setSelectedEvent(e);
        setIsOpen(true);
    }

    return(
        <main className="min-h-screen">
            
            <div className="py-10 rounded-xl bg-white shadow">

                <h1 className="text-3xl font-bold text-center text-[#E55B3C] mb-5">
                    My Calendar
                </h1>

                <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    // convert data for Full Calendar use
                    events={events.map(event => {
                        const dateOnly = event.date.split("T")[0];
                        return {
                            ...event,
                            start: `${dateOnly}T${event.start_time}`,
                            end: `${dateOnly}T${event.end_time}`
                        };
                    })}
                    eventClick={handleEventClick}
                    eventContent={( eventInfo ) => {
                        try {
                            const startTime = DateTime.fromJSDate(eventInfo.event.start).toFormat("h:mm a");
                        return (
                            <CalenderSmallEvent
                                time={startTime}
                                title={eventInfo.event.title}
                            />
                        );
                        } catch (error) {
                            return <div>{eventInfo.event.title}</div>;
                        }
                    }}
                />
            </div>
            

            {isOpen===true &&
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
                >
                    <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <CalendarBigEvent
                            workshop={selectedEvent}
                            onClose={() => setIsOpen(false)}
                        />
                        {console.log("Selected Event: ", selectedEvent)}
                    </div>
                </div>
            }

            {/* Calendar Style */}
            <style jsx global>
                {`.fc {
                font-family: 'Inter', sans-serif;
                color: black;
                height: 750px;
                margin: 0px 50px;
                }

                .fc .fc-daygrid-day-frame {
                padding: 8px;
                min-height: 100px;
                min-width: 80px;
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
        </main>
    );
}