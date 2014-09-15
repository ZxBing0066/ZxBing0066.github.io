
// ZxGame.characterMainfest = [
// 	{src:"./img/character/head.png", id:"head"},
// 	{src:"./img/character/body.png", id:"body"},
// 	{src:"./img/character/hand.png", id:"hand"},
// 	{src:"./img/character/arm_right.png", id:"armRight"},
// 	{src:"./img/character/hand_right.png", id:"handRight"},
// 	{src:"./img/character/arms.png", id:"arms"}
// ];
// var character = new ZxGame.Character(ZxGame.characterMainfest);
// character.preload(ZxGame.start);
// ZxGame.character = character;

// Character
ZxGame.Character = function (mainfest) {
	createjs.Container.call(this,null);
	this._init(mainfest);
}
ZxGame.Character.prototype = new createjs.Container();
ZxGame.Character.prototype._init = function (mainfest) {
	var self = this;
	self.mainfest = mainfest;
	self.preloadState = false;
	self.parts = {};
}
ZxGame.Character.prototype.preload = function (completeHandle,progressHandle,fileloadHandle) {
	var self = this;
	var characterPreload = new createjs.LoadQueue(false);
	characterPreload.addEventListener("complete",function (event) {
		self.preloadState = true;
		self.initPartsPosition();
		typeof(completeHandle)==="function"?completeHandle(event):function () {
			console.log("completeHandle is not a function!!!");
		};
	})
	characterPreload.addEventListener("progress",function (event) {
		typeof(progressHandle)==="function"?progressHandle(event):function () {
			console.log("progressHandle is not a function!!!");
		};
	})
	characterPreload.addEventListener("fileload",function (event) {
		self.parts[event.item.id] = new createjs.Bitmap(event.item.tag);
		typeof(fileloadHandle)==="function"?fileloadHandle(event):function () {
			console.log("fileloadHandle is not a function!!!");
		};
	})
	characterPreload.loadManifest(self.mainfest);
}
ZxGame.Character.prototype.initPartsPosition = function () {
	var self = this;
	if (!self.preloadState) {
		console.log("character mainfest is not preloaded!!!");
		return;
	};
	self.armsLinkHandContainer = new createjs.Container();
	self.armsLinkHandContainer.addChild(self.parts.arms);
	self.armsLinkHandContainer.addChild(self.parts.handRight);
	self.parts.handRight.regX = 3;
	self.parts.handRight.regY = 12;
	self.parts.arms.regX = 20;
	self.parts.arms.regY = 170;
	self.parts.arms.x = 15;
	self.parts.arms.y = 20;
	self.parts.arms.rotations = {
		attack: {
			from:60,
			to:90
		}
	};
	self.parts.arms.rotation = 90;

	self.handLinkArmContainer = new createjs.Container();
	self.handLinkArmContainer.addChild(self.parts.armRight);
	self.handLinkArmContainer.addChild(self.armsLinkHandContainer);
	self.parts.armRight.regX = 12;
	self.parts.armRight.regY = 0;
	self.armsLinkHandContainer.regX = 10;
	self.armsLinkHandContainer.regY = -3;
	self.armsLinkHandContainer.y = 35;
	self.armsLinkHandContainer.rotations = {
		attack: {
			from:-90,
			to:0
		}
	};

	self.armLinkBodyContainer = new createjs.Container();
	self.armLinkBodyContainer.addChild(self.parts.body);
	self.armLinkBodyContainer.addChild(self.handLinkArmContainer);
	self.parts.body.regX = 30;
	self.parts.body.regY = 32;
	self.handLinkArmContainer.regY = 3;
	self.handLinkArmContainer.x = -10;
	self.handLinkArmContainer.y = -10;
	self.handLinkArmContainer.rotations = {
		attack: {
			from:-120,
			to:0
		}
	};

	self.frameNums = {
		attack: 0
	}

	self.totalframes = {
		attack: {
			go: 20,
			back: 30
		}
	}

	self.addChild(self.armLinkBodyContainer);
}
ZxGame.Character.prototype.attack = function () {
	var self = this;
	var actionName = "attack";
	self.frameNums[actionName]++;
	if(self.frameNums[actionName]>=self.totalframes[actionName].go+self.totalframes[actionName].back) {
		self.frameNums[actionName] = 0;
	}
	self.rotate(self.parts.arms,actionName);
	self.rotate(self.armsLinkHandContainer,actionName);
	self.rotate(self.handLinkArmContainer,actionName);
}
ZxGame.Character.prototype.rotate = function (part,actionName) {
	var self = this;
	var currentFrameNum = self.frameNums[actionName];
	var totalframesGo = self.totalframes[actionName].go;
	var totalframesBack = self.totalframes[actionName].back;
	var rotation = part.rotations[actionName];
	if(currentFrameNum<totalframesGo) {
		part.rotation = rotation.from + (rotation.to - rotation.from)*currentFrameNum/totalframesGo;
	} else {
		part.rotation = rotation.to + (rotation.from - rotation.to)*(currentFrameNum-totalframesGo)/totalframesBack;
	}
}
