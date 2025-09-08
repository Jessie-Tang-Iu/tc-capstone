import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import Button from "../components/ui/Button";
import { DateTime } from "luxon";




export default function MyAvailability() {

    const dummyData = [
                    {title: 'Open', start: '2025-09-06T10:00:00', type: 'Open'},
                    {title: 'Open', start: '2025-09-07T11:00:00', type: 'Open'},
                    {title: 'Booked', start: '2025-09-07T20:00:00', type: 'Booked'},
                    {title: 'Open', start: '2025-09-09T10:00:00', type: 'Open'},
                    {title: 'Booked', start: '2025-09-10T10:00:00', type: 'Booked'},
                    {title: 'Open', start: '2025-09-10T11:00:00', type: 'Open'},
                    {title: 'Booked', start: '2025-09-12T11:00:00', type: 'Booked'}
                ]

    return(
        <main>
            <h1 className="text-3xl font-bold text-center text-[#E55B3C] mb-2">
                My Availability
            </h1>

            <Button text="Add Availability" />

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridWeek"
                events={dummyData}
                eventContent={(eventInfo) => {
                    const type = eventInfo.event.extendedProps.type;
                    const colorClass =
                        type === 'Open' ? '#B4DDFF' : '#64D991';

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
        </main>
    );
}