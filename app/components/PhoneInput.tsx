import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  showLabel?: boolean; // New optional prop
}

export default function PhoneInputComponent({ value, onChange, showLabel = true }: PhoneInputProps) {
  return (
    <div className="flex flex-col w-full">
      {showLabel && (
        <label htmlFor="phone" className="text-sm font-medium text-gray-700">
          Mobile Number
        </label>
      )}
      <PhoneInput defaultCountry="in" value={value} onChange={onChange} />
    </div>
  );
}
