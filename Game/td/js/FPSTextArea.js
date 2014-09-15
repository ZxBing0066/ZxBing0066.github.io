// FPSTextArea
ZxGame.FPSTextArea = function() {
	createjs.Text.call(this,null);
	this._init();
}
ZxGame.FPSTextArea.prototype = new createjs.Text();
ZxGame.FPSTextArea.prototype._init = function() {
	var self = this;
	self.font = "15px 微软雅黑";
	self.frame = 0;
	self.time = new Date;
}
ZxGame.FPSTextArea.prototype.update = function() {
	var self = this;
	self.frame++;
	if(self.frame>=10) {
		var time = new Date;
		var interval = time - self.time;
		var fps = self.frame*1000/interval;
		self.text = fps.toFixed(2);
		self.frame = 0;
		self.time = time;
	}
}
