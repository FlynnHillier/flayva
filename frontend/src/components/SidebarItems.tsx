import { LucideIcon } from 'lucide-react';
import React from 'react'

interface SidebarItemsProps {
    title: string;
    url: string;
    icon: LucideIcon;
}

function SidebarItems({
    title,
    url,
    icon,
}: SidebarItemsProps) {
  return (
    <a href={url} className='flex items-center space-x-4 p-2 text-yellow-950'>
       {React.createElement(icon, { className: "w-8 h-8" })}
        <span className="text-4xl pl-5">{title}</span>
    </a>
  )
}

export default SidebarItems