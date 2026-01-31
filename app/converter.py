import re
import json
from pathlib import Path

INPUT_TXT = "story.txt"     # paste the story EXACTLY into this file
OUTPUT_JSON = "story.json"

def split_paragraphs(text: str):
    # Normalize line endings but preserve exact characters otherwise
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    # Split on one-or-more blank lines
    paras = [p.strip("\n") for p in re.split(r"\n\s*\n+", text) if p.strip()]
    return paras

def scene_id(i: int) -> str:
    return f"S{i:03d}"

def find_branch_targets(paras, i):
    """
    Attempts to map a decision at paragraph i to its two branch starts by scanning forward
    for headings like:
      ### If the Hero ...
      #### If the Hero ...
      ##### If the Hero ...
    Returns (left_scene_index, right_scene_index) or (None, None)
    """
    # scan forward for the next two "If the Hero ..." headings
    targets = []
    heading_re = re.compile(r"^(#{3,5})\s+If the Hero\b", re.MULTILINE)

    for j in range(i + 1, len(paras)):
        if heading_re.search(paras[j]):
            targets.append(j)
            if len(targets) == 2:
                break

    if len(targets) == 2:
        return targets[0], targets[1]
    return None, None

def is_decision_paragraph(p: str) -> bool:
    # Detects your decision paragraph header
    return bool(re.search(r"^\*\*Decision\s+–\s+.+?:\*\*", p.strip(), re.MULTILINE))

def extract_two_options(p: str):
    """
    Tries to extract the two option lines:
      - **Option 1: ...**
      - **Option 2: ...**
    Returns (opt1_text, opt2_text) or (None, None)
    """
    # capture the lines containing Option 1 and Option 2 (keep them exactly as written)
    opt1 = re.search(r"(\-\s+\*\*Option\s+1:.*?\*\*)", p, re.DOTALL)
    opt2 = re.search(r"(\-\s+\*\*Option\s+2:.*?\*\*)", p, re.DOTALL)
    return (opt1.group(1) if opt1 else None, opt2.group(1) if opt2 else None)

def main():
    text = Path(INPUT_TXT).read_text(encoding="utf-8")
    paras = split_paragraphs(text)

    scenes = []
    for idx, para in enumerate(paras):
        sid = scene_id(idx + 1)

        scene = {
            "SceneId": sid,
            "Text": para,
            "NextScene": scene_id(idx + 2) if idx + 1 < len(paras) else None
        }

        if is_decision_paragraph(para):
            # choices default
            left_idx, right_idx = find_branch_targets(paras, idx)
            scene["LeftChoice"] = scene_id(left_idx + 1) if left_idx is not None else None
            scene["RightChoice"] = scene_id(right_idx + 1) if right_idx is not None else None

            # optional: also store option text for convenience
            opt1, opt2 = extract_two_options(para)
            if opt1 is not None:
                scene["LeftOptionText"] = opt1
            if opt2 is not None:
                scene["RightOptionText"] = opt2

        scenes.append(scene)

    out = {
        "Title": "The Knight's Journey to Ronnie",
        "Scenes": scenes
    }

    Path(OUTPUT_JSON).write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Wrote {OUTPUT_JSON} with {len(scenes)} scenes.")

if __name__ == "__main__":
    main()
