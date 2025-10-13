import Image from "next/image";
import { useState } from "react";

export default function CustomImage({
  img,
  w,
  h,
  alt,
}: {
  img?: string;
  w?: number;
  h?: number;
  alt?: string;
}) {
  const [imgSrc, setImgSrc] = useState(
    img ? `/api/file/${img}` : "/logo/zu-black.png"
  );

  return (
    <Image
      src={imgSrc}
      objectFit="contain"
      alt={alt ?? "logo"}
      width={w ?? 50}
      className="h-full rounded-full"
      height={h ?? 50}
      onError={() => setImgSrc("/logo/zu-black.png")} // fallback зураг
    />
  );
}
