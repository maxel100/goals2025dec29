import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconBadgeProps {
  icon: LucideIcon;
}

export function IconBadge({ icon: Icon }: IconBadgeProps) {
  return (
    <div className="p-3 rounded-lg bg-primary-100">
      <Icon className="w-6 h-6 text-primary-600" />
    </div>
  );
}