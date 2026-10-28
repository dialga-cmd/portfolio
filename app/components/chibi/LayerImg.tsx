"use client";

import Image from "next/image";

interface LayerImgProps {
  src: string;
  alt: string;
  style?: React.CSSProperties;
  className?: string;
}

export default function LayerImg({ src, alt, style, className }: LayerImgProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 70vw, 360px"
        style={{ objectFit: "contain" }}
        draggable={false}
      />
    </div>
  );
}
