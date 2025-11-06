import React from "react";

interface TextBoxProps {
  textBoxCategory: string;
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void;
  categoryLength: number;
  isOpenBox: boolean;
  textBoxValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextBox: React.FC<TextBoxProps> = ({
  textBoxCategory,
  onClick,
  categoryLength,
  isOpenBox,
  textBoxValue,
  onChange,
}) => {
  return (
    <div className='flex flex-col p-1'>
      <div
        className='flex flex-row justify-between justify-items-center items-center p-2 bg-secondary rounded hover:bg-primaryColor group'
        onClick={onClick}
      >
        <h1 className='text-primaryColor group-hover:text-tertiaryColor'>{textBoxCategory}</h1>
        <p className="text-right text-xs text-primaryColor">{categoryLength} characters</p>
      </div>
      {isOpenBox && (
        <textarea
          value={textBoxValue}
          placeholder={`${textBoxCategory}...`}
          className='placeholder:text-sm text-sm/tight border border-primaryColor text-primaryColor p-2 rounded resize-none'
          rows={8}
          onChange={onChange}
        />
      )}
    </div>
  );
};

export default TextBox;
