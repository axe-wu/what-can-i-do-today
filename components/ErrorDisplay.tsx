import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4" role="alert">
      <p className="font-bold">哎呀！出错了。</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;