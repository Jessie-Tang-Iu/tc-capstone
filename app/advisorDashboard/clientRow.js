



export default function ClientRow({
    name,
    subtitle,
    onMessage,
}) {

    return(
        <div className="mb-3 rounded-xl bg-[#F7EAE2] px-4 py-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                {/* Left: name + subtitle */}
                <div className="min-w-0">
                    <div className="text-[20px] font-bold text-black text-left">{name}</div>
                    {subtitle && (
                        <div className="truncate text-[13px] text-gray-700">{subtitle}</div>
                    )}
                </div>

                {/* Right: actions */}
                <div className="flex shrink-0 items-center gap-3">
                    {/* Dark yellow message button with white text */}
                    <button
                        onClick={onMessage}
                        className="w-70 h-12 rounded-md bg-yellow-600 px-4 py-2 text-sm font-semibold text-white
                                hover:bg-yellow-700 active:scale-[0.98] transition"
                    >
                        Message
                    </button>
                </div>
            </div>
        </div>
    );
}