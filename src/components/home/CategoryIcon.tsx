'use client';

import {
  MdConstruction,
  MdDesignServices,
  MdPlumbing,
  MdElectricalServices,
  MdOutlineHvac,
  MdCleaningServices,
  MdLocalShipping,
  MdComputer,
  MdHome,
  MdOutlinePalette,
  MdOutlineNature,
  MdOutlineCameraAlt,
  MdOutlineSchool,
  MdOutlineHealthAndSafety,
  MdOutlineCalculate,
  MdOutlineGavel,
  MdOutlineBusinessCenter,
  MdOutlineAccountBalance,
  MdOutlineEmojiEvents,
  MdOutlineFolder,
} from 'react-icons/md';

/**
 * Maps iconName strings from the database to actual Lucide icon components.
 * Add new mappings here when new categories are created.
 */
const iconRegistry: Record<string, any> = {
  'construction': MdConstruction,
  'interior-design': MdDesignServices,
  'plumbing': MdPlumbing,
  'electrical': MdElectricalServices,
  'hvac': MdOutlineHvac,
  'cleaning': MdCleaningServices,
  'moving': MdLocalShipping,
  'it': MdComputer,
  'home': MdHome,
  'palette': MdOutlinePalette,
  'nature': MdOutlineNature,
  'camera': MdOutlineCameraAlt,
  'school': MdOutlineSchool,
  'health': MdOutlineHealthAndSafety,
  'calculator': MdOutlineCalculate,
  'gavel': MdOutlineGavel,
  'business': MdOutlineBusinessCenter,
  'bank': MdOutlineAccountBalance,
  'award': MdOutlineEmojiEvents,
  'folder': MdOutlineFolder,
};

interface CategoryIconProps {
  iconName?: string | null;
  /** Emoji fallback from the `icon` field */
  emoji?: string | null;
  className?: string;
  size?: number;
}

// Map iconName to SVG filename (with spaces, matching actual files in /public/images/)
const svgIconMap: Record<string, string> = {
  'it': 'IT .svg',
  'plumbing': 'Plumping .svg',
  'moving': 'moving .svg',
  'cleaning': 'Cleaning .svg',
  'construction': 'Construction & Building.svg',
  'interior-design': 'interior .svg',
  'electrical': 'Electrical.svg',
};

export default function CategoryIcon({
  iconName,
  emoji,
  className = 'h-6 w-6',
  size,
}: CategoryIconProps) {
  // Try SVG icon first for mapped categories
  if (iconName && svgIconMap[iconName]) {
    // Add cache-busting query string to force reload
    const svgPath = `/images/${svgIconMap[iconName]}?v=${Date.now()}`;
    return (
      <img
        src={svgPath}
        alt={iconName}
        className={className}
        width={size || 35}
        height={size || 35}
        style={{ display: 'inline-block', objectFit: 'contain' }}
        loading="lazy"
      />
    );
  }

  // Fallback to Material icon
  if (iconName && iconRegistry[iconName]) {
    const Icon = iconRegistry[iconName];
    return <Icon className={className} size={size} />;
  }

  // Fall back to emoji
  if (emoji) {
    return (
      <span className="text-2xl leading-none" role="img" aria-hidden="true">
        {emoji}
      </span>
    );
  }

  // Default fallback
  const DefaultIcon = MdOutlineFolder;
  return <DefaultIcon className={className} size={size} />;
}
