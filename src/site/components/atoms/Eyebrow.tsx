import type { ReactNode } from 'react';
import { cn } from '@/site/lib/cn';

export function Eyebrow({ children, inverse = false, className }: { children: ReactNode; inverse?: boolean; className?: string }) {
  return <p className={cn('eyebrow', inverse && 'eyebrow--inverse', className)}>{children}</p>;
}
