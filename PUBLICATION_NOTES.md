# GabeCubeAura Concept Lab 1.0.0 publication notes

## Release scope

This website is the public showcase for **GabeCubeAura 1.0.0**. It accompanies
the final plugin release and uses the same public identity throughout.

The mockup now covers the product changes that were missing from the previous
SignalBar showcase:

- the GabeCubeAura name and future `Albusquerque/GabeCubeAura` links;
- Customization+ as a separate permanent display;
- the complete 61-effect library, grouped by origin;
- exact one-, two- or three-colour controls, raw brightness from 34 to 255,
  speed and direction;
- Game Launches as a temporary layer, with sample AppIDs, local artwork colour
  extraction, custom per-AppID palettes, ten patterns and a visible timer;
- GabeCubeAura Off wording and the revised priority hierarchy;
- explicit omission of Valve's Patrol, Breathe, Rainbow and Solid effects;
- no embedded LED game or unrelated game tab.

## Publication checks

1. The final behaviour was validated on the physical Steam Machine by the
   project owner.
2. The plugin repository and all public links use `Albusquerque/GabeCubeAura`.
3. GabeCubeAura 1.0.0 is published with a ZIP archive and SHA-256 checksums.
4. The concept repository is published from its `main` branch with GitHub
   Pages.
5. The live landing page, every simulator tab, repository links, desktop
   layout and the 390 px mobile layout are verified after deployment.

The concept site is published after the GabeCubeAura repository so its source
and download links resolve immediately.

## GitHub name check, 2026-09-27

The exact public path `github.com/Albusquerque/GabeCubeAura` returned 404 and was
therefore unoccupied at the time of this check. Nothing was created or
reserved. GitHub repository names are scoped to their owner, so this does not
guarantee future availability. A GitHub repository search for `GabeCubeAura`
returned zero public matches at the same time. Recheck the exact target path
immediately before renaming or creating the repository.

## Mockup functional audit, 2026-09-27

The audit following the rebrand found and corrected two functional gaps:

- direct `file://` opening could not fetch the JSON choreography files, leaving
  35 Customization+ Light Event and Weather choices dark; the exporters now
  generate matching JavaScript datasets loaded before `app.js`, with no runtime
  fetch dependency;
- Game Launches reused one global artwork palette, which allowed a completed
  image load to overwrite another game or artwork source; palettes are now
  stored by `game:source`, stale asynchronous loads are ignored, and the UI
  exposes an explicit analysing/ready state with the extracted hexadecimal
  colours. Because browsers forbid canvas pixel reads from local `file://`
  images, the nine bundled sample artworks also have a per-game/per-source
  palette cache; HTTP mode still performs the extraction dynamically.

The one-colour Customization+ choice now hides both unused colour fields, and
Steady disables controls that cannot affect it. The automated check now verifies
actual LED output for Steady and representative Event, Controller, Weather and
Launch families; all 19 event datasets and all 18 weather loops contain lit
frames; Hero/Header palettes differ where the sample artwork differs; custom
launch colours are the only hues rendered, and all ten launch patterns light
the bar; direct `file://`, desktop HTTP and 390 px mobile layouts are all
covered.
