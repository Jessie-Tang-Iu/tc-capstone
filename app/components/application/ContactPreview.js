import LabelValue from "@/app/components/application/InfoCard";

export default function ContactPreview({title, app}) {
  return (
    <div className="border border-gray-200 rounded-lg bg-white">
      <div className="px-4 py-3 border-b border-gray-200 text-base font-bold rounded-t-lg text-black bg-[#F3E1D5]">{title}</div>
        <div className="p-4 grid md:grid-cols-2 gap-3">
        <LabelValue label="First Name" value={app.first_name} />
        <LabelValue label="Last Name" value={app.last_name} />
        <LabelValue label="Email address" value={app.email} />
        <LabelValue label="Phone Number" value={app.phone || ""} />
      </div>
    </div>
  );
}