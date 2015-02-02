var drugDom = document.getElementsByClassName('drugable');
var ZxDrug = function ZxDrug(dom) {
	this.dom = dom;
	this.init();
}
var ZxDrugProto = ZxDrug.prototype;
ZxDrugProto.init = function() {
	var self = this;
	self.top = self.dom.style.top ? +self.dom.style.top.replace('px', '') : 0;
	self.left = self.dom.style.left ? +self.dom.style.left.replace('px', '') : 0;
	self.druging = self._druging.bind(self);
	self.bind = self._bind.bind(self);
	self.unbind = self._unbind.bind(self);
	self.dom.addEventListener('mousedown', self.bind);
};
ZxDrugProto._druging = function(e) {
	this.top = e.clientY - this.preY + this.top;
	this.left = e.clientX - this.preX + this.left;
	this.dom.style.top = this.top+'px';
	this.dom.style.left = this.left+'px';
	this.preY = e.clientY;
	this.preX = e.clientX;
}
ZxDrugProto._bind = function bind(e) {
	this.preX = e.clientX;
	this.preY = e.clientY;
	this.isDruging = true;
	window.addEventListener('mousemove', this.druging);
	window.addEventListener('mouseup', this.unbind);
}
ZxDrugProto._unbind = function unbind(e) {
	this.isDruging = false;
	window.removeEventListener('mousemove', this.druging);
	window.removeEventListener('mouseup', this.unbind);
}

var zxDrug = new ZxDrug(drugDom[0]);