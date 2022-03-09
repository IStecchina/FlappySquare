class ObstacleObject extends GameObject
{
	constructor(width, speed, x, gapMidY, gapWidth){
		super(x, gapMidY)
		this.width = width;
		this.speed = speed;
		this.gapWidth = gapWidth;
	}
	
	//Update gap bounds automatically
	get gapUpperY(){ return this.y - this.gapWidth/2; }
	get gapLowerY(){ return this.y + this.gapWidth/2; }
	
	draw(){
		GameObject.ctx.fillStyle = 'Tomato';
		GameObject.ctx.fillRect(this.x, 0, this.width, this.gapUpperY);
		GameObject.ctx.fillRect(this.x, this.gapLowerY, this.width, canvasH - this.gapWidth - this.gapUpperY);
	}
	
	update(milliseconds){
		this.x -= this.speed * milliseconds;
		this.constrainPosition();
	}
	
	//Wrap around
	constrainPosition(){
		//Is the obstacle out of sight?
		if (this.x < -this.width*2){
			//Find the leftmost obstacle, and position this obstacle after it
			let leftmostObstacle = obstacles.reduce(
				(previous, current) => previous.x > current.x ? previous: current
			);
			this.x += leftmostObstacle.x + obstacleSpacing;
			//Randomize the gap when out of sight
			this.randomizeGap();
		}
	}
	
	randomizeGap(){
		//From 150% to 250% of player size
		this.gapWidth = (Math.random() * 1 + 1.5) * playerSize;
		//Keep the whole gap on screen, with some addtional margin
		const margin = canvasH/20;
		this.y = Math.random() * (canvasH - this.gapWidth - margin) + (this.gapWidth + margin)/2;
	}
	
}