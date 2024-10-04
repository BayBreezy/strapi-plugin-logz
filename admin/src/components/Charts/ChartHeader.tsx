import React from "react";

interface ChartHeaderProps {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  SelectComponent?: React.ComponentType;
}

/**
 *  Data displayed above your chart
 */
const ChartHeader: React.FC<ChartHeaderProps> = ({ title, description, SelectComponent }) => {
  return (
    <div className="header">
      <div className="content">
        {typeof title === "string" ? <h3 className="title">{title}</h3> : title}
        {typeof description === "string" ? <p className="description">{description}</p> : description}
      </div>
      {SelectComponent && (
        <div className="select">
          <SelectComponent />
        </div>
      )}
    </div>
  );
};

export default ChartHeader;
