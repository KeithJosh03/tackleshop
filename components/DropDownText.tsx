import React from 'react';

interface DropDownListProps {
onClick: () => void;
indexKey:number;
listName:string
}

const DropDownText: React.FC<DropDownListProps> = ({
onClick,indexKey,listName
}) => {
  return (
    <li
    key={indexKey}
    className="p-2 cursor-pointer hover:bg-primaryColor hover:text-tertiaryColor text-primaryColor"
    onClick={onClick}
    >
    {listName}
    </li>
  );
}

export default DropDownText;
