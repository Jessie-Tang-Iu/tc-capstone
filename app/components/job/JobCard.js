

export default function JobCard({
    title, company, location, tags, isSelected = false, onClick
}) {
    return(
        <div
            // className="bg-white rounded-lg shadow px-6 py-4 space-y-2 text-black cursor-pointer hover:opacity-95 transition"
            className={`w-full bg-white rounded-lg px-6 py-4 mb-5 space-y-2 text-black cursor-pointer transition ${
                isSelected ? 'ring-2 ring-[#E55B3C] bg-[#E55B3C]/5' : 'hover:bg-gray-50'
            }`}
            onClick={onClick}
        >
            {/* Job Title */}
            <h3 className="text-base md:text-lg font-bold text-black leading-tight">
                {title}
            </h3>
            
            {/* Company */}
            <p className="text-sm md:text-base font-normal text-gray-600 mb-1">
                {company}
            </p>
            
            {/* Location */}
            <p className="text-sm md:text-base font-normal text-gray-600 mb-3">
                {location}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-1">
                {tags.map((tag, index) => (
                    <span
                        key={index}
                        className="px-2 py-1 bg-gray-200 rounded text-sm font-normal text-black"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
}