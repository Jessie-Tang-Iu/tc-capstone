export default function InputField({type="input", label, value, placeholder="", isRequired=false, isEdit=true, options=[], onChange}) {
    return (
    <div>
        <label className={`block mb-1 text-sm text-gray-700 ${!isEdit && "font-bold"}`}>{label}</label>

        {type == "input" ? (
            <input
                required={isRequired}
                type={label == "Website" ? "url" : "text"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                disabled={!isEdit}
                className={`w-full h-10 px-3 py-2 text-base rounded-lg border border-gray-300 
                    ${isEdit 
                        ? "text-black outline-none focus:ring-2 focus:ring-gray-200"
                        : "text-gray-500 bg-gray-100 focus:outline-none cursor-not-allowed"
                    }
                `}
            />
        ) : (
            <select
                placeholder={placeholder}
                value={value || ""}
                onChange={onChange}
                className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-base text-black outline-none focus:ring-2 focus:ring-gray-200"
            >
                {options.map((key, index) => <option key={index} value={String(key).includes("Select") ? "" : key} disabled={String(key).includes("Select")}>{key}</option>)}
            </select>
        )}
    </div>
    );
}