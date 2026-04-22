import { ShoppingCart, LucideIcon } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuItemProps {
  item: {
    id: number;
    name: string;
    price: number;
    weight: string;
    image: string;
    emoji?: string | null;
  };
  tags: Array<{ text: string; color: string }>;
  displayIcon?: { icon: LucideIcon; color: string } | null;
  onClick: () => void;
}

const colorClasses = {
  green: 'bg-green-100 text-green-700',
  pink: 'bg-pink-100 text-pink-700',
  blue: 'bg-blue-100 text-blue-700',
  orange: 'bg-orange-100 text-orange-700',
  red: 'bg-red-100 text-red-700',
  gray: 'bg-gray-100 text-gray-700',
  purple: 'bg-purple-100 text-purple-700',
};

export default function MenuItem({ item, tags, displayIcon, onClick }: MenuItemProps) {
  const IconComponent = displayIcon?.icon;
  
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-2xl p-3 hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Image */}
      <div className="relative mb-3 aspect-square rounded-xl overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Icon display (replaces emoji) */}
        {displayIcon && IconComponent && (
          <div className={`absolute bottom-2 left-2 w-10 h-10 rounded-full flex items-center justify-center ${
            displayIcon.color === 'red' ? 'bg-red-100' : 'bg-green-100'
          }`}>
            <IconComponent className={`w-5 h-5 ${
              displayIcon.color === 'red' ? 'text-red-600' : 'text-green-600'
            }`} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between text-xs text-gray-500">
          <span>{item.weight}</span>
        </div>

        <h3 className="font-semibold leading-tight line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>

        {/* Tags under title */}
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map((tag, index) => (
            <div
              key={index}
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${colorClasses[tag.color as keyof typeof colorClasses]}`}
            >
              <span>{tag.text}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="text-xl font-bold">
            {item.price}
            <span className="text-gray-400 text-lg">,99 ₽</span>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic
            }}
            className="w-11 h-11 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-all"
          >
            <ShoppingCart className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}