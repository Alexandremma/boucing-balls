const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

const counterView = document.getElementById('counter');
let ballCounter = 0;

const gameOverView = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');

let balls = [];

let deathCircle = new DeathCircle(
    random(0 + 10, width - 10),
    random(0 + 10, height - 10),
    true
);

// function to generate random number
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

function Shape(coordinateX, coordinateY, velocityX, velocityY, exists) {
    this.coordinateX = coordinateX;
    this.coordinateY = coordinateY;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.exists = exists;
}

function Ball(coordinateX, coordinateY, velocityX, velocityY, exists, color, size) {
    Shape.call(this, coordinateX, coordinateY, velocityX, velocityY, exists);

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

function DeathCircle(coordinateX, coordinateY, exists) {
    Shape.call(this, coordinateX, coordinateY, 20, 20, exists);
    this.color = 'white';
    this.size = 10;
}

DeathCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.arc(this.coordinateX, this.coordinateY, this.size, 0, 2 * Math.PI);
    ctx.stroke();
}

DeathCircle.prototype.checkBounds = function() {
    if ((this.coordinateX + this.size) >= width) {
        this.coordinateX -= this.size;
    }
    
    if ((this.coordinateX - this.size) <= 0) {
        this.coordinateX += this.size;
    }
    
    if ((this.coordinateY + this.size) >= height) {
        this.coordinateY -= this.size;
    }
    
    if ((this.coordinateY - this.size) <= 0) {
        this.coordinateY += this.size;        
    }
}

DeathCircle.prototype.setControls = function() {
    let _this = this;
    
    window.onkeydown = function(e) {
        if (e.keyCode === 65) {
            _this.coordinateX -= _this.velocityX;
        } else if (e.keyCode === 68) {
            _this.coordinateX += _this.velocityX;
        } else if (e.keyCode === 87) {
            _this.coordinateY -= _this.velocityY;
        } else if (e.keyCode === 83) {
            _this.coordinateY += _this.velocityY;
        }
    }
}

DeathCircle.prototype.collisionDetect = function() {
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            let distanceX = this.coordinateX - balls[i].coordinateX;
            let distanceY = this.coordinateY - balls[i].coordinateY;
            let ballsDistance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            if (ballsDistance < (this.size + balls[i].size)) {
                balls[i].exists = false;
                ballCounter--;
                if (ballCounter === 0) {
                    gameOver();
                }
            }
        }
    }
}

deathCircle.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    counterView.textContent = `Ball Count: ${ballCounter}`;

    deathCircle.draw();
    deathCircle.checkBounds();
    deathCircle.collisionDetect();
    
    while (balls.length < 30) {
        let size = random(10, 20);
        let ball = new Ball(
            random(0 + size, width - size),
            random(0 + size, height - size),
            random(-5, 5),
            random(-5, 5),
            true,
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            size
            );
            balls.push(ball);
        ballCounter++;
    }

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
        }
    }

    requestAnimationFrame(loop);
}

function gameOver() {
    gameOverView.style.display = 'flex';
}

function restartGame() {
    gameOverView.style.display ='none';

    for (let i = 0; i < balls.length; i++) {
        balls[i].exists = true; 
    }

    ballCounter = balls.length;
}

restartButton.addEventListener('click', restartGame);

loop();