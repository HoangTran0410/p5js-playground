class Map {
    constructor(_width, _height) {
        this.position = createVector(0, 0);
        this.width = _width;
        this.height = _height;
        this.gridSize = 200;
    }

    showEdge() {
        var topLeft = createVector(0, 0);
        var topRight = createVector(this.width, 0);
        var botLeft = createVector(0, this.height);
        var botRight = createVector(this.width, this.height);

        stroke(255);
        strokeWeight(2);
        line(topLeft.x, topLeft.y, topRight.x, topRight.y);
        line(topLeft.x, topLeft.y, botLeft.x, botLeft.y);
        line(botLeft.x, botLeft.y, botRight.x, botRight.y);
        line(topRight.x, topRight.y, botRight.x, botRight.y);
    }

    showGrid(_viewport) {
        stroke(50, 70);
        strokeWeight(3);
        var delta = 1;

        for (var x = _viewport.position.x - width / 2; x < _viewport.position.x + width / 2; x += delta) {
            if (floor(x) % this.gridSize == 0) {
                delta = this.gridSize;
                line(x, _viewport.position.y - height / 2, x, _viewport.position.y + height / 2);
            }
        }

        delta = 1;
        for (var y = _viewport.position.y - height / 2; y < _viewport.position.y + height / 2; y += delta) {
            if (floor(y) % this.gridSize == 0) {
                delta = this.gridSize;
                line(_viewport.position.x - width / 2, y, _viewport.position.x + width / 2, y);
            }
        }
    };
}