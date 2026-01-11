import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; onClick?: () => void; active?: boolean }[];
  onHomeClick: () => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onHomeClick }) => {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
      <button 
        onClick={onHomeClick}
        className="flex items-center gap-1 hover:text-gold-400 transition-colors"
      >
        <Home size={14} />
        <span>Bosh sahifa</span>
      </button>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={14} className="mx-2 text-gray-700" />
          <button
            onClick={item.onClick}
            disabled={item.active}
            className={`${
              item.active 
                ? 'text-white font-medium cursor-default' 
                : 'hover:text-gold-400 transition-colors'
            }`}
          >
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumbs;