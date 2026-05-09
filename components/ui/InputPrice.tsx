import React from 'react';

interface InputPriceProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  className?: string;
  isUnit: boolean;
}

const InputPrice: React.FC<InputPriceProps> = ({
  value,
  onChange,
  placeholder,
  isUnit = true,
  type = 'text',
  className = ''
}) => {

  // Helper to clean value before saving to state
  const cleanValue = (inputValue: string, isUnit: boolean) => {
    let cleanedValue = inputValue.replace(/[^0-9.-]+/g, ''); // Remove non-numeric characters

    // If it's a percentage, add the "%" sign after cleaning
    if (!isUnit) {
      return `${cleanedValue}%`;
    }

    return cleanedValue;
  };

  const numericConverter = (number: string | undefined, isUnit: boolean) => {
    const numericValue = Number(number?.replace(/[^0-9.-]+/g, ''));
    if (isNaN(numericValue)) return '';

    if (isUnit) {
      // Format as currency if isUnit is true
      return numericValue.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    } else {
      // Format as percentage if isUnit is false
      return `${numericValue}%`;
    }
  };

  const formattedValue = numericConverter(value, isUnit);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Clean value before passing to parent component
    const cleaned = cleanValue(newValue, isUnit);

    // Call the parent onChange with the cleaned value
    onChange({
      target: {
        value: cleaned
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={formattedValue}
      onChange={handleChange}
      className={`border text-base p-2 placeholder:text-base placeholder:text-secondary rounded-md w-full outline-none border-primaryColor text-primaryColor ${className}`}
    />
  );
};

export default InputPrice;
