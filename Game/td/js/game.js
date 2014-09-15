var ZxGame = {};
ZxGame.config = {
	w: 900,
	h: 600,
	defaultFontStyle : "15px 微软雅黑",
	defaultTextColor : "#123456",
	defaultFPS: 50,
	showHPBar: true,
	gridColNum: 20,
	gridRowNum: 15,
	gridW: 35,
	startCoord: [0, 0],
	targetCoord: [19, 14]
}
ZxGame.config.monstersData = [[{
	fillColor: '#523',
	strokeColor: '#7c1',
	r: 5
}, {
	_HP: 100,
	maxHP: 100,
	speed: 2,
	money: 5,
	point: 5,
	damage: 1
}],[{
	fillColor: '#993',
	strokeColor: '#187',
	r: 7
}, {
	_HP: 200,
	maxHP: 200,
	speed: 1.5,
	money: 10,
	point: 10,
	damage: 2
}],[{
	fillColor: '#c83',
	strokeColor: '#0cc',
	r: 4
}, {
	_HP: 80,
	maxHP: 80,
	speed: 3,
	money: 10,
	point: 10,
	damage: 1
}],[{
	fillColor: '#14a',
	strokeColor: '#ca7',
	r: 10
}, {
	_HP: 1000,
	maxHP: 1000,
	speed: 1,
	money: 1000,
	point: 500,
	damage: 5
}]]
ZxGame.config.waveArr = [[0,100,0,100,0,100,0,100,0,100,0,100,1,100,1,100,1,100,1,100,3],[0,100,0,100,0,100,0,100,1,100,1,100,2,10,2,10,2,10,2,10,3],[0,100,0,100,0,100,0,100,0,100,0,100,1,10,1,10,1,10,1,10,3]];
// init
ZxGame.init = function () {
	var canvas = document.getElementById('stage');
	var stage = new createjs.Stage(canvas);
	canvas.width = ZxGame.config.w;
	canvas.height = ZxGame.config.h;
	ZxGame.canvas = canvas;
	ZxGame.stage = stage;
	stage.enableMouseOver(10);
	stage.mouseMoveOutside = true;
	ZxGame.reset();
}

// reset
ZxGame.reset = function () {
	var startBtn = new ZxGame.Button(200, 50, "开始", "24px 微软雅黑", "#ccc", "#655");
	ZxGame.stage.addChild(startBtn);
	startBtn.x = (ZxGame.canvas.width-200)/2;
	startBtn.y = 200;
	startBtn.addEventListener("click", function() {
		ZxGame.stage.removeChild(startBtn);
		ZxGame.start();
	})

	var ticker = new ZxGame.Ticker();
	ZxGame.update = {};
	ZxGame.update.stageUpdate = function() {
		ZxGame.stage.update();
	}
	ticker.addChild(ZxGame.update.stageUpdate);
	ZxGame.ticker = ticker;
	createjs.Ticker.setInterval(1000/ZxGame.config.defaultFPS);
	ZxGame.tick = function () {
		ZxGame.ticker.run();
	}
	createjs.Ticker.addEventListener("tick", ZxGame.tick);
}

