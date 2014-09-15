// Menu
ZxGame.Menu = function (w,h) {
	createjs.Container.call(this,null);
	this._init(w,h);
}
ZxGame.Menu.prototype = new createjs.Container();
ZxGame.Menu.prototype._init = function (w,h,titleText) {
	var self = this;
	self.w = w;
	self.h = h;

	var bg = new createjs.Shape();
	var bgG = bg.graphics;
	bgG.beginStroke("rgba(120,205,55,0.5)");
	bgG.beginFill("rgba(130,130,130,0.5)");
	bgG.setStrokeStyle(3,"butt");
	bgG.drawRect(0,0,w,h);
	self.addChild(bg);
	self.bg = bg;

	var title = new createjs.Text();
	title.text = titleText||"title";
	title.textAlign = "center";
	title.font = "14px 幼圆";
	title.color = "#f55";
	title.x = w/2;
	self.addChild(title);
	self.title = title;

	var closeBtn = new ZxGame.CloseBtn();
	closeBtn.addEventListener("click", function () {
		self.parent.removeChild(self);
	})
	closeBtn.x = w;
	self.addChild(closeBtn);
	self.closeBtn = closeBtn;
}


// CloseBtn
ZxGame.CloseBtn = function() {
	createjs.Container.call(this,null);
	this._init();
}
ZxGame.CloseBtn.prototype = new createjs.Container();
ZxGame.CloseBtn.prototype._init = function () {
	var self = this;

	var closeCircle = new createjs.Shape();
	var closeCircleG = closeCircle.graphics;
	var closeRect1 = new createjs.Shape();
	var closeRect1G = closeRect1.graphics;
	var closeRect2 = new createjs.Shape();
	var closeRect2G = closeRect2.graphics;
	closeCircleG.beginStroke("#ccc");
	closeCircleG.beginFill("#fff");
	closeCircleG.setStrokeStyle(3);
	closeCircleG.drawCircle(0,0,10);
	closeRect1G.beginFill("#ccc");
	closeRect1G.drawRect(-1,-6,2,12);
	closeRect1.rotation = 45;
	closeRect2G.beginFill("#ccc");
	closeRect2G.drawRect(-1,-6,2,12);
	closeRect2.rotation = -45;
	self.addChild(closeCircle);
	self.addChild(closeRect1);
	self.addChild(closeRect2);
}
