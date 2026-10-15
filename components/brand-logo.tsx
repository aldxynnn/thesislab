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
 * The custom symbol lives at /public/logo.png; the wordmark is rendered separately.
 */
export default function BrandLogo({ variant = "header" }: BrandLogoProps) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <span className={`brand-logo brand-logo--${variant}`}>
      <span className={`brand-logo-symbol brand-logo-symbol--${variant}`}>
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
          <BookOpen className="brand-logo-fallback-mark" aria-hidden="true" />
        )}
      </span>
      <span className="brand-logo-name" aria-label="ThesisLab">
        thesis<span>lab</span>
      </span>
    </span>
  );
}
