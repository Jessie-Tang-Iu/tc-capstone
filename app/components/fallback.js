"use client";

import { useState } from "react";
import Image from "next/image";

export default function SafeImage({
  srcBase,
  fallbackSrc,
  alt,
  width,
  height,
  className,
}) {
  const extensions = [".jpg", ".png", ".avif"];
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleError = () => {
    if (currentIndex < extensions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentSrc = `${srcBase}${extensions[currentIndex]}`;

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized // to prevent caching fallback errors
    />
  );
}
