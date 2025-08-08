// app/components/myCalender/calenderSmallEvent.js

export default function CalenderSmallEvent({ time, title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-[#FDF1EC] rounded-lg w-full px-2 py-1 cursor-pointer hover:bg-[#f0e0d7]"
    >
      <div className="text-xs font-bold text-black leading-tight break-words">
        {time.toUpperCase()}
      </div>
      <div className="text-xs text-black leading-tight break-words whitespace-normal">
        {title}
      </div>
    </div>
  );
}
