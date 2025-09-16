import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div 
    className={cn(
      "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]",
      className
    )}
    style={{
      animation: 'shimmer 2s infinite linear'
    }}
  />
);

export const CardSkeleton = () => (
  <div className="border border-border rounded-xl p-6 space-y-4 bg-white/80 backdrop-blur-sm">
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-24" />
    </div>
  </div>
);

export const MenuItemSkeleton = () => (
  <div className="flex space-x-4 p-4 border-b border-border/50">
    <Skeleton className="w-16 h-16 rounded-lg" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center mt-3">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  </div>
);

export const GallerySkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="aspect-square rounded-lg" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

export const TableSkeleton = () => (
  <div className="space-y-3">
    <div className="flex space-x-4 p-4 border-b border-border">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/5" />
      <Skeleton className="h-4 w-1/6" />
    </div>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex space-x-4 p-4 border-b border-border/30">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/5" />
        <Skeleton className="h-4 w-1/6" />
      </div>
    ))}
  </div>
);

export default Skeleton;