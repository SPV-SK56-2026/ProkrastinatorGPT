import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ 
  children, 
  onClick, 
  type = 'submit', 
  className = 'btnSubmit' 
}) => {
  return (
    <button 
      type={type} 
      className={className} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;