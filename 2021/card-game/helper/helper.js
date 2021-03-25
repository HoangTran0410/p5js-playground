// https://stackoverflow.com/a/8763329
export function testRectangleToPoint(rw, rh, rr, rcx, rcy, px, py) {
    if (rr == 0)
        return Math.abs(rcx - px) < rw / 2 && Math.abs(rcy - py) < rh / 2;

    let tx = Math.cos(rr) * px - Math.sin(rr) * py;
    let ty = Math.cos(rr) * py + Math.sin(rr) * px;

    let cx = Math.cos(rr) * rcx - Math.sin(rr) * rcy;
    let cy = Math.cos(rr) * rcy + Math.sin(rr) * rcx;

    return Math.abs(cx - tx) < rw / 2 && Math.abs(cy - ty) < rh / 2;
}

export function collidePointRect(px, py, rx, ry, rw, rh) {
    return Math.abs(rx - px) < rw / 2 && Math.abs(ry - py) < rh / 2;
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function millisToMinutes(millis) {
    let ss = ~~(millis / 1000);
    let m = ~~(ss / 60);
    let s = ss % 60;

    return addZero(m) + ':' + addZero(s);
}

export function addZero(num) {
    return (num < 10 ? '0' : '') + num;
}
