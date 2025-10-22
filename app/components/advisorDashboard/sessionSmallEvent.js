// app/components/advisorDashboard/sessionSmallEvent.js



export default function SessionSmallEvent({ time, title, client, onClick }) {

    return(
        <div
        onClick={onClick}
        className="bg-[#cff5fa] rounded-lg w-full px-2 py-1 cursor-pointer hover:bg-[#8db4ba]"
        >
        <div className="text-xs font-bold text-black leading-tight break-words">
            {time.toUpperCase()}
        </div>
        <div className="text-xs text-black leading-tight break-words whitespace-normal">
            {title} with {client}
        </div>
        </div>
    )
}