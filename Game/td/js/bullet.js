// bullet
ZxGame.Bullet = function(gameAttr) {
	createjs.Shape.call(this);
	this._init(gameAttr);
}
ZxGame.Bullet.prototype = new createjs.Shape();
ZxGame.Bullet.prototype._init = function(gameAttr) {
	var self = this;
	var g = self.graphics;
	g.beginFill("rgba(200,100,30,0.5)");
	g.drawCircle(0,0,2);
	self.gameAttr = {};
	self.gameAttr.damage = gameAttr.damage;
	self.gameAttr.speed = gameAttr.speed;
	self.gameAttr.maxDistance = gameAttr.maxDistance;
	self.gameAttr.angle = gameAttr.angle;
	self.totalDistance = 0;
}
ZxGame.Bullet.prototype.setTarget = function(target) {
	var self = this;
	self.target = target;
}
ZxGame.Bullet.prototype.update = function() {
	var self = this;
	self.hitTest();
	self.move();
}
ZxGame.Bullet.prototype.move = function() {
	var self = this;
	if (self.totalDistance>self.gameAttr.maxDistance) {
		self.remove();
	} else {
		switch(self.gameAttr.angle/90|0) {
			case 0:
				self.x+=Math.abs(Math.sin(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				self.y-=Math.abs(Math.cos(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				break;
			case 1:
				self.x+=Math.abs(Math.sin(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				self.y+=Math.abs(Math.cos(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				break;
			case 2:
				self.x-=Math.abs(Math.sin(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				self.y+=Math.abs(Math.cos(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				break;
			case 3:
				self.x-=Math.abs(Math.sin(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				self.y-=Math.abs(Math.cos(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				break;
			default:
				break;
		}
		self.totalDistance+=self.gameAttr.speed;
	}
}
ZxGame.Bullet.prototype.hitTest = function() {
	var self = this;
	var hitTarget;
	// ZxGame.monsters.children.some(function(child, index, array) {
	// 	if(Math.sqrt((child.x-self.x)*(child.x-self.x)+(child.y-self.y)*(child.y-self.y))<=child.style.r+2) {
	// 		hitTarget = child;
	// 	}
	// })
	var self = this;
	if (self.totalDistance>self.gameAttr.maxDistance) {
		self.remove();
	} else {
		var nextPoint = [];
		switch(self.gameAttr.angle/90|0) {
			case 0:
				nextPoint[0] = self.x+Math.abs(Math.sin(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				nextPoint[1] = self.y-Math.abs(Math.cos(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				break;
			case 1:
				nextPoint[0] = self.x+Math.abs(Math.sin(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				nextPoint[1] = self.y+Math.abs(Math.cos(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				break;
			case 2:
				nextPoint[0] = self.x-Math.abs(Math.sin(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				nextPoint[1] = self.y+Math.abs(Math.cos(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				break;
			case 3:
				nextPoint[0] = self.x-Math.abs(Math.sin(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				nextPoint[1] = self.y-Math.abs(Math.cos(Math.PI*self.gameAttr.angle/180))*self.gameAttr.speed;
				break;
			default:
				break;
		}
		var segment = new ZxGame.Segment([self.x,self.y],nextPoint);
		ZxGame.monsters.children.some(function(child, index, array) {
			var intersectionPoints = segment.intersectWithCircle({x:child.x,y:child.y,r:child.style.r});
			if(intersectionPoints.length>0) {
				if (intersectionPoints.length==1) {
					self.x = intersectionPoints[0][0];
					self.y = intersectionPoints[0][1];
				} else {
					self.x = (intersectionPoints[0][0]+intersectionPoints[1][0])/2;
					self.y = (intersectionPoints[0][1]+intersectionPoints[1][1])/2;
				}
				hitTarget = child;
				return true;
			}
		})
		if(hitTarget) {
			hitTarget.gameAttr.HP-=self.gameAttr.damage;
			self.remove();
		} else {
			self.x = nextPoint[0];
			self.y = nextPoint[1];
			self.totalDistance+=self.gameAttr.speed;
		}
	}

	
}
ZxGame.Bullet.prototype.remove = function() {
	var self = this;
	ZxGame.bullets.clearList.push(self);
}

ZxGame.Line = function(point,angle) {
	var k = Math.tan(angle*Math.PI/180);
	var a = point[0];
	var b = point[1];
	//y = k(x-a)+b  y = kx-ka+b kx-y-ka+b=0
	this.x = function(y) {
		return (y-b)/k+a
	}
	this.y = function(x) {
		return k*(x-a)+b
	}
	this.pointDistance = function(point) {
		var x0 = point[0];
		var y0 = point[1];
		return Math.abs(k*x0-y0-k*a+b)/Math.sqrt(1+k*k);
	}
}
// ZxGame.Segment = function(line, range) {//线段
// 	this.line = line;
// 	this.range = range;
// }
ZxGame.Segment = function(point1, point2) {
	var angle = Math.atan((point1[0]-point2[0])/(point1[1]-point2[1]));
	var k = Math.tan(angle);
	var a = point1[0];
	var b = point1[1];
	var range = [Math.min(point1[0],point2[0]),Math.max(point1[0],point2[0])];
	this.x = function(y) {
		return (y-b)/k+a
	}
	this.y = function(x) {
		return k*(x-a)+b
	}
	this.pointDistance = function(point) {
		var x0 = point[0];
		var y0 = point[1];
		return Math.abs(k*x0-y0-k*a+b)/Math.sqrt(1+k*k);
	}
	this.intersectWithCircle = function(circle) {
		if(this.pointDistance([circle.x,circle.y])>circle.r) {
			return [];
		} else {
			//y = k(x-a)+b  y = kx-ka+b kx-y-ka+b=0
			var a1 = k;
			var b1 = -k*a+b;
			var r = circle.r;
			var a2 = circle.x;
			var b2 = circle.y;
			//y = a1*x+b1
			//(x-a2)*(x-a2)+(y-b2)*(y-b2) = r*r
			var b3 = b1-b2
			//x*x-2*a2*x+a2*a2+a1*a1*x*x+2*b3*a1*x+b3*b3 = r*r
			var a4 = Math.sqrt(1+a1*a1);
			var b4 = b3*a1-a2;
			var c = r*r-a2*a2-b3*b3;
			//a4*a4*x*x+2*b4*x = c
			// (a4*x+b4/a4)*(a4*x+b4/a4)-(b4/a4)*(b4/a4) = c
			var x0 = (Math.sqrt(c+(b4/a4)*(b4/a4))-b4/a4)/a4;
			var x1 = (-Math.sqrt(c+(b4/a4)*(b4/a4))-b4/a4)/a4;
			var y0 = k*(x0-a)+b;
			var y1 = k*(x1-a)+b;
			if((x0<=range[1]&&x0>=range[0])&&(x1<=range[1]&&x1>=range[0])) {
				return [[x0,y0],[x1,y1]];
			} else if(x0<=range[1]&&x0>=range[0]) {
				return [[x0,y0]];
			} else if(x1<=range[1]&&x1>=range[0]) {
				return [[x1,y1]];
			}
			// if((x<=range[1]&&x>=range[0])||(-x<=range[1]&&-x>=range[0])) {
			// 	return true
			// }
			return [];
		}
	}
}