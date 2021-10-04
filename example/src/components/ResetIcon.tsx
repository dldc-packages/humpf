import React from 'react';

interface Props {
  size?: number;
}

export const ResetIcon: React.FC<Props> = ({ size = 24 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="feather"
      viewBox="0 0 24 24"
    >
      <path d="M1 4L1 10 7 10"></path>
      <path d="M3.51 15a9 9 0 102.13-9.36L1 10"></path>
    </svg>
  );
};
