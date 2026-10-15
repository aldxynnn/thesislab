"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen } from "lucide-react";

type BrandLogoVariant = "header" | "auth" | "workspace" | "footer";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
};

/**
 * Shared brand lockup used by every route.
 * The image is the brand symbol; the adjacent wordmark keeps the name visible.
 * Keep the custom asset at /public/logo.png.
 */
export default function BrandLogo({ variant = "header" }: BrandLogoProps) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <span className={`brand-logo brand-logo--${variant}`}>
      {!useFallback ? (
        <Image
          src="/logo.png"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          className="brand-logo-image"
          onError={() => setUseFallback(true)}
        />
      ) : (
        <span className="brand-logo-fallback-mark" aria-hidden="true">
          <BookOpen size={variant === "workspace" ? 15 : variant === "auth" ? 21 : 19} />
        </span>
      )}
      <span className="brand-logo-name" aria-label="ThesisLab">
        thesis<span>lab</span>
      </span>
    </span>
  );
}
