// myCalender/calenderSmallEvent.js

export default function CalenderSmallEvent({ time, title }) {
  return (
    <div className="bg-[#fbeee8] text-black p-2 rounded-md text-sm leading-snug shadow-sm">
      <div className="font-semibold">{time}</div>
      <div>{title}</div>
    </div>
  );
}
