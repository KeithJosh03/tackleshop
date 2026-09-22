import React from 'react';

interface DropDownListProps {
  onClick: () => void;
  indexKey: number;
  listName: string;
  isSelected?: boolean;
}

const DropDownText: React.FC<DropDownListProps> = ({
  onClick,
  indexKey,
  listName,
  isSelected = false,
}) => {
  return (
    <li
      key={indexKey}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevents input blur before click registers
        onClick();
      }}
      className={`px-4 py-2.5 cursor-pointer text-sm font-medium transition-all border-b border-[#2c3542]/50 last:border-b-0 flex items-center justify-between ${isSelected
          ? 'bg-[#ffb77c]/15 text-[#ffb77c]'
          : 'text-[#d9e3f4] hover:bg-[#ffb77c]/10 hover:text-[#ffb77c]'
        }`}
    >
      <span>{listName}</span>
    </li>
  );
};

export default DropDownText;