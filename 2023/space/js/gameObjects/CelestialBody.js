export default class CelestialBody {
  constructor({ x, y, r, c, mass, vx = 0, vy = 0, isStatic = false }) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(0, 0);
    this.mass = mass;
    this.radius = r;
    this.color = c;
    this.isStatic = isStatic;
  }

  static gravity(o1, o2) {
    // Apply forces to celestial bodies
    let dist = p5.Vector.sub(o2.pos, o1.pos);
    let force = dist
      .copy()
      .normalize()
      .mult((o2.mass * o1.mass) / dist.magSq());
    o1.applyForce(force);
    o2.applyForce(force.copy().mult(-1));
  }

  static isCollide(o1, o2, offset = 0) {
    // Check if two celestial bodies collide
    let dist = p5.Vector.sub(o2.pos, o1.pos);
    return dist.mag() < o1.radius + o2.radius + offset;
  }

  static resolveCollision(o1, o2) {
    // Resolve collision between two celestial bodies
    let dx = o2.x - o1.x;
    let dy = o2.y - o1.y;

    // Calculate the angle of collision
    let angle = Math.atan2(dy, dx);
    let sin = Math.sin(angle);
    let cos = Math.cos(angle);

    // circle1 perpendicular velocities
    let vx1 = o1.vx * cos + o1.vy * sin;
    let vy1 = o1.vy * cos - o1.vx * sin;

    // o2 perpendicular velocities
    let vx2 = o2.vx * cos + o2.vy * sin;
    let vy2 = o2.vy * cos - o2.vx * sin;

    // swapping the x velocity (y is parallel so doesn't matter)
    // and rotating back the adjusted perpendicular velocities
    o1.vx = vx2 * cos - vy1 * sin;
    o1.vy = vy1 * cos + vx2 * sin;
    o2.vx = vx1 * cos - vy2 * sin;
    o2.vy = vy2 * cos + vx1 * sin;
  }

  gravityWith(o) {
    CelestialBody.gravity(this, o);
  }

  isCollideWith(o, offset = 0) {
    return CelestialBody.isCollide(this, o, offset);
  }

  elasticCollisionWith(o) {
    CelestialBody.elasticCollision(this, o);
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  update() {
    if (this.isStatic) return;
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  show() {
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);
  }
}
