import React from 'react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-solid border-primaryColor border-t-transparent rounded-full" />
    </div>
  );
}
