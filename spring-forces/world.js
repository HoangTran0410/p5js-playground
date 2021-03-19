import Particle from "./particle.js";
import Spring from "./spring.js";

export default class World {
    constructor({
        gravity = createVector(0, 0),
        friction = 0.01,
        bound = {
            top: -Infinity,
            left: 0,
            right: width,
            bottom: height,
        },
    }) {
        this.gravity = gravity;
        this.friction = friction;
        this.bound = bound;

        this.particles = [];
        this.springs = [];
    }

    update() {
        // update springs
        for (let i = this.springs.length - 1; i >= 0; i--) {
            let s = this.springs[i];
            if (s.disabled) continue;

            s.update();
            if (s.isBroken) {
                this.springs.splice(i, 1);
            }
        }

        // update particles
        for (let p of this.particles) {
            p.applyForce(this.gravity);
            p.update();
        }

        // overlap particles
        for (let p of this.particles) {
            for (let p2 of this.particles) {
                if (p == p2) continue;

                p.checkCollision(p2);
            }
        }

        // bound particles
        for (let p of this.particles) {
            if (p.position.y > this.bound.bottom) {
                p.velocity.y *= -0.9;
                p.position.y = this.bound.bottom;
            } else if (p.position.y < this.bound.top) {
                p.velocity.y *= -0.9;
                p.position.y = this.bound.top;
            }
            if (p.position.x > this.bound.right) {
                p.velocity.x *= -0.9;
                p.position.x = this.bound.right;
            } else if (p.position.x < this.bound.left) {
                p.velocity.x *= -0.9;
                p.position.x = this.bound.left;
            }
        }
    }

    show() {
        for (let s of this.springs) {
            if (s.disabled) continue;
            s.show();
        }
        for (let p of this.particles) {
            p.show();
        }
    }

    getParticleAt(x, y) {
        for (let p of this.particles) {
            if (p5.Vector.dist(p.position, createVector(x, y)) < p.radius) {
                return p;
            }
        }
        return null;
    }

    applyForce(f) {
        for (let p of this.particles) {
            p.applyForce(f);
        }
    }

    joinSpring(p, p2, springConfig = {}) {
        const {
            k = 0.03,
            spacing = p5.Vector.dist(p.position, p2.position),
            maxl = Infinity,
            twoWay: tw = true,
        } = springConfig;

        this.springs.push(new Spring(k, spacing, p, p2, maxl, tw));
    }

    cutSpring(p) {
        for (let i = this.springs.length - 1; i >= 0; i--) {
            if (this.springs[i].a == p || this.springs[i].b == p) {
                this.springs.splice(i, 1);
            }
        }
    }

    deleteParticle(p) {
        let index = this.particles.indexOf(p);
        if (index != -1) {
            this.cutSpring(p);
            this.particles.splice(index, 1);
        }
    }

    lock(p, state) {
        p.isLocked = state;
        p.velocity.mult(0);
        p.acc.mult(0);
    }

    toggleLock(p) {
        this.lock(p, !p.isLocked);
    }

    // ---------------- make shapes ----------------
    makeChain({
        position,
        len,
        springConfig = {},
        particleConfig = {},
        lock = {},
    }) {
        // -------- default values --------
        const { x = 5, y = 5 } = position;
        const { radius = 10 } = particleConfig;
        const {
            k = 0.03,
            spacing = 30,
            maxl = Infinity,
            twoWay: tw = true,
        } = springConfig;

        const { indexes: lockIndexes = [] } = lock;

        // -------- init particles --------
        let pars = [];
        for (let i = 0; i < len; i++) {
            pars.push(new Particle(x, y + i * spacing, radius));
        }

        // -------- lock particles --------
        if (lockIndexes.length) {
            for (let i of lockIndexes) {
                if (pars[i]) pars[i].isLocked = true;
            }
        }

        // -------- init springs --------
        let sprs = [];
        for (let i = 1; i < pars.length; i++) {
            sprs.push(new Spring(k, spacing, pars[i - 1], pars[i], maxl, tw));
        }

        this.particles.push(...pars);
        this.springs.push(...sprs);
    }

    makeGrid({
        position,
        row = 3,
        col = 3,
        strong = true,
        springConfig = {},
        particleConfig = {},
        lock = {},
    }) {
        // -------- default values --------
        const { x = 5, y = 5 } = position;

        const {
            rows: lockRows = -1,
            cols: lockCols = -1,
            indexes: lockIndexes = [],
        } = lock;

        const {
            k = 0.03,
            spacing = 30,
            maxl = Infinity,
            twoWay: tw = true,
        } = springConfig;

        const { radius = 10 } = particleConfig;

        // -------- init particles --------
        let pars = [];
        for (let r = 0; r < row; r++) {
            for (let c = 0; c < col; c++) {
                let p = new Particle(c * spacing + x, r * spacing + y, radius);
                pars.push(p);
            }
        }

        // -------- lock particles --------
        if (lockRows.length) {
            for (let lockRow of lockRows)
                for (let i = 0; i < col; i++) {
                    pars[i + lockRow * col].isLocked = true;
                }
        }

        if (lockCols.length) {
            for (let lockCol of lockCols)
                for (let i = 0; i < row; i++) {
                    pars[lockCol + col * i].isLocked = true;
                }
        }

        if (lockIndexes.length) {
            for (let index of lockIndexes) {
                if (pars[index]) pars[index].isLocked = true;
            }
        }

        // -------- init springs --------
        let sprs = [];
        for (let i = 0; i < pars.length; i++) {
            let p = pars[i];
            let u = pars[i - col];
            let d = pars[i + col];
            let l = pars[i % col == 0 ? -1 : i - 1];
            let r = pars[(i + 1) % col == 0 ? -1 : i + 1];

            u && sprs.push(new Spring(k, spacing, p, u, maxl, tw));
            d && sprs.push(new Spring(k, spacing, p, d, maxl, tw));
            l && sprs.push(new Spring(k, spacing, p, l, maxl, tw));
            r && sprs.push(new Spring(k, spacing, p, r, maxl, tw));

            if (!strong) continue;

            let ul = pars[i % col == 0 ? -1 : i - col - 1];
            let ur = pars[(i + 1) % col == 0 ? -1 : i - col + 1];

            ul && sprs.push(new Spring(k, spacing * sqrt(2), p, ul, maxl, tw));
            ur && sprs.push(new Spring(k, spacing * sqrt(2), p, ur, maxl, tw));
        }

        this.particles.push(...pars);
        this.springs.push(...sprs);
    }
}
