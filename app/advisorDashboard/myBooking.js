"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import { useState } from "react";
import CalenderSmallEvent from "../components/myCalender/calenderSmallEvent";
import { DateTime } from "luxon";
import CalendarBigEvent from "../components/myCalender/calenderBig";



export default function MyBookingPage() {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    //dummy data
    const dummyEvents = [
        {
            id: 1,
            title: 'Advisory Session with John Doe',
            client: 'John Doe',
            advisor: 'Jordan Smith',
            date: "2025-09-16",
            start_time: "18:00:00",
            description: 'I need some advise on my front-end project',
            end_time: "20:00:00",
        },
        {
            id: 2,
            title: 'Advisory Session with May Chan',
            client: 'May Chan',
            advisor: 'Jordan Smith',
            date: "2025-09-22",
            start_time: "12:00:00",
            description: 'I need some advise on my front-end project',
            end_time: "14:00:00",
        },
    ]

    const handleEventClick = (e) => {
        setSelectedEvent(e);
        setIsOpen(true);
    }

    return(
        <main className="min-h-screen">
            <h1 className="text-3xl font-bold text-center text-[#E55B3C] mb-2">
                My Calendar
            </h1>

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                // convert data for Full Calendar use
                events={dummyEvents.map(event => ({
                    ...event,
                    start: `${event.date}T${event.start_time}`
                }))}
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