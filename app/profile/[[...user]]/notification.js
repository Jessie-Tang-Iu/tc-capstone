import { Mail, Phone } from "lucide-react";


export default function Notification({ formData, setFormData }) {
    
    const handleNotificationChange = (type, method, value) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [type]: {
                ...prev.notifications[type],
                [method]: value
                }
            }
        }));
    };

    const NotificationRow = ({ title, type }) => (
        <div className="flex items-center justify-between py-1">
            <span className="text-sm font-medium text-black">{title}</span>
            <div className="flex gap-3">
                <button
                    onClick={() => handleNotificationChange(type, 'email', !formData.notifications[type]?.email)}
                    className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${
                    formData.notifications[type]?.email
                        ? 'bg-[#E55B3C] text-white hover:bg-[#E55B3C]/80'
                        : 'bg-orange-200 text-black hover:bg-orange-300'
                    }`}
                >
                    <Mail size={24} className='w-5 h-5'/>
                </button>
                <button
                    onClick={() => handleNotificationChange(type, 'phone', !formData.notifications[type]?.phone)}
                    className={`px-4 py-1 rounded-full text-sm font-bold transition-colors ${
                    formData.notifications[type]?.phone
                        ? 'bg-[#E55B3C] text-white hover:bg-[#E55B3C]/80'
                        : 'bg-orange-200 text-black hover:bg-orange-300'
                    }`}
                >
                    <Phone size={24} className='w-5 h-5'/>
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 px-5 h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
            {/* Message and comment */}
            <section className="mb-6 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-2 text-2xl font-semibold text-[#E55B3C]">Message and comment</h2>
                <div>
                    <NotificationRow title="New message received" type="newMessage" />
                    <NotificationRow title="New comment received from your post" type="newComment" />
                </div>
            </section>

            {/* <hr className="border-gray-300" /> */}

            {/* Connection */}
            <section className="mb-6 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-2 text-2xl font-semibold text-[#E55B3C]">Connection</h2>
                <div>
                    <NotificationRow title="New connection request" type="newConnection" />
                </div>
            </section>

            {/* <hr className="border-gray-300" /> */}

            {/* Account */}
            <section className="mb-6 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-2 text-2xl font-semibold text-[#E55B3C]">Account</h2>
                <div>
                    <NotificationRow title="Account updated" type="accountUpdated" />
                    <NotificationRow title="Verifications" type="verifications" />
                </div>
            </section>

            {/* <hr className="border-gray-300" /> */}

            {/* Event */}
            <section className="mb-6 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-2 text-2xl font-semibold text-[#E55B3C]">Event</h2>
                <div>
                    <NotificationRow title="Event registered" type="eventRegistered" />
                    <NotificationRow title="Two days before the registered event" type="eventReminder" />
                    <NotificationRow title="Event update (change of date, location or cancellation)" type="eventUpdate" />
                </div>
            </section>

            {/* <hr className="border-gray-300" /> */}

            {/* Setting Message */}
            <section className="mb-6 rounded-xl bg-white p-6 shadow">
                <h2 className="mb-2 text-2xl font-semibold text-[#E55B3C]">Setting Message</h2>
                <div>
                    <NotificationRow title="Message from admin" type="messageFromAdmin" />
                    <NotificationRow title="Account error" type="accountError" />
                </div>
            </section>
        </div>
    );
}