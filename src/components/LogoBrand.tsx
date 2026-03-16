import Image from 'next/image';

const LOGO_SRC = "https://res.cloudinary.com/dspngcwzj/image/upload/v1773368448/enlarged_logo_team_shuf_g1bmvq.png";

type Size = 'sm' | 'md' | 'lg';

const imgProps: Record<Size, { width: number; height: number; className: string }> = {
  sm: { width: 30, height: 30, className: 'h-6 w-auto' },
  md: { width: 35, height: 35, className: 'h-7 w-auto' },
  lg: { width: 40, height: 40, className: 'h-8 w-auto' },
};

export default function LogoBrand({ size = 'lg', textClassName }: { size?: Size; textClassName?: string }) {
  const img = imgProps[size];
  const defaultText = size === 'sm' ? 'text-sm font-bold' : size === 'md' ? 'text-lg font-extrabold' : 'text-xl font-extrabold';
  return (
    <div className="flex items-center gap-2">
      <Image src={LOGO_SRC} alt="TeamShuffle Logo" {...img} referrerPolicy="no-referrer" />
      <span className={`tracking-tight text-white ${textClassName ?? defaultText}`}>TeamShuffle</span>
    </div>
  );
}
