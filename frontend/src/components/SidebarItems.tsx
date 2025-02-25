import { LucideProps } from 'lucide-react';

function SidebarItems({
    title,
    url,
    Icon,
}: {
  title: string,
  url: string,
  Icon: React.ElementType<LucideProps>,
}) {
  return (
    <a href={url} className='flex items-center text-yellow-950'>
       <span className='flex shrink-0 items-center'><Icon className='h-8 w-8'/></span>
        <span className="text-4xl pl-5 lg:flex hidden">{title}</span>
    </a>
  )
}

export default SidebarItems