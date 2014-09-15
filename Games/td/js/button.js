
// Button
ZxGame.Button = function(w,h,text,textStyle,bgColor,hoverColor,clickListener) {
	createjs.Container.call(this,null);
	this._init(w,h,text,textStyle,bgColor,hoverColor,clickListener);
}
ZxGame.Button.prototype = new createjs.Container();
ZxGame.Button.prototype._init = function(w,h,t,textStyle,bgColor,hoverColor) {
	var self = this;
	self.w = w;
	self.h = h;
	self.bgColor = bgColor;
	self.hoverColor = hoverColor;
	var text = new createjs.Text(t);
	text.textAlign = "center";
	text.textBaseline = "middle";
	text.font = textStyle;
	text.x = w/2;
	text.y = h/2;
	var bg = new createjs.Shape();
	var bgG = bg.graphics;
	bgG.beginFill(bgColor);
	bgG.drawRect(0,0,w,h);
	self.addEventListener("rollover", function() {
		bgG.beginFill(hoverColor);
		bgG.drawRect(0,0,w,h);
	})
	self.addEventListener("rollout", function() {
		bgG.beginFill(bgColor);
		bgG.drawRect(0,0,w,h);
	})
	self.addChild(bg);
	self.addChild(text);
	self.bg = bg;
	self.text = text;
}
