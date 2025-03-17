import React from "react";

interface InputFieldProps {
  label: string;
  id: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  placeholder,
  required,
  value,
  onChange,
  type = "text",
}) => {
  return (
    <div className="flex flex-col w-full justify-start">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className="border rounded px-4 py-2 text-gray-700 placeholder-gray-400"
      />
    </div>
  );
};

export default InputField;
