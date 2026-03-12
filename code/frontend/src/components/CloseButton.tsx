import React from 'react';

interface CloseButtonProps {
  label?: string;
}

const CloseButton: React.FC<CloseButtonProps> = ({ label = 'Zapri' }) => {
  const handleClose = () => {
    window.parent.postMessage({ type: "CLOSE_IFRAME" }, "*");
  };

  return (
    <div className="btnWrapper">
      <button className="btnClose" onClick={handleClose}>
        {label}
      </button>
    </div>
  );
};

export default CloseButton;