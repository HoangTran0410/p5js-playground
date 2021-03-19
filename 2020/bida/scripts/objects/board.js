class Board {
  constructor(config = {}) {

    const {
      x = 0,
      y = 0,
      w = 320,
      h = 550,
      fillColor = '#3ca064',
      borderColorIn = '#3cfa64',
      borderColorOut = '#6c3030'
    } = config

    this.position = createVector(x, y)
    this.size = createVector(w, h)

    this.fillColor = fillColor
    this.borderColorIn = borderColorIn
    this.borderColorOut = borderColorOut

    this.border = 25
    this.defaultHoleSize = 17
    this.holes = []
  }

  addHoles(holes) {
    for (let hole of holes) {
      if (typeof (hole) === "string") {

        let offset = 5
        let leftBoard = this.position.x
        let rightBoard = this.size.x + leftBoard
        let topBoard = this.position.y
        let bottomBoard = this.size.y + topBoard

        switch (hole) {
          case HOLEPOS.topleft: {
            this.holes.push([leftBoard + offset, topBoard + offset])
            break
          }
          case HOLEPOS.topright: {
            this.holes.push([rightBoard - offset, topBoard + offset])
            break
          }
          case HOLEPOS.bottomleft: {
            this.holes.push([leftBoard + offset, bottomBoard - offset])
            break
          }
          case HOLEPOS.bottomright: {
            this.holes.push([rightBoard - offset, bottomBoard - offset])
            break
          }
          case HOLEPOS.left: {
            this.holes.push([leftBoard + offset, (bottomBoard + topBoard) / 2 - offset])
            break
          }
          case HOLEPOS.right: {
            this.holes.push([rightBoard - offset, (bottomBoard + topBoard) / 2 - offset])
            break
          }
        }
      }
      else {
        this.holes.push(hole)
      }
    }
  }

  getRealPos(x, y) {
    return {
      x: x + this.position.x,
      y: y + this.position.y
    }
  }

  display() {
    push()
    translate(this.position.x, this.position.y)

    // display board
    noStroke()
    fill(this.borderColorOut)
    rect(-this.border * 1.25, -this.border * 1.25, this.size.x + this.border * 2.5, this.size.y + this.border * 2.5)

    fill(this.borderColorIn)
    rect(-this.border * .5, -this.border * .5, this.size.x + this.border, this.size.y + this.border)

    fill(this.fillColor)
    rect(0, 0, this.size.x, this.size.y)

    pop()

    // display holes
    // fill('#3c9964')
    fill(this.fillColor)
    stroke('#258f4b')
    strokeWeight(2)
    for (let hole of this.holes) {
      circle(hole[0], hole[1], hole[2] || this.defaultHoleSize * 2)
    }
  }
}