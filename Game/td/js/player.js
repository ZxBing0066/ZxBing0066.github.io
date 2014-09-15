ZxGame.Player = function () {
	this._init();
}
ZxGame.Player.prototype._init = function() {
	var self = this;
	self._money = 1000;
	self._point = 0;
	self._wave = 0;
	self._life = 20;
	var moneyText = new createjs.Text();
	var pointText = new createjs.Text();
	var waveText = new createjs.Text();
	var lifeText = new createjs.Text();
	moneyText.x = 0;
	moneyText.y = 100;
	pointText.x = 0;
	pointText.y = 130;
	waveText.x = 0;
	waveText.y = 160;
	lifeText.x = 0;
	lifeText.y = 190;

	ZxGame.palyerBar.addChild(moneyText, pointText, waveText, lifeText);
	self._moneyText = moneyText;
	self._pointText = pointText;
	self._waveText = waveText;
	self._lifeText = lifeText;
	Object.defineProperties(self, {
		money: {
			get: function() {
				return self._money;
			}, set: function(val) {
				self._money = val;
				self._moneyText.text = "金钱："+val;
			}
		},
		point: {
			get: function() {
				return self._point;
			}, set: function(val) {
				self._point = val;
				self._pointText.text = "分数："+val;
			}
		},
		wave: {
			get: function() {
				return self._wave;
			}, set: function(val) {
				self._wave = val;
				self._waveText.text = "波数："+val;
			}
		},
		life: {
			get: function() {
				return self._life;
			}, set: function(val) {
				self._life = val;
				self._lifeText.text = "剩余生命："+val;
			}
		},
	})
	self.money = self._money;
	self.point = self._point;
	self.wave = self._wave;
	self.life = self._life;
}