import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  className = 'registerInput' ,
  style
}) => {
  return (
    <div className="registerContainer">
      <label className="registerLabel">{label}</label>
      <input
        className={className}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
      />
    </div>
  );
};

export default FormInput;
