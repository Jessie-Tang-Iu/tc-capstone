export default function TabToggle({ current, onChange }) {
  const baseClass =
    "block w-full text-left transition-colors duration-150 cursor-pointer text-black";

  return (
    <div className="bg-white rounded-lg p-4 space-y-2 text-[15px] font-semibold">
      <button
        onClick={() => onChange("upcoming")}
        className={`${baseClass} ${
          current === "upcoming" ? "underline" : "hover:underline"
        }`}
      >
        Upcoming
      </button>
      <button
        onClick={() => onChange("past")}
        className={`${baseClass} ${
          current === "past" ? "underline" : "hover:underline"
        }`}
      >
        Past
      </button>
    </div>
  );
}
