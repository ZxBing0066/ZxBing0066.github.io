// GameMap
ZxGame.GameMap = function() {
	createjs.Container.call(this, null);
	this._init();
}
ZxGame.GameMap.prototype = new createjs.Container();
ZxGame.GameMap.prototype._init = function() {
	var self = this;

	var bg = new createjs.Shape();
	var g = bg.graphics;
	g.beginFill("#fff");
	g.beginStroke("#ccc");
	g.setStrokeStyle(1);
	g.drawRect(0, 0, ZxGame.config.gridW*ZxGame.config.gridColNum, ZxGame.config.gridW*ZxGame.config.gridRowNum);
	self.addChild(bg);
	self.bg = bg;

	var startCoord = new createjs.Shape();
	var g = startCoord.graphics;
	g.beginFill("#ccc");
	g.drawRect(0, 0, ZxGame.config.gridW, ZxGame.config.gridW);
	g.beginFill("#CE639A");
	g.drawCircle(ZxGame.config.gridW/2, ZxGame.config.gridW/2, 15);
	startCoord.x = ZxGame.config.startCoord[0]*ZxGame.config.gridW;
	startCoord.y = ZxGame.config.startCoord[1]*ZxGame.config.gridW;
	self.addChild(startCoord);

	var targetCoord = new createjs.Shape();
	var g = targetCoord.graphics;
	g.beginFill("#ccc");
	g.drawRect(0, 0, ZxGame.config.gridW, ZxGame.config.gridW);
	g.beginFill("#2D8D5B");
	g.drawCircle(ZxGame.config.gridW/2, ZxGame.config.gridW/2, 15);
	targetCoord.x = ZxGame.config.targetCoord[0]*ZxGame.config.gridW;
	targetCoord.y = ZxGame.config.targetCoord[1]*ZxGame.config.gridW;
	self.addChild(targetCoord);

	self.map = [];
	var gridBorder = new createjs.Shape();
	var g = gridBorder.graphics;
	g.beginStroke("#eee");
	g.setStrokeStyle(1);
	for (var i = 0; i < ZxGame.config.gridColNum; i++) {
		var array = [];
		for (var j = 0; j < ZxGame.config.gridRowNum; j++) {
			array.push(0);
			g.drawRect(ZxGame.config.gridW*i, ZxGame.config.gridW*j, ZxGame.config.gridW, ZxGame.config.gridW);
		};
		self.map.push(array); //0 
	};
	self.addChild(gridBorder);
}
ZxGame.GameMap.prototype.getPath = function() {
	return ZxGame.findPath(this.map, ZxGame.config.gridColNum, ZxGame.config.gridRowNum, ZxGame.config.startCoord[0], ZxGame.config.startCoord[1], ZxGame.config.targetCoord[0], ZxGame.config.targetCoord[1]);
}