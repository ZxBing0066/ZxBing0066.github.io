ZxGame.colorToRgb = function(color) {
	color = color.substr(1);
	var r,g,b;
	if (color.length===3) {
		r = color.substr(0,1);
		r = r + "" + r;
		g = color.substr(1,1);
		g = g + "" + g;
		b = color.substr(2,1);
		b = b + "" + b;
	} else if (color.length===6) {
		r = color.substr(0,2);
		g = color.substr(2,2);
		b = color.substr(4,2);
	};
	r = parseInt(r,16);
	g = parseInt(g,16);
	b = parseInt(b,16);
	return [r,g,b];
}

ZxGame.createMonster = function(index) {
	var monster = new ZxGame.Monster(ZxGame.config.monstersData[index][0], ZxGame.config.monstersData[index][1]);
	monster.x = ZxGame.config.startCoord[0]*ZxGame.config.gridW+ZxGame.config.gridW/2;
	monster.y = ZxGame.config.startCoord[1]*ZxGame.config.gridW+ZxGame.config.gridW/2;
	ZxGame.monsters.addChild(monster);
}

ZxGame.monsterArrive = function(monster) {
	console.log(monster);
	ZxGame.player.life-=monster.gameAttr.damage;
	ZxGame.monsters.removeChild(monster);
}

ZxGame.createTower = function(coord, type) {
	// var shape = new createjs.Shape();
	// var g = shape.graphics;
	// g.beginStroke("#3238cc");
	// g.beginFill("#87723a");
	// g.drawCircle(0, 0, 10);
	// g.beginFill("yellow");
	// g.drawRect(-2,-15,4,15);
	// var attr = {
	// 	attackVal: 1,
	// 	attackInterval: 3,
	// 	attackRange: 50,
	// 	bulletType: 0
	// }
	var shape, attr;
	switch(type) {
		case 0: {
			shape = new createjs.Shape();
			var g = shape.graphics;
			g.beginStroke("#3238cc");
			g.beginFill("#87723a");
			g.drawCircle(0, 0, 10);
			g.beginFill("yellow");
			g.drawRect(-2,-15,4,15);
			attr = {
				attackVal: 1,
				attackInterval: 3,
				attackRange: 50,
				bulletType: 0
			}
			break;
		}
		case 1: {
			shape = new createjs.Shape();
			var g = shape.graphics;
			g.beginFill("#1a4");
			g.drawPolyStar(0,0,10,3,0.6,30);//regx,regy,r,n,内嵌,angle
			g.drawPolyStar(0,0,10,3,0.6,210);
			attr = {
				attackVal: 1,
				attackRange: 100,
				bulletType: 1
			}
			break;
		}
	}
	var tower = new ZxGame.Tower(shape, attr);
	ZxGame.towers.addChild(tower);
	tower.x = (coord[0]+0.5)*ZxGame.config.gridW;
	tower.y = (coord[1]+0.5)*ZxGame.config.gridW;
}

ZxGame.pause = function() {
	ZxGame.ticker.clear();
	ZxGame.ticker.addChild(ZxGame.update.stageUpdate, ZxGame.update.fpsTextAreaUpdate);
}
ZxGame.continue = function() {
	ZxGame.ticker.addChild(ZxGame.update.bombsUpdate, ZxGame.update.bulletsUpdate, ZxGame.update.monsterFactoryUpdate, ZxGame.update.monstersUpdate, ZxGame.update.towersUpdate);
}

ZxGame.gameMapClickHandle = function(e) {
	ZxGame.gameMap.addChild(ZxGame.seleteTowerMenu);
	var x = e.localX;
	var y = e.localY;
	var coord = [];
	coord[0] = x/ZxGame.config.gridW|0;
	coord[1] = y/ZxGame.config.gridW|0;
	ZxGame.seleteTowerMenu.x = (0.5+coord[0])*ZxGame.config.gridW;
	ZxGame.seleteTowerMenu.y = (0.5+coord[1])*ZxGame.config.gridW;
	ZxGame.seleteTowerMenu.coord = coord;
	if (ZxGame.gameMap.map[coord[0]][coord[1]]===0) {
		ZxGame.gameMap.map[coord[0]][coord[1]] = -1;
		if (ZxGame.gameMap.getPath()==-1) {
			ZxGame.gameMap.map[coord[0]][coord[1]] = 0;
			return;
		};
		// ZxGame.seleteTowerMenu = seleteTowerMenu;
		ZxGame.path = ZxGame.gameMap.getPath();
		ZxGame.mapChanged = true;
		ZxGame.monsters.refreshPath();
	};
}

