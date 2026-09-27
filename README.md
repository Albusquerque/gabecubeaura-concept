# GabeCubeAura Concept Lab

A standalone, interactive product preview for [GabeCubeAura](https://github.com/Albusquerque/GabeCubeAura). It simulates the official Steam Machine's 17-pixel light bar without installing Decky Loader, reading a Steam account, or writing to hardware.

The mockup is prepared for the public **GabeCubeAura 1.0.0** identity. It includes:

- Customization+ as an independent permanent display, with all 61 effects grouped under Steady, Light Events, Controllers, Weather and Game Launches;
- one, two or three exact colours, hexadecimal editing, raw 34–255 brightness, speed and direction;
- per-AppID Game Launches using two or three dominant colours extracted locally from Hero, Header or Capsule artwork;
- custom two- and three-colour launch palettes retained separately per sample AppID, ten patterns and a 3–45 second timer;
- Artwork, Performance, Playtime, Light Events, controller status, Weather and the complete priority explanation;
- the `GabeCubeAura Off` wording, distinct from disabling every GabeCubeAura output.

Steam's native Patrol, Breathe, Rainbow and Solid presets are deliberately not imitated. GabeCubeAura Off is presented as the route that leaves Steam's authentic effect visible between temporary GabeCubeAura layers.

Light-event and weather frames are sampled from GabeCubeAura's real renderers by `export_frames.py` and `export_weather_frames.py`. Each exporter writes both JSON and a matching JavaScript data file so every Customization+ family also works when `index.html` is opened directly through `file://`. Customization+ remaps that choreography to its chosen palette. Launch patterns and other modes are interactive browser simulations, not live telemetry.

Sample artwork is from the public Steam store pages for [Deep Rock Galactic](https://store.steampowered.com/app/548430/), [The Witcher 3](https://store.steampowered.com/app/292030/) and [Balatro](https://store.steampowered.com/app/2379780/); each image belongs to its respective publisher. Uploaded images stay in the browser and are not sent anywhere.

The front-on console silhouette uses the **156 mm width × 152 mm height** ratio in [Valve's Steam Machine specifications](https://store.steampowered.com/hardware/steammachine). Valve lists 162.4 mm depth, which a front view cannot show. Lighting and diffuser details remain an illustration, not a hardware-accuracy claim.

The website has no dependencies, analytics or third-party runtime requests. Serve this directory over HTTP to test locally:

```sh
python3 -m http.server 8765
```

To refresh event or weather frames after changing GabeCubeAura's renderer, keep the plugin repository in a sibling directory and run `python3 export_frames.py` or `python3 export_weather_frames.py`. The Playwright smoke test is `node test_site.mjs` when Playwright is available in the parent workspace.

GitHub Pages serves this repository directly from the root of its `main` branch. See [PUBLICATION_NOTES.md](PUBLICATION_NOTES.md) for the coordinated 1.0.0 publication record.
