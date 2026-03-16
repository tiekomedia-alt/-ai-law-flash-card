import { Twitter, Instagram } from 'lucide-react';

export default function SocialLinks({ iconClassName = 'size-6', linkClassName = 'text-slate-400' }: {
  iconClassName?: string;
  linkClassName?: string;
}) {
  return (
    <div className="flex items-center gap-6">
      <a href="https://x.com/tiekomedia" target="_blank" rel="noopener noreferrer" className={`${linkClassName} hover:text-[#dc2626] transition-colors`}>
        <Twitter className={iconClassName} />
      </a>
      <a href="https://www.instagram.com/tiekomedia?igsh=YTNmNTAyemFmdzhr" target="_blank" rel="noopener noreferrer" className={`${linkClassName} hover:text-[#dc2626] transition-colors`}>
        <Instagram className={iconClassName} />
      </a>
    </div>
  );
}
