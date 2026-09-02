import React from 'react';

interface DropDownListProps {
  onClick: () => void;
  indexKey: number;
  listName: string
}

const DropDownText: React.FC<DropDownListProps> = ({
  onClick, indexKey, listName
}) => {
  return (
    <li
      key={indexKey}
      className="px-4 py-3 cursor-pointer text-sm font-medium text-[#a6a7a6] hover:bg-[#ffb77c]/10 hover:text-[#ffb77c] transition-all border-b border-[#3d4859]/40 last:border-b-0"
      onClick={onClick}
    >
      {listName}
    </li>
  );
}

export default DropDownText;
