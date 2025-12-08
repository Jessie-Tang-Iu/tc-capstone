

export default function LabelValue({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-md p-3 bg-white">
      <div className="text-sm font-bold text-gray-600 mb-1">{label}</div>

      {/* if value is a string */}
      {typeof value == 'string' && (
      <div className="text-base font-medium text-black wrap-break-word">
        {value ? `${value}` : "—"}
      </div>
      )}

      {/* if value is an array */}
      {typeof value == 'object' && (
        <div className="flex flex-wrap gap-2">
          {value.map((tag, index) => {
            let information = tag;
            if (label == "Education") {
              let eduSplit = tag.split(' | ');
              information = `${eduSplit[1]} in ${eduSplit[2]} from ${eduSplit[0]} (${eduSplit[3]}-${eduSplit[4]})`;
            }
            if (label == "Experience") {
              let expSplit = tag.split(' | ');
              if (expSplit[5] == "" && expSplit[6] == "") {
                information = `${expSplit[0]} (${expSplit[2]}) at ${expSplit[1]} (from ${expSplit[3]}-${expSplit[4]})`
              } else {
                information = `${expSplit[0]} (${expSplit[2]}) at ${expSplit[1]} (from ${expSplit[3]}-${expSplit[4]} to ${expSplit[5]}-${expSplit[6]})`
              }
            }
            return (
              <span
                key={index}
                className="px-2 py-1 bg-gray-200 rounded text-base font-medium text-black"
              >{information}</span>
            );
          })}
        </div>
      )}
    </div>
  );
}