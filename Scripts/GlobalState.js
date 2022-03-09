"use strict";
//Game objects
let player;
let obstacles;

//Internal resolution
const canvasW = 1920;
const canvasH = 1200;
//Sizes (pixels)
const playerSize = canvasW/12;
const obstacleWidth = canvasW/24;
const obstacleSpacing = canvasW/2;
//Speeds (pixels per millisecond)
const playerSpeed = (canvasW/3)/1000;
const obstacleSpeed = (canvasW/4)/1000;
//Obstacle count, just enough to fill the whole screen width
const obstaclesCount = Math.ceil(canvasW/obstacleSpacing) + 1;

//Canvas context
let ctx2d;
//Background colors
let bgColor;
const bgColorDefault = 'AliceBlue';
const bgColorNearMiss = 'GhostWhite';
const bgColorHit = 'MistyRose';

//Timestep
let oldtimestamp;
let timestep;
//Score
let score;
let startingTime;
const msPerPoint = 100;
//Game flow
let gameOver;
//Input
let keyMap;