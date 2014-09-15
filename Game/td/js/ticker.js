// Ticker
ZxGame.Ticker = function () {
	this._init();
}
ZxGame.Ticker.prototype._init = function () {
	var self = this;
	self.childs = [];
}
ZxGame.Ticker.prototype.addChild = function () {
	var self = this;
	for (var i = 0; i < arguments.length; i++) {
		typeof(arguments[i])==="function"?self.childs.push(arguments[i]):function () {
			console.log(arguments[i],"is not a function!!!");
		};
	};
}
ZxGame.Ticker.prototype.removeChild = function (argument) {
	var self = this;
	if(typeof(argument)==="number") {
		self.removeChildByIndex(argument);
	} else if (typeof(argument)==="function") {
		self.removeChildByReference(argument);
	} else {
		console.log("type is wrong");
	}
}
ZxGame.Ticker.prototype.removeChildByReference = function (child) {
	var self = this;
	var index = self.getChildIndex(child);
	if (index!==-1) {
		self.childs.splice(index,1);
	} else {
		console.log(child,"is not in the ticker!!!");
	}
}
ZxGame.Ticker.prototype.removeChildByIndex = function (index) {
	var self = this;
	if (index>-1&&index<self.childs.length) {
		self.childs.splice(index,1);
	} else {
		console.log(index,"is not in the ticker!!!");
	}
}
ZxGame.Ticker.prototype.clear = function () {
	var self = this;
	self.childs = [];
}
ZxGame.Ticker.prototype.getChildIndex = function (child) {
	var self = this;
	for (var i = 0; i < self.childs.length; i++) {
		if(self.childs[i]===child) {
			return i;
		}
	};
	return -1;
}
ZxGame.Ticker.prototype.run = function () {
	var self = this;
	for (var i = 0; i < self.childs.length; i++) {
		typeof(self.childs[i])==="function"?(function () {
			self.childs[i]();
		})():(function () {
			console.log(self.childs[i],"is not a function!!!");
		})();
	};
}
