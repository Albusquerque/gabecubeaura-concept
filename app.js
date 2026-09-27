/* GabeCubeAura Concept Lab: a browser-only visual simulator, not the plugin runtime. */
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const OFF = [0, 0, 0];
const WHITE = [246, 249, 255];
const CYAN = [67, 214, 225];
const ICE = [215, 240, 250];
const BLUE = [55, 132, 205];
const GOLD = [255, 196, 73];
const CHAMPAGNE = [255, 238, 170];
const PINK = [245, 98, 166];
const RED = [229, 54, 70];
const GREEN = [0, 180, 45];
const GAME_DATA = {
  drg: { title: "Deep Rock Galactic", id: "548430" },
  witcher: { title: "The Witcher 3: Wild Hunt", id: "292030" },
  balatro: { title: "Balatro", id: "2379780" },
};
const IMAGE_LABELS = { hero: "Library Hero", header: "Library Header", capsule: "Library Capsule" };
// Browsers display local file:// images but forbid reading their pixels back from canvas.
// These values are generated from the bundled samples and are only used for that security fallback.
const SAMPLE_ARTWORK_PALETTES = {
  "drg:hero": { 2: [[69, 48, 23], [198, 154, 86]], 3: [[56, 39, 18], [144, 104, 51], [236, 195, 118]] },
  "drg:header": { 2: [[52, 60, 39], [162, 154, 91]], 3: [[50, 58, 38], [131, 157, 123], [217, 135, 16]] },
  "drg:capsule": { 2: [[42, 57, 55], [165, 149, 94]], 3: [[42, 56, 54], [129, 169, 143], [203, 123, 33]] },
  "witcher:hero": { 2: [[204, 226, 223], [94, 89, 93]], 3: [[219, 240, 236], [150, 168, 170], [82, 72, 76]] },
  "witcher:header": { 2: [[202, 223, 219], [86, 77, 79]], 3: [[213, 234, 230], [148, 156, 156], [65, 54, 57]] },
  "witcher:capsule": { 2: [[77, 62, 65], [206, 223, 218]], 3: [[56, 38, 43], [220, 241, 234], [134, 128, 127]] },
  "balatro:hero": { 2: [[156, 62, 58], [29, 80, 118]], 3: [[50, 51, 61], [183, 69, 63], [33, 126, 199]] },
  "balatro:header": { 2: [[56, 37, 44], [198, 191, 190]], 3: [[41, 40, 49], [197, 196, 196], [165, 22, 18]] },
  "balatro:capsule": { 2: [[69, 64, 84], [186, 180, 190]], 3: [[66, 52, 64], [100, 122, 159], [214, 197, 197]] },
};
const PALETTES = {
  classic: ["#00b42d", "#f1ca25", "#e83b39"],
  thermal: ["#24c5e7", "#f2a724", "#e52239"],
  icefire: ["#287beb", "#a65be8", "#f98ac1"],
};
const START_COLOURS = { cyan: "#19c3eb", green: "#2dcd69", amber: "#f5a523", violet: "#a555eb", white: "#e1ebf5" };
const EVENT_OPTIONS = {
  notification: [
    ["notification-original", "Original · cyan crossing", "One quick cyan crossing."],
    ["notification-return", "Out and back", "A cyan glint crosses the bar and returns."],
    ["notification-echo", "Centre echo", "A centre call sends two waves towards the edges."],
    ["notification-ample", "Wide echo", "A bright centre call, one broad wave, then a softer echo."],
    ["notification-double", "Double halo", "Two separate centre pulses send halos to the edges."],
    ["notification-beacon", "Return beacon", "The edges answer a centre beacon and return to it."],
  ],
  achievement: [
    ["achievement-original", "Original · gold celebration", "Three centre beats open into a full gold bar."],
    ["achievement-confetti", "Return + confetti", "Gold opens, returns to centre and bursts into colours."],
    ["achievement-rebound", "Chromatic rebound", "Two gold ribbons rebound from the edges and collide in colour."],
    ["achievement-constellation", "Constellation", "Stars light in sequence, connect and radiate."],
    ["achievement-twoway", "Constellation round trip", "A line connects the stars in both directions, flashing at each end."],
    ["achievement-supernova", "Supernova", "Stars gather at centre, explode and leave a shimmering trail."],
  ],
  screenshot: [
    ["screenshot-original", "Original · ice shutter", "Two icy blades close like a camera shutter."],
    ["screenshot-double", "Shutter + two flashes", "A shutter closes; one central flash is followed by a wider flash."],
    ["screenshot-scan", "Scan + negative", "A focus line scans, flashes, then leaves a fading blue imprint."],
    ["screenshot-bloom", "Expanding echoes", "Each flash sends a soft echo outwards."],
    ["screenshot-ripple", "Ricochet echoes", "Narrow echoes reach the edges and bounce back."],
  ],
  recording: [
    ["record-start", "Recording starts", "Red traces meet at the centre, then leave a steady red marker."],
    ["record-stop", "Recording stops", "The centre marker sends red traces outward and goes dark."],
  ],
};
const CONTROLLER_OPTIONS = {
  duo: [["twin", "Twin reveal"], ["focus", "Two signatures"], ["double-welcome", "Mirror greeting"]],
  gauge: [["clean", "Quiet fill"], ["tip", "Bright tip"], ["horizon", "Soft horizon"]],
  connect: [["welcome", "Magnetic welcome"], ["orbit", "Arc return"], ["handshake", "Twin bloom"]],
  low: [["beacon", "Last ember"], ["drain", "Signal flare"], ["heartbeat", "Afterglow"]],
  charging: [["current", "Photon current"], ["breath", "Tidal fill"], ["spark", "Spark lattice"]],
};
const WEATHER_OPTIONS = {
  clear_day: ["Sun glints", "Solar bloom"],
  clear_night: ["Quiet constellation", "Silver hush"],
  rain: ["Bluewater", "Pearl rain"],
  cloud: ["Passing shadow", "Passing shadows", "Cross & gather", "Slow convergence"],
  breaks: ["Sun through clouds", "Sun, fading clouds"],
  breaks_night: ["Moon through clouds", "Moon, fading clouds"],
  snow: ["Melting snowfall", "Snow takes hold"],
  storm: ["Pulse and echoes", "Storm break"],
};
const WEATHER_ICONS = { clear_day: "☀", clear_night: "☾", rain: "☂", cloud: "☁", breaks: "⛅", breaks_night: "☾", snow: "❄", storm: "⚡" };
const LAUNCH_PATTERNS = [
  ["arpege-crossed", "Crossed arpeggio"], ["two-hands", "Two hands"],
  ["legato", "Legato"], ["nocturne", "Nocturne"], ["crescendo", "Crescendo"],
  ["color-wipe", "Color wipe"], ["scanner", "Scanner"],
  ["theater-chase", "Theater chase"], ["twinkle", "Twinkle"], ["ripple", "Ripple"],
];
const CUSTOMIZATION_GROUPS = [
  ["Steady", [["steady", "Steady · precise static colour"]]],
  ...Object.entries(EVENT_OPTIONS).filter(([kind]) => kind !== "recording").map(([kind, variants]) =>
    [`Light Events / ${kind[0].toUpperCase()}${kind.slice(1)}`, variants.map(([key, label]) => [`event:${key}`, label])]),
  ...Object.entries(CONTROLLER_OPTIONS).map(([kind, variants]) =>
    [`Controllers / ${kind[0].toUpperCase()}${kind.slice(1)}`, variants.map(([key, label]) => [`controller:${kind}:${key}`, label])]),
  ...Object.entries(WEATHER_OPTIONS).map(([condition, variants]) =>
    [`Weather / ${condition.replaceAll("_", " ")}`, variants.map((label, index) => [`weather:${condition}:${index}`, label])]),
  ["Game Launches", LAUNCH_PATTERNS],
];
function freshLaunchProfiles() {
  return Object.fromEntries(Object.keys(GAME_DATA).map((game) => [game, {
    paletteMode: "artwork",
    custom: { 2: ["#FFD000", "#00C8FF"], 3: ["#FFD000", "#00C8FF", "#FF3C9D"] },
  }]));
}

function defaultState() {
  return {
    tab: "overview", context: "game", display: "artwork", paused: false,
    game: "drg", artSource: "hero", artMode: "manual", artRow: 59, autoRow: 59,
    gameSettings: {
      drg: { source: "hero", mode: "manual", row: 59, display: "inherit" },
      witcher: { source: "hero", mode: "auto", row: 65, display: "inherit" },
      balatro: { source: "hero", mode: "manual", row: 34, display: "inherit" },
    },
    artCustom: null, artworkColors: Array.from({ length: 17 }, (_, i) => hexToRgb(i < 5 ? "#9ed163" : i < 12 ? "#e9aa22" : "#46a58e")),
    metric: "mixed", direction: "mirrored", cpu: 38, cpuTemp: 58, gpu: 72, gpuTemp: 70,
    palette: "classic", response: "balanced", shownCpu: 38, shownGpu: 72,
    coolColor: "#1eb4e6", middleColor: "#f5b42d", hotColor: "#eb2d37", coolTemp: 45, hotTemp: 78, perfHome: true,
    timerSource: "families", timerDuration: 60, timerRemaining: 2520, timerScale: 0, timerColor: "white", timerSpeed: 60, timerRunning: false, timerElapsed: 0,
    eventKind: "notification", eventVariants: { notification: "notification-beacon", achievement: "achievement-rebound", screenshot: "screenshot-bloom", recording: "record-start" },
    recording: false, recordIsolation: true,
    padCount: 2, padOne: 96, padTwo: 41, padCharging: false, controllerWhere: "home", chargeMode: "continuous-home", alertWhere: "both", lowThreshold: 20, padBrightness: 65,
    controllerScene: "duo", controllerVariants: { duo: "double-welcome", gauge: "tip", connect: "welcome", low: "beacon", charging: "breath" },
    padHealthy: "#00b42d", padMedium: "#e66e00", padLow: "#dc0c18", padCharge: "#0091dc",
    weatherCondition: "clear_day", weatherVariants: { clear_day: 0, clear_night: 0, rain: 0, cloud: 1, breaks: 0, breaks_night: 0, snow: 1, storm: 0 },
    weatherWhere: "off", weatherTopbar: false, weatherUnit: "celsius", weatherBrightness: 70, weatherCutoff: 0, weatherStart: 0,
    customPattern: "steady", customPaletteCount: 2, customColours: ["#FFD000", "#00C8FF", "#FF3C9D"], customBrightness: 128, customSpeed: 50, customDirection: "forward",
    launchGame: "drg", launchSource: "hero", launchColourCount: 2, launchPattern: "arpege-crossed", launchDuration: 20,
    launchProfiles: freshLaunchProfiles(), launchArtworkPalettes: {},
    launchStarted: 0, launchPlaying: false,
    extraDark: 2, reversePhysical: true, overlay: null,
  };
}
let state = defaultState();
let eventFrames = globalThis.GABECUBEAURA_EVENT_FRAMES || {};
let weatherFrames = globalThis.GABECUBEAURA_WEATHER_FRAMES || null;
let clock = 0;
let lastRealTime = performance.now();
let artworkLoadToken = 0;
let launchArtworkLoadToken = 0;
let customObjectUrl = null;
const ledElements = Array.from({ length: 17 }, () => {
  const led = document.createElement("i");
  $("#logicalLeds").append(led);
  return led;
});
const mobileLedElements = Array.from({ length: 17 }, () => {
  const led = document.createElement("i");
  $("#mobileLeds").append(led);
  return led;
});

function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function rgbToHex(rgb) { return `#${rgb.map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`; }
function hexToRgb(hex) { const value = hex.replace("#", ""); return [0, 2, 4].map((index) => parseInt(value.slice(index, index + 2), 16)); }
function blend(a, b, amount) { return a.map((value, index) => Math.round(value * (1 - amount) + b[index] * amount)); }
function scale(color, amount) { return color.map((value) => Math.round(value * amount)); }
function blank() { return Array.from({ length: 17 }, () => [...OFF]); }
function isLit(color) { return color.some((value) => value > 3); }
function formatTime(seconds) { const safe = Math.max(0, Math.ceil(seconds)); return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, "0")}`; }
function ease(value) { const x = clamp(value, 0, 1); return x * x * (3 - 2 * x); }
function fill(frame, from, to, color) { for (let index = Math.max(0, from); index <= Math.min(16, to); index++) frame[index] = [...color]; }
function put(frame, index, color) { if (index >= 0 && index < 17) frame[index] = [...color]; }
function colourAtTemp(temperature) {
  const palette = state.palette === "custom" ? [state.coolColor, state.middleColor, state.hotColor] : PALETTES[state.palette];
  const colors = palette.map(hexToRgb);
  const fraction = clamp((temperature - state.coolTemp) / Math.max(1, state.hotTemp - state.coolTemp), 0, 1);
  return fraction < .5 ? blend(colors[0], colors[1], fraction * 2) : blend(colors[1], colors[2], (fraction - .5) * 2);
}
function applyExtraDark(counts) {
  const values = [...counts];
  for (let i = 0; i < state.extraDark; i++) {
    const available = values.map((count, index) => count > 1 ? index : -1).filter((index) => index >= 0);
    if (!available.length) break;
    const selected = available.reduce((best, index) => values[index] > values[best] ? index : best, available[0]);
    values[selected]--;
  }
  return values;
}
function performanceFrames() {
  const frame = blank();
  const physical = blank();
  const cpuColor = colourAtTemp(state.cpuTemp), gpuColor = colourAtTemp(state.gpuTemp);
  if (state.metric === "mixed") {
    const cpuCount = Math.round(clamp(state.shownCpu, 0, 100) * 8 / 100);
    const gpuCount = Math.round(clamp(state.shownGpu, 0, 100) * 8 / 100);
    const [physicalCpu, physicalGpu] = applyExtraDark([cpuCount, gpuCount]);
    fill(frame, 0, cpuCount - 1, cpuColor); fill(physical, 0, physicalCpu - 1, cpuColor);
    const fillGpu = (target, count) => {
      if (state.direction === "mirrored") fill(target, 17 - count, 16, gpuColor);
      else fill(target, 9, 8 + count, gpuColor);
    };
    fillGpu(frame, gpuCount); fillGpu(physical, physicalGpu);
    return { logical: frame, physical, name: `CPU + GPU · ${state.direction === "mirrored" ? "mirrored" : "left-to-right"} meter`, readout: `CPU ${Math.round(state.shownCpu)}% · ${state.cpuTemp}°C   GPU ${Math.round(state.shownGpu)}% · ${state.gpuTemp}°C`, explain: "Eight LEDs for each meter; the centre LED stays dark. Length shows load, colour shows temperature.", badge: "PERFORMANCE" };
  }
  const cpu = state.metric === "cpu";
  const load = cpu ? state.shownCpu : state.shownGpu;
  const temp = cpu ? state.cpuTemp : state.gpuTemp;
  const count = Math.round(clamp(load, 0, 100) * 17 / 100);
  const [physicalCount] = applyExtraDark([count]);
  fill(frame, 0, count - 1, cpu ? cpuColor : gpuColor);
  fill(physical, 0, physicalCount - 1, cpu ? cpuColor : gpuColor);
  return { logical: frame, physical, name: `${cpu ? "CPU" : "GPU"} performance`, readout: `${Math.round(load)}% · ${temp}°C`, explain: "The meter grows with load. Its colour moves between Cool, Middle and Hot as temperature changes.", badge: "PERFORMANCE" };
}
function artworkFrame() {
  const colors = state.artworkColors?.length === 17 ? state.artworkColors : blank();
  const title = state.artCustom ? "Your image" : GAME_DATA[state.game].title;
  return { logical: colors, physical: colors, name: "Game artwork", readout: `${title} · row ${getSampleRow()}%`, explain: "The selected horizontal row is sampled into 17 colours. Upload an image to try your own palette.", badge: "ARTWORK" };
}
function countdownFrame() {
  const remaining = state.timerRemaining;
  const scaleDuration = state.timerScale ? state.timerScale * 60 : state.timerDuration * 60;
  const count = remaining <= 0 ? 0 : Math.ceil(17 * clamp(remaining / scaleDuration, 0, 1));
  const physicalCount = count === 17 ? 17 : remaining > 0 ? Math.max(1, count - state.extraDark) : 0;
  const chosen = remaining <= 300 ? [255, 0, 0] : remaining <= 900 ? hexToRgb("#f5a523") : hexToRgb(START_COLOURS[state.timerColor]);
  const make = (lit) => {
    const frame = blank();
    for (let index = 0; index < lit; index++) frame[index] = scale(chosen, .34);
    if (lit) {
      const head = lit - 1 - (Math.floor(state.timerElapsed / .2) % lit);
      frame[head] = chosen;
      put(frame, head + 1, scale(chosen, .72));
      put(frame, head + 2, scale(chosen, .52));
      for (let index = lit; index < 17; index++) frame[index] = [...OFF];
    }
    return frame;
  };
  if (remaining <= 8 && remaining > 0) {
    const phase = (8 - remaining) % 1.8;
    const flash = [0, .3, .6].some((start) => phase >= start && phase < start + .15);
    const frame = flash ? Array.from({ length: 17 }, () => [255, 255, 255]) : blank();
    return { logical: frame, physical: frame, name: "Final eight seconds", readout: formatTime(remaining), explain: "Three short white flashes repeat until the timer reaches zero.", badge: "COUNTDOWN" };
  }
  const source = state.timerSource === "families" ? "Steam Families" : "Personal timer";
  return { logical: make(count), physical: make(physicalCount), name: `${source} countdown`, readout: `${formatTime(remaining)} left · ${count}/17 logical LEDs`, explain: "The bright point travels right to left. Below 15 minutes the bar turns amber; below five minutes it turns red.", badge: "PLAYTIME" };
}
function controllerColour(percent, charging = false) {
  if (charging) return hexToRgb(state.padCharge);
  if (percent <= state.lowThreshold) return hexToRgb(state.padLow);
  if (percent <= Math.max(35, state.lowThreshold + 5)) return hexToRgb(state.padMedium);
  return hexToRgb(state.padHealthy);
}
function controllerGauge(percent, count = 17, fromRight = false, charging = false) {
  const result = Array.from({ length: count }, () => [...OFF]);
  const lit = percent > 0 ? Math.max(1, Math.round(percent * count / 100)) : 0;
  for (let index = 0; index < lit; index++) result[fromRight ? count - 1 - index : index] = controllerColour(percent, charging);
  return result;
}
function controllerBaseFrame(animateCharging = false) {
  let frame;
  const chargingAllowed = state.chargeMode === "continuous-everywhere" || (state.chargeMode === "continuous-home" && state.context === "home");
  const activePercent = state.padCount === 2 ? state.padTwo : state.padOne;
  const charging = state.padCharging && chargingAllowed && activePercent < 100;
  if (state.padCount === 2) {
    const first = controllerGauge(state.padOne, 8);
    const second = controllerGauge(state.padTwo, 8, true, charging);
    frame = [...first, [...OFF], ...second];
    const leftTip = first.findLastIndex(isLit);
    const rightTip = second.findIndex(isLit);
    if (leftTip >= 0) frame[leftTip] = [...WHITE];
    if (rightTip >= 0) frame[9 + rightTip] = [...WHITE];
    if (charging && state.padTwo < 100 && animateCharging) {
      const lit = second.map((color, index) => isLit(color) ? index : -1).filter((index) => index >= 0);
      if (lit.length) {
        const phase = (clock / 1000) % 3.2;
        const point = 16 - Math.min(lit.length - 1, Math.floor(ease(phase / 2.75) * lit.length));
        put(frame, point, WHITE);
      }
    }
  } else {
    frame = controllerGauge(state.padOne, 17, false, charging);
    const tip = frame.findLastIndex(isLit);
    if (tip >= 0 && state.controllerVariants.gauge !== "clean") frame[tip] = [...WHITE];
    if (charging && state.padOne < 100 && animateCharging) {
      const lit = frame.filter(isLit).length;
      const point = Math.min(lit - 1, Math.floor(ease(((clock / 1000) % 3.2) / 2.75) * lit));
      if (point >= 0) put(frame, point, WHITE);
    }
    if (state.controllerVariants.gauge === "horizon") frame = frame.map((color) => scale(color, .58));
  }
  return frame.map((color) => scale(color, state.padBrightness / 100));
}
function controllerFrame() {
  const frame = controllerBaseFrame(true);
  const second = state.padCount === 2 ? ` · P2 ${state.padTwo}%` : "";
  const activePercent = state.padCount === 2 ? state.padTwo : state.padOne;
  const charging = state.padCharging && state.chargeMode !== "off" && activePercent < 100;
  return { logical: frame, physical: frame, name: charging ? "Controller charging" : state.padCount === 2 ? "Two mirrored controllers" : "Controller battery", readout: `P1 ${state.padOne}%${second}${charging ? " · charging" : ""}`, explain: state.padCount === 2 ? "Eight LEDs per player, mirrored towards a dark centre. White tips mark each reported charge level." : "The lit length reflects the reported battery. A white tip can mark its exact end.", badge: "CONTROLLERS" };
}
function weatherFrame() {
  const variant = state.weatherVariants[state.weatherCondition];
  const loop = weatherFrames?.frames?.[state.weatherCondition]?.[variant];
  const elapsed = Math.max(0, clock - state.weatherStart) / 1000;
  const raw = loop?.[Math.floor(elapsed * weatherFrames.fps) % loop.length] || blank();
  const frame = raw.map((pixel) => {
    const scaled = scale(pixel, state.weatherBrightness / 100);
    return Math.max(...scaled) <= state.weatherCutoff ? [...OFF] : scaled;
  });
  return { logical: frame, physical: frame, name: `${state.weatherCondition.replaceAll("_", " ")} · ${WEATHER_OPTIONS[state.weatherCondition][variant]}`, readout: `${state.weatherUnit === "fahrenheit" ? "64°F" : "18°C"} · sample sky`, explain: "An eight-second weather loop repeats on the light bar. The exact temperature is text only, never encoded as LED colours.", badge: "WEATHER" };
}
function controllerPreviewFrame(overlay) {
  const t = (clock - overlay.start) / 1000;
  const variant = overlay.variant;
  const percent = overlay.kind === "low" ? Math.min(state.padOne, state.lowThreshold) : overlay.kind === "charging" && state.padCount === 2 ? state.padTwo : state.padOne;
  const frame = blank();
  if (overlay.kind === "duo") {
    const settled = controllerBaseFrame(false);
    const finishAt = variant === "twin" ? 1.45 : variant === "focus" ? 3.3 : 3.4;
    if (variant === "twin" && t < finishAt) {
      const fraction = ease(t / finishAt);
      for (let i = 0; i < Math.round(fraction * 8); i++) frame[i] = settled[i];
      for (let i = 16; i > 16 - Math.round(fraction * 8); i--) frame[i] = settled[i];
    } else {
      settled.forEach((color, index) => { frame[index] = color; });
      if (t < finishAt) {
        const step = variant === "focus" ? (t < 1.7 ? Math.floor(ease(t / 1.7) * 7) : Math.floor(ease((t - 1.7) / 1.6) * 7)) : t < 1.6 ? Math.floor(ease(t / 1.6) * 7) : Math.floor((1 - ease((t - 1.6) / 1.8)) * 7);
        if (variant !== "focus" || t < 1.7) put(frame, step, WHITE);
        if (variant !== "focus" || t >= 1.7) put(frame, 16 - step, WHITE);
      }
    }
    frame[8] = [...OFF];
  } else if (overlay.kind === "gauge") {
    return controllerFrame();
  } else if (overlay.kind === "connect") {
    if (t < 1.75) {
      if (variant === "welcome") { const point = Math.min(8, Math.floor(ease(t / 1.3) * 8)); put(frame, point, CYAN); put(frame, 16 - point, CYAN); if (t > 1.3) fill(frame, 6, 10, WHITE); }
      if (variant === "orbit") { const point = Math.floor(ease(t < 1.15 ? t / 1.15 : 2 - t / 1.15) * 16); put(frame, point, WHITE); put(frame, point - 1, CYAN); put(frame, point + 1, CYAN); }
      if (variant === "handshake") { const point = Math.floor(ease(t / 1.65) * 8); put(frame, 8 - point, WHITE); put(frame, 8 + point, WHITE); }
    } else return controllerFrame();
  } else if (overlay.kind === "low") {
    const low = Math.max(1, Math.round(percent / 100 * 17));
    const red = hexToRgb(state.padLow);
    if (variant === "beacon" && t < 1.25) fill(frame, 0, Math.max(low, Math.round((1 - ease(t / 1.25)) * 17)) - 1, hexToRgb(state.padMedium));
    else { fill(frame, 0, low - 1, variant === "heartbeat" && t % .92 < .25 ? WHITE : red); if (variant === "drain" && t < 2.4) put(frame, Math.floor((t < 1.2 ? t / 1.2 : 2 - t / 1.2) * 16), WHITE); if (variant === "beacon" && ((t > 1.5 && t < 1.73) || (t > 1.91 && t < 2.15))) put(frame, low - 1, WHITE); }
  } else if (overlay.kind === "charging") {
    const width = state.padCount === 2 ? 8 : 17;
    const lit = Math.max(1, Math.round(percent / 100 * width));
    const chargedIndices = state.padCount === 2 ? Array.from({ length: lit }, (_, index) => 16 - index) : Array.from({ length: lit }, (_, index) => index);
    if (state.padCount === 2) {
      const first = controllerGauge(state.padOne, 8);
      first.forEach((color, index) => { frame[index] = color; });
      const firstTip = first.findLastIndex(isLit);
      if (firstTip >= 0) put(frame, firstTip, WHITE);
    }
    chargedIndices.forEach((index) => put(frame, index, hexToRgb(state.padCharge)));
    if (variant === "current") put(frame, chargedIndices[Math.min(lit - 1, Math.floor(ease(t / 1.95) * lit))], WHITE);
    if (variant === "breath") { const centre = ease(t / 2.75) * (lit + 3) - 2; chargedIndices.forEach((index, position) => { if (Math.abs(position - centre) < 2.8) put(frame, index, Math.abs(position - centre) < 1 ? WHITE : ICE); }); }
    if (variant === "spark") for (let i = 0; i < 3; i++) put(frame, chargedIndices[Math.floor(((t / 2.15 + i / 3) % 1) * lit)], i === 0 ? WHITE : ICE);
    put(frame, chargedIndices[lit - 1], WHITE);
  }
  const scaled = frame.map((color) => scale(color, state.padBrightness / 100));
  return { logical: scaled, physical: scaled, name: `${overlay.kind === "duo" ? "Two controllers" : overlay.kind === "low" ? "Low battery" : overlay.kind === "connect" ? "Controller connected" : "Charging"} · ${CONTROLLER_OPTIONS[overlay.kind]?.find(([id]) => id === variant)?.[1] || "preview"}`, readout: overlay.kind === "duo" ? `P1 ${state.padOne}% · P2 ${state.padTwo}%` : `${percent}% · demo`, explain: "A short controller animation temporarily replaces the everyday display.", badge: "CONTROLLER EVENT" };
}
function eventFrame(overlay) {
  const data = eventFrames[overlay.key];
  const elapsed = Math.max(0, (clock - overlay.start) / 1000);
  const index = data ? Math.min(data.frames.length - 1, Math.floor(elapsed * data.fps)) : 0;
  const frame = data ? data.frames[index] : blank();
  const title = Object.values(EVENT_OPTIONS).flat().find(([key]) => key === overlay.key)?.[1] || overlay.key;
  return { logical: frame, physical: frame, name: title, readout: `${Math.max(0, overlay.duration - elapsed).toFixed(1)} s`, explain: "This short light event takes the bar, then the live display underneath returns.", badge: "LIGHT EVENT" };
}
function addGlow(frame, position, width, colour, strength = 1) {
  for (let index = 0; index < 17; index++) {
    const weight = Math.max(0, 1 - Math.abs(index - position) / Math.max(.1, width)) * strength;
    const candidate = scale(colour, weight);
    if (Math.max(...candidate) > Math.max(...frame[index])) frame[index] = candidate;
  }
}
function launchPatternFrame(pattern, palette, seconds, strength = 1) {
  const frame = blank();
  const colours = palette.length > 1 ? palette : [palette[0], palette[0]];
  const phase = Math.max(0, seconds);
  if (pattern === "arpege-crossed") {
    const travel = (phase * 5.1) % 32, left = travel <= 16 ? travel : 32 - travel;
    addGlow(frame, left, 3, colours[0], strength); addGlow(frame, 16 - left, 3, colours[1], strength);
    if (colours[2]) addGlow(frame, 8 + Math.sin(phase * 2.2) * 5, 2.1, colours[2], strength * .72);
  } else if (pattern === "two-hands") {
    const radius = Math.abs(8 - ((phase * 4) % 16));
    addGlow(frame, 8 - radius, 2.7, colours[0], strength); addGlow(frame, 8 + radius, 2.7, colours[1], strength);
    if (colours[2]) addGlow(frame, 8, 2.5, colours[2], strength * (1 - radius / 8) * .85);
  } else if (pattern === "legato") {
    for (let index = 0; index < 17; index++) {
      const wave = (Math.sin(index * .58 - phase * 2) + 1) / 2;
      const base = Math.floor(phase / 2) % colours.length;
      frame[index] = scale(colours[(base + (wave >= .5 ? 1 : 0)) % colours.length], strength * (.45 + .5 * wave));
    }
  } else if (pattern === "nocturne") {
    const breath = .32 + .45 * (Math.sin(phase * 1.15 - Math.PI / 2) + 1) / 2;
    for (let index = 0; index < 17; index++) frame[index] = scale(colours[index % colours.length], strength * breath * (.55 + .35 * Math.cos(index * .42) ** 2));
    const spark = Math.floor(phase * 2.3) % 17;
    addGlow(frame, spark, 1.4, colours[(spark + 1) % colours.length], strength * .75);
  } else if (pattern === "crescendo") {
    const cycle = (phase % 3.2) / 3.2, reach = cycle * 8.8;
    for (let index = 0; index < 17; index++) {
      const distance = Math.abs(index - 8);
      if (distance <= reach) frame[index] = scale(colours[Math.min(colours.length - 1, Math.floor(distance / 8 * colours.length))], strength * (.45 + .55 * cycle));
    }
    addGlow(frame, 8 - reach, 1.7, colours[0], strength); addGlow(frame, 8 + reach, 1.7, colours[1], strength);
  } else if (pattern === "color-wipe") {
    const raw = phase * 7, head = Math.floor(raw % 23) - 3, colourIndex = Math.floor(raw / 23) % colours.length;
    for (let index = 0; index < 17; index++) if (index <= head) frame[index] = scale(colours[colourIndex], strength * .82);
    addGlow(frame, head, 2.4, colours[(colourIndex + 1) % colours.length], strength);
  } else if (pattern === "scanner") {
    const travel = (phase * 6.4) % 32, position = travel <= 16 ? travel : 32 - travel, colourIndex = Math.floor(phase / 2.5) % colours.length;
    addGlow(frame, position, 3.2, colours[colourIndex], strength);
    addGlow(frame, position - (travel <= 16 ? 2 : -2), 3.8, colours[(colourIndex + 1) % colours.length], strength * .32);
  } else if (pattern === "theater-chase") {
    const step = Math.floor(phase * 7.5);
    for (let index = 0; index < 17; index++) {
      if ((index + step) % 3 === 0) frame[index] = scale(colours[(Math.floor(index / 3) + Math.floor(step / 3)) % colours.length], strength);
      else if ((index + step) % 3 === 1) frame[index] = scale(colours[(index + 1) % colours.length], strength * .18);
    }
  } else if (pattern === "twinkle") {
    const tick = Math.floor(phase * 8);
    for (let index = 0; index < 17; index++) {
      const seed = (index * 73 + tick * 47 + (index + tick) * 19) % 101;
      if (seed < 24) addGlow(frame, index, 1.25, colours[(index * 5 + tick) % colours.length], strength * (.4 + .6 * (1 - seed / 24)));
    }
  } else if (pattern === "ripple") {
    [0, 1.1, 2.2].forEach((offset, colourIndex) => {
      const age = ((phase - offset) % 3.3 + 3.3) % 3.3, radius = age / 3.3 * 9.5;
      addGlow(frame, 8 - radius, 1.8, colours[colourIndex % colours.length], strength * (1 - age / 3.3));
      addGlow(frame, 8 + radius, 1.8, colours[colourIndex % colours.length], strength * (1 - age / 3.3));
    });
  }
  return frame;
}
function activeLaunchPalette() {
  const profile = state.launchProfiles[state.launchGame];
  const key = `${state.launchGame}:${state.launchSource}`;
  const raw = profile.paletteMode === "custom"
    ? profile.custom[state.launchColourCount]
    : state.launchArtworkPalettes[key]?.[state.launchColourCount];
  return Array.isArray(raw)
    ? raw.map((colour) => typeof colour === "string" ? hexToRgb(colour) : colour)
    : [];
}
function launchReadyFrame() {
  const palette = activeLaunchPalette();
  const frame = palette.length
    ? Array.from({ length: 17 }, (_, index) => palette[Math.min(palette.length - 1, Math.floor(index * palette.length / 17))])
    : blank();
  const profile = state.launchProfiles[state.launchGame];
  return {
    logical: frame,
    physical: frame,
    name: palette.length ? `${GAME_DATA[state.launchGame].title} · launch palette ready` : `${GAME_DATA[state.launchGame].title} · analysing artwork`,
    readout: palette.length
      ? `${palette.length} ${profile.paletteMode === "custom" ? "custom" : "artwork"} colours · AppID ${GAME_DATA[state.launchGame].id}`
      : `AppID ${GAME_DATA[state.launchGame].id}`,
    explain: palette.length
      ? "These are the exact colours the selected launch animation will use. Choose a pattern, then preview it."
      : "The selected artwork is being decoded locally before the launch preview becomes available.",
    badge: palette.length ? "LAUNCH READY" : "ANALYSING",
  };
}
function launchFrame() {
  const elapsed = Math.max(0, (clock - state.launchStarted) / 1000);
  if (!state.launchPlaying || elapsed >= state.launchDuration) {
    state.launchPlaying = false;
    return launchReadyFrame();
  }
  const envelope = Math.min(1, elapsed / .45, Math.max(0, state.launchDuration - elapsed) / .65);
  const frame = launchPatternFrame(state.launchPattern, activeLaunchPalette(), elapsed, envelope);
  const label = LAUNCH_PATTERNS.find(([key]) => key === state.launchPattern)?.[1] || state.launchPattern;
  return { logical: frame, physical: frame, name: `${GAME_DATA[state.launchGame].title} · ${label}`, readout: `${Math.ceil(state.launchDuration - elapsed)} s · AppID ${GAME_DATA[state.launchGame].id}`, explain: "A temporary launch layer uses only the selected two or three hues, plus darker values towards black. The permanent display returns afterwards.", badge: "GAME LAUNCH" };
}
function recolourFrame(raw, palette, brightness, phase) {
  return raw.map((pixel, index) => {
    const level = Math.max(...pixel);
    return level <= 0 ? [...OFF] : scale(palette[(index + Math.floor(phase * .7)) % palette.length], brightness / 255 * level / 255);
  });
}
function customizationFrame() {
  const pattern = state.customPattern;
  const palette = state.customColours.slice(0, state.customPaletteCount).map(hexToRgb);
  const phase = clock / 1000 * (.2 + state.customSpeed * .028);
  let frame;
  if (pattern === "steady") frame = Array.from({ length: 17 }, () => scale(palette[0], state.customBrightness / 255));
  else if (pattern.startsWith("event:")) {
    const key = pattern.slice(6), data = eventFrames[key];
    const raw = data?.frames?.[Math.floor(phase * data.fps) % data.frames.length] || blank();
    frame = recolourFrame(raw, palette, state.customBrightness, phase);
  } else if (pattern.startsWith("controller:")) {
    const [, kind, variant] = pattern.split(":");
    const raw = controllerPreviewFrame({ kind, variant, start: clock - (phase % 3.2) * 1000, duration: 99 }).logical;
    frame = recolourFrame(raw, palette, state.customBrightness, phase);
  } else if (pattern.startsWith("weather:")) {
    const [, condition, rawVariant] = pattern.split(":"), variant = Number(rawVariant);
    const loop = weatherFrames?.frames?.[condition]?.[variant];
    const raw = loop?.[Math.floor(phase * weatherFrames.fps) % loop.length] || blank();
    frame = recolourFrame(raw, palette, state.customBrightness, phase);
  } else frame = launchPatternFrame(pattern, palette, phase, state.customBrightness / 255);
  if (state.customDirection === "reverse") frame.reverse();
  const label = [...CUSTOMIZATION_GROUPS.flatMap(([, choices]) => choices)].find(([key]) => key === pattern)?.[1] || pattern;
  return { logical: frame, physical: frame, name: `Customization+ · ${label}`, readout: `${state.customPaletteCount} colour${state.customPaletteCount === 1 ? "" : "s"} · ${state.customBrightness}/255 · speed ${state.customSpeed}`, explain: "A permanent GabeCubeAura display. Short alerts, launch animations and countdowns can temporarily take priority, then this scene returns.", badge: "CUSTOMIZATION+" };
}
 function activeContext(placement) { return placement === "everywhere" || (placement === "home" && state.context === "home"); }
function getCurrentOutput() {
  const countdownActive = state.timerRunning && state.timerRemaining > 0 && (state.timerSource !== "families" || state.context === "game");
  if (countdownActive && state.timerRemaining <= 300) return countdownFrame();
  if (state.overlay && (clock - state.overlay.start) / 1000 < state.overlay.duration) {
    return state.overlay.type === "event" ? eventFrame(state.overlay) : controllerPreviewFrame(state.overlay);
  }
  if (state.overlay) state.overlay = null;
  if (state.launchPlaying) return launchFrame();
  if (countdownActive) return countdownFrame();
  if (state.tab === "launches") return launchReadyFrame();
  if (state.display === "disabled") return { logical: blank(), physical: blank(), name: "GabeCubeAura Off", readout: "Steam keeps the bar", explain: "No permanent GabeCubeAura display is selected here. Temporary GabeCubeAura layers can still appear; the master switch in the real plugin is the control that stops everything.", badge: "GABECUBEAURA OFF" };
  const chargeContext = state.chargeMode === "continuous-everywhere" || (state.chargeMode === "continuous-home" && state.context === "home");
  const persistentContext = activeContext(state.controllerWhere);
  if ((state.padCharging && chargeContext && (state.padCount === 2 ? state.padTwo : state.padOne) < 100) || persistentContext) return controllerFrame();
  if (state.weatherWhere === "everywhere" || state.weatherWhere === state.context) return weatherFrame();
  let output;
  if (state.display === "customization") output = customizationFrame();
  else if (state.display === "performance" && (state.context === "game" || state.perfHome)) output = performanceFrames();
  else if (state.display === "artwork" && state.context === "game") output = artworkFrame();
  else output = { logical: blank(), physical: blank(), name: "GabeCubeAura Off", readout: "Steam keeps the bar", explain: "Choose a permanent display for this context, or leave GabeCubeAura Off to keep Steam's own light-bar behaviour.", badge: "GABECUBEAURA OFF" };
  if (state.recording && (output.badge === "PERFORMANCE" || output.badge === "ARTWORK")) {
    output.logical = output.logical.map((color) => [...color]);
    output.physical = output.physical.map((color) => [...color]);
    if (state.recordIsolation) for (const index of [7, 9]) { output.logical[index] = [...OFF]; output.physical[index] = [...OFF]; }
    output.logical[8] = [...RED]; output.physical[8] = [...RED];
    output.name += " · recording";
    output.explain = "The centre LED marks active recording. Its neighbours can be isolated for better contrast.";
  }
  return output;
}

function drawPhysical(frame) {
  const canvas = $("#ledCanvas");
  const bounds = canvas.getBoundingClientRect();
  if (!bounds.width || !bounds.height) return;
  const ratio = Math.min(2, window.devicePixelRatio || 1);
  const width = Math.round(bounds.width * ratio), height = Math.round(bounds.height * ratio);
  if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, width, height);
  // With reversal enabled, the hardware mapping corrects its native right-to-left order.
  // Show the viewer-facing result, not the byte order sent to sysfs.
  const pixels = state.reversePhysical ? frame : [...frame].reverse();
  const cell = width / 17, centreY = height * .48;
  ctx.globalCompositeOperation = "screen";
  pixels.forEach((color, index) => {
    if (!isLit(color)) return;
    const x = (index + .5) * cell;
    const radius = cell * 1.32;
    const glow = ctx.createRadialGradient(x, centreY, 0, x, centreY, radius);
    const rgb = color.join(",");
    glow.addColorStop(0, `rgba(${rgb},.42)`);
    glow.addColorStop(.4, `rgba(${rgb},.17)`);
    glow.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = glow;
    ctx.fillRect(x - radius, centreY - radius, radius * 2, radius * 2);
  });
  ctx.globalCompositeOperation = "source-over";
  const diffuser = ctx.createLinearGradient(0, 0, width, 0);
  pixels.forEach((color, index) => diffuser.addColorStop((index + .5) / 17, `rgba(${color.join(",")},${isLit(color) ? .91 : 0})`));
  ctx.fillStyle = diffuser;
  ctx.fillRect(0, centreY - height * .045, width, height * .09);
}
 function renderStage() {
  const output = getCurrentOutput();
  ledElements.forEach((element, index) => {
    const color = output.logical[index] || OFF;
    element.style.background = isLit(color) ? rgbToHex(color) : "#33454e";
    const glow = "";
    element.style.boxShadow = glow;
    mobileLedElements[index].style.background = element.style.background;
  });
  $("#logicalLeds").setAttribute("aria-label", `${output.name}: ${output.logical.filter(isLit).length} of 17 logical LEDs lit`);
  drawPhysical(output.physical || output.logical);
  $("#signalName").textContent = output.name;
  $("#signalReadout").textContent = output.readout;
  $("#stageExplain").textContent = output.explain;
  $("#providerBadge").textContent = output.badge;
  $("#mobileSignal").textContent = output.name;
  const stagedGame = state.tab === "launches" ? state.launchGame : state.game;
  $("#contextLabel").textContent = state.context === "home" ? "STEAM HOME" : `IN GAME · ${GAME_DATA[stagedGame].title}`;
  $("#contextSwitch").disabled = false;
  $("#contextSwitch").textContent = state.context === "home" ? "Go in game ↔" : "Go Home ↔";
  if (state.tab === "launches") {
    const remaining = Math.max(0, state.launchDuration - (clock - state.launchStarted) / 1000);
    const paletteReady = activeLaunchPalette().length === state.launchColourCount;
    $("#launchStatus").textContent = state.launchPlaying ? `Playing · ${Math.ceil(remaining)} s` : paletteReady ? `Ready · ${state.launchDuration} s` : "Waiting for colours";
  }
}
function tick(realNow) {
  const elapsed = clamp(realNow - lastRealTime, 0, 100);
  lastRealTime = realNow;
  if (!state.paused) {
    clock += elapsed;
    const time = elapsed / 1000;
    if (state.timerRunning && state.timerRemaining > 0) {
      state.timerRemaining = Math.max(0, state.timerRemaining - time * state.timerSpeed);
      state.timerElapsed += time;
      if (state.timerRemaining === 0) state.timerRunning = false;
      $("#timerRemainingValue").textContent = formatTime(state.timerRemaining);
      $("#timerRemaining").value = String(Math.round(state.timerRemaining));
    }
    const smoothing = state.response === "responsive" ? .18 : state.response === "smooth" ? 2.5 : .7;
    const alpha = 1 - Math.exp(-time / smoothing);
    state.shownCpu += (state.cpu - state.shownCpu) * alpha;
    state.shownGpu += (state.gpu - state.shownGpu) * alpha;
  }
  renderStage();
  requestAnimationFrame(tick);
}

function getSampleRow() {
  return state.artMode === "center" ? 50 : state.artMode === "lower" ? 76 : state.artMode === "auto" ? state.autoRow : state.artRow;
}
function saveGameArtworkChoice() {
  if (state.artCustom) return;
  const settings = state.gameSettings[state.game];
  settings.source = state.artSource;
  settings.mode = state.artMode;
  settings.row = state.artRow;
}
function updateSampleLine() {
  const image = $("#artImage");
  const frame = $(".art-image-wrap").getBoundingClientRect();
  const rect = image.getBoundingClientRect();
  const line = $("#sampleLine");
  line.style.left = `${rect.left - frame.left}px`;
  line.style.width = `${rect.width}px`;
  line.style.top = `${rect.top - frame.top + rect.height * getSampleRow() / 100}px`;
  $("#artTypeLabel").textContent = `${state.artCustom ? "Your image" : IMAGE_LABELS[state.artSource]} · row ${getSampleRow()}%`;
  $("#artRowValue").textContent = `${getSampleRow()}%`;
}
function updateMobilePreviewVisibility() {
  const settings = $(".settings-shell").getBoundingClientRect();
  const stage = $(".stage-shell").getBoundingClientRect();
  const visible = window.innerWidth <= 850 && stage.bottom < 0 && settings.top < window.innerHeight && settings.bottom > 0;
  $("#mobilePreview").classList.toggle("visible", visible);
}
function sampleArtwork(image) {
  if (!image.naturalWidth || !image.naturalHeight) return;
  const canvas = document.createElement("canvas");
  canvas.width = Math.min(image.naturalWidth, 680);
  canvas.height = Math.min(image.naturalHeight, 360);
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const y = clamp(Math.round((canvas.height - 1) * getSampleRow() / 100), 0, canvas.height - 1);
  let data;
  try { data = context.getImageData(0, y, canvas.width, 1).data; }
  catch { updateSampleLine(); return; }
  state.artworkColors = Array.from({ length: 17 }, (_, index) => {
    const start = Math.floor(index * canvas.width / 17), end = Math.max(start + 1, Math.floor((index + 1) * canvas.width / 17));
    const sum = [0, 0, 0];
    for (let x = start; x < end; x++) for (let channel = 0; channel < 3; channel++) sum[channel] += data[x * 4 + channel];
    return sum.map((value) => Math.round(value / (end - start)));
  });
  updateSampleLine();
}
function findAutoRow(image) {
  const canvas = document.createElement("canvas");
  canvas.width = 170; canvas.height = 100;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  let data;
  try { data = context.getImageData(0, 0, canvas.width, canvas.height).data; }
  catch { state.autoRow = state.gameSettings[state.game]?.row ?? 59; return; }
  let best = { row: 59, score: -1 };
  for (let row = 18; row <= 82; row += 4) {
    let saturation = 0, contrast = 0;
    for (let index = 0; index < 17; index++) {
      const x = Math.floor((index + .5) * canvas.width / 17);
      const offset = (row * canvas.width + x) * 4;
      const color = [data[offset], data[offset + 1], data[offset + 2]];
      saturation += Math.max(...color) - Math.min(...color);
      if (index) {
        const previous = (row * canvas.width + Math.floor((index - .5) * canvas.width / 17)) * 4;
        contrast += color.reduce((sum, value, channel) => sum + Math.abs(value - data[previous + channel]), 0);
      }
    }
    const score = saturation + contrast * .55;
    if (score > best.score) best = { row, score };
  }
  state.autoRow = best.row;
}
function loadArtwork() {
  const image = $("#artImage");
  const token = ++artworkLoadToken;
  const source = state.artCustom || `assets/${state.game}-${state.artSource}.jpg`;
  $("#artTitle").textContent = state.artCustom ? "Your image" : GAME_DATA[state.game].title;
  image.onload = () => { if (token === artworkLoadToken) { findAutoRow(image); sampleArtwork(image); requestAnimationFrame(updateSampleLine); } };
  image.onerror = () => { $("#artTypeLabel").textContent = "Artwork unavailable"; };
  if (image.src !== new URL(source, location.href).href) image.src = source;
  else if (image.complete) { findAutoRow(image); sampleArtwork(image); }
}
function dominantArtworkColours(image, count, fallbackKey) {
  const canvas = document.createElement("canvas"), context = canvas.getContext("2d", { willReadFrequently: true });
  const ratio = Math.min(1, 120 / Math.max(image.naturalWidth, image.naturalHeight));
  canvas.width = Math.max(1, Math.round(image.naturalWidth * ratio));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * ratio));
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  let data;
  try { data = context.getImageData(0, 0, canvas.width, canvas.height).data; }
  catch { return SAMPLE_ARTWORK_PALETTES[fallbackKey]?.[count]?.map((colour) => [...colour]) || []; }
  const samples = [];
  for (let offset = 0; offset < data.length; offset += 16) {
    const color = [data[offset], data[offset + 1], data[offset + 2]], max = Math.max(...color), min = Math.min(...color);
    if (data[offset + 3] > 200 && max > 18 && !(min > 238 && max - min < 9)) samples.push(color);
  }
  if (!samples.length) return Array.from({ length: count }, () => [120, 120, 120]);
  const vividness = (color) => Math.max(...color) - Math.min(...color) + Math.max(...color) * .14;
  const centres = [samples.reduce((best, color) => vividness(color) > vividness(best) ? color : best, samples[0])];
  while (centres.length < count) centres.push(samples.reduce((best, color) => {
    const distance = (candidate) => Math.min(...centres.map((centre) => centre.reduce((sum, channel, index) => sum + (channel - candidate[index]) ** 2, 0)));
    return distance(color) * (.5 + vividness(color) / 255) > distance(best) * (.5 + vividness(best) / 255) ? color : best;
  }, samples[0]));
  let groups = [];
  for (let pass = 0; pass < 8; pass++) {
    groups = Array.from({ length: count }, () => []);
    samples.forEach((color) => {
      const index = centres.map((centre) => centre.reduce((sum, channel, channelIndex) => sum + (channel - color[channelIndex]) ** 2, 0))
        .reduce((best, value, index, values) => value < values[best] ? index : best, 0);
      groups[index].push(color);
    });
    groups.forEach((group, index) => {
      if (group.length) centres[index] = [0, 1, 2].map((channel) => Math.round(group.reduce((sum, color) => sum + color[channel], 0) / group.length));
    });
  }
  return centres.map((colour, index) => ({ colour, size: groups[index].length }))
    .sort((a, b) => b.size - a.size).map(({ colour }) => colour);
}
function loadLaunchArtwork() {
  const image = $("#launchArtImage");
  const game = state.launchGame, artworkSource = state.launchSource;
  const source = `assets/${game}-${artworkSource}.jpg`, key = `${game}:${artworkSource}`;
  const token = ++launchArtworkLoadToken;
  $("#launchPaletteStatus").textContent = `Analysing ${IMAGE_LABELS[artworkSource]} for ${GAME_DATA[game].title}…`;
  if (!state.launchArtworkPalettes[key]) {
    $("#launchPalette").replaceChildren();
    $("#launchPalette").dataset.paletteKey = "";
    if (state.launchProfiles[game].paletteMode === "artwork") $("#launchPreview").disabled = true;
  }
  image.onload = () => {
    const palettes = { 2: dominantArtworkColours(image, 2, key), 3: dominantArtworkColours(image, 3, key) };
    state.launchArtworkPalettes[key] = palettes;
    if (token === launchArtworkLoadToken && game === state.launchGame && artworkSource === state.launchSource) syncLaunchUI();
  };
  image.onerror = () => {
    if (token !== launchArtworkLoadToken) return;
    $("#launchArtType").textContent = "Artwork unavailable";
    $("#launchPaletteStatus").textContent = "No colours available for this artwork source.";
    $("#launchPreview").disabled = state.launchProfiles[state.launchGame].paletteMode === "artwork";
  };
  if (image.src !== new URL(source, location.href).href) image.src = source;
  else if (image.complete) image.onload();
  $("#launchArtTitle").textContent = `${GAME_DATA[game].title} · AppID ${GAME_DATA[game].id}`;
}
function renderPalette(target, colours) {
  target.replaceChildren(...colours.map((colour, index) => {
    const item = document.createElement("span"), rgb = typeof colour === "string" ? hexToRgb(colour) : colour;
    item.style.background = rgbToHex(rgb); item.title = `Colour ${index + 1} · ${rgbToHex(rgb).toUpperCase()} · RGB ${rgb.join(", ")}`;
    return item;
  }));
}
function syncCustomizationUI() {
  const select = $("#customPattern");
  if (!select.options.length) select.replaceChildren(...CUSTOMIZATION_GROUPS.map(([label, choices]) => {
    const group = document.createElement("optgroup"); group.label = label;
    group.append(...choices.map(([value, text]) => new Option(text, value)));
    return group;
  }));
  select.value = state.customPattern;
  $("#customPaletteCount").value = String(state.customPaletteCount);
  $("#customDirection").value = state.customDirection;
  state.customColours.forEach((colour, index) => {
    $(`#customColour${index + 1}`).value = colour.toLowerCase();
    $(`#customHex${index + 1}`).value = colour.toUpperCase();
  });
  for (const index of [2, 3]) $(`[data-custom-colour="${index}"]`).hidden = state.customPaletteCount < index;
  const steady = state.customPattern === "steady";
  $("#customSpeed").disabled = steady;
  $("#customDirection").disabled = steady;
}
function syncLaunchUI() {
  const profile = state.launchProfiles[state.launchGame], count = state.launchColourCount;
  $("#launchSource").value = state.launchSource;
  $("#launchPaletteMode").value = profile.paletteMode;
  $("#launchColourCount").value = String(count);
  $("#launchPattern").value = state.launchPattern;
  $("#launchCustomColours").hidden = profile.paletteMode !== "custom";
  $("[data-launch-colour=\"3\"]").hidden = count < 3;
  profile.custom[count].forEach((colour, index) => {
    $(`#launchColour${index + 1}`).value = colour.toLowerCase();
    $(`#launchHex${index + 1}`).value = colour.toUpperCase();
  });
  $("#launchArtTitle").textContent = `${GAME_DATA[state.launchGame].title} · AppID ${GAME_DATA[state.launchGame].id}`;
  $("#launchArtType").textContent = `${IMAGE_LABELS[state.launchSource]} · ${profile.paletteMode === "custom" ? "custom AppID palette" : "artwork palette"}`;
  const palette = activeLaunchPalette(), ready = palette.length === count;
  renderPalette($("#launchPalette"), palette);
  $("#launchPalette").dataset.paletteKey = ready ? `${state.launchGame}:${state.launchSource}:${profile.paletteMode}:${count}` : "";
  $("#launchPaletteStatus").textContent = ready
    ? `${profile.paletteMode === "custom" ? "Saved for this AppID" : "Extracted locally"}: ${palette.map((colour) => rgbToHex(colour).toUpperCase()).join(" · ")}`
    : `Analysing ${IMAGE_LABELS[state.launchSource]} for ${GAME_DATA[state.launchGame].title}…`;
  $("#launchPreview").disabled = !ready;
  $$('[data-launch-game]').forEach((button) => button.classList.toggle("selected", button.dataset.launchGame === state.launchGame));
}
function startLaunchPreview() {
  if (activeLaunchPalette().length !== state.launchColourCount) return;
  state.launchStarted = clock; state.launchPlaying = true; state.context = "game"; state.overlay = null; state.timerRunning = false;
  $("#contextChoice").value = "game";
}
function setTab(tab, configure = true) {
  state.tab = tab;
  $$(".tab").forEach((button) => { const active = button.dataset.tab === tab; button.classList.toggle("active", active); button.setAttribute("aria-selected", String(active)); });
  $$(".pane").forEach((pane) => pane.classList.toggle("active", pane.dataset.pane === tab));
  if (configure) {
    state.overlay = null;
    if (tab === "customization") { state.display = "customization"; state.context = "home"; state.timerRunning = false; state.launchPlaying = false; state.controllerWhere = "off"; state.weatherWhere = "off"; state.padCharging = false; $("#controllerWhere").value = "off"; $("#weatherWhere").value = "off"; $("#padCharging").checked = false; }
    if (tab === "artwork") { const chosen = state.gameSettings[state.game].display; state.display = chosen === "inherit" ? "artwork" : chosen; state.context = "game"; state.timerRunning = false; state.launchPlaying = false; }
    if (tab === "performance") { state.display = "performance"; state.context = "game"; state.timerRunning = false; }
    if (tab === "launches") { state.display = "artwork"; state.context = "game"; state.timerRunning = false; state.launchPlaying = false; syncLaunchUI(); }
    if (tab === "playtime") { state.display = "performance"; state.context = "game"; state.timerRunning = true; }
    if (tab === "controllers") { state.display = "performance"; state.context = "home"; state.timerRunning = false; state.padCharging = false; state.controllerWhere = "home"; state.weatherWhere = "off"; $("#controllerWhere").value = "home"; $("#weatherWhere").value = "off"; $("#padCharging").checked = false; }
    if (tab === "weather") { state.display = "performance"; state.context = "home"; state.timerRunning = false; state.padCharging = false; state.controllerWhere = "off"; state.weatherWhere = "home"; state.weatherStart = clock; $("#controllerWhere").value = "off"; $("#weatherWhere").value = "home"; $("#padCharging").checked = false; }
    if (tab === "events") { state.display = "performance"; state.context = "game"; state.timerRunning = false; playEvent(); }
    $("#contextChoice").value = state.context;
    $("#displayChoice").value = state.display;
  }
  requestAnimationFrame(updateSampleLine);
}
function choosePreset(preset) {
  if (preset === "customization") setTab("customization");
  if (preset === "artwork") setTab("artwork");
  if (preset === "performance") setTab("performance");
  if (preset === "launches") { setTab("launches"); startLaunchPreview(); }
  if (preset === "playtime") setTab("playtime");
  if (preset === "controllers") setTab("controllers");
  if (preset === "weather") setTab("weather");
  if (preset === "notification" || preset === "achievement") {
    state.eventKind = preset;
    setTab("events", false);
    state.context = "game"; state.display = "performance"; state.timerRunning = false;
    syncEventUI(); playEvent();
  }
}
function syncEventUI() {
  $$("[data-event-kind]").forEach((button) => button.classList.toggle("selected", button.dataset.eventKind === state.eventKind));
  const choices = EVENT_OPTIONS[state.eventKind];
  $("#eventVariant").replaceChildren(...choices.map(([key, label]) => new Option(label, key)));
  $("#eventVariant").value = state.eventVariants[state.eventKind];
  const selected = choices.find(([key]) => key === state.eventVariants[state.eventKind]) || choices[0];
  $("#eventEyebrow").textContent = state.eventKind.toUpperCase();
  $("#eventName").textContent = selected[1];
  $("#eventDescription").textContent = selected[2];
  $("#recordToggle").hidden = state.eventKind !== "recording";
  $("#recordIsolationRow").hidden = state.eventKind !== "recording";
  $("#recordingHelp").hidden = state.eventKind !== "recording";
  $("#recordToggle").textContent = state.recording ? "Stop recording" : "Start recording";
  $("#eventPlay").textContent = state.eventKind === "recording" ? "Replay cue" : "Play this signal";
}
function playEvent(key = state.eventVariants[state.eventKind]) {
  const duration = eventFrames[key]?.duration || 2.5;
  state.overlay = { type: "event", key, start: clock, duration };
}
function syncControllerUI() {
  const choices = CONTROLLER_OPTIONS[state.controllerScene];
  $("#controllerVariant").replaceChildren(...choices.map(([id, label]) => new Option(label, id)));
  $("#controllerVariant").value = state.controllerVariants[state.controllerScene];
  $("#padTwo").disabled = state.padCount !== 2;
  $("#padCharging").parentElement.lastChild.textContent = state.padCount === 2 ? " Controller 2 charging" : " Controller charging";
}
function syncWeatherUI() {
  const choices = WEATHER_OPTIONS[state.weatherCondition];
  $("#weatherVariant").replaceChildren(...choices.map((label, index) => new Option(label, String(index))));
  $("#weatherVariant").value = String(state.weatherVariants[state.weatherCondition]);
  const degrees = state.weatherUnit === "fahrenheit" ? "64°F" : "18°C";
  $("#weatherTopbarSample").textContent = `Top-bar example: ${WEATHER_ICONS[state.weatherCondition]} ${degrees} · ${state.weatherTopbar ? "enabled" : "optional"} beside the clock. The real plugin needs a chosen city; this demo uses sample data only.`;
}
function playController() {
  state.timerRunning = false;
  const kind = state.controllerScene;
  state.overlay = { type: "controller", kind, variant: state.controllerVariants[kind], start: clock, duration: kind === "duo" ? 5.6 : kind === "gauge" ? 3 : 3.2 };
}
function updateOutputs() {
  const outputs = { customBrightness: `${state.customBrightness} / 255`, customSpeed: `${state.customSpeed} / 100`, launchDuration: `${state.launchDuration} s`, artRow: `${getSampleRow()}%`, cpuLoad: `${state.cpu}%`, cpuTemp: `${state.cpuTemp}°C`, gpuLoad: `${state.gpu}%`, gpuTemp: `${state.gpuTemp}°C`, coolTemp: `${state.coolTemp}°C`, hotTemp: `${state.hotTemp}°C`, timerRemaining: formatTime(state.timerRemaining), padOne: `${state.padOne}%`, padTwo: `${state.padTwo}%`, lowThreshold: `${state.lowThreshold}%`, padBrightness: `${state.padBrightness}%`, weatherBrightness: `${state.weatherBrightness}%`, weatherCutoff: String(state.weatherCutoff), extraDark: String(state.extraDark) };
  Object.entries(outputs).forEach(([key, value]) => { const element = $(`#${key}Value`); if (element) element.textContent = value; });
}
function bindValue(id, stateKey, transform = (value) => value, callback) {
  const element = $(`#${id}`);
  element.addEventListener(element.tagName === "SELECT" ? "change" : "input", () => {
    state[stateKey] = transform(element.value);
    callback?.();
    updateOutputs();
  });
}
function normaliseHex(value) {
  const raw = String(value).trim().toUpperCase();
  return /^#[0-9A-F]{6}$/.test(raw) ? raw : null;
}
function bindControls() {
  $$(".tab").forEach((button) => button.addEventListener("click", () => setTab(button.dataset.tab)));
  $$("[data-preset]").forEach((button) => button.addEventListener("click", () => choosePreset(button.dataset.preset)));
  $("#customPattern").addEventListener("change", (event) => { state.customPattern = event.target.value; syncCustomizationUI(); });
  $("#customPaletteCount").addEventListener("change", (event) => { state.customPaletteCount = Number(event.target.value); syncCustomizationUI(); });
  $("#customDirection").addEventListener("change", (event) => { state.customDirection = event.target.value; });
  bindValue("customBrightness", "customBrightness", Number);
  bindValue("customSpeed", "customSpeed", Number);
  for (let index = 0; index < 3; index++) {
    const picker = $(`#customColour${index + 1}`), hex = $(`#customHex${index + 1}`);
    picker.addEventListener("input", () => { state.customColours[index] = picker.value.toUpperCase(); hex.value = state.customColours[index]; });
    hex.addEventListener("input", () => { const value = normaliseHex(hex.value); if (value) { state.customColours[index] = value; picker.value = value.toLowerCase(); } });
    hex.addEventListener("blur", () => { hex.value = state.customColours[index]; });
  }
  $("#customPreview").addEventListener("click", () => { state.display = "customization"; state.context = "home"; state.overlay = null; state.timerRunning = false; state.controllerWhere = "off"; state.weatherWhere = "off"; state.padCharging = false; $("#contextChoice").value = "home"; $("#displayChoice").value = "customization"; $("#controllerWhere").value = "off"; $("#weatherWhere").value = "off"; $("#padCharging").checked = false; });
  $$("[data-launch-game]").forEach((button) => button.addEventListener("click", () => {
    state.launchGame = button.dataset.launchGame; state.launchPlaying = false; syncLaunchUI(); loadLaunchArtwork();
  }));
  $("#launchSource").addEventListener("change", (event) => { state.launchSource = event.target.value; state.launchPlaying = false; loadLaunchArtwork(); });
  $("#launchPaletteMode").addEventListener("change", (event) => { state.launchProfiles[state.launchGame].paletteMode = event.target.value; syncLaunchUI(); });
  $("#launchColourCount").addEventListener("change", (event) => { state.launchColourCount = Number(event.target.value); syncLaunchUI(); });
  $("#launchPattern").addEventListener("change", (event) => { state.launchPattern = event.target.value; });
  bindValue("launchDuration", "launchDuration", Number);
  for (let index = 0; index < 3; index++) {
    const picker = $(`#launchColour${index + 1}`), hex = $(`#launchHex${index + 1}`);
    const setLaunchColour = (value) => {
      state.launchProfiles[state.launchGame].custom[state.launchColourCount][index] = value;
      picker.value = value.toLowerCase(); hex.value = value; syncLaunchUI();
    };
    picker.addEventListener("input", () => setLaunchColour(picker.value.toUpperCase()));
    hex.addEventListener("input", () => { const value = normaliseHex(hex.value); if (value) setLaunchColour(value); });
    hex.addEventListener("blur", () => { hex.value = state.launchProfiles[state.launchGame].custom[state.launchColourCount][index] || "#000000"; });
  }
  $("#launchPreview").addEventListener("click", startLaunchPreview);
  $$("[data-game]").forEach((button) => button.addEventListener("click", () => {
    saveGameArtworkChoice();
    state.game = button.dataset.game;
    state.artCustom = null;
    if (customObjectUrl) { URL.revokeObjectURL(customObjectUrl); customObjectUrl = null; }
    const settings = state.gameSettings[state.game];
    state.artSource = settings.source; state.artMode = settings.mode; state.artRow = settings.row;
    state.display = settings.display === "inherit" ? "artwork" : settings.display;
    $("#artSource").value = state.artSource; $("#artMode").value = state.artMode;
    $("#artRow").value = String(state.artRow); $("#artRow").disabled = state.artMode !== "manual";
    $("#gameDisplay").value = settings.display;
    $("#displayChoice").value = state.display;
    $$("[data-game]").forEach((choice) => choice.classList.toggle("selected", choice === button));
    loadArtwork();
  }));
  bindValue("artSource", "artSource", String, () => { saveGameArtworkChoice(); loadArtwork(); });
  bindValue("artMode", "artMode", String, () => { saveGameArtworkChoice(); sampleArtwork($("#artImage")); $("#artRow").disabled = state.artMode !== "manual"; });
  bindValue("artRow", "artRow", Number, () => { saveGameArtworkChoice(); sampleArtwork($("#artImage")); });
  $("#gameDisplay").addEventListener("change", (event) => {
    state.gameSettings[state.game].display = event.target.value;
    state.display = event.target.value === "inherit" ? "artwork" : event.target.value;
    $("#displayChoice").value = state.display;
  });
  $("#artUpload").addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (customObjectUrl) URL.revokeObjectURL(customObjectUrl);
    customObjectUrl = URL.createObjectURL(file);
    state.artCustom = customObjectUrl;
    state.context = "game"; state.display = "artwork";
    loadArtwork();
  });
  for (const [id, key] of [["perfMetric", "metric"], ["perfDirection", "direction"], ["perfPalette", "palette"], ["perfResponse", "response"]]) bindValue(id, key, String, id === "perfPalette" ? () => { $("#customColours").hidden = state.palette !== "custom"; } : undefined);
  for (const [id, key] of [["cpuLoad", "cpu"], ["cpuTemp", "cpuTemp"], ["gpuLoad", "gpu"], ["gpuTemp", "gpuTemp"], ["coolTemp", "coolTemp"], ["hotTemp", "hotTemp"]]) bindValue(id, key, Number);
  for (const [id, key] of [["coolColor", "coolColor"], ["middleColor", "middleColor"], ["hotColor", "hotColor"]]) bindValue(id, key);
  $("#perfHome").addEventListener("change", (event) => { state.perfHome = event.target.checked; });
  $$("[data-timer-source]").forEach((button) => button.addEventListener("click", () => {
    state.timerSource = button.dataset.timerSource;
    $$("[data-timer-source]").forEach((choice) => choice.classList.toggle("selected", choice === button));
    state.context = "game";
  }));
  bindValue("timerDuration", "timerDuration", Number, () => { state.timerRemaining = Math.min(state.timerRemaining, state.timerDuration * 60); $("#timerRemaining").max = String(state.timerDuration * 60); $("#timerRemaining").value = String(Math.round(state.timerRemaining)); });
  bindValue("timerScale", "timerScale", Number);
  bindValue("timerRemaining", "timerRemaining", Number, () => { state.timerElapsed = 0; });
  bindValue("timerColor", "timerColor"); bindValue("timerSpeed", "timerSpeed", Number);
  $("#timerStart").addEventListener("click", () => { state.context = "game"; state.timerRunning = true; state.timerElapsed = 0; state.overlay = null; $("#contextChoice").value = "game"; });
  $("#timerStop").addEventListener("click", () => { state.timerRunning = false; });
  $("#timerFinal").addEventListener("click", () => { state.timerRemaining = 8; state.timerElapsed = 0; state.timerRunning = true; state.context = "game"; state.overlay = null; updateOutputs(); });
  $$("[data-event-kind]").forEach((button) => button.addEventListener("click", () => { state.eventKind = button.dataset.eventKind; syncEventUI(); playEvent(); }));
  $("#eventVariant").addEventListener("change", (event) => { state.eventVariants[state.eventKind] = event.target.value; syncEventUI(); playEvent(); });
  $("#eventPlay").addEventListener("click", () => playEvent());
  $("#recordToggle").addEventListener("click", () => { state.recording = !state.recording; playEvent(state.recording ? "record-start" : "record-stop"); syncEventUI(); });
  $("#recordIsolation").addEventListener("change", (event) => { state.recordIsolation = event.target.checked; });
  for (const [id, key] of [["controllerCount", "padCount"], ["padOne", "padOne"], ["padTwo", "padTwo"], ["lowThreshold", "lowThreshold"], ["padBrightness", "padBrightness"]]) bindValue(id, key, Number, id === "controllerCount" ? syncControllerUI : undefined);
  bindValue("controllerWhere", "controllerWhere", String, () => { if (state.controllerWhere !== "off") { state.weatherWhere = "off"; $("#weatherWhere").value = "off"; } });
  for (const [id, key] of [["chargeMode", "chargeMode"], ["alertWhere", "alertWhere"], ["padHealthy", "padHealthy"], ["padMedium", "padMedium"], ["padLow", "padLow"], ["padCharge", "padCharge"]]) bindValue(id, key);
  $("#controllerScene").addEventListener("change", (event) => { state.controllerScene = event.target.value; syncControllerUI(); playController(); });
  $("#controllerVariant").addEventListener("change", (event) => { state.controllerVariants[state.controllerScene] = event.target.value; playController(); });
  $("#controllerPlay").addEventListener("click", playController);
  $("#padCharging").addEventListener("change", (event) => { state.padCharging = event.target.checked; });
  $("#weatherCondition").addEventListener("change", (event) => { state.weatherCondition = event.target.value; state.weatherStart = clock; syncWeatherUI(); });
  $("#weatherVariant").addEventListener("change", (event) => { state.weatherVariants[state.weatherCondition] = Number(event.target.value); state.weatherStart = clock; });
  $("#weatherWhere").addEventListener("change", (event) => { state.weatherWhere = event.target.value; if (state.weatherWhere !== "off") { state.controllerWhere = "off"; $("#controllerWhere").value = "off"; } });
  $("#weatherTopbar").addEventListener("change", (event) => { state.weatherTopbar = event.target.checked; syncWeatherUI(); });
  $("#weatherUnit").addEventListener("change", (event) => { state.weatherUnit = event.target.value; syncWeatherUI(); });
  bindValue("weatherBrightness", "weatherBrightness", Number);
  bindValue("weatherCutoff", "weatherCutoff", Number);
  $("#weatherReplay").addEventListener("click", () => { state.weatherStart = clock; });
  bindValue("contextChoice", "context"); bindValue("displayChoice", "display"); bindValue("extraDark", "extraDark", Number);
  $("#reversePhysical").addEventListener("change", (event) => { state.reversePhysical = event.target.checked; });
  $("#contextSwitch").addEventListener("click", () => { state.context = state.context === "home" ? "game" : "home"; $("#contextChoice").value = state.context; });
  $("#priorityDemo").addEventListener("click", () => { state.display = "performance"; state.context = "game"; state.timerRemaining = 240; state.timerRunning = true; state.timerElapsed = 0; state.eventKind = "notification"; state.overlay = null; $("#contextChoice").value = "game"; $("#displayChoice").value = "performance"; $("#priorityFeedback").textContent = "Four minutes remain. Now send a notification to test the protected countdown."; });
  $("#priorityNotify").addEventListener("click", () => {
    if (state.timerRunning && state.timerRemaining <= 300) $("#priorityFeedback").textContent = "Notification held: the final five minutes keep the countdown visible.";
    else { playEvent("notification-beacon"); $("#priorityFeedback").textContent = "Notification shown briefly. The previous signal returns when it finishes."; }
  });
  $("#resetDemo").addEventListener("click", resetDemo);
  $("#pauseDemo").addEventListener("click", () => { state.paused = !state.paused; $("#pauseDemo").textContent = state.paused ? "▶" : "Ⅱ"; $("#pauseDemo").setAttribute("aria-label", state.paused ? "Play animation" : "Pause animation"); });
  $("#resetView").addEventListener("click", () => { if (state.overlay) state.overlay.start = clock; else if (state.tab === "events") playEvent(); else if (state.tab === "controllers") playController(); else if (state.tab === "weather") state.weatherStart = clock; else state.timerElapsed = 0; });
  window.addEventListener("resize", () => { updateSampleLine(); updateMobilePreviewVisibility(); });
  window.addEventListener("scroll", updateMobilePreviewVisibility, { passive: true });
}
function resetDemo() {
  state = defaultState();
  clock = 0;
  if (customObjectUrl) { URL.revokeObjectURL(customObjectUrl); customObjectUrl = null; }
  for (const [id, value] of Object.entries({ customBrightness: state.customBrightness, customSpeed: state.customSpeed, launchDuration: state.launchDuration, artSource: state.artSource, artMode: state.artMode, artRow: state.artRow, gameDisplay: "inherit", perfMetric: state.metric, perfDirection: state.direction, cpuLoad: state.cpu, cpuTemp: state.cpuTemp, gpuLoad: state.gpu, gpuTemp: state.gpuTemp, perfPalette: state.palette, perfResponse: state.response, coolColor: state.coolColor, middleColor: state.middleColor, hotColor: state.hotColor, coolTemp: state.coolTemp, hotTemp: state.hotTemp, timerDuration: state.timerDuration, timerScale: state.timerScale, timerRemaining: state.timerRemaining, timerColor: state.timerColor, timerSpeed: state.timerSpeed, controllerCount: state.padCount, padOne: state.padOne, padTwo: state.padTwo, controllerWhere: state.controllerWhere, chargeMode: state.chargeMode, alertWhere: state.alertWhere, lowThreshold: state.lowThreshold, padBrightness: state.padBrightness, padHealthy: state.padHealthy, padMedium: state.padMedium, padLow: state.padLow, padCharge: state.padCharge, weatherCondition: state.weatherCondition, weatherWhere: state.weatherWhere, weatherUnit: state.weatherUnit, weatherBrightness: state.weatherBrightness, weatherCutoff: state.weatherCutoff, extraDark: state.extraDark, contextChoice: state.context, displayChoice: state.display })) { const element = $(`#${id}`); if (element) element.value = String(value); }
  $("#timerRemaining").max = String(state.timerDuration * 60);
  for (const [id, checked] of Object.entries({ perfHome: state.perfHome, recordIsolation: state.recordIsolation, padCharging: state.padCharging, weatherTopbar: state.weatherTopbar, reversePhysical: state.reversePhysical })) $(`#${id}`).checked = checked;
  $$("[data-game]").forEach((button) => button.classList.toggle("selected", button.dataset.game === state.game));
  $$("[data-timer-source]").forEach((button) => button.classList.toggle("selected", button.dataset.timerSource === state.timerSource));
  $("#padCharging").checked = false;
  $("#customColours").hidden = true;
  $("#artRow").disabled = false;
  $("#pauseDemo").textContent = "Ⅱ";
  syncEventUI(); syncControllerUI(); syncWeatherUI(); syncCustomizationUI(); syncLaunchUI(); updateOutputs(); loadArtwork(); loadLaunchArtwork(); setTab("overview", false);
}
function init() {
  $("#launchPattern").replaceChildren(...LAUNCH_PATTERNS.map(([value, label]) => new Option(label, value)));
  syncCustomizationUI(); syncLaunchUI(); loadLaunchArtwork();
  bindControls();
  syncEventUI(); syncControllerUI(); syncWeatherUI(); updateOutputs(); loadArtwork();
  updateMobilePreviewVisibility();
  requestAnimationFrame(tick);
}
init();
