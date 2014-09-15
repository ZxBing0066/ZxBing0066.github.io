// building
ZxGame.Building = function(shape) {
	createjs.Container.call(this);
	this._init(shape);
}
ZxGame.Building.prototype = new createjs.Container();
ZxGame.Building.prototype._init = function(shape) {
	var self = this;
	self.shape = shape;
	self.addChild(shape);
}
ZxGame.Tower = function(shape, attr) {
	createjs.Container.call(this);
	this._init(shape,attr);
}
ZxGame.Tower.prototype = new createjs.Container();
ZxGame.Tower.prototype._init = function(shape, attr) {
	var self = this;
	self.shape = shape;
	self.addChild(shape);
	var gameAttr;
	if (typeof(attr)==="object") {
		gameAttr = {
			attackVal: attr.attackVal,
			attackInterval: attr.attackInterval,
			attackRange: attr.attackRange,
			bulletType: attr.bulletType
		};
	} else {
		gameAttr = {
			attackVal: 0,
			attackInterval: 0,
			attackRange: 0,
			bulletType: 0
		}
	}
	gameAttr.cooling = 0;
	self.gameAttr = gameAttr;
	var rangeShape = new createjs.Shape();
	var g = rangeShape.graphics;
	g.beginStroke("#ccc");
	g.drawCircle(0,0,self.gameAttr.attackRange);
	self.rangeShape = rangeShape;
	self.addChild(rangeShape);
	if (self.gameAttr.bulletType==1) {
		var lineBullet = new createjs.Shape();
		self.addChild(lineBullet);
		self.lineBullet = lineBullet;
	};
	self.addEventListener("click", function(e) {
		console.log(1);
	})
}
/*{
	attackVal: 0,
	attackInterval: 10,
	attackRange: 0
}*/
ZxGame.Tower.prototype.find = function() {
	var self = this;
	var targetIndex = -1;
	for (var i = 0; i < ZxGame.monsters.children.length; i++) {
		var monster = ZxGame.monsters.children[i];
		var distance = Math.sqrt((monster.x-self.x)*(monster.x-self.x)+(monster.y-self.y)*(monster.y-self.y)) - monster.style.r;
		if (distance<=self.gameAttr.attackRange) {
			return i;
		};
	};
	return targetIndex;
}
ZxGame.Tower.prototype.attack = function() {
	var self = this;
	switch(self.gameAttr.bulletType) {
		case 0: {
			if (self.gameAttr.cooling<=0) {
				var targetIndex = self.find();
				var target = ZxGame.monsters.children[targetIndex];
				if (targetIndex>=0) {
					var rotation;
					var angle = 180*Math.atan(Math.abs((self.x-target.x)/(self.y-target.y)))/Math.PI;
					if(self.x>target.x) {
						if(self.y>target.y) {
							rotation = 360-angle;
						} else {
							rotation = 180+angle;
						}
					} else {
						if(self.y<target.y) {
							rotation = 180-angle;
						} else {
							rotation = angle;
						}
					}
					self.rotation = rotation;
					self.createBullet();
					self.gameAttr.cooling = self.gameAttr.attackInterval;
				};
			} else {
				self.gameAttr.cooling--;
			}
			break;
		}
		case 1: {
			var targetIndex = self.find();
			var target = ZxGame.monsters.children[targetIndex];
			if (targetIndex>=0) {
				self.addChild(self.lineBullet);
				var rotation;
				var angle = 180*Math.atan(Math.abs((self.x-target.x)/(self.y-target.y)))/Math.PI;
				if(self.x>target.x) {
					if(self.y>target.y) {
						rotation = 360-angle;
					} else {
						rotation = 180+angle;
					}
				} else {
					if(self.y<target.y) {
						rotation = 180-angle;
					} else {
						rotation = angle;
					}
				}
				var g = self.lineBullet.graphics;
				g.clear();
				g.beginStroke("rgba(152, 80, 158, 0.62)");
				g.setStrokeStyle(2);
				g.lineTo(target.x-self.x,target.y-self.y);
				g.lineTo(0,0);
				target.gameAttr.HP-=self.gameAttr.attackVal;
			} else {
				self.removeChild(self.lineBullet);
			}
			break;
		}
	}
}
ZxGame.Tower.prototype.createBullet = function() {
	var self = this;
	var bullet = new ZxGame.Bullet({
		damage: self.gameAttr.attackVal,
		speed: 5,
		maxDistance: self.gameAttr.attackRange*2,
		angle: self.rotation
	});
	bullet.x = self.x;
	bullet.y = self.y;
	ZxGame.bullets.addChild(bullet);
}