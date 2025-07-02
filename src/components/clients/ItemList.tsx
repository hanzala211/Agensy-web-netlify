import React from "react";
import { BorderedCard, H3 } from "@agensy/components";

interface ItemListProps {
  label: string;
  items: string[];
  className?: string;
}

export const ItemList: React.FC<ItemListProps> = ({
  label,
  items,
  className = "",
}) => {
  return (
    <React.Fragment>
      <div className={`group flex flex-col ${className}`}>
        <H3 className="mb-2 font-bold text-[17px]">{label}</H3>
        <ul className={`space-y-1.5`}>
          {items.map((item, index) => (
            <BorderedCard key={index}>
              <span className="font-medium">{item}</span>
            </BorderedCard>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
};

export default ItemList;
