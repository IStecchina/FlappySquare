"use strict";
window.onload = init;
//Load everything
function init() {
	//Get canvas context
	ctx2d = document.getElementById('game-area').getContext('2d');
	//Assign HTML+CSS properties
	ctx2d.canvas.width = canvasW;
	ctx2d.canvas.height = canvasH;
	ctx2d.canvas.style.aspectRatio = canvasW/canvasH;
	//Reset state
	reset();
	//Go
	window.requestAnimationFrame(gameLoop);
}

function reset(){
	//Reinitialize input to get rid of stuck keys
	keyMap = new Map();
	bgColor = bgColorDefault;
	//Reset player and obstacles
	player = new PlayerObject(playerSize, playerSpeed, canvasW/10, (canvasH - playerSize)/2);
	obstacles = [];
	for (let i = 1; i <= obstaclesCount; i++){
		obstacles.push(
			//Obstacles are spawned offscreen
			new ObstacleObject(obstacleWidth, obstacleSpeed, canvasW + obstacleSpacing * i, canvasH/2, canvasH/2)
		);
	}
	//Immediately randomize gaps
	obstacles.forEach(obstacle => obstacle.randomizeGap());
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
	//Get all keys that are currently down
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