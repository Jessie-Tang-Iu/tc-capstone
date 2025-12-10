import { useRouter } from "next/navigation";
import Button from "../components/ui/Button";



export default function InvoiceRow({
    invoiceId,
    client,
    timeAgo,
    dueDate,
}) {

    const router = useRouter();

    const handleInvoiceClick = () => {
        console.log("Invoice clicked:", invoiceId);
        router.push(`/advisorDashboard/invoiceDetail/${invoiceId}`);
    }

    return(
        <div className="flex items-stretch gap-4 bg-white border-b border-black py-3">
            {/* Left mini card */}
            <div className="w-40 rounded-md border bg-[#F0E0D5] px-3 py-3 text-xs text-black">
            <div className="font-semibold">Advisory Session</div>
            <div className="mt-2">Invoice #:</div>
            <div className="font-mono">{invoiceId}</div>
            </div>
    
            {/* Middle details */}
            <div className="flex-1 text-sm text-black">
            <div className="font-semibold">{client}</div>
            <div className="mt-1">Official receipts</div>
            {timeAgo && <div className="mt-1 text-gray-500">Applied {timeAgo}</div>}
            {dueDate && <div className="mt-1 text-gray-500">Due Date: {dueDate}</div>}
            </div>
    
            {/* Right action */}
            <div className="flex items-center">
            <Button text="Invoice Detail" onClick={handleInvoiceClick} />
            </div>
        </div>
    );
}