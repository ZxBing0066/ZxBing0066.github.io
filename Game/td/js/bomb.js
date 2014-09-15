// bomb

ZxGame.Bomb = function (style) {
	createjs.Shape.call(this);
	this._init(style);
}
ZxGame.Bomb.prototype = new createjs.Shape();
ZxGame.Bomb.prototype._init = function(style) {
	var self = this;
	self.style = style;
	self.currentFrame = 1;
	self.totalFrame = 20;
	self.maxSize = 2;
	self.update();
	delete self._init;
}
/*{
	r: 10,
	color: [20,20,20]
}*/
ZxGame.Bomb.prototype.update = function() {
	var self = this;
	var g = self.graphics;
	var color = self.style.color; 
	var opacity = 0.8*(self.totalFrame-self.currentFrame)/self.totalFrame;
	var rgbaColor = "rgba(" + color[0] + "," + color[1] + "," + color[2] + "," + opacity + ")";
	g.clear();
	g.beginFill(rgbaColor);
	g.drawCircle(0,0,self.style.r*((self.maxSize-1)*self.currentFrame/self.totalFrame+1));
	self.currentFrame++;
}