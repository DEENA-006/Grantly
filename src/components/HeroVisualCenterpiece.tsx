"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const HeroGeometricMesh = dynamic(
  () => import("@/components/HeroGeometricMesh"),
  {
    ssr: false,
    loading: () => <FluidShaderPlaceholder />,
  }
);

function FluidShaderPlaceholder() {
  return (
    <div className="w-full h-full min-h-[360px] bg-gradient-to-tr from-[#FAFAFA] via-[#FFF1F3] to-[#FAFAFA] filter blur-[70px] opacity-60" />
  );
}

export function HeroVisualCenterpiece() {
  return (
    <div className="relative w-full h-full min-h-[380px]">
      <Suspense fallback={<FluidShaderPlaceholder />}>
        <HeroGeometricMesh />
      </Suspense>
    </div>
  );
}
