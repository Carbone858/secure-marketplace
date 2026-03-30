'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
}

interface DashboardMobileNavProps {
  items: NavItem[];
}

export function DashboardMobileNav({ items }: DashboardMobileNavProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (el) {
      const isAtStart = el.scrollLeft <= 10;
      const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;
      
      setShowLeftArrow(!isAtStart);
      setShowRightArrow(!isAtEnd && el.scrollWidth > el.clientWidth);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = 150;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 500);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [items]);

  return (
    <div className="relative sm:hidden group">
      {/* Left indicator arrow */}
      <div 
        className={`absolute left-0 top-0 bottom-0 z-10 w-8 flex items-center justify-start bg-gradient-to-r from-card to-transparent pointer-events-none transition-opacity duration-300 ${showLeftArrow ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronLeft className="h-4 w-4 text-primary animate-pulse" />
      </div>

      <nav 
        ref={scrollRef}
        id="mobile-dash-nav"
        className="flex items-center gap-4 py-3 overflow-x-auto no-scrollbar scroll-smooth"
        onScroll={checkScroll}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-all whitespace-nowrap active:scale-95"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right indicator arrow */}
      <div 
        className={`absolute right-0 top-0 bottom-0 z-10 w-8 flex items-center justify-end bg-gradient-to-l from-card to-transparent pointer-events-none transition-opacity duration-300 ${showRightArrow ? 'opacity-100' : 'opacity-0'}`}
      >
        <ChevronRight className="h-4 w-4 text-primary animate-pulse" />
      </div>
    </div>
  );
}
