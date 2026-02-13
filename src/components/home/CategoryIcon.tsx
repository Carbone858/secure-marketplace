'use client';

import {
  HardHat,
  Sparkles,
  Droplets,
  Zap,
  PaintBucket,
  Hammer,
  Thermometer,
  Trees,
  Palette,
  Monitor,
  Megaphone,
  Truck,
  HeartPulse,
  GraduationCap,
  PartyPopper,
  Camera,
  Folder,
  Wrench,
  Home,
  Scale,
  Calculator,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps iconName strings from the database to actual Lucide icon components.
 * Add new mappings here when new categories are created.
 */
const iconRegistry: Record<string, LucideIcon> = {
  'hard-hat': HardHat,
  'sparkles': Sparkles,
  'droplets': Droplets,
  'zap': Zap,
  'paint-bucket': PaintBucket,
  'hammer': Hammer,
  'thermometer': Thermometer,
  'trees': Trees,
  'palette': Palette,
  'monitor': Monitor,
  'megaphone': Megaphone,
  'truck': Truck,
  'heart-pulse': HeartPulse,
  'graduation-cap': GraduationCap,
  'party-popper': PartyPopper,
  'camera': Camera,
  'wrench': Wrench,
  'home': Home,
  'scale': Scale,
  'calculator': Calculator,
  'folder': Folder,
};

interface CategoryIconProps {
  iconName?: string | null;
  /** Emoji fallback from the `icon` field */
  emoji?: string | null;
  className?: string;
  size?: number;
}

export default function CategoryIcon({
  iconName,
  emoji,
  className = 'h-6 w-6',
  size,
}: CategoryIconProps) {
  // Try Lucide icon first
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
  const DefaultIcon = Folder;
  return <DefaultIcon className={className} size={size} />;
}
