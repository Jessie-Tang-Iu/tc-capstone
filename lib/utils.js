import { Slice } from "lucide-react"

export function phoneNumberString(string) {
    let clean = string.replace("-", "").replace(" ", "");
    if (clean.length <= 3) {
        return clean
    } else if (clean.length <= 6) {
        return `(${clean.slice(0,4)})-${clean.slice(3-clean.length)}`
    } else if (clean.length <= 10) {
        return `(${clean.slice(0,4)})-${clean.slice(4,7)}-${clean.slice(6-clean.length)}`
    } else {
        return `(${clean.slice(0,4)})-${clean.slice(4,7)}-${clean.slice(6,10)}`
    }
}