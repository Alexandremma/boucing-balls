const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

let balls = [];

// function to generate random number
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Ball(coordinateX, coordinateY, velocityX, velocityY, color, size) {
    this.coordinateX = coordinateX;
    this.coordinateY = coordinateY;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.coordinateX, this.coordinateY, this.size, 0, 2 * Math.PI);
    ctx.fill();
}

Ball.prototype.update = function() {
    if ((this.coordinateX + this.size) >= width) {
        this.velocityX = -(this.velocityX);
    }

    if ((this.coordinateX - this.size) <= 0) {
        this.velocityX = -(this.velocityX);
    }

    if ((this.coordinateY + this.size) >= height) {
        this.velocityY = -(this.velocityY);
    }

    if ((this.coordinateY - this.size) <= 0) {
        this.velocityY = -(this.velocityY);
    }

    this.coordinateX += this.velocityX;
    this.coordinateY += this.velocityY;
}

Ball.prototype.collisionDetect = function() {
    for (let i = 0; i < balls.length; i++) {
        if (!(this === balls[i])) {
            let distanceX = this.coordinateX - balls[i].coordinateX;
            let distanceY = this.coordinateY - balls[i].coordinateY;
            let ballsDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (ballsDistance < (this.size + balls[i].size)) {
                balls[i].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
                balls[i].velocityX = -(balls[i].velocityX);
                this.velocityX = -(this.velocityX);
            }
        }
    }
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    while (balls.length < 50) {
        let size = random(10, 20);
        let ball = new Ball(
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-4, 4),
            random(-4, 4),
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            size
        );
        balls.push(ball);
    }

    for (let i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    requestAnimationFrame(loop);
}

loop();