ZxGame.hitTest = function(figure1, figure2) {
	//未完善
	if(figure1.type==="circle"&&figure2.type==="circle") {
		return (figure1.x-figure2.x)*(figure1.x-figure2.x)+(figure1.y-figure2.y)*(figure1.y-figure2.y)<=(figure1.r+figure2.r)*(figure1.r+figure2.r);
	}
	if (figure1.type==="circle"&&figure2.type==="rect") {
		var dx = Math.abs(figure1.x-figure2.x);
		var dy = Math.abs(figure1.y-figure2.y);
		var hypotenuse = Math.sqrt(dx*dx+dy*dy);
		var angle = Math.asin(dy/hypotenuse)*180/Math.PI;
		angle = angle-figure2.rotation;
		dx = Math.abs(hypotenuse*Math.cos(angle*Math.PI/180));
		dy = Math.abs(hypotenuse*Math.sin(angle*Math.PI/180));
		dx -= Math.min(dx,figure2.w/2);
		dy -= Math.min(dy,figure2.h/2);
		console.log(angle);
		console.log(dx);
		console.log(dy);
		return dx*dx+dy*dy<=figure1.r*figure1.r;
	}
	if (figure1.type==="rect"&&figure2.type==="circle") {
		var dx = Math.abs(figure2.x-figure1.x);
		var dy = Math.abs(figure2.y-figure1.y);
		var hypotenuse = Math.sqrt(dx*dx+dy*dy);
		var angle = Math.asin(dy/hypotenuse);
		angle = angle-figure1.rotation;
		dx = Math.abs(hypotenuse*Math.cos(angle*Math.PI/180));
		dy = Math.abs(hypotenuse*Math.sin(angle*Math.PI/180));
		dx -= Math.min(Math.abs(figure2.x-figure1.x),figure1.w/2);
		dy -= Math.min(Math.abs(figure2.y-figure1.y),figure1.h/2);
		return dx*dx+dy*dy<=figure2.r*figure2.r;
	}
	if (figure1.type==="rect"&&figure2.type==="rect") {
		return Math.abs(figure1.x-figure2.x)<=(figure1.w/2+figure2.w/2)&&Math.abs(figure1.y-figure2.y)<=(figure1.h/2+figure2.h/2);
	}
}

/* 圆 矩形 碰撞测试
	var circle1 = new createjs.Shape();
	var g = circle1.graphics;
	g.beginFill("blue");
	g.drawCircle(0,0,10);
	Object.defineProperty(circle1,"cfg",{
		get: function() {
			return {
				type: "circle",
				r: 10,
				x: this.x,
				y: this.y
			}
		}
	})
	circle1.x = 100;
	circle1.y = 100;

	var circle2 = new createjs.Shape();
	var g = circle2.graphics;
	g.beginFill("#654");
	g.drawCircle(0,0,20);
	Object.defineProperty(circle2,"cfg",{
		get: function() {
			return {
				type: "circle",
				r: 20,
				x: this.x,
				y: this.y
			}
		}
	})
	circle2.x = 150;
	circle2.y = 100;

	var rect1 = new createjs.Shape();
	var g = rect1.graphics;
	g.beginFill("#572");
	g.drawRect(-20,-10,40,20);
	Object.defineProperty(rect1, "cfg", {
		get: function() {
			return {
				type: "rect",
				w: 40,
				h: 20,
				x: this.x,
				y: this.y
			}
		}
	})
	rect1.x = 200;
	rect1.y = 100;

	var rect2 = new createjs.Shape();
	var g = rect2.graphics;
	g.beginFill("#138");
	g.drawRect(-20,-10,40,20);
	Object.defineProperty(rect2, "cfg", {
		get: function() {
			return {
				type: "rect",
				w: 40,
				h: 20,
				x: this.x,
				y: this.y
			}
		}
	})
	rect2.x = 250;
	rect2.y = 100;

	circle1.addEventListener("mousedown", function() {
		drugFigure = circle1;
		ZxGame.stage.addChild(drugFigure);
	})
	circle2.addEventListener("mousedown", function() {
		drugFigure = circle2;
		ZxGame.stage.addChild(drugFigure);
	})
	rect1.addEventListener("mousedown", function() {
		drugFigure = rect1;
		ZxGame.stage.addChild(drugFigure);
	})
	rect2.addEventListener("mousedown", function() {
		drugFigure = rect2;
		ZxGame.stage.addChild(drugFigure);
	})

	ZxGame.stage.addChild(circle1, circle2, rect1, rect2);
	var drugFigure;
	var shapes = [circle1, circle2, rect1, rect2];
	function drug(e) {
		if(drugFigure) {
			drugFigure.x = e.localX;
			drugFigure.y = e.localY;
			shapes.forEach(function(shape, index) {
				if (shape!=drugFigure&&ZxGame.hitTest(drugFigure.cfg, shape.cfg)) {
					console.log("撞");
				};
			})
		}
	}
	ZxGame.stage.addEventListener("pressmove", drug);
	ZxGame.stage.addEventListener("mouseup", function() {
		drugFigure = undefined;
	})
*/

/* 线段  圆  交点
	var line = new createjs.Shape();
	var g = line.graphics;
	g.beginFill("#a35");
	g.beginStroke("#543");
	g.moveTo(0,0);
	g.lineTo(50,50);
	g.lineTo(0,0);
	line.x = 100;
	line.y = 100;
	line.l = new ZxGame.Segment([line.x,line.y], [line.x+50,line.y+50]);
	ZxGame.stage.addChild(line);
	var circle = new createjs.Shape();
	var g = circle.graphics;
	g.beginFill("#654");
	g.drawCircle(0,0,10);
	ZxGame.stage.addChild(circle);
	ZxGame.stage.addEventListener("pressmove", drug);
	function drug(e) {
		circle.x = e.localX;
		circle.y = e.localY;
		console.log(line.l.intersectWithCircle({x:circle.x,y:circle.y,r:10}));
	}
*/