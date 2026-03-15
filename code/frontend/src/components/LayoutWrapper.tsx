import React, { useEffect } from 'react';
import Header from '../header';
import CloseButton from './CloseButton';
import Footer from '../footer';
interface LayoutWrapperProps {
  children: React.ReactNode;
  showCloseButton?: boolean;
  noAssignmentMessage?: string;
  isNoAssignment?: boolean;
  setPage?: (page: string) => void;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ 
  children, 
  showCloseButton = true,
  noAssignmentMessage = "Odpri katero koli nalogo na Moodle, da vidiš podrobnosti.",
  isNoAssignment = false,
  setPage,
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
        <Header setPage={setPage} />
        <div className="titleContainer">
          {noAssignmentMessage}
        </div>
        {showCloseButton && <CloseButton />}
         <Footer/>
      </>
    );
  }

  return (
    <>
      <Header setPage={setPage} />
      {children}
      {showCloseButton && <CloseButton />}
       <Footer/>
    </>
  );
};

export default LayoutWrapper;