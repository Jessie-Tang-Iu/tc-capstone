

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
        <div className="flex items-center justify-between py-2 bg-gray-100">
            <span className="text-base md:text-lg font-normal text-black">{title}</span>
            <div className="flex gap-3">
                <button
                    onClick={() => handleNotificationChange(type, 'email', !formData.notifications[type]?.email)}
                    className={`px-6 py-2 rounded-lg text-sm font-normal transition-colors ${
                    formData.notifications[type]?.email
                        ? 'bg-[#E55B3C] text-white hover:bg-[#E55B3C]/80'
                        : 'bg-orange-200 text-black hover:bg-orange-300'
                    }`}
                >
                    Email
                </button>
                <button
                    onClick={() => handleNotificationChange(type, 'phone', !formData.notifications[type]?.phone)}
                    className={`px-6 py-2 rounded-lg text-sm font-normal transition-colors ${
                    formData.notifications[type]?.phone
                        ? 'bg-[#E55B3C] text-white hover:bg-[#E55B3C]/80'
                        : 'bg-orange-200 text-black hover:bg-orange-300'
                    }`}
                >
                    Phone
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 px-5 h-[calc(100vh-180px)] md:h-[calc(100vh-240px)] overflow-y-auto">
            {/* Message and comment */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-3">Message and comment</h2>
                <div>
                    <NotificationRow title="New message received" type="newMessage" />
                    <NotificationRow title="New comment received from your post" type="newComment" />
                </div>
            </section>

            <hr className="border-gray-300" />

            {/* Connection */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Connection</h2>
                <div>
                    <NotificationRow title="New connection request" type="newConnection" />
                </div>
            </section>

            <hr className="border-gray-300" />

            {/* Account */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Account</h2>
                <div>
                    <NotificationRow title="Account updated" type="accountUpdated" />
                    <NotificationRow title="Verifications" type="verifications" />
                </div>
            </section>

            <hr className="border-gray-300" />

            {/* Event */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Event</h2>
                <div>
                    <NotificationRow title="Event registered" type="eventRegistered" />
                    <NotificationRow title="Two days before the registered event" type="eventReminder" />
                    <NotificationRow title="Event update (change of date, location or cancellation)" type="eventUpdate" />
                </div>
            </section>

            <hr className="border-gray-300" />

            {/* Setting Message */}
            <section>
                <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Setting Message</h2>
                <div>
                    <NotificationRow title="Message from admin" type="messageFromAdmin" />
                    <NotificationRow title="Account error" type="accountError" />
                </div>
            </section>
        </div>
    );
}