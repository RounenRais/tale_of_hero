import Image from "next/image";
import Link from "next/link";
export default function Start() {
      const base = 64;    
  const scale = 10;   
  return (
    <div className="compo">
    <Image
  src="/sprites/pixel/tale_of_hero.png"
      width={base}
      height={base}
      alt="play"
      unoptimized
      className="pixelart"
      style={{ width: base * scale, height: base * scale }}
    />
    <div className=" flex flex-col items-center justify-center gap-5">
      <Link href={"/screen/S001"} className=" flex items-center flex-col justify-center z-1 cursor-pointer ">
        <Image
          src="/sprites/play.ico"
          width={80}
          height={80}
          className="p-0 m-0"
          alt="start"
        />
      </Link>
      <button className="border-2  cursor-pointer h-10 w-20  z-1">How To Play</button>
      <button className="border-2 cursor-pointer  h-10 w-20 z-1">Donate Me</button>
      </div>
    </div>
  );
}
