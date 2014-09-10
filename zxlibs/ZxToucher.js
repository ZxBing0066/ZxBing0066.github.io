define([], function() {
	var ZxToucher = {
		coord: null,
		enabled: 0,
		baseDis: 50,
		handles: {}
	};
	ZxToucher.init = function init() {
		this.touchstartHandle = _.bind(this.touchstartHandle, this);
		this.touchmoveHandle = _.bind(this.touchmoveHandle, this);
		this.touchendHandle = _.bind(this.touchendHandle, this);
		window.addEventListener('touchstart', this.touchstartHandle);
		window.addEventListener('touchmove', this.touchmoveHandle);
		window.addEventListener('touchend', this.touchendHandle);
	}
	ZxToucher.destroy = function destroy() {
		window.removeEventListener('touchstart', this.touchstartHandle);
		window.removeEventListener('touchmove', this.touchmoveHandle);
		window.removeEventListener('touchend', this.touchendHandle);
	}
	ZxToucher.bind = function bind(type, handle) {
		this.handles[type] = this.handles[type] ? this.handles[type] : [];
		this.handles[type].push(handle);
	}
	ZxToucher.unbind = function unbind (type, handle) {
		if(this.handles[type]) {
			
		}
	}
	ZxToucher.emit = function emit(type) {
		if (!this.handles[type]) {
			return;
		}
		for (var i = 0; i < this.handles[type].length; i++) {
			this.handles[type][i]();
		};
	}
	ZxToucher.touchstartHandle = function touchstartHandle(e) {
		if (e.targetTouches.length == 1) {
			this.coord = {
				x: e.targetTouches[0].pageX,
				y: e.targetTouches[0].pageY
			}
			this.enabled = 1;
		} else {
			this.enabled = 0;
		}
	}
	ZxToucher.touchmoveHandle = function touchmoveHandle(e) {
		if (!this.enabled) {
			return;
		};
	}
	ZxToucher.touchendHandle = function touchendHandle(e) {
		if (!this.enabled) {
			return;
		};
		var offsetX = this.coord.x - e.changedTouches[0].pageX,
			offsetY = this.coord.y - e.changedTouches[0].pageY;
		if (Math.abs(offsetX) > Math.abs(offsetY) && Math.abs(offsetX) > this.baseDis) {
			console.log(offsetX, offsetY);
			if (offsetX > 0) {
				this.emit('swipeLeft');
			} else {
				this.emit('swipeRight');
			}
		} else if (Math.abs(offsetY) >= Math.abs(offsetX) && Math.abs(offsetY) > this.baseDis) {
			console.log(offsetX, offsetY);
			if (offsetY > 0) {
				this.emit('swipeUp');
			} else {
				this.emit('swipeDown');
			}
		}
		this.enabled = 0;
	}
	return ZxToucher;
})