// start
ZxGame.start = function () {
	var gameMap = new ZxGame.GameMap();
	gameMap.x = 10;
	gameMap.y = 10;
	gameMap.bg.addEventListener("click",ZxGame.gameMapClickHandle);
	ZxGame.stage.addChild(gameMap);
	ZxGame.gameMap = gameMap;

	var seleteTowerMenu = new createjs.Container();
	var towerShape1 = new createjs.Container();
	var towerShape = new createjs.Shape();
	var g = towerShape.graphics;
	g.beginFill("rgba(100,100,100,0.5)");
	g.drawRect(-ZxGame.config.gridW/2,-ZxGame.config.gridW/2,ZxGame.config.gridW,ZxGame.config.gridW);
	g.beginStroke("#3238cc");
	g.beginFill("#87723a");
	g.drawCircle(0, 0, 10);
	g.beginFill("yellow");
	g.drawRect(-2,-15,4,15);
	towerShape1.y = -ZxGame.config.gridW;
	towerShape1.addChild(towerShape);
	var towerShape2 = new createjs.Shape();
	var g = towerShape2.graphics;
	g.beginFill("rgba(100,100,100,0.5)");
	g.drawRect(-ZxGame.config.gridW/2,-ZxGame.config.gridW/2,ZxGame.config.gridW,ZxGame.config.gridW);
	g.beginFill("#1a4");
	g.drawPolyStar(0,0,10,3,0.6,30);//regx,regy,r,n,内嵌,angle
	g.drawPolyStar(0,0,10,3,0.6,210);
	towerShape2.y = ZxGame.config.gridW;
	seleteTowerMenu.addChild(towerShape1,towerShape2);
	towerShape1.addEventListener("rollover", function() {
		console.log(1);
	})
	towerShape1.addEventListener("click", function() {
		ZxGame.gameMap.removeChild(ZxGame.seleteTowerMenu);
		ZxGame.createTower(ZxGame.seleteTowerMenu.coord, 0);
		ZxGame.player.money-=100;
	})
	towerShape2.addEventListener("click", function() {
		ZxGame.gameMap.removeChild(ZxGame.seleteTowerMenu);
		ZxGame.createTower(ZxGame.seleteTowerMenu.coord, 1);
		ZxGame.player.money-=100;
	})
	ZxGame.seleteTowerMenu = seleteTowerMenu;

	// palyerbar
	var palyerBar = new createjs.Container();
	palyerBar.x = 720;
	ZxGame.stage.addChild(palyerBar);
	ZxGame.palyerBar = palyerBar;
	var player = new ZxGame.Player();
	ZxGame.player = player;

	var fpsTextArea = new ZxGame.FPSTextArea();
	fpsTextArea.x = 10;
	fpsTextArea.y = 550;
	ZxGame.stage.addChild(fpsTextArea);
	ZxGame.fpsTextArea = fpsTextArea;
	ZxGame.update.fpsTextAreaUpdate = function() {
		ZxGame.fpsTextArea.update();
	}
	ZxGame.ticker.addChild(ZxGame.update.fpsTextAreaUpdate);

	// monsters
	var monsters = new createjs.Container();
	monsters.clearList = [];
	monsters.gameUpdate = function() {
		var self = this;
		self.children.forEach(function(child) {
			child.update();
		})
		self.clearList.forEach(function(child, index) {
			self.removeChild(child);
		})
		self.clearList = [];
	}
	monsters.refreshPath = function() {
		var self = this;
		self.children.forEach(function(child) {
			child.refreshPath();
		})
	}
	ZxGame.gameMap.addChild(monsters);
	ZxGame.monsters = monsters;
	ZxGame.update.monstersUpdate = function() {
		ZxGame.monsters.gameUpdate();
	}

	// towers
	var towers = new createjs.Container();
	towers.gameUpdate = function() {
		var self = this;
		for (var i = 0; i < self.children.length; i++) {
			self.children[i].attack();
		};
	}
	ZxGame.gameMap.addChild(towers);
	ZxGame.towers = towers;
	ZxGame.update.towersUpdate = function() {
		ZxGame.towers.gameUpdate();
	}

	// bullets
	var bullets = new createjs.Container();
	bullets.gameUpdate = function() {
		var self = this;
		self.children.forEach(function(child, index, array){
			child.update();
		})
		self.clearList.forEach(function(child, index, array) {
			self.removeChild(child);
		})
		self.clearList = [];
	}
	bullets.clearList = [];
	ZxGame.gameMap.addChild(bullets);
	ZxGame.bullets = bullets;
	ZxGame.update.bulletsUpdate = function() {
		ZxGame.bullets.gameUpdate();
	}

	//bombs
	var bombs = new createjs.Container();
	bombs.clearList = [];
	bombs.gameUpdate = function() {
		var self = this;
		self.children.forEach(function(child, index, array) {
			if(child.currentFrame>child.totalFrame) {
				self.clearList.push(child);
			} else {
				child.update();
			}
		})
		self.clearList.forEach(function(child, index, array) {
			self.removeChild(child);
		})
		self.clearList = [];
	}
	ZxGame.gameMap.addChild(bombs);
	ZxGame.bombs = bombs;
	ZxGame.update.bombsUpdate = function() {
		ZxGame.bombs.gameUpdate();
	}

	var map = [];
	var w = 10;
	var h = 8;
	for (var i = 0; i < w; i++) {
		var array = [];
		for (var j = 0; j < h; j++) {
			array.push(0);
		};
		map.push(array); //0 无 >0 怪物 <0 建筑
	};
	ZxGame.map = map;
	ZxGame.path = ZxGame.gameMap.getPath();

	var menu = new ZxGame.Menu(500,300);
	menu.regX = 500/2;
	menu.y = 300;
	menu.x = ZxGame.canvas.width/2;
	menu.addEventListener("rollover", function() {})

	var bt = new ZxGame.Button(80,30,"下一波",ZxGame.config.defaultFontStyle,"#ccc","#e63")
	ZxGame.stage.addChild(bt);
	bt.x = 500;
	bt.y = 550;
	bt.addEventListener("click",function(){
		// ZxGame.stage.addChild(menu);
		if (ZxGame.monsterFactory.clock) {
			ZxGame.monsterFactory.nextWave();
		};
	})

	ZxGame.monsterFactory = new ZxGame.MonsterFactory(ZxGame.config.waveArr);
	ZxGame.update.monsterFactoryUpdate = function() {
		ZxGame.monsterFactory.run();
	}

	ZxGame.ticker.addChild(ZxGame.update.monstersUpdate);
	ZxGame.ticker.addChild(ZxGame.update.bulletsUpdate);
	ZxGame.ticker.addChild(ZxGame.update.towersUpdate);
	ZxGame.ticker.addChild(ZxGame.update.bombsUpdate);
	ZxGame.ticker.addChild(ZxGame.update.monsterFactoryUpdate);
	console.log("start");
}
// onload
window.addEventListener("load", function (event) {
	ZxGame.init();
})