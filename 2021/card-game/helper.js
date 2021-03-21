// https://stackoverflow.com/a/12646864
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

// https://stackoverflow.com/a/8763329
export function testRectangleToPoint(rw, rh, rr, rcx, rcy, px, py) {
  if (rr == 0) return Math.abs(rcx - px) < rw / 2 && Math.abs(rcy - py) < rh / 2

  let tx = Math.cos(rr) * px - Math.sin(rr) * py
  let ty = Math.cos(rr) * py + Math.sin(rr) * px

  let cx = Math.cos(rr) * rcx - Math.sin(rr) * rcy
  let cy = Math.cos(rr) * rcy + Math.sin(rr) * rcx

  return Math.abs(cx - tx) < rw / 2 && Math.abs(cy - ty) < rh / 2
}

// https://www.w3schools.com/howto/howto_js_draggable.asp
export function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0
  if (document.getElementById(elmnt.id + 'header')) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + 'header').onmousedown = dragMouseDown
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown
  }

  function dragMouseDown(e) {
    e = e || window.event
    e.preventDefault()
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    e = e || window.event
    e.preventDefault()
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px'
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px'
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null
    document.onmousemove = null
  }
}
