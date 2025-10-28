import React from 'react';

interface DropDownListProps {
onCLick: () => void;
indexKey:number;
listName:string
}

const DropDownText: React.FC<DropDownListProps> = ({
onCLick,indexKey,listName
}) => {
  return (
    <div
    key={indexKey}
    className="p-2 text-primaryColor bg-secondary hover:text-tertiaryColor hover:bg-primaryColor cursor-pointer"
    onClick={onCLick}
    >
    {listName}
    </div>
  );
}

export default DropDownText;
