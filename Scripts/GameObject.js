class GameObject
{
	//Share a single canvas context between all objects, and initialize it automatically
	static _ctx;
	static get ctx(){
		if(!this._ctx) this._ctx = ctx2d;
		return this._ctx;
	}
	
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}