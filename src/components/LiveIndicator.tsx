type Color = 'green' | 'emerald';

const pingClass: Record<Color, string> = {
  green: 'bg-green-400',
  emerald: 'bg-emerald-400',
};

const dotClass: Record<Color, string> = {
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
};

export default function LiveIndicator({ size = 'md', color = 'emerald' }: { size?: 'sm' | 'md'; color?: Color }) {
  const dim = size === 'sm' ? 'h-2 w-2' : 'h-3 w-3';
  return (
    <span className={`relative flex ${dim}`}>
      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pingClass[color]} opacity-75`} />
      <span className={`relative inline-flex rounded-full ${dim} ${dotClass[color]}`} />
    </span>
  );
}
