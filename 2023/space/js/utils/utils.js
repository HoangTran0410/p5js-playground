export function createLinearGradient(x, y, w, h, colorStops) {
  let grd = drawingContext.createLinearGradient(x, y, x + w, y);
  for (const c of colorStops) {
    grd.addColorStop(c.stop, c.color);
  }
  drawingContext.fillStyle = grd;
}

export function createRadialGradient(x, y, r1, r2, colorStops) {
  let grd = drawingContext.createRadialGradient(x, y, r1, x, y, r2);
  for (const c of colorStops) {
    grd.addColorStop(c.stop, c.color);
  }
  drawingContext.fillStyle = grd;
}
