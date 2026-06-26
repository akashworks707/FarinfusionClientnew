"use client";

import { VerificationCard } from "./VerificationCard";
import { IProductVerification } from "@/types/productVerification";
import { GridSkeleton } from "./VerificationSkeleton";
import { VerificationEmpty } from "./VerificationEmpty";

interface VerificationGridProps {
  verifications: IProductVerification[];
  isLoading: boolean;
  onWatch: (verification: IProductVerification) => void;
  onReset?: () => void;
}

export function VerificationGrid({
  verifications,
  isLoading,
  onWatch,
  onReset,
}: VerificationGridProps) {
  if (isLoading) {
    return <GridSkeleton />;
  }

  if (verifications.length === 0) {
    return <VerificationEmpty onReset={onReset} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {verifications.map((verification) => (
        <VerificationCard
          key={verification._id}
          verification={verification}
          onWatch={onWatch}
        />
      ))}
    </div>
  );
}