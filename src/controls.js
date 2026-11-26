const controlKeys = new Set([
  "q",
  "d",
  "z",
  "s",
  "arrowup",
  "arrowdown",
  "arrowleft",
  "arrowright",
]);

export function createKeyboardControls() {
  const pressedKeys = new Set();

  function onKeyDown(event) {
    const key = event.key.toLowerCase();
    if (!controlKeys.has(key)) {
      return;
    }

    event.preventDefault();
    pressedKeys.add(key);
  }

  function onKeyUp(event) {
    pressedKeys.delete(event.key.toLowerCase());
  }

  function onBlur() {
    pressedKeys.clear();
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  return {
    readInput() {
      const forward = pressedKeys.has("z") || pressedKeys.has("arrowup");
      const reverse = pressedKeys.has("s") || pressedKeys.has("arrowdown");
      const left = pressedKeys.has("q") || pressedKeys.has("arrowleft");
      const right = pressedKeys.has("d") || pressedKeys.has("arrowright");

      return {
        throttle: Number(forward) - Number(reverse),
        steering: Number(right) - Number(left),
      };
    },
  };
}
