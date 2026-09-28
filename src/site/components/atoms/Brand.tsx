import { Link } from 'react-router';

import { cn } from '@/site/lib/cn';

type BrandProps = { inverse?: boolean; className?: string };

/** Sankhya's mark, the product's name, and whose it is: Manu | Sankhya AI Labs. */
export function Brand({ inverse = false, className }: BrandProps) {
  return (
    <Link className={cn('brand', inverse && 'brand--inverse', className)} to="/" aria-label="Manu by Sankhya AI Labs, home">
      <img className="brand__mark" src="/brand/sankhya-mark.png" alt="" width="142" height="142" />
      <strong>Manu</strong>
      <span className="brand__by">Sankhya AI Labs</span>
    </Link>
  );
}
