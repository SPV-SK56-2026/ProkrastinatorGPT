import React from 'react';

interface PageHeaderProps {
  title: string;
  iconSrc: string;
  iconId?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, iconSrc, iconId }) => {
  return (
    <div id="titleContainer">
      <span id="title">{title}</span>
      <img src={iconSrc} id={iconId} alt={title} />
    </div>
  );
};

export default PageHeader;
