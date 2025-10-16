"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from '@fullcalendar/daygrid';
import Button from "../components/ui/Button";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";




export default function MyAvailability({advisorId}) {

    const [events, setEvents] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [startTimeErrorMessage, setStartTimeErrorMessage] = useState("");
    const [endTimeErrorMessage, setEndTimeErrorMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);
    const [windowTitle, setWindowTitle] = useState("");
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
    
                    const mappedEvents = data.map(event => ({
                        id: event.booking_id,
                        title: event.status,
                        date: event.date,
                        start_time: event.starttime,
                        end_time: event.endtime,
                        description: event.description,
                        type: event.status,
                    }));
    
                    setEvents(mappedEvents);
                    console.log(mappedEvents);
                } catch (error) {
                    console.error("Fetch error: ", error);
                }
            })();
          }, [advisorId]);

    // get the local date time with correct time zone
    const getLocalDateTime = (offsetMs = 0) => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset *60 *1000 + offsetMs);
        return localDate.toISOString().slice(0, 16);
    }

    // default the start time and end time
    useEffect(() => {
        if (!startTime || !endTime) {
            setStartTime(getLocalDateTime());
            setEndTime(getLocalDateTime(2 * 60 * 60 * 1000)); // default as two hours later
        }
    }, [startTime, endTime]);

    const handleAddAvailability = () => {
        setStartTime(getLocalDateTime());
        setEndTime(getLocalDateTime(2 * 60 * 60 * 1000)); // default as two hours later
        setIsOpen(true);
        setWindowTitle("Add Availability");
        console.log("Start Time: ", startTime);
        console.log("End Time: ", endTime);
    }

    const handleCloseWindow = () => {
        setIsOpen(false);
    }

    const validationCheck = (newStartTime, newEndTime) => {
        // reset value
        setStartTimeErrorMessage("");
        setEndTimeErrorMessage("");
        setIsDisabled(false);

        // validation check for start time
        if (newStartTime < getLocalDateTime()) {
            setStartTimeErrorMessage("Invalid start time")
            setIsDisabled(true)};

        // validation check for end time
        if (newEndTime <= newStartTime) {
            setEndTimeErrorMessage("Invalid end time")
            setIsDisabled(true)};
    }

    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;
        validationCheck(newStartTime, endTime);
        setStartTime(newStartTime);
    }

    const handleEndTimeChange = (e) => {
        const newEndTime = e.target.value;
        validationCheck(startTime, newEndTime);
        setEndTime(newEndTime);
    }

    const handleSubmit = async () => {

        if (!startTimeErrorMessage && !endTimeErrorMessage) {

            const newDate = startTime.split("T")[0];
            const newStart = startTime.split("T")[1];
            const newEnd = endTime.split("T")[1];

            // Add to the list
            const newEvent = {
                advisorId: advisorId,
                date: newDate,
                start: newStart,
                end: newEnd,
                status: 'open' 
            };
            
            try {
                const res = await fetch('/api/advisory_bookings', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newEvent)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("Error adding availability:", errorData.error);
                    return;
                }

                const createdEvent = await res.json();

                // Update local events state so the calendar reflects new availability immediately
                setEvents(prev => [
                    ...prev,
                    {
                    id: createdEvent.booking_id,
                    title: createdEvent.status,
                    date: createdEvent.date,
                    start_time: createdEvent.starttime,
                    end_time: createdEvent.endtime,
                    description: createdEvent.description,
                    type: createdEvent.status,
                    }
                ]);

                console.log(createdEvent);

                setIsOpen(false);
            } catch (error) {
                console.error("Failed to add availability:", error);
            }
        }
    }

    const handleEventClick = (e) => {
        const startISO = DateTime.fromJSDate(e.event.start).toISO({ suppressSeconds: true, suppressMilliseconds: true }).slice(0,16);
        const endISO = DateTime.fromJSDate(e.event.end).toISO({ suppressSeconds: true, suppressMilliseconds: true }).slice(0,16);

        console.log(startISO, endISO);

        setStartTime(startISO);
        setEndTime(endISO);
        setIsOpen(true); 
        setWindowTitle("Change Availability");
        setSelectedEvent(e.event);
    }

    const handleDeleteEvent = async () => {
        console.log(selectedEvent.title);
        // Prevent Delete By Mistake
        if (selectedEvent.title === "booked") {
            const confirmDelete = window.confirm(
                "This timeslot is booked. Are you sure you want to delete it?"+
                "\nPlease confirm with your client before proceeding!"+
                "\nOK: To Keep Proceeding     Cancel: To Return"
            );
            // Cancel deletion
            if (!confirmDelete) {
                return; 
            }
        }

        try {
            const res = await fetch(`/api/advisory_bookings?bookingId=${selectedEvent.id}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const err = await res.json();
                console.error("Failed to delete availability:", err.error);
                return;
            }

            setEvents((prevEvents) => 
                prevEvents.filter((event) => event.id !== Number(selectedEvent.id)));

            setIsOpen(false);
            setSelectedEvent(null);
        } catch (error) {
            console.error("Error deleting availability:", error);
        }
    }

    const handleChangeTimeSlot = async () => {
        if (!startTimeErrorMessage && !endTimeErrorMessage) {

            // Prevent Change By Mistake
            if (selectedEvent.title === "booked") {
                const confirmDelete = window.confirm(
                    "This timeslot is booked. Are you sure you want to change it?"+
                    "\nPlease confirm with your client before proceeding!"+
                    "\nOK: To Keep Proceeding     Cancel: To Return"
                );
                // Cancel deletion
                if (!confirmDelete) {
                    return; 
                }
            }

            try {

                const newDate = startTime.split("T")[0];
                const newStart = startTime.split("T")[1];
                const newEnd = endTime.split("T")[1];

                // changing data
                const newEvent = {
                    bookingId: selectedEvent.id,
                    date: newDate,
                    start: newStart,
                    end: newEnd
                };
                const res = await fetch('/api/advisory_bookings', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newEvent)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    console.error("Error changing availability:", errorData.error);
                    return;
                }

                try {
                    const res = await fetch(
                        `/api/advisory_bookings/advisor?advisorId=${encodeURIComponent(advisorId)}`
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
    
                    setEvents(mappedEvents);
                    console.log(mappedEvents);
                } catch (error) {
                    console.error("Fetch error: ", error);
                }

                setIsOpen(false);
                setSelectedEvent(null);
            } catch (error) {
                console.error("Failed to change availability:", error);
            }
        }
    }
    

    return(
        <main className="px-10 py-7 rounded-xl bg-white shadow">
            <h1 className="text-3xl font-bold text-center text-[#E55B3C] mb-2">
                My Availability
            </h1>

            <Button onClick={handleAddAvailability} text="Add Availability" />

            {isOpen===true &&
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
                            <h1 className="text-2xl font-bold text-center text-[#E55B3C] mb-2">
                                {windowTitle}
                            </h1>

                            <div className="flex flex-col px-20 my-3">
                                <label>
                                    Start Time: 
                                </label>
                                <input 
                                    type="datetime-local"
                                    className="border h-8 px-2 rounded"
                                    value={startTime}
                                    onChange={handleStartTimeChange}></input>
                                <p className="text-red-500 mb-3">{startTimeErrorMessage}</p>

                                <label>
                                    End Time: 
                                </label>
                                <input 
                                    type="datetime-local"
                                    className="border h-8 px-2 rounded"
                                    value={endTime}
                                    onChange={handleEndTimeChange}></input>
                                <p className="text-red-500 mb-3">{endTimeErrorMessage}</p>
                            </div>

                            <div className="flex justify-center">
                                {windowTitle==="Add Availability" &&
                                <div>
                                    <button
                                        onClick={handleCloseWindow}
                                        type="button"
                                        className="font-semibold px-6 py-2 rounded-md mr-8 bg-[#D9D9D9] transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95"
                                    >Cancel</button>
                                    <Button 
                                        onClick={handleSubmit}
                                        disabled={isDisabled}
                                        text="Confirm" 
                                    />
                                </div>
                                }
                                {windowTitle==="Change Availability" &&
                                <div>
                                    <button
                                        onClick={handleDeleteEvent}
                                        type="button"
                                        className="font-semibold px-6 py-2 rounded-md mr-8 text-white bg-[#DA1919] transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95"
                                    >Delete</button>
                                    <button
                                        onClick={handleChangeTimeSlot}
                                        type="button"
                                        className="font-semibold px-6 py-2 rounded-md mr-8 text-white bg-[#65AD5C] transition duration-200 ease-in-out cursor-pointer focus:outline-none active:scale-95"
                                    >Confirm</button>
                                </div>
                                }
                            </div>
                            
                        </div>
                    </div>
                </div>
            }

            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridWeek"
                events={events.map(event => {
                    const dateOnly = event.date.split("T")[0];
                    return {
                        ...event,
                        start: `${dateOnly}T${event.start_time}`,
                        end: `${dateOnly}T${event.end_time}`
                    };
                })}
                eventClick={handleEventClick}
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
        </main>
    );
}