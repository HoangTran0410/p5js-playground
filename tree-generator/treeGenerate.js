// Này code ở đâu ý quên rồi :)
// Không phải code của tôi :)

var sketch = function (p) {
    // Initial setup
    p.setup = function () {
        // Create the canvas
        var canvas = p.createCanvas(p.windowWidth, p.windowHeight);

        // Paint a new tree each time the mouse is pressed inside the canvas
        canvas.mousePressed(paintNewTree);

        // We will just paint the tree once
        p.noLoop();
        p.noStroke();

        // Paint the tree
        paintNewTree();
    };

    /*
     * This function creates a tree iteratively and paints it in the canvas
     */
    function paintNewTree() {
        var position = p.createVector(0.5 * p.width, 0.95 * p.height, 0);
        var length = p.height / 7;
        var diameter = length / 4.5;
        var angle = -p.HALF_PI + (p.PI / 180) * p.random(-5, 5);
        var color = p.color(130, 80, 20);
        var level = 1;
        var tree = new Branch(position, length, diameter, angle, color, level);

        // Paint the tree
        p.background(245);
        tree.paint();
    }

    /*
     * The Branch class
     */
    function Branch(position, length, diameter, angle, color, level) {
        this.position = position;
        this.length = length;
        this.diameter = diameter;
        this.angle = angle;
        this.color = color;
        this.level = level;
        this.middleBranch = this.createSubBranch(true);
        this.extremeBranch = this.createSubBranch(false);
    }

    /*
     * This method paints the branch and its sub-branches in the canvas
     */
    Branch.prototype.paint = function () {
        // Paint the middle branch
        if (this.middleBranch) {
            this.middleBranch.paint();
        }

        // Paint the extreme branch
        if (this.extremeBranch) {
            this.extremeBranch.paint();
        }

        // Calculate the diameter at the branch top
        var topDiameter = 0.65 * this.diameter;

        if (this.extremeBranch) {
            topDiameter = this.extremeBranch.diameter;
        }

        // Paint the branch
        p.push();
        p.fill(this.color);
        p.translate(this.position.x, this.position.y);
        p.rotate(this.angle);
        p.beginShape();
        p.vertex(0, -this.diameter / 2);
        p.vertex(1.04 * this.length, -topDiameter / 2);
        p.vertex(1.04 * this.length, topDiameter / 2);
        p.vertex(0, this.diameter / 2, 0);
        p.endShape();
        p.pop();
    };

    /*
     * This method creates a new sub-branch
     */
    Branch.prototype.createSubBranch = function (isMiddleBranch) {
        // Decide if the branch should be created
        var createBranch = false;
        var maxLevel = 18;

        if (isMiddleBranch) {
            if (this.level < 4 && p.random() < 0.7) {
                createBranch = true;
            } else if (this.level >= 4 && this.level < 10 && p.random() < 0.8) {
                createBranch = true;
            } else if (this.level >= 10 && this.level < maxLevel && p.random() < 0.85) {
                createBranch = true;
            }
        } else {
            if (this.level == 1) {
                createBranch = true;
            } else if (this.level < maxLevel && p.random() < 0.85) {
                createBranch = true;
            }
        }

        if (createBranch) {
            // Calculate the starting position of the new branch
            var newPosition = p.createVector(p.cos(this.angle), p.sin(this.angle), 0);
            newPosition.mult(this.length);

            if (isMiddleBranch) {
                newPosition.mult(p.random(0.5, 0.9));
            }

            newPosition.add(this.position);

            // Calculate the length of the new branch
            var newLength = p.random(0.8, 0.9) * this.length;

            // Calculate the diameter of the new branch
            var newDiameter = this.diameter;

            if (this.level < 5) {
                newDiameter *= p.random(0.8, 0.9);
            } else {
                newDiameter *= p.random(0.65, 0.75);
            }

            // Calculate the inclination angle of the new branch
            var newAngle = this.angle;

            if (isMiddleBranch) {
                var sign = (p.random() < 0.5) ? -1 : 1;
                var deltaAngle = (p.PI / 180) * p.random(20, 40);
                newAngle += sign * deltaAngle;

                if (this.level < 8) {
                    // Don't let the branches fall too much
                    if (newAngle < -p.PI) {
                        newAngle += 2 * deltaAngle;
                    } else if (newAngle > 0) {
                        newAngle -= 2 * deltaAngle;
                    }
                }
            } else {
                newAngle += (p.PI / 180) * p.random(-15, 15);

                if (this.level < 8) {
                    // Don't let the branches fall too much
                    if (newAngle < -p.PI) {
                        newAngle += (p.PI / 180) * p.random(10, 30);
                    } else if (newAngle > 0) {
                        newAngle -= (p.PI / 180) * p.random(10, 30);
                    }
                }
            }

            // Calculate the color of the new branch
            var newColor;

            if (newDiameter > 1) {
                var deltaColor = p.round(0, 20);
                newColor = p.color(p.red(this.color) + deltaColor, p.green(this.color) + deltaColor, p.blue(this.color));
            } else {
                newColor = p.color(0.75 * p.red(this.color), p.green(this.color), 0.85 * p.blue(this.color));
            }

            // Calculate the new branch level
            var newLevel = this.level + 1;

            if (this.level < 6 && p.random() < 0.3) {
                newLevel++;
            }

            // Return the new branch
            return new Branch(newPosition, newLength, newDiameter, newAngle, newColor, newLevel);
        } else {
            // Return undefined
            return;
        }
    };
};

var myp5 = new p5(sketch);