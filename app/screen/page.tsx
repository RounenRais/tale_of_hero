import Image from "next/image";
import Link from "next/link";
export default function Start() {
      const base = 64;    
  const scale = 10;   
  return (
    <div className="compo">
            <Image
          src="/sprites/pixel/borderline.png"
              width={base}
              height={base}
              alt="play"
              unoptimized
              className="pixelart"
              style={{ width: base * scale, height: base * scale }}
            />
    </div>
  );
}
