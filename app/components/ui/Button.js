export default function Button({ text, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-white font-semibold px-6 py-2 rounded-md transition cursor-pointer"
      style={{
        backgroundColor: "#E55B3C",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#d14f32";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#E55B3C";
      }}
    >
      {text}
    </button>
  );
}
