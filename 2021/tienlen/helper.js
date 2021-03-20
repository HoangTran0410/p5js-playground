// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function rotatePoint(point, angle, center_of_rotation) {
    let sinus = sin(angle);
    let cosinus = cos(angle);

    let dx = point.x - center_of_rotation.x;
    let dy = point.y - center_of_rotation.y;

    tempx = dx * cosinus - dy * sinus;
    tempy = dx * sinus + dy * cosinus;

    let px = tempx + center_of_rotation.x;
    let py = tempy + center_of_rotation.y;

    return {
        x: px,
        y: py,
    };
}

// https://stackoverflow.com/a/8763329
function testRectangleToPoint(rw, rh, rr, rcx, rcy, px, py) {
    if (rr == 0)
        return Math.abs(rcx - px) < rw / 2 && Math.abs(rcy - py) < rh / 2;

    let tx = Math.cos(rr) * px - Math.sin(rr) * py;
    let ty = Math.cos(rr) * py + Math.sin(rr) * px;

    let cx = Math.cos(rr) * rcx - Math.sin(rr) * rcy;
    let cy = Math.cos(rr) * rcy + Math.sin(rr) * rcx;

    return Math.abs(cx - tx) < rw / 2 && Math.abs(cy - ty) < rh / 2;
}
