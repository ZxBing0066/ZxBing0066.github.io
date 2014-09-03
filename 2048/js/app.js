(function() {
	"use strict"
	var stage = document.getElementsByClassName('stage')[0];
	var movingClock = 0;
	var randomArr = [2, 2, 4]; // 生成的数字可用列表
	var moveAction = function moveAction(direction) {
		// direction: 0 向下 1 向左 2 向上 3 向右
		var moveAble = false;

		function move(indexs) {
			var clockIndex = [];
			for (var i = 1; i < indexs.length; i++) {
				var index = indexs[i];
				if (map.get(index) != 0) {
					var result = tryMerge(i, clockIndex);
					switch (result[0]) {
						case true:
							map.set(result[1], map.get(index) * 2, 'flip');
							map.set(index, 0);
							moveAble = true;
							clockIndex.push(result[1]);
							break;
						case 0:
							map.set(result[1], map.get(index));
							map.set(index, 0);
							moveAble = true;
							break;
						case false:
							break;
						default:
							break;
					}
				}
			};

			function tryMerge(i, clockIndex) {
				for (var j = i - 1; j >= 0; j--) {
					if (map.get(indexs[j]) != 0) {
						if (map.get(indexs[j]) == map.get(indexs[i]) && isInArr(clockIndex, indexs[j]) >= 0) { //值相等 但是前面的那个已经合并过
							if (j == i - 1) {
								return [false, 0];
							} else {
								return [0, indexs[j + 1]];
							}
						} else if (map.get(indexs[j]) == map.get(indexs[i])) {
							return [true, indexs[j]];
						} else if (j == i - 1) {
							return [false, 0];
						} else {
							break;
						}
					}
				}
				return [0, indexs[j + 1]]
			}
		}
		switch (direction) {
			case 0:
				for (var i = 0; i < 4; i++) {
					move([i + 12, i + 8, i + 4, i]);
				};
				break;
			case 1:
				for (var i = 0; i < 4; i++) {
					move([i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3]);
				};
				break;
			case 2:
				for (var i = 0; i < 4; i++) {
					move([i, i + 4, i + 8, i + 12]);
				};
				break;
			case 3:
				for (var i = 0; i < 4; i++) {
					move([i * 4 + 3, i * 4 + 2, i * 4 + 1, i * 4]);
				};
				break;
			default:
				break;
		}
		if (moveAble && map.check()) {
			map.randomSetBlank();
		}
	}
	var map = {};
	map.init = function init() {
		this.data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		this.grids = stage.getElementsByClassName('grid');
		this.randomSetBlank();
		this.randomSetBlank();
	}
	map.randomSetBlank = function randomSetBlank() {
		var randomIndex = getRandomNum(this.data.length);
		if (this.get(randomIndex) != 0) {
			this.randomSetBlank();
		} else {
			this.set(randomIndex, getRandomFromArr(randomArr), 'bounceIn');
		}
	}
	map.set = function set(index, val, className) {
		var webkitAnimationEndHandle = function webkitAnimationEndHandle(e) {
			removeClass(e.currentTarget, className);
			e.currentTarget.removeEventListener('webkitAnimationEnd', webkitAnimationEndHandle)
		}
		this.data[index] = val;
		this.grids[index].className = this.grids[index].className.replace(/num_\d{1,}/, 'num_' + val);
		if (className != null) {
			addClass(this.grids[index], className);
			this.grids[index].addEventListener('webkitAnimationEnd', webkitAnimationEndHandle)
		}
	}
	map.get = function get(index) {
		return this.data[index];
	}
	map.clear = function clear(index) {
		this.set(index, 0);
	}
	map.check = function check() {
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i] == 0) {
				return true;
			}
		};
		return false;
	}
	var getRandomNum = function getRandomNum(num) {
		return Math.floor(Math.random() * num);
	}
	var getRandomFromArr = function getRandomFromArr(arr) {
		return arr[getRandomNum(arr.length)]
	}
	var addClass = function addClass(dom, className) {
		var curClassNameList = dom.className.split(' ');
		if (!havaClass(dom, className)) {
			curClassNameList.push(className)
			dom.className = curClassNameList.join(' ');
		}
	}
	var havaClass = function havaClass(dom, className) {
		var curClassNameList = dom.className.split(' ');
		return isInArr(curClassNameList, className) >= 0 ? true : false;
	}
	var removeClass = function removeClass(dom, className) {
		var curClassNameList = dom.className.split(' ');
		var index = isInArr(curClassNameList, className);
		if (index >= 0) {
			curClassNameList.splice(index, 1);
		}
		dom.className = curClassNameList.join(' ');
	}

	// 是否包含在数组中
	var isInArr = function isInArr(arr, val) {
		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr[i] == val) {
				return i;
			}
		};
		return -1;
	}

	/**
	 * 按键操作
	 * @param  {Event} e 键盘事件
	 */
	var keypressAction = function keypressAction(e) {
		if (movingClock) {
			
		}
		// direction: 0 向下 1 向左 2 向上 3 向右
		// 按键映射表 w a s d
		var directionMap = {
			119: 2,
			115: 0,
			97: 1,
			100: 3
		}
		movingClock = true;
		if (moveAction(directionMap[e.keyCode])) {

		}
	}

	// touch时间各种
	var zxToucher = {
		coord: null,
		enabled: 0,
		baseDis: 50,
		handles: {}
	};
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
	var bind = function bind(func, context) {
		var args, bound, slice = [].slice;
		args = slice.call(arguments, 2);
		return bound = function() {
			if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
			ctor.prototype = func.prototype;
			var self = new ctor;
			ctor.prototype = null;
			var result = func.apply(self, args.concat(slice.call(arguments)));
			if (Object(result) === result) return result;
			return self;
		};
	}

	// 初始化
	map.init();
	zxToucher.init();
	zxToucher.bind('swipeDown', function() {
		moveAction(0);
	});
	zxToucher.bind('swipeLeft', function() {
		moveAction(1);
	});
	zxToucher.bind('swipeUp', function() {
		moveAction(2);
	});
	zxToucher.bind('swipeRight', function() {
		moveAction(3);
	});
	// 添加键盘监听
	window.addEventListener('keypress', keypressAction);
})()