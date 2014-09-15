
ZxGame.MonsterFactory = function(arr) {
	this._init(arr);
}
ZxGame.MonsterFactory.prototype._init = function(arr) {
	var self = this;
	self.monstersDataArr = [];
	self.delayDataArr = [];
	self.waveNum = 0;
	self.totalWave = arr.length;
	self.index = 0;
	self.delay = 0;
	self.clock = true;
	for (var i = 0; i < arr.length; i++) {
		var waveArr = arr[i];
		self.monstersDataArr.push([]);
		self.delayDataArr.push([]);
		for (var j = 0; j < waveArr.length; j+=2) {
			self.monstersDataArr[i].push(waveArr[j]);
			self.delayDataArr[i].push(waveArr[j+1]);
		}
	};
}
ZxGame.MonsterFactory.prototype.run = function() {
	var self = this;
	if (self.clock) {
		return;
	};
	if(self.delay!=0) {
		self.delay--;
	} else {
		ZxGame.createMonster(self.monstersDataArr[self.waveNum][self.index]);
		self.delay = self.delayDataArr[self.waveNum][self.index];
		self.index++;
		if (self.index>=self.monstersDataArr[self.waveNum].length) {
			self.clock = true;
			self.waveNum++;
			ZxGame.player.wave++;
		};
	}
}
ZxGame.MonsterFactory.prototype.nextWave = function() {
	var self = this;
	self.clock = false;
	self.index = 0;
	self.delay = 0;
}