// https://stackoverflow.com/a/12646864
export function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
}

// https://stackoverflow.com/a/8763329
export function testRectangleToPoint(rw, rh, rr, rcx, rcy, px, py) {
    if (rr == 0)
        return Math.abs(rcx - px) < rw / 2 && Math.abs(rcy - py) < rh / 2

    let tx = Math.cos(rr) * px - Math.sin(rr) * py
    let ty = Math.cos(rr) * py + Math.sin(rr) * px

    let cx = Math.cos(rr) * rcx - Math.sin(rr) * rcy
    let cy = Math.cos(rr) * rcy + Math.sin(rr) * rcx

    return Math.abs(cx - tx) < rw / 2 && Math.abs(cy - ty) < rh / 2
}

export function collidePointRect(px, py, rx, ry, rw, rh) {
    return Math.abs(rx - px) < rw / 2 && Math.abs(ry - py) < rh / 2
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}
