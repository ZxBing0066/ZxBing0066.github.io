var canvas;
var stage;
var config = {
	mFontStyle : "20px 微软雅黑",
	mTextColor: "#12356c",
	mFPS: 50
}

var whee;    // 展示位置的按钮
var bar1;	 // 蓝色棒的展示
var bar2;	 // 绿色棒的展示
var bar3;	 // 红色棒的展示

var arm1;	 // 蓝色棒的容器，用来放置子对象
var arm2;	 // 绿色棒的容器，用来放置子对象

var text;
var container1;

var characterO = {};
var preload
var character;
var menu;

var ZxGame = {
	canvas:null,
	stage:null,
	preload:null,
	character: null,
	UI:null,
	menu: null,
	config: {
		w: 800,
		h: 600,
		defaultFontStyle : "20px 微软雅黑",
		defaultTextColor : "#123456",
		defaultFPS: 50
	}
}

function reset () {
	canvas = document.getElementById('stage');
	stage = new createjs.Stage(canvas);
	canvas.width = 800;
	canvas.height = 600;

	var characterManifest = [
		{src:"./img/character/head.png", id:"head"},
		{src:"./img/character/body.png", id:"body"},
		{src:"./img/character/hand.png", id:"hand"},
		{src:"./img/character/arm_right.png", id:"armRight"},
		{src:"./img/character/hand_right.png", id:"handRight"},
		{src:"./img/character/arms.png", id:"arms"},
	];
	character = new Character(characterManifest);
	character.preload(gameStart);

}

function gameStart () {
	var bar = new createjs.Shape();
	text = new createjs.Text('hehe',config.mFontStyle,config.mTextColor);
	text.x = 10;
	text.y = 10;
	var rect = new createjs.Shape();
	rectG = rect.graphics;
	rectG.beginFill("#543");
	rectG.drawRect(0,0,10,10);
	container1 = new createjs.Container();
	container1.addChild(text);
	container1.addChild(rect);

	whee = document.getElementById("whee");

	bar3 = new createjs.Shape();
	var g = bar3.graphics;
	g.beginFill("#8B2222");
	g.drawRect(-3,-3,6,130);
	bar3.regY = 20;
	bar3.y = 105;

	bar2 = new createjs.Shape();
	g = bar2.graphics;
	g.beginFill("#228B22");
	g.drawRect(-5,-5,10,110);

	bar1 = new createjs.Shape();
	g = bar1.graphics;
	g.beginFill("#22228B");
	g.drawRect(-8,-8,16,80);

	arm2 = new createjs.Container();
	arm2.addChild(bar2);
	arm2.addChild(bar3);
	arm2.regY = 20;
	arm2.y = 72;

	arm1 = new createjs.Container();
	arm1.addChild(bar1);
	arm1.addChild(arm2);
	arm1.x = canvas.width/2;
	arm1.y = canvas.height/2;
	stage.addChild(arm1);

	stage.addChild(container1);

	var characterContainer = character.container;
	characterContainer.x = canvas.width/2;
	characterContainer.y = canvas.height/2;
	character.initPartsPosition();
	stage.addChild(characterContainer);

	menu = new Menu(500,300);
	var cl = new CloseBtn();
	stage.addChild(cl);
	cl.addEventListener("click",function(){
		stage.addChild(menu);
	})
	menu.regX = 500/2;
	menu.x = canvas.width/2;
	menu.y = 100;

	createjs.Ticker.setInterval(1000/config.mFPS);		// 单位：毫秒，就是50fps
	createjs.Ticker.addEventListener("tick", tick);
	// gameUpdate();
}

function tick () {
	arm1.rotation += 1.9;
	arm2.rotation += -2.7;
	bar3.rotation += 4.4;

	container1.rotation +=2;

	character.attack();

	gameUpdate();
}

function gameUpdate () {
	stage.update();
}

function Character (manifest) {
	var self = this;
	self.manifest = manifest;
	self.container = new createjs.Container();
	self.parts = {};
	self.preload = function (completeHandle) {
		var characterPreload = new createjs.LoadQueue(false);
		characterPreload.addEventListener("progress", function (event) {
		});
		characterPreload.addEventListener("fileload", function (event) {
			var item = event.item;
			self.parts[item.id] = new createjs.Bitmap(item.tag);
		})
		characterPreload.addEventListener("complete", function (event) {
			completeHandle();
		});
		characterPreload.loadManifest(self.manifest);
	}
	self.initPartsPosition = function () {
		self.armsLinkHandContainer = new createjs.Container();
		self.armsLinkHandContainer.addChild(self.parts.arms);
		self.armsLinkHandContainer.addChild(self.parts.handRight);
		self.parts.handRight.regX = 3;
		self.parts.handRight.regY = 12;
		self.parts.arms.regX = 20;
		self.parts.arms.regY = 170;
		self.parts.arms.x = 15;
		self.parts.arms.y = 20;
		self.parts.arms.rotation = 90;

		self.handLinkArmContainer = new createjs.Container();
		self.handLinkArmContainer.addChild(self.parts.armRight);
		self.handLinkArmContainer.addChild(self.armsLinkHandContainer);
		self.parts.armRight.regX = 12;
		self.parts.armRight.regY = 0;
		self.armsLinkHandContainer.regX = 10;
		self.armsLinkHandContainer.regY = -3;
		self.armsLinkHandContainer.y = 35;

		self.armLinkBodyContainer = new createjs.Container();
		self.armLinkBodyContainer.addChild(self.parts.body);
		self.armLinkBodyContainer.addChild(self.handLinkArmContainer);
		self.parts.body.regX = 30;
		self.parts.body.regY = 32;
		self.handLinkArmContainer.regY = 3;
		self.handLinkArmContainer.x = -10;
		self.handLinkArmContainer.y = -10;

		// self.container.addChild(self.armLinkBodyContainer);
	}
	self.attack = function () {
		var attackInterval = 1000;
		rotate(self.parts.arms,60,90,attackInterval/2);
		// rotate(self.armsLinkHandContainer,-90,0,attackInterval/2);
		// rotate(self.handLinkArmContainer,-120,0,attackInterval/2);
	}
	function rotate (part,minAngle,maxAngle,roundTime) {
		var offAngle = (maxAngle - minAngle)/(roundTime/(1000/config.mFPS));
		part.rotation>maxAngle?part.rotateDirection = false:null;
		part.rotation<minAngle?part.rotateDirection = true:null;
		part.rotateDirection?part.rotation+=offAngle:part.rotation-=offAngle;
	}
}
var Menu = function (w,h) {
	createjs.Container.call(this,null);
	this.init(w,h);
}
Menu.prototype = new createjs.Container();
Menu.prototype.init = function (w,h,titleText) {
	var self = this;
	self.w = w;
	self.h = h;

	var bg = new createjs.Shape();
	var bgG = bg.graphics;
	bgG.beginStroke("rgba(120,205,55,0.5)");
	bgG.beginFill("rgba(255,255,255)");
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

	var closeBtn = new CloseBtn();
	closeBtn.addEventListener("click", function () {
		console.log(1);
	})
	closeBtn.x = w;
	self.addChild(closeBtn);
	self.closeBtn = closeBtn;
}
var CloseBtn = function() {
	createjs.Container.call(this,null);
	this.init();
}
CloseBtn.prototype = new createjs.Container();
CloseBtn.prototype.init = function () {
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

var skillList = {

}

reset();