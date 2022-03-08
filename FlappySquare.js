"use strict";
//Game objects
let player;
let playerSize = 160;
let playerSpeed = 500/1000;

let obstacles;
let obstacleWidth = 80;
let obstacleSpeed = 400/1000;
//Canvas
let myCanvas;
let canvasW, canvasH;
let ctx2d;
let oldtimestamp;
let timestep;
let bgColor;
let bgColorDefault = 'AliceBlue';
let bgColorNearMiss = 'GhostWhite';
let bgColorHit = 'MistyRose';
//Score
let score;
let startingTime;
let msPerPoint = 100;
let gameOver;
//Input
let keyMap;

window.onload = init;
//Load everything
function init() {
	//Initialize input
	keyMap = new Map();
	//Get canvas
	myCanvas = document.getElementById('game-area');
	canvasW = myCanvas.width;
	canvasH = myCanvas.height;
	ctx2d = myCanvas.getContext('2d');
	//Zero out things
	reset();
	//Go
	window.requestAnimationFrame(gameLoop);
}

function reset(){
	bgColor = bgColorDefault;
	player = new PlayerObject(ctx2d, playerSize, playerSpeed, canvasW/10, (canvasH - playerSize)/2);
	obstacles = [
		new ObstacleObject(ctx2d, obstacleWidth, obstacleSpeed, canvasW*15/10, canvasH/4, canvasH/3),
		new ObstacleObject(ctx2d, obstacleWidth, obstacleSpeed, canvasW*20/10, canvasH*3/4, canvasH/3),
		new ObstacleObject(ctx2d, obstacleWidth, obstacleSpeed, canvasW*25/10, canvasH/4, canvasH/3),
		new ObstacleObject(ctx2d, obstacleWidth, obstacleSpeed, canvasW*30/10, canvasH*3/4, canvasH/3)
	]
	gameOver = false;
	oldtimestamp = 0;
	startingTime = null;
}

function gameLoop(timestamp) {
	startingTime = startingTime ?? timestamp;
	timestep = Math.min(timestamp - oldtimestamp, 100);
	oldtimestamp = timestamp;
	if(!gameOver) score = (timestamp - startingTime) / msPerPoint;
	update(timestep);
	draw();
	window.requestAnimationFrame(gameLoop);
}

function update(milliseconds) {
	if(gameOver) return;
	player.update(milliseconds, keyMap);
	for(let obstacle of obstacles){
		obstacle.update(milliseconds);
	}
	checkCollisions();
}

function inputHandler() {
	//Prevent browser hotkeys from interfering with game controls
	const keyList = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
	
	if(keyList.includes(event.key))	event.preventDefault();
	keyMap.set(event.key, event.type == 'keydown');
	//Restart after game over
	if(gameOver && keyMap.get('Enter')) reset();
}

function checkCollisions() {
	bgColor = bgColorDefault;
	for(let obstacle of obstacles){
		//Is player within the X range of the obstacle?
		if (obstacle.x < player.x + player.size && obstacle.x + obstacle.width > player.x){
			bgColor = bgColorNearMiss;
			//Is player outside the Y range of the gap?
			if(obstacle.gapUpperY > player.y || obstacle.gapLowerY < player.y + player.size){
				//Game Over
				bgColor = bgColorHit;
				gameOver = true;
			}
		}
	}
}

function draw() {
	//Clear drawing area
	ctx2d.fillStyle = bgColor;
	ctx2d.fillRect(0, 0, canvasW, canvasH);
	
	player.draw();
	for(let obstacle of obstacles){
		obstacle.draw();
	}
	drawScore();
	if(gameOver) drawGameOver();
}

function drawScore() {
	ctx2d.font = '50px Arial';
	ctx2d.textBaseline = 'middle';
	ctx2d.textAlign = 'right';
    ctx2d.fillStyle = '#111111';
    ctx2d.fillText("SCORE: " + score.toFixed(0), canvasW - 20, 50 - 10);
}

function drawGameOver() {
	ctx2d.font = '50px Arial';
	ctx2d.textBaseline = 'middle';
	ctx2d.textAlign = 'center';
    ctx2d.fillStyle = '#111111';
    ctx2d.fillText("GAME OVER: press Enter to try again", canvasW/2, canvasH/2);
}

class GameObject
{
	constructor(ctx, x, y){
		this.ctx = ctx;
		this.canvas = ctx.canvas;
		this.x = x;
		this.y = y;
	}
}

class PlayerObject extends GameObject
{
	constructor(ctx, size, speed, x, y){
		super(ctx, x, y)
		this.size = size;
		this.speed = speed;
	}
	
	draw(){
		this.ctx.fillStyle = 'SpringGreen';
		this.ctx.fillRect(this.x, this.y, this.size, this.size);
	}
	
	update(milliseconds, keyMap){
		let vector = {x:0, y:0};
		if(keyMap.get('ArrowUp')) vector.y -= 1;
		if(keyMap.get('ArrowDown')) vector.y += 1;
		if(keyMap.get('ArrowLeft')) vector.x -= 1;
		if(keyMap.get('ArrowRight')) vector.x += 1;
		
		player.x += player.speed * milliseconds * vector.x;
		player.y += player.speed * milliseconds * vector.y;
		this.constrainPosition();
	}
	
	//Don't go out of borders
	constrainPosition(){
		if (this.x < 0) this.x = 0;
		if (this.x > this.canvas.width - this.size) this.x = this.canvas.width - this.size;
		if (this.y < 0) this.y = 0;
		if (this.y > this.canvas.height - this.size) this.y = this.canvas.height - this.size;
	}
	
}

class ObstacleObject extends GameObject
{
	constructor(ctx, width, speed, x, gapMidY, gapWidth){
		super(ctx, x, ctx.canvas.height/2)
		this.width = width;
		this.speed = speed;
		
		this.gapUpperY = gapMidY - gapWidth/2;
		this.gapLowerY = gapMidY + gapWidth/2;
	}
	
	draw(){
		let gapUpperY = this.canvas.width/3;
		let gapLowerY = this.canvas.height*2/3;
		this.ctx.fillStyle = 'Tomato';
		this.ctx.fillRect(this.x, -this.canvas.height + this.gapUpperY, this.width, this.canvas.height);
		this.ctx.fillRect(this.x, this.gapLowerY, this.width, this.canvas.height);
	}
	
	update(milliseconds){
		this.x -= this.speed * milliseconds;
		this.constrainPosition();
	}
	
	//Wrap around
	constrainPosition(){
		if (this.x < -this.canvas.width){
			this.x += this.canvas.width*2;
			//Move the gap when offscreen
			this.randomizeGap();
		}
	}
	
	randomizeGap(){
		let gapWidth = (Math.random() + 1) * 1.5 * playerSize;
		let gapMidY = Math.random() * (canvasH - playerSize) + playerSize/2 ;
		this.gapUpperY = gapMidY - gapWidth/2;
		this.gapLowerY = gapMidY + gapWidth/2;
	}
	
}