import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const url = process.env.GABECUBEAURA_CONCEPT_URL || process.env.SIGNALBAR_CONCEPT_URL || "http://127.0.0.1:8765/";
const browser = await chromium.launch({ headless: true });
const errors = [];
const offColour = "rgb(51, 69, 78)";

async function waitForLit(page) {
  await page.waitForFunction((off) => [...document.querySelectorAll("#logicalLeds i")]
    .some((led) => getComputedStyle(led).backgroundColor !== off), offColour, { timeout: 3000 });
}

async function launchPalette(page) {
  return page.locator("#launchPalette span").evaluateAll((items) => items.map((item) => item.title));
}

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  page.on("pageerror", (error) => errors.push(error.message));
  const jsonRequests = [];
  page.on("request", (request) => { if (request.url().endsWith("-frames.json")) jsonRequests.push(request.url()); });
  await page.goto(url, { waitUntil: "networkidle" });
  assert.match(await page.title(), /GabeCubeAura Concept Lab/);
  assert.match(await page.locator("body").innerText(), /GabeCubeAura 1\.0\.0 product preview/);
  assert.doesNotMatch((await page.locator("body").innerText()).toLowerCase(), /1\.0\.0-beta/);
  for (const selector of [".hero-cube", ".steam-machine"]) {
    const ratio = await page.locator(selector).evaluate((element) => element.offsetWidth / element.offsetHeight);
    assert.ok(Math.abs(ratio - 156 / 152) < 0.015, `${selector} front ratio: ${ratio}`);
  }
  await page.locator("#artImage").evaluate((image) => image.decode());
  await page.screenshot({ path: "/tmp/gabecubeaura-concept-desktop.png", fullPage: true });
  assert.equal(await page.locator("#logicalLeds i").count(), 17);
  assert.deepEqual(jsonRequests, [], "runtime must not fetch frame JSON");
  const frameCoverage = await page.evaluate(() => ({
    events: Object.keys(globalThis.GABECUBEAURA_EVENT_FRAMES || {}).length,
    eventLoopsWithLight: Object.values(globalThis.GABECUBEAURA_EVENT_FRAMES || {}).filter((entry) => entry.frames.some((frame) => frame.some((pixel) => pixel.some((channel) => channel > 0)))).length,
    weatherConditions: Object.keys(globalThis.GABECUBEAURA_WEATHER_FRAMES?.frames || {}).length,
    weatherVariants: Object.values(globalThis.GABECUBEAURA_WEATHER_FRAMES?.frames || {}).reduce((sum, variants) => sum + variants.length, 0),
    weatherLoopsWithLight: Object.values(globalThis.GABECUBEAURA_WEATHER_FRAMES?.frames || {}).flat().filter((loop) => loop.some((frame) => frame.some((pixel) => pixel.some((channel) => channel > 0)))).length,
  }));
  assert.deepEqual(frameCoverage, { events: 19, eventLoopsWithLight: 19, weatherConditions: 8, weatherVariants: 18, weatherLoopsWithLight: 18 });

  await page.locator('[data-tab="customization"]').click();
  assert.equal(await page.locator("#customPattern option").count(), 61);
  assert.equal(await page.locator('#customPattern option[value="steady"]').count(), 1);
  assert.equal(await page.locator('#customPattern option[value="ripple"]').count(), 1);
  assert.equal(await page.locator('#customPattern option[value="event:achievement-supernova"]').count(), 1);
  assert.equal(await page.locator('#customPattern option[value="controller:charging:spark"]').count(), 1);
  assert.equal(await page.locator('#customPattern option[value="weather:cloud:3"]').count(), 1);
  assert.equal(await page.locator("#customBrightness").getAttribute("min"), "34");
  await page.locator("#customPattern").selectOption("steady");
  await page.locator("#customPaletteCount").selectOption("1");
  await page.locator("#customHex1").fill("#FF0000");
  await page.locator("#customBrightness").fill("34");
  assert.equal(await page.locator("#customBrightnessValue").textContent(), "34 / 255");
  await page.locator("#customBrightness").fill("255");
  await page.locator("#customPreview").click();
  assert.equal(await page.locator("#providerBadge").textContent(), "CUSTOMIZATION+");
  await page.waitForFunction(() => [...document.querySelectorAll("#logicalLeds i")]
    .every((led) => getComputedStyle(led).backgroundColor === "rgb(255, 0, 0)"));
  assert.equal(await page.locator('[data-custom-colour="2"]').isHidden(), true);
  assert.equal(await page.locator('[data-custom-colour="3"]').isHidden(), true);
  assert.equal(await page.locator("#customSpeed").isDisabled(), true);
  assert.equal(await page.locator("#customDirection").isDisabled(), true);
  await page.locator("#customHex1").fill("#00FF00");
  await page.waitForFunction(() => [...document.querySelectorAll("#logicalLeds i")]
    .every((led) => getComputedStyle(led).backgroundColor === "rgb(0, 255, 0)"));
  await page.locator("#customPaletteCount").selectOption("2");
  assert.equal(await page.locator('[data-custom-colour="2"]').isVisible(), true);
  for (const pattern of ["event:achievement-supernova", "controller:charging:spark", "weather:cloud:3", "ripple"]) {
    await page.locator("#customPattern").selectOption(pattern);
    assert.equal(await page.locator("#customSpeed").isEnabled(), true);
    assert.equal(await page.locator("#customDirection").isEnabled(), true);
    await waitForLit(page);
    assert.match(await page.locator("#signalName").textContent(), /Customization\+/);
  }
  await page.locator("#customPaletteCount").selectOption("3");
  await page.locator("#customHex3").fill("#7F22EE");
  await page.locator("#customBrightness").fill("170");
  await page.locator("#customSpeed").fill("73");
  await page.locator("#customDirection").selectOption("reverse");
  assert.equal(await page.locator("#customBrightnessValue").textContent(), "170 / 255");
  await page.locator(".workbench").screenshot({ path: "/tmp/gabecubeaura-concept-customization.png" });

  await page.locator('[data-tab="launches"]').click();
  await page.locator("#launchArtImage").evaluate((image) => image.decode());
  assert.equal(await page.locator("#launchPattern option").count(), 10);
  await page.locator('#launchPalette[data-palette-key="drg:hero:artwork:2"]').waitFor();
  const deepRockHero = await launchPalette(page);
  assert.equal(deepRockHero.length, 2);
  assert.match(await page.locator("#launchPaletteStatus").textContent(), /Extracted locally: #[0-9A-F]{6} · #[0-9A-F]{6}/);
  await page.locator('[data-launch-game="witcher"]').click();
  await page.locator('#launchPalette[data-palette-key="witcher:hero:artwork:2"]').waitFor();
  const witcherHero = await launchPalette(page);
  assert.notDeepEqual(witcherHero, deepRockHero, "each game's hero must produce its own palette");
  await page.locator("#launchSource").selectOption("header");
  await page.locator('#launchPalette[data-palette-key="witcher:header:artwork:2"]').waitFor();
  assert.notDeepEqual(await launchPalette(page), witcherHero, "artwork source must change the palette");
  await page.locator('[data-launch-game="drg"]').click();
  await page.locator("#launchSource").selectOption("hero");
  await page.locator('#launchPalette[data-palette-key="drg:hero:artwork:2"]').waitFor();
  assert.deepEqual(await launchPalette(page), deepRockHero, "cached palette must remain attached to its game and source");
  await page.locator("#launchColourCount").selectOption("3");
  await page.locator('#launchPalette[data-palette-key="drg:hero:artwork:3"]').waitFor();
  assert.equal((await launchPalette(page)).length, 3);
  await page.locator("#launchPaletteMode").selectOption("custom");
  await page.locator("#launchHex1").fill("#FF0000");
  await page.locator("#launchHex2").fill("#00FF00");
  await page.locator("#launchHex3").fill("#0000FF");
  await page.locator('#launchPalette[data-palette-key="drg:hero:custom:3"]').waitFor();
  await page.locator("#launchDuration").fill("9");
  const launchPatterns = await page.locator("#launchPattern option").evaluateAll((options) => options.map((option) => option.value));
  for (const pattern of launchPatterns) {
    await page.locator("#launchPattern").selectOption(pattern);
    await page.locator("#launchPreview").click();
    await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "GAME LAUNCH");
    await waitForLit(page);
  }
  await page.locator("#launchPattern").selectOption("theater-chase");
  await page.locator("#launchPreview").click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "GAME LAUNCH");
  await waitForLit(page);
  const launchPixels = await page.locator("#logicalLeds i").evaluateAll((items, off) => items
    .map((item) => item.style.backgroundColor).filter((colour) => colour !== off), offColour);
  assert.ok(launchPixels.length > 0);
  launchPixels.forEach((colour) => {
    const channels = colour.match(/\d+/g).slice(0, 3).map(Number);
    assert.ok(channels.filter((channel) => channel > 0).length <= 1, `unexpected colour outside custom RGB palette: ${colour}`);
  });
  assert.match(await page.locator("#launchStatus").textContent(), /Playing/);
  await page.locator(".workbench").screenshot({ path: "/tmp/gabecubeaura-concept-launch.png" });
  await page.locator('[data-launch-game="balatro"]').click();
  await page.locator('[data-launch-game="drg"]').click();
  await page.locator("#launchPaletteMode").selectOption("custom");
  assert.equal((await page.locator("#launchHex3").inputValue()).toUpperCase(), "#0000FF");

  await page.locator('[data-tab="performance"]').click();
  await page.waitForTimeout(400);
  assert.equal(await page.locator("#providerBadge").textContent(), "PERFORMANCE");
  await page.locator(".workbench").screenshot({ path: "/tmp/gabecubeaura-concept-performance.png" });
  await page.locator("#gpuLoad").fill("91");
  assert.equal(await page.locator("#gpuLoadValue").textContent(), "91%");

  await page.locator('[data-tab="artwork"]').click();
  await page.locator('[data-game="balatro"]').click();
  await page.locator("#artImage").evaluate((image) => image.decode());
  assert.match(await page.locator("#artTitle").textContent(), /Balatro/);
  await page.locator("#gameDisplay").selectOption("performance");
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "PERFORMANCE");
  await page.locator('[data-game="drg"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "ARTWORK");
  await page.locator('[data-game="balatro"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "PERFORMANCE");
  await page.locator("#gameDisplay").selectOption("artwork");
  await page.locator(".workbench").screenshot({ path: "/tmp/gabecubeaura-concept-artwork.png" });
  await page.locator("#artUpload").setInputFiles(path.resolve("assets/drg-hero.jpg"));
  await page.waitForTimeout(200);
  assert.match(await page.locator("#artTitle").textContent(), /Your image/);

  await page.locator('[data-tab="playtime"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "PLAYTIME");
  assert.equal(await page.locator("#providerBadge").textContent(), "PLAYTIME");
  await page.locator("#timerSpeed").selectOption("1");
  await page.locator("#timerFinal").click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "COUNTDOWN");
  assert.equal(await page.locator("#providerBadge").textContent(), "COUNTDOWN");
  await page.locator(".workbench").screenshot({ path: "/tmp/gabecubeaura-concept-final-countdown.png" });

  await page.locator('[data-tab="controllers"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "CONTROLLERS");
  assert.equal(await page.locator("#providerBadge").textContent(), "CONTROLLERS");
  await page.locator(".workbench").screenshot({ path: "/tmp/gabecubeaura-concept-controllers.png" });
  await page.locator("#controllerScene").selectOption("low");
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "CONTROLLER EVENT");
  assert.equal(await page.locator("#providerBadge").textContent(), "CONTROLLER EVENT");
  for (const scene of ["duo", "gauge", "connect", "low", "charging"]) {
    await page.locator("#controllerScene").selectOption(scene);
    const variants = await page.locator("#controllerVariant option").evaluateAll((options) => options.map((option) => option.value));
    assert.equal(variants.length, 3);
    for (const variant of variants) await page.locator("#controllerVariant").selectOption(variant);
  }

  await page.locator('[data-tab="weather"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "WEATHER");
  await page.waitForFunction(() => [...document.querySelectorAll("#logicalLeds i")].some((led) => led.style.background !== "rgb(51, 69, 78)"));
  assert.equal(await page.locator("#weatherVariant option").count(), 2);
  for (const condition of ["clear_day", "clear_night", "rain", "cloud", "breaks", "breaks_night", "snow", "storm"]) {
    await page.locator("#weatherCondition").selectOption(condition);
    assert.equal(await page.locator("#weatherVariant option").count(), condition === "cloud" ? 4 : 2);
    await page.locator("#weatherVariant").selectOption("1");
    assert.equal(await page.locator("#providerBadge").textContent(), "WEATHER");
  }
  await page.locator("#weatherUnit").selectOption("fahrenheit");
  await page.locator("#weatherTopbar").check();
  assert.match(await page.locator("#weatherTopbarSample").textContent(), /64°F/);
  await page.locator(".workbench").screenshot({ path: "/tmp/gabecubeaura-concept-weather.png" });

  await page.locator('[data-tab="events"]').click();
  await page.locator('[data-event-kind="achievement"]').click();
  await page.waitForFunction(() => document.querySelector("#providerBadge")?.textContent === "LIGHT EVENT");
  assert.equal(await page.locator("#providerBadge").textContent(), "LIGHT EVENT");
  await page.locator("#eventVariant").selectOption("achievement-constellation");
  await page.waitForFunction(() => document.querySelector("#signalName")?.textContent?.includes("Constellation"));
  assert.match(await page.locator("#signalName").textContent(), /Constellation/);
  await page.waitForTimeout(500);
  await page.locator(".workbench").screenshot({ path: "/tmp/gabecubeaura-concept-achievement.png" });
  let eventCount = 0;
  for (const kind of ["notification", "achievement", "screenshot", "recording"]) {
    await page.locator(`[data-event-kind="${kind}"]`).click();
    const variants = await page.locator("#eventVariant option").evaluateAll((options) => options.map((option) => option.value));
    for (const variant of variants) { await page.locator("#eventVariant").selectOption(variant); eventCount++; }
  }
  assert.equal(eventCount, 19);
  await page.locator('[data-tab="priorities"]').click();
  await page.locator("#priorityDemo").click();
  await page.locator("#priorityNotify").click();
  assert.match(await page.locator("#priorityFeedback").textContent(), /held/);
  assert.equal(await page.locator("#providerBadge").textContent(), "PLAYTIME");

  const directFile = await browser.newPage({ viewport: { width: 1100, height: 780 }, deviceScaleFactor: 1 });
  directFile.on("pageerror", (error) => errors.push(`file:// ${error.message}`));
  await directFile.goto(pathToFileURL(path.resolve("index.html")).href, { waitUntil: "load" });
  assert.equal(await directFile.evaluate(() => Object.keys(globalThis.GABECUBEAURA_EVENT_FRAMES || {}).length), 19);
  assert.equal(await directFile.evaluate(() => Object.keys(globalThis.GABECUBEAURA_WEATHER_FRAMES?.frames || {}).length), 8);
  await directFile.locator('[data-tab="customization"]').click();
  await directFile.locator("#customPattern").selectOption("event:achievement-supernova");
  await directFile.locator("#customPreview").click();
  await waitForLit(directFile);
  await directFile.locator("#customPattern").selectOption("weather:cloud:3");
  await waitForLit(directFile);
  assert.equal(await directFile.locator("#providerBadge").textContent(), "CUSTOMIZATION+");
  await directFile.locator('[data-tab="launches"]').click();
  await directFile.locator('#launchPalette[data-palette-key="drg:hero:artwork:2"]').waitFor();
  const directDeepRock = await launchPalette(directFile);
  await directFile.locator('[data-launch-game="witcher"]').click();
  await directFile.locator("#launchSource").selectOption("header");
  await directFile.locator('#launchPalette[data-palette-key="witcher:header:artwork:2"]').waitFor();
  assert.notDeepEqual(await launchPalette(directFile), directDeepRock, "file:// fallback palettes must remain game/source specific");
  await directFile.locator('[data-tab="artwork"]').click();
  await directFile.locator("#artUpload").setInputFiles(path.resolve("assets/balatro-hero.jpg"));
  await directFile.waitForFunction(() => document.querySelector("#artTitle")?.textContent === "Your image");
  await directFile.close();

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  mobile.on("pageerror", (error) => errors.push(error.message));
  await mobile.goto(url, { waitUntil: "networkidle" });
  const mobileMachineRatio = await mobile.locator(".steam-machine").evaluate((element) => element.offsetWidth / element.offsetHeight);
  assert.ok(Math.abs(mobileMachineRatio - 156 / 152) < 0.015, `mobile machine front ratio: ${mobileMachineRatio}`);
  await mobile.screenshot({ path: "/tmp/gabecubeaura-concept-mobile.png", fullPage: true });
  for (const tab of ["customization", "artwork", "performance", "launches", "playtime", "events", "controllers", "weather", "priorities"]) {
    await mobile.locator(`[data-tab="${tab}"]`).click();
    const width = await mobile.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(width <= 1, `${tab} horizontal overflow: ${width}px`);
  }
  await mobile.evaluate(() => window.scrollTo({ top: document.querySelector(".settings-shell").offsetTop + 130, behavior: "instant" }));
  await mobile.waitForTimeout(100);
  assert.equal(await mobile.locator("#mobilePreview").evaluate((element) => element.classList.contains("visible")), true);
  await mobile.screenshot({ path: "/tmp/gabecubeaura-concept-mobile-settings.png" });
  const overflow = await mobile.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  assert.ok(overflow <= 1, `mobile horizontal overflow: ${overflow}px`);
  assert.deepEqual(errors, []);
  console.log("PASS: GabeCubeAura 1.0 mockup, file:// datasets, Customization+ rendering, per-game/source launch palettes, all major tabs and 390px layout");
} finally {
  await browser.close();
}
