class BoidManager {
  constructor(numberOfBoids = 50) {
    this.boidsTree = new Quadtree(
      {
        x: 0,
        y: 0,
        width: width,
        height: height,
      },
      5,
      6
    );

    this.maxBoids = numberOfBoids;
    this.boids = [];
    for (let i = 0; i < numberOfBoids; i++) this.boids.push(new Boid());
    this.boids[0].debug = true;
  }

  addBoid(x, y, buffer = 5) {
    let boid = new Boid();
    boid.position.set(x + random(-buffer, buffer), y + random(-buffer, buffer));
    this.boids.push(boid);

    if (this.boids.length > this.maxBoids) {
      let first = this.boids.shift(); // take out first
      this.boids.shift(); // remove second
      this.boids.unshift(first); // re-append first
    }
  }

  update() {
    if (BoidSetting.useQuadtree) {
      this.boidsTree.clear();

      for (var boid of this.boids) {
        this.boidsTree.insert(this.getBoundOfBoid(boid));
      }

      for (let boid of this.boids) {
        let arroundBoids = this.boidsTree.retrieve({
          x: boid.position.x - BoidSetting.perceptionRadius,
          y: boid.position.y - BoidSetting.perceptionRadius,
          width: BoidSetting.perceptionRadius * 2,
          height: BoidSetting.perceptionRadius * 2,
        });

        // console.log(arroundBoids.length)

        boid.flock(arroundBoids.map((bound) => this.getBoidFromBound(bound)));
      }
    } else {
      for (var boid of this.boids) {
        boid.flock(this.boids);
      }
    }

    for (let boid of this.boids) {
      boid.update();
      boid.edges();
    }
  }

  show() {
    BoidSetting.drawQuadtree && this.drawQuadtree(this.boidsTree);

    stroke(255);
    fill(0);
    for (let boid of this.boids) {
      boid.show();
    }
  }

  getBoidFromBound(bound) {
    return bound.ref;
  }

  getBoundOfBoid(boid) {
    return {
      x: boid.position.x,
      y: boid.position.y,
      width: boid.radius * 2,
      height: boid.radius * 2,
      ref: boid,
    };
  }

  drawQuadtree(node) {
    var bounds = node.bounds;

    //no subnodes? draw the current node
    if (node.nodes.length === 0) {
      stroke(100);
      noFill();
      rect(bounds.x, bounds.y, bounds.width, bounds.height);

      //has subnodes? drawQuadtree them!
    } else {
      for (var i = 0; i < node.nodes.length; i++) {
        this.drawQuadtree(node.nodes[i]);
      }
    }
  }
}
