import { ReactNode, useState } from "react";

interface ExpanderProps<T> {
  items: ReadonlyArray<T>;
  visible: (item: T) => ReactNode;
  hidden: (item: T) => ReactNode;
}

function Expander<T>({ items, visible, hidden }: ExpanderProps<T>) {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const toggleExpand = (idx: number) => {
    if (expandedItem === idx) {
      setExpandedItem(null);
    } else {
      setExpandedItem(idx);
    }
  };

  return (
    <div className="expander-container">
      {items.map((item, idx) => (
        <div
          className="expander-item"
          key={idx}
          onClick={() => toggleExpand(idx)}
        >
          {visible(item)}
          <div className="expander-hidden-container">
            {expandedItem === idx && hidden(item)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Expander;
