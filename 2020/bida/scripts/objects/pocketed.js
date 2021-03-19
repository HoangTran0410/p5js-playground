class Pocketed {
  constructor(x = 0, y = 0, direction = 'verticle', balls = []) {
    this.position = createVector(x, y)
    this.direction = direction
    this.balls = balls
  }

  addBall(ball) {
    this.balls.push(ball)
  }

  display() {
    let currentPos = {
      x: this.position.x,
      y: this.position.y
    }

    for (let ball of this.balls) {

      this.displayBall(ball, currentPos)

      if (this.direction == 'verticle') {
        currentPos.x += ball.radius * 1.5
      } else {
        currentPos.y += ball.radius * 1.5
      }
    }
  }

  displayBall(ball, pos) {

    let x = pos.x + (this.direction == 'verticle' ? ball.radius : 0)
    let y = pos.y + (this.direction == 'verticle' ? 0 : ball.radius)

    fill(ball.color)
    noStroke()
    circle(x, y, ball.radius * 2)

    fill(255)
    textSize(14)
    textAlign(CENTER, CENTER)
    text(ball.value, x, y)
  }
}