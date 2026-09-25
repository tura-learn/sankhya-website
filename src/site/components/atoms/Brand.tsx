import { Link } from 'react-router';

import { cn } from '@/site/lib/cn';
import { ManuMark } from '@/site/components/atoms/ManuMark';

type BrandProps = { inverse?: boolean; className?: string };

/** Tura's lockup, with Manu's mark and name: mark, then the word in Baloo 2. */
export function Brand({ inverse = false, className }: BrandProps) {
  return (
    <Link className={cn('brand', inverse && 'brand--inverse', className)} to="/" aria-label="Manu home">
      <ManuMark className="brand__mark" />
      <strong>manu</strong>
    </Link>
  );
}
