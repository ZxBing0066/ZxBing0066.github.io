define(function() {
	var zxToucher = {};
	zxToucher.init = function init() {
		this.touchstartHandle = bind(this.touchstartHandle, this);
		this.touchmoveHandle = bind(this.touchmoveHandle, this);
		this.touchendHandle = bind(this.touchendHandle, this);
		window.addEventListener('touchstart', this.touchstartHandle);
		window.addEventListener('touchmove', this.touchmoveHandle);
		window.addEventListener('touchend', this.touchendHandle);
	}
	zxToucher.destroy = function destroy() {
		window.removeEventListener('touchstart', this.touchstartHandle);
		window.removeEventListener('touchmove', this.touchmoveHandle);
		window.removeEventListener('touchend', this.touchendHandle);
	}
	zxToucher.bind = function bind(type, handle) {
		this.handles[type] = this.handles[type] ? this.handles[type] : [];
		this.handles[type].push(handle);
	}
	zxToucher.emit = function emit(type) {
		if (!this.handles[type]) {
			return;
		}
		for (var i = 0; i < this.handles[type].length; i++) {
			this.handles[type][i]();
		};
	}
	zxToucher.touchstartHandle = function touchstartHandle(e) {
		if (e.targetTouches.length == 1) {
			this.coord = {
				x: e.targetTouches[0].pageX,
				y: e.targetTouches[0].pageY
			}
			this.enabled = 1;
		} else {
			this.enabled = 0;
		}
		console.log(e);
		e.preventDefault();
	}
	zxToucher.touchmoveHandle = function touchmoveHandle(e) {
		if (!this.enabled) {
			return;
		};
		console.log(e);
		e.preventDefault();
	}
	zxToucher.touchendHandle = function touchendHandle(e) {
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
		console.log(e);
		e.preventDefault();
	}
	return zxToucher;
})