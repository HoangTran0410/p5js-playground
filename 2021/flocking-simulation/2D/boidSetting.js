const BoidShape = {
  line: 0,
  triangle: 1,
  point: 2,
};

const BoidSetting = {
  numberOfBoidsMobile: 70,
  numberOfBoids: 200,
  boidShape: BoidShape.triangle,
  boidRadius: 5,

  minSpeed: 1.5,
  maxSpeed: 3,
  maxSteerForce: 0.2,
  avoidWall: true,

  alignWeight: 1,
  cohesionWeight: 0.5,
  seperateWeight: 1.5,
  avoidWallWeight: 2,
  targetWeight: 2,

  perceptionRadius: 25,
  avoidanceRadius: 20,
  avoidWallRadius: 20,

  useQuadtree: true,
  drawQuadtree: false,
};
