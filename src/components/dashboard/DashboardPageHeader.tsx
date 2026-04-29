import React from "react";

interface PageHeaderProps {
  title: string;
}

const DashboardPageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};

export default DashboardPageHeader;
