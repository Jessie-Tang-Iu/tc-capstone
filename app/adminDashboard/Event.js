"use client";

import { useEffect, useState } from "react";
import { getAllEvents, updateEventStatus } from "@/lib/workshop_crud";
import EventCard from "../components/event/eventCard";
import Button from "../components/ui/Button";
import { RxCross2 } from "react-icons/rx";




export default function EventsPanel() {

    const [events, setEvents] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [date, setDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [highlight, setHighlight] = useState("");
    const [price, setPrice] = useState(Number);

    const [dateErrorMessage, setDateErrorMessage] = useState("");
    const [startTimeErrorMessage, setStartTimeErrorMessage] = useState("");
    const [endTimeErrorMessage, setEndTimeErrorMessage] = useState("");
    const [isDisabled, setIsDisabled] = useState(false);

    useEffect(() => {
        async function fetchAndUpdateEvents() {
          const data = await getAllEvents();
          const now = new Date();
    
          // Auto-update events with past dates
          const updates = await Promise.all(
            data.map(async (event) => {
              const eventDate = new Date(event.date);
              if (event.status === "active" && eventDate < now) {
                await updateEventStatus(event.id, "completed");
                return { ...event, status: "completed" };
              }
              return event;
            })
          );
    
          setEvents(updates);
        }
    
        fetchAndUpdateEvents();
    }, []);

    const handleAddEventButton = () => {
        setIsOpen(true);
    }

    // get the local date time with correct time zone
    const getLocalDateTime = (offsetMs = 0) => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localDate = new Date(now.getTime() - offset *60 *1000 + offsetMs);
        return localDate.toISOString().slice(0, 16);
    }

    useEffect(() => {
        console.log(getLocalDateTime());

        const localDateTime = getLocalDateTime();
        const localEndTime = getLocalDateTime(2 * 60 * 60 * 1000)   // default as two hours later
        
        setDate(localDateTime.split('T')[0]);
        setStartTime(localDateTime.split('T')[1]);
        setEndTime(localEndTime.split('T')[1]); 
    }, []);

    const validationDateTimeCheck = (date, newStartTime, newEndTime) => {
        // reset value
        setDateErrorMessage("");
        setStartTimeErrorMessage("");
        setEndTimeErrorMessage("");
        setIsDisabled(false);

        const localTime = getLocalDateTime();
        const checkStartTime = `${date}T${newStartTime}`;
        const checkEndTime = `${date}T${newEndTime}`;
        console.log("Checked: ", checkStartTime);

        // validation check for date
        if (date < localTime.split('T')[0]) {
            setDateErrorMessage("Invalid date")
            setIsDisabled(true)};

        // validation check for start time
        if (checkStartTime < getLocalDateTime()) {
            setStartTimeErrorMessage("Invalid start time")
            setIsDisabled(true)};

        // validation check for end time
        if (checkEndTime <= checkStartTime) {
            setEndTimeErrorMessage("Invalid end time")
            setIsDisabled(true)};
    }

    const handleDateChange = (e) => {
        const newDate = e.target.value;
        console.log("New Date: ", newDate);
        validationDateTimeCheck(newDate,startTime, endTime);
        setDate(newDate);
    }

    const handleStartTimeChange = (e) => {
        const newStartTime = e.target.value;
        validationDateTimeCheck(date, newStartTime, endTime);
        setStartTime(newStartTime);
    }

    const handleEndTimeChange = (e) => {
        const newEndTime = e.target.value;
        validationDateTimeCheck(date, startTime, newEndTime);
        setEndTime(newEndTime);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDisabled) return;

        const eventData = {
            id: Math.max(...events.map(event => event.id)) +1,
            title,
            date,
            startTime, 
            endTime, 
            location, 
            description, 
            highlight, 
            price, 
            status: "active"
        };
        setEvents((prevEvents) => [eventData, ...prevEvents]);

        console.log("Submitting event:", eventData);
        setIsOpen(false);
    }

    return(
        <main>
            <Button onClick={handleAddEventButton} text="Add Event" />

            {/* List of All Events */}
            <div className="mt-3">
                {events.length > 0 ? (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 text-sm">No events found.</div>
                ) }
            </div>

            {/* Add Event Form */}
            {isOpen &&
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
                >
                    <div className="w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white p-6 rounded-xl shadow-xl text-black relative w-full max-w-lg mx-auto">
                            <button onClick={() => setIsOpen(false)} title="Close">
                                <RxCross2
                                    className="cursor-pointer text-gray-600 hover:text-black"
                                    size={20}
                                />
                            </button>
                            <h1 className="text-2xl font-bold text-center text-[#E55B3C] mb-2">
                                Add Event
                            </h1>

                            <form onSubmit={handleSubmit} className="flex flex-col mx-10 my-5">
                                <label>
                                    Title: 
                                </label>
                                <input
                                    type="text" 
                                    className="border rounded mb-3 px-1"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required/>
                                <label>
                                    Date: 
                                </label>
                                <input
                                    type="date" 
                                    className="border rounded px-1"
                                    value={date}
                                    onChange={handleDateChange}/>
                                <p className="text-red-400 mb-3">{dateErrorMessage}</p>
                                <label>
                                    Start Time: 
                                </label>
                                <input
                                    type="time"
                                    className="border rounded px-1"
                                    value={startTime}
                                    onChange={handleStartTimeChange}/>
                                <p className="text-red-400 mb-3">{startTimeErrorMessage}</p>
                                <label>
                                    End Time: 
                                </label>
                                <input
                                    type="time"
                                    className="border rounded px-1"
                                    value={endTime}
                                    onChange={handleEndTimeChange}/>
                                <p className="text-red-400 mb-3">{endTimeErrorMessage}</p>
                                <label>
                                    Location: 
                                </label>
                                <input
                                    type="text" 
                                    className="border rounded mb-3 px-1"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="online | The Platform"
                                    required/>  
                                <label>
                                    Description: 
                                </label>
                                <textarea
                                    className="border rounded h-20 mb-3 px-1"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required/>
                                <label>
                                    Highlight: 
                                </label>
                                <textarea
                                    className="border rounded h-15 mb-3 px-1"
                                    value={highlight}
                                    onChange={(e) => setHighlight(e.target.value)}/>
                                <label>
                                    Price: 
                                </label>
                                <input
                                    type="number" 
                                    className="border rounded px-1"
                                    value={price}
                                    onChange={(e)=> setPrice(e.target.value)}/>
                                <p className="text-red-400 mb-3"></p>
                                <p className="text-red-400 mb-3"></p>
                                <Button disabled={isDisabled} text="Submit" />                              
                            </form>
                        </div>
                    </div>
                </div>
            }
        </main>
    );
}