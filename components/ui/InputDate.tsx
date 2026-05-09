import React from 'react';

interface InputDateProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

const InputDate: React.FC<InputDateProps> = ({ value, onChange, className = '' }) => {
    return (
        <input
            type='date'
            value={value}
            onChange={onChange}
            className={`border text-base p-2 rounded-md w-full outline-none border-primaryColor text-primaryColor bg-transparent 
                [color-scheme:dark]
                ${className}`}
        />
    );
};

export default InputDate;
