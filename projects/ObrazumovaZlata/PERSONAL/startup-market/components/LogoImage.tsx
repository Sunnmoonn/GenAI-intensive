'use client';

interface LogoImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function LogoImage({ src, alt, className }: LogoImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
    />
  );
}
