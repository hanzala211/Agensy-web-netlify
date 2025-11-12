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
      {items?.length > 0 && (
        <div className={`group flex flex-col ${className}`}>
          <H3 className="mb-0.5 font-bold text-[17px]">{label}</H3>
          <ul className={`space-y-1.5 list-disc list-outside ml-5`}>
            {items?.map((item, index) => (
              <li key={index}>
                <BorderedCard className="!py-1.5 !px-2">
                  <span className="font-medium">{item}</span>
                </BorderedCard>
              </li>
            ))}
          </ul>
        </div>
      )}
    </React.Fragment>
  );
};

export default ItemList;
