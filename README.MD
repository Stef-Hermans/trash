# Drivable Van

Start the development server with `npm run dev`.

## Controls

- `Z` / `Arrow Up`: accelerate
- `S` / `Arrow Down`: reverse
- `Q` / `Arrow Left`: steer left
- `D` / `Arrow Right`: steer right

## Model

Place the model at `public/models/van.glb`. Keep any external assets referenced by the model at their relative paths under `public/models` (for example, `Textures/colormap.png`).

## Source layout

- `src/main.js` sets up the renderer and animation loop.
- `src/scene.js` creates the sky, terrain, and road.
- `src/van.js` loads and moves the vehicle.
- `src/controls.js` handles keyboard input.
- `src/followCamera.js` keeps the camera behind the vehicle.