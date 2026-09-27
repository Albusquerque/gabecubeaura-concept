"""Export the real GabeCubeAura light-event renderer for the static simulator.

Run from this directory. The generated JSON and JavaScript contain the same
data, not a second animation implementation. The script form lets the mockup
work when index.html is opened directly through file:// without fetch access.
"""

import json
import math
import sys
from pathlib import Path


HERE = Path(__file__).resolve().parent
PLUGIN = next((HERE.parent / name for name in ("GabeCubeAura", "SignalBar-v070-fixes", "SignalBar")
               if (HERE.parent / name / "py_modules").is_dir()), HERE.parent / "GabeCubeAura")
sys.path.insert(0, str(PLUGIN / "py_modules"))

from signalbar.providers.events import VARIANT_DURATIONS, event_frame  # noqa: E402


def main() -> None:
    fps = 24
    payload = {}
    for variant, duration in VARIANT_DURATIONS.items():
        if variant.startswith("record-"):
            kind = variant
        else:
            kind = variant.split("-", 1)[0]
        count = math.ceil(duration * fps) + 1
        frames = [event_frame(kind, min(duration, index / fps), variant)
                  for index in range(count)]
        payload[variant] = {"duration": duration, "fps": fps, "frames": frames}
    serialized = json.dumps(payload, separators=(",", ":"))
    output = HERE / "event-frames.json"
    script = HERE / "event-frames.js"
    output.write_text(serialized, encoding="utf-8")
    script.write_text(f"globalThis.GABECUBEAURA_EVENT_FRAMES={serialized};\n", encoding="utf-8")
    print(f"{len(payload)} GabeCubeAura variants -> {output} + {script}")


if __name__ == "__main__":
    main()
