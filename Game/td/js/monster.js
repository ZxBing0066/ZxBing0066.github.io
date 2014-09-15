// monster
ZxGame.Monster = function(style, attr) {
	createjs.Container.call(this);
	this._init(style, attr);
}
ZxGame.Monster.prototype = new createjs.Container();
ZxGame.Monster.prototype._init = function(style, attr) {
	var self = this;
	self._setStyle(style);
	self._setGameAttr(attr);
	self.path = ZxGame.path;
	self.preCoord = ZxGame.config.startCoord;
	ZxGame.gameMap.map[self.preCoord[0]][self.preCoord[1]]++;
	self.findNextCoord();
	ZxGame.gameMap.map[self.nextCoord[0]][self.nextCoord[1]]++;
	Object.defineProperty(self.gameAttr,"HP",{set: function(val) {
		val>0||self.die();
		val<0?val=0:null;
		this._HP = val;
		val>0&&ZxGame.config.showHPBar&&self._updateHPBar();
	}, get: function() {
		return this._HP;
	}})
	ZxGame.config.showHPBar&&this._updateHPBar();
}
ZxGame.Monster.prototype._setStyle = function(style) {
	var self = this;
	self.style = style;
	self.removeChild(self.shape);
	var shape = new createjs.Shape();
	var g = shape.graphics;
	g.beginFill(style.fillColor);
	g.beginStroke(style.strokeColor);
	g.setStrokeStyle(1);
	g.drawCircle(0,0,style.r);
	g.closePath();
	g.beginFill('#fff');
	g.beginStroke();
	g.drawCircle(-style.r/3,-2*style.r/3,1);
	g.beginFill('#fff');
	g.beginStroke();
	g.drawCircle(style.r/3,-2*style.r/3,1);
	self.Shape = shape;
	self.addChild(shape);
}
ZxGame.Monster.prototype._setGameAttr = function(attr) {
	var self = this;
	self.gameAttr = {};
	if (typeof(attr)==="object") {
		self.gameAttr._HP = attr._HP;
		self.gameAttr.maxHP = attr.maxHP;
		self.gameAttr.speed = attr.speed;
		self.gameAttr.money = attr.money;
		self.gameAttr.point = attr.point;
		self.gameAttr.damage = attr.damage;
	}
/*	
	{
		_HP:100,
		maxHP: 100,
		speed: 5,
		damage: 2
	}
*/
}
ZxGame.Monster.prototype._updateHPBar = function() {
	var self = this;
	self.removeChild(self._HPBar);
	var _HPBar = new createjs.Shape();
	var g = _HPBar.graphics;
	var r = self.style.r;
	var _y = r+6;
	var _x = r;
	g.beginStroke('#000');
	g.beginFill('#fff');
	g.setStrokeStyle(1);
	g.drawRect(-_x,-_y,r*2,3);
	g.beginStroke();
	g.beginFill('red');
	g.drawRect(-_x,-_y,r*2*self.gameAttr.HP/self.gameAttr.maxHP,3);
	self.addChild(_HPBar);
	self._HPBar = _HPBar;
}
ZxGame.Monster.prototype.showHPBar = function() {
	this._updateHPBar();
}
ZxGame.Monster.prototype.hideHPBar = function() {
	this.removeChild(this._HPBar);
}
ZxGame.Monster.prototype.die = function() {
	var self = this;
	if (self.died) {
		return;
	}
	self.died = true;
	ZxGame.player.money+=self.gameAttr.money;
	ZxGame.player.point+=self.gameAttr.point;
	ZxGame.monsters.clearList.push(self);
	var bomb = new ZxGame.Bomb({
		color: ZxGame.colorToRgb(self.style.fillColor),
		r: self.style.r
	});
	bomb.x = self.x;
	bomb.y = self.y;
	ZxGame.gameMap.map[self.preCoord[0]][self.preCoord[1]]--;
	ZxGame.gameMap.map[self.nextCoord[0]][self.nextCoord[1]]--;
	ZxGame.bombs.addChild(bomb);
}
ZxGame.Monster.prototype.update = function() {
	var self = this;
	if (self.gameAttr.HP>0) {
		self.move();
	}
}
ZxGame.Monster.prototype.move = function() {
	var self = this;
	var distance = self.gameAttr.speed;
	while(distance>0) {
		var direction = self.getDirection();
		var arrived = false;
		switch(direction) {
			case 0: {
				if (distance<=Math.abs(self.y-(self.nextCoord[1]*ZxGame.config.gridW+ZxGame.config.gridW/2))) {
					self.y -= distance;
					distance = 0;
				} else {
					distance -= Math.abs(self.y-(self.nextCoord[1]*ZxGame.config.gridW+ZxGame.config.gridW/2));
					self.y = self.nextCoord[1]*ZxGame.config.gridW+ZxGame.config.gridW/2;
					arrived = true;
				}
				break;
			}
			case 1: {
				if (distance<=Math.abs(self.x-(self.nextCoord[0]*ZxGame.config.gridW+ZxGame.config.gridW/2))) {
					self.x += distance;
					distance = 0;
				} else {
					distance -= Math.abs(self.x-(self.nextCoord[0]*ZxGame.config.gridW+ZxGame.config.gridW/2));
					self.x = self.nextCoord[0]*ZxGame.config.gridW+ZxGame.config.gridW/2;
					arrived = true;
				}
				break;
			}
			case 2: {
				if (distance<=Math.abs(self.y-(self.nextCoord[1]*ZxGame.config.gridW+ZxGame.config.gridW/2))) {
					self.y += distance;
					distance = 0;
				} else {
					distance -= Math.abs(self.y-(self.nextCoord[1]*ZxGame.config.gridW+ZxGame.config.gridW/2));
					self.y = self.nextCoord[1]*ZxGame.config.gridW+ZxGame.config.gridW/2;
					arrived = true;
				}
				break;
			}
			case 3: {
				if (distance<=Math.abs(self.x-(self.nextCoord[0]*ZxGame.config.gridW+ZxGame.config.gridW/2))) {
					self.x -= distance;
					distance = 0;
				} else {
					distance -= Math.abs(self.x-(self.nextCoord[0]*ZxGame.config.gridW+ZxGame.config.gridW/2));
					self.x = self.nextCoord[0]*ZxGame.config.gridW+ZxGame.config.gridW/2;
					arrived = true;
				}
				break;
			}
			default:
				break;
		}
		if (arrived) {
			if(self.nextCoord[0]===ZxGame.config.targetCoord[0]&&self.nextCoord[1]===ZxGame.config.targetCoord[1]) {
				ZxGame.monsterArrive(self);
				ZxGame.gameMap.map[self.preCoord[0]][self.preCoord[1]]--;
				break;
			}
			ZxGame.gameMap.map[self.preCoord[0]][self.preCoord[1]]--;
			self.preCoord = self.nextCoord;
			self.findNextCoord();
			ZxGame.gameMap.map[self.nextCoord[0]][self.nextCoord[1]]++;
		};
		direction = self.getDirection();
		self.rotation = 90*direction;
	}
}
ZxGame.Monster.prototype.getDirection = function() {
	var self = this;
	var direction = ""; // 0 上 1 右 2下 3 左
	if (self.preCoord[0]>self.nextCoord[0]) {
		direction = 3;
	} else if (self.preCoord[0]<self.nextCoord[0]) {
		direction = 1;
	} else if (self.preCoord[1]>self.nextCoord[1]) {
		direction = 0;
	} else if (self.preCoord[1]<self.nextCoord[1]) {
		direction = 2;
	}
	return direction;
}
ZxGame.Monster.prototype.findNextCoord = function() {
	var self = this;
	function getIndexInPath(coord, path) {
		for (var i = 0; i < path.length; i++) {
			if (coord[0]===path[i][0]&&coord[1]===path[i][1]) {
				return i;
			};
		};
		return -1;
	}
	var nextCoord = self.path[getIndexInPath(self.preCoord, self.path)+1];
	self.nextCoord = nextCoord;
}
ZxGame.Monster.prototype.refreshPath = function() {
	var self = this;
	self.path = ZxGame.findPath(ZxGame.gameMap.map, ZxGame.config.gridColNum, ZxGame.config.gridRowNum, self.nextCoord[0], self.nextCoord[1], ZxGame.config.targetCoord[0], ZxGame.config.targetCoord[1]);
}