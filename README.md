# Mistbits Reserve

A standalone concept website for a new Mistbits product: connected field intelligence for farms, game farms, conservancies and private reserves.

Live site: [mistbits.github.io/mistbits-reserve](https://mistbits.github.io/mistbits-reserve/)

The product story is grounded in the existing Mistbits V3 logger and Smarta platform. It uses the logger's real multi-path transport, Meshtastic support, sensor inputs, relay control, local log queue, BLE commissioning and device-health telemetry, then presents additional reserve applications as sensor modules and pilot concepts.

## Preview

```sh
npm run dev
```

Open [http://localhost:4174](http://localhost:4174).

## Structure

- `index.html` — semantic single-page product site
- `styles.css` — responsive visual system and motion
- `script.js` — mobile navigation, live concept dashboard, reveals and pilot dialog
- `assets/images/` — original AI-generated concept imagery
- `scripts/validate.mjs` — dependency-free project checks

The project is intentionally dependency-free and does not alter the existing `website/` project.
