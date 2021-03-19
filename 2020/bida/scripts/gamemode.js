const GAMEMODE = {
  "Carom": {
    names: ["Carom", "Phăng"],
    board: {
      size: [320, 550],
      ...THEMEBOARD.deepblue
    },
    holes: [],
    balls: [
      // [x, y, radius, color, value]
      [160, 500, 14, '#ffffff', ''],
      [120, 100, 14, '#e63214', ''],
      [200, 100, 14, '#f0aa00', ''],
    ],
    events: {
      onCollideBall: function (x, y) {
        effects.add(x, y, 4)
      },
      onCollideBoard: function () { },
      onPocketed: function () { }
    }
  },

  "Pool 8": {
    names: ["Pool 8"],
    board: {
      size: [320, 550],
      ...THEMEBOARD.green
    },
    holes: [
      HOLEPOS.topleft,
      HOLEPOS.topright,
      HOLEPOS.bottomleft,
      HOLEPOS.bottomright,
      HOLEPOS.left,
      HOLEPOS.right,
    ],
    balls: [
      // [x, y, radius, color, value]
      [160, 500, 13, "#ffffff", 0],
      [160, 150, 12, "#fac800", 1],
      [145, 130, 12, "#0a00e6", 2],
      [175, 130, 12, "#c83214", 3],
      [130, 110, 12, "#6464fa", 4],
      [160, 110, 12, "#fa8214", 5],
      [190, 110, 12, "#006414", 6],
      [115, 90, 12, "#961414", 7],
      [145, 90, 12, "#000000", 8],
      [175, 90, 12, "#f0aa00", 9],
      [205, 90, 12, "#145afa", 10],
      [100, 70, 12, "#e63214", 11],
      [130, 70, 12, "#6464fa", 12],
      [160, 70, 12, "#dc6414", 13],
      [190, 70, 12, "#0a7814", 14],
      [220, 70, 12, "#783214", 15],
    ],
    events: {
      onCollideBall: function () { },
      onCollideBoard: function () { },
      onPocketed: function (hole) {
        effects.add(hole.x, hole.y)

        if (this.value == 0) {
          this.setDrag(true)

          return
        }

        pocketed.addBall(this)
        balls.splice(balls.indexOf(this), 1)
      }
    }
  }
}

function getGameMode(mode) {
  let data = GAMEMODE[mode]

  // create board
  let b = data.board
  let boardWidth = b.size[0]
  let boardHeight = b.size[1]

  let board = new Board({
    x: (width - boardWidth) / 2,
    y: (height - boardHeight) / 2,
    boardWidth,
    boardHeight,
    fillColor: b.fillColor,
    borderColorIn: b.borderColorIn,
    borderColorOut: b.borderColorOut
  })

  // create holes
  board.addHoles(data.holes)

  // create balls
  let balls = []
  for (let ballData of data.balls) {
    let x = ballData[0] + board.position.x
    let y = ballData[1] + board.position.y
    balls.push(new Ball({
      x, y,
      radius: ballData[2],
      color: ballData[3],
      value: ballData[4],
      events: data.events // add events
    }))
  }

  return {
    board,
    balls
  }
}