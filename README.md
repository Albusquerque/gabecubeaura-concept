# GabeCubeAura Concept Lab

A standalone, interactive product preview for [GabeCubeAura](https://github.com/Alyenax/GabeCubeAura). It simulates the official Steam Machine's 17-pixel light bar without installing Decky Loader, reading a Steam account, or writing to hardware.

The mockup now previews **GabeCubeAura 1.2.0 beta** while preserving the stable feature set. It includes:

- Customization+ as an independent permanent display, with all 61 effects grouped under Steady, Light Events, Controllers, Weather and Game Launches;
- one, two or three exact colours, hexadecimal editing, raw 34–255 brightness, speed and direction;
- per-AppID Game Launches using two or three dominant colours extracted locally from Hero, Header or Capsule artwork;
- custom two- and three-colour launch palettes retained separately per sample AppID, ten patterns and a 3–45 second timer;
- Artwork, Performance, Playtime, Light Events, Weather and the complete priority explanation;
- controller gauges for one to four players, automatic mirrored layouts for two and four players, a left-to-right Three Seats layout, Battery level or fixed Player seats colour meaning, editable P1 to P4 colours, three official choices in every animation family and dedicated Three Seats and Four Seats previews;
- an interactive Screen Sync simulation with Panorama and Ambient mappings, brightness, colour intensity and cinematic black-bar controls;
- an explicitly experimental The Witcher 3 Lab for Steam AppID 292030, including vitality, stamina, toxicity, adrenaline and Sign previews plus the required setup commands;
- the `GabeCubeAura Off` wording, distinct from disabling every GabeCubeAura output.

Steam's native Patrol, Breathe, Rainbow and Solid presets are deliberately not imitated. GabeCubeAura Off is presented as the route that leaves Steam's authentic effect visible between temporary GabeCubeAura layers. Native download activity, repeated Valve writes and the fixed red critical thermal warning remain above the simulated permanent displays in the priority explanation.

Light-event and weather frames are sampled from GabeCubeAura's real renderers by `export_frames.py` and `export_weather_frames.py`. Each exporter writes both JSON and a matching JavaScript data file so every Customization+ family also works when `index.html` is opened directly through `file://`. Controller previews use the plugin's real pattern names, timings and 17-pixel choreography. Three Seats and Four Seats extend those multiplayer patterns across fixed player zones. Battery level keeps the status palette used by the plugin. Player seats is a proposed alternative that assigns a persistent editable colour to P1, P2, P3 and P4 while low-battery and charging alerts keep their warning colours. Customization+ remaps that choreography to its chosen palette. Screen Sync and Witcher 3 are faithful visual explainers of the beta controls, not Gamescope capture or live game telemetry. Launch patterns and other modes are also interactive browser simulations.

Sample artwork is from the public Steam store pages for [Deep Rock Galactic](https://store.steampowered.com/app/548430/), [The Witcher 3](https://store.steampowered.com/app/292030/) and [Balatro](https://store.steampowered.com/app/2379780/); each image belongs to its respective publisher. Uploaded images stay in the browser and are not sent anywhere.

The front-on console silhouette uses the **156 mm width × 152 mm height** ratio in [Valve's Steam Machine specifications](https://store.steampowered.com/hardware/steammachine). Valve lists 162.4 mm depth, which a front view cannot show. Lighting and diffuser details remain an illustration, not a hardware-accuracy claim.

The website has no dependencies, analytics or third-party runtime requests. Serve this directory over HTTP to test locally:

```sh
python3 -m http.server 8765
```

To refresh event or weather frames after changing GabeCubeAura's renderer, keep the plugin repository in a sibling directory and run `python3 export_frames.py` or `python3 export_weather_frames.py`. The Playwright smoke test is `node test_site.mjs` when Playwright is available in the parent workspace.

GitHub Pages serves this repository directly from the root of its `main` branch. See [PUBLICATION_NOTES.md](PUBLICATION_NOTES.md) for the publication and beta-preview record.
