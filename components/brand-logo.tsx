"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen } from "lucide-react";

type BrandLogoVariant = "header" | "auth" | "workspace" | "footer";

type BrandLogoProps = {
  variant?: BrandLogoVariant;
};

/**
 * Centralized ThesisLab logo.
 *
 * To use the custom logo, put the image at /public/logo.png.
 * If that file is missing, the existing text-and-icon identity stays visible.
 */
export default function BrandLogo({ variant = "header" }: BrandLogoProps) {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <span className={`brand-logo brand-logo--${variant}`}>
      {!useFallback ? (
        <Image
          src="/logo.png"
          alt="ThesisLab"
          width={360}
          height={120}
          className="brand-logo-image"
          onError={() => setUseFallback(true)}
        />
      ) : (
        <span className="brand-logo-fallback">
          <span className="brand-logo-fallback-mark" aria-hidden="true">
            <BookOpen size={variant === "workspace" ? 15 : variant === "auth" ? 19 : 18} />
          </span>
          <span className="brand-logo-fallback-name">
            thesis<span>lab</span>
          </span>
        </span>
      )}
    </span>
  );
}
