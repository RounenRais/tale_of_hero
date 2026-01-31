import Image from "next/image";
import Link from "next/link";
import gameJson from "@/app/game.json";

type Scene = {
  SceneId: string;
  Type: "narration" | "choice" | "meta";
  ShowInGame: boolean;
  Text: string;
  NextScene: string | null;
  LeftChoice?: string | null;
  RightChoice?: string | null;
  LeftChoiceText?: string | null;
  RightChoiceText?: string | null;
  imageId?: string | number | null;
};
type GameFile = { Title: string; Scenes: Scene[] };

const game = gameJson as unknown as GameFile;

export default async function Page({ params }: { params: Promise<{ sceneId: string }> }) {
  // ✅ unwrap params
  const { sceneId } = await params;

  const scenes = game.Scenes ?? [];
  const byId = new Map(scenes.map((s) => [s.SceneId, s]));
  const getScene = (id?: string | null) => (id ? byId.get(id) ?? null : null);

  const nextPlayable = (start?: string | null) => {
    let cur = start ?? null;
    const visited = new Set<string>();
    while (cur) {
      if (visited.has(cur)) return null;
      visited.add(cur);
      const s = getScene(cur);
      if (!s) return null;
      if (s.ShowInGame) return s.SceneId;
      cur = s.NextScene;
    }
    return null;
  };

  const currentRaw = getScene(sceneId);
  if (!currentRaw) {
    return (
      <div style={{ padding: 20, color: "white" }}>
        Scene not found: {sceneId}
      </div>
    );
  }

  const current = currentRaw.ShowInGame
    ? currentRaw
    : getScene(nextPlayable(currentRaw.NextScene));

  if (!current) {
    return <div style={{ padding: 20, color: "white" }}>No playable scene</div>;
  }

  const isChoice = current.Type === "choice";
  const nextId = !isChoice ? nextPlayable(current.NextScene) : null;

  const pretty = (t?: string | null) =>
    (t ?? "").replace(/^Option\s*\d\s*:\s*/i, "").trim();

  const base = 64;
  const scale = 10;

  return (
    <div className=" flex flex-col items-center compo justify-center gap-5">
      <Image
        src="/sprites/pixel/borderline.png"
        width={base}
        height={base}
        alt="play"
        unoptimized
        className="pixelart z-[-1]"
        style={{ width: base * scale, height: base * scale }}
      />

      <div >
        { 
          // <Image
          //   src={`/sprites/sceneSprites/sprite_${current.imageId}.png`}
          //   className="pixel_scene"
          //   alt="scene_sprite"
          //   width={350}
          //   height={350}
          // />
         }

        <div className="max-w-[90vw] text-sm sm:max-w-[70vw] sm:text-base md:max-w-[40vw] md:text-lg lg:max-w-[30vw] ">
          {current.Text}
        </div>

        {isChoice ? (
          <div className="flex flex-col gap-4 items-center max-w-[90vw] text-sm sm:max-w-[70vw] sm:text-base md:max-w-[40vw] md:text-lg lg:max-w-[30vw] ">
            <Link href={`/screen/${current.LeftChoice}`}>
              {pretty(current.LeftChoiceText) || "Choice 1"}
            </Link>
            <Link href={`/screen/${current.RightChoice}`}>
              {pretty(current.RightChoiceText) || "Choice 2"}
            </Link>
          </div>
        ) : (
          <Link href={nextId ? `/screen/${nextId}` : `/screen/${current.SceneId}`}>
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
