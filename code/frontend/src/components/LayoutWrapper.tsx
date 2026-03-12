import React, { useEffect } from 'react';
import Header from '../header';
import CloseButton from './CloseButton';

interface LayoutWrapperProps {
  children: React.ReactNode;
  showCloseButton?: boolean;
  noAssignmentMessage?: string;
  isNoAssignment?: boolean;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  showCloseButton = true,
  noAssignmentMessage = "Odpri katero koli nalogo na Moodle, da vidiš podrobnosti.",
  isNoAssignment = false
}) => {
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      window.parent.postMessage({ 
        type: "RESIZE_IFRAME", 
        height: document.body.scrollHeight 
      }, "*");
    });
    observer.observe(document.body);
    
    return () => observer.disconnect();
  }, []);

  if (isNoAssignment) {
    return (
      <>
        <Header />
        <div className="titleContainer">
          {noAssignmentMessage}
        </div>
        {showCloseButton && <CloseButton />}
      </>
    );
  }

  return (
    <>
      <Header />
      {children}
      {showCloseButton && <CloseButton />}
    </>
  );
};

export default LayoutWrapper;
