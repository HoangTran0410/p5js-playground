function MouseEvents() {
  this.ms = 0 // mouse state
  this.pms = 0 // pre mouse state

  this.run = () => {
    this.pms = this.ms
    this.ms = mouseIsPressed
  }

  this.isPressed = () => (this.pms == 0 && this.ms == 1)
  this.isReleased = () => (this.pms == 1 && this.ms == 0)
  this.isDragging = () => (this.pms == 1 && this.ms == 1)
}

const mouseEvents = new MouseEvents()