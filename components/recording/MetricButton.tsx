import React from 'react';

interface MetricButtonProps {
  abbreviation: string;
  name: string;
  count?: number;
  onPress: () => void;
}

export const MetricButton: React.FC<MetricButtonProps> = ({
  abbreviation,
  name,
  count,
  onPress,
}) => {
  const handlePress = () => {
    // Haptic feedback (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    onPress();
  };

  return (
    <button
      onClick={handlePress}
      className="
        relative w-full h-20
        bg-white dark:bg-slate-800
        border-2 border-gray-200 dark:border-slate-700
        hover:border-brand-purple dark:hover:border-brand-purple
        rounded-xl
        flex flex-col items-center justify-center gap-0.5
        transition-all duration-150
        active:scale-95 active:border-brand-purple
        shadow-sm hover:shadow-md
        group
      "
    >
      {/* Abbreviation */}
      <span className="text-sm font-bold text-brand-navy dark:text-brand-light group-hover:scale-110 transition-transform">
        {abbreviation}
      </span>

      {/* Korean name */}
      <span className="text-[10px] text-text-sub dark:text-slate-400 text-center line-clamp-1 px-1">
        {name}
      </span>

      {/* Count badge */}
      {count !== undefined && count > 0 && (
        <span className="
          absolute -top-1 -right-1 min-w-[18px] h-[18px]
          flex items-center justify-center px-1
          text-[10px] font-bold rounded-full
          bg-red-500 text-white shadow-sm
        ">
          {count}
        </span>
      )}

      {/* Touch feedback ring */}
      <div className="absolute inset-0 rounded-xl ring-0 ring-brand-purple/50 group-active:ring-4 transition-all pointer-events-none" />
    </button>
  );
};
