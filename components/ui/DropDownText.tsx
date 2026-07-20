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
      className="px-4 py-2.5 cursor-pointer text-sm text-[#a6a7a6] hover:bg-[#16202c] hover:text-[#d9e3f4] transition-colors border-b border-[#212b37] last:border-b-0"
      onClick={onClick}
    >
      {listName}
    </li>
  );
}

export default DropDownText;
