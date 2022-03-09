class PlayerObject extends GameObject
{
	constructor(size, speed, x, y){
		super(x, y)
		this.size = size;
		this.speed = speed;
	}
	
	draw(){
		GameObject.ctx.fillStyle = 'SpringGreen';
		GameObject.ctx.fillRect(this.x, this.y, this.size, this.size);
	}
	
	update(milliseconds, keys){
		let vector = {x:0, y:0};
		if(keys.get('ArrowUp')) vector.y -= 1;
		if(keys.get('ArrowDown')) vector.y += 1;
		if(keys.get('ArrowLeft')) vector.x -= 1;
		if(keys.get('ArrowRight')) vector.x += 1;
		
		//Prevent straferunning
		//No fun allowed!
		if(vector.x != 0 && vector.y != 0){
			let diagonal = Math.sqrt(vector.x ** 2 + vector.y ** 2);
			vector.x /= diagonal;
			vector.y /= diagonal;
		}
		
		player.x += player.speed * milliseconds * vector.x;
		player.y += player.speed * milliseconds * vector.y;
		this.constrainPosition();
	}
	
	//Don't go out of bounds
	constrainPosition(){
		if (this.x < 0) this.x = 0;
		if (this.x > canvasW - this.size) this.x = canvasW - this.size;
		if (this.y < 0) this.y = 0;
		if (this.y > canvasH - this.size) this.y = canvasH - this.size;
	}
	
}