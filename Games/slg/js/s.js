"use strict"
function slg() {
	var strict = "use strict";
	function polygonDotted(ctx, n, x, y, r, angle, counterclockwise) { //多边形虚线绘制
		strict;
		ctx.beginPath();
		angle = angle || 0;
		counterclockwise = counterclockwise || false;
		ctx.moveTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
		var delta = 2 * Math.PI / n;
		for (var i = 0; i < n; i++) {
			var angle0 = angle;
			angle += counterclockwise ? -delta : delta;
			ctx.lineTo(x + r * Math.sin(angle0) + r * (Math.sin(angle) - Math.sin(angle0)) / 3, y - r * Math.cos(angle0) - r * (Math.cos(angle) - Math.cos(angle0)) / 3);
			ctx.moveTo(x + r * Math.sin(angle0) + r * (Math.sin(angle) - Math.sin(angle0)) * 2 / 3, y - r * Math.cos(angle0) - r * (Math.cos(angle) - Math.cos(angle0)) * 2 / 3);
			ctx.lineTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
		}
		ctx.closePath();
	}

	function polygon(ctx, n, x, y, r, angle, counterclockwise) { //多边形绘制
		ctx.beginPath();
		angle = angle || 0;
		counterclockwise = counterclockwise || false;
		ctx.moveTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
		var delta = 2 * Math.PI / n;
		for (var i = 1; i < n; i++) {
			angle += counterclockwise ? -delta : delta;
			ctx.lineTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
		}
		ctx.closePath();
	}

	function imgLoad(arr, path, postfix, callback) { //图片加载
		var imgNum = arr.length;
		var imgLoadedNum = 0;
		for (var i = 0; i < imgNum; i++) {
			(function() {
				var img = new Image();
				var pos = i;
				img.src = path + arr[pos].imgId + postfix;
				arr[pos].img = img;
				img.onload = function() {
					imgLoadedNum++;
					if (imgLoadedNum == imgNum) {
						callback();
					};
				}
			})();
		}
	}

	function getCoord(e) {
		var offsetX = container.offsetLeft + container.style.borderLeft.slice(0, -2) * 1 + fiducialPoint.x;
		var offsetY = container.offsetTop + container.style.borderTop.slice(0, -2) * 1 + fiducialPoint.y;
		var point = new Point(e.x - offsetX, e.y - offsetY);
		var X = point.x;
		var Y = point.y;
		var w = gridW;
		var h = gridH;
		var i = X / w | 0;
		var j = i % 2 == 0 ? Y / h | 0 : (Y - h / 2) / h | 0;
		var x = X % w;
		var y = i % 2 == 0 ? Y % h : (Y - h / 2) % h;
		if (x >= w - R && x <= w) {} else {
			var pointLT = new Point(-R / 2, 0);
			var pointLB = new Point(-R / 2, h);
			var pointSelf = new Point(w - R / 2, h / 2);
			var point = new Point(x, y);
			var lineLT = new Line(point, pointLT);
			var lineLB = new Line(point, pointLB);
			var lineSelf = new Line(point, pointSelf);
			if (lineSelf.length <= lineLT.length && lineSelf.length <= lineLB.length) {

			} else if (lineLT.length <= lineLB.length && lineLT.length <= lineSelf.length) {
				i % 2 == 0 ? j-- : null;
				i--;
			} else {
				i % 2 == 0 ? null : j++;
				i--;
			}
		};
		return [i, j]
	}

	function getPath(char) {
		var coord = char.coord;
		var vigour = char.vigour;
		var path = {};

		function getClosedCoord(coord) {
			var closedCoord = [];
			var closedOffsetArr = coord[0] % 2 == 0 ? [
				[1, -1],
				[-1, -1],
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1]
			] : [
				[1, 1],
				[-1, 1],
				[1, 0],
				[-1, 0],
				[0, 1],
				[0, -1]
			];
			for (var i = 0; i < closedOffsetArr.length; i++) {
				closedCoord.push([closedOffsetArr[i][0] + coord[0], closedOffsetArr[i][1] + coord[1]]);
			};
			return closedCoord;
		}
		path[coord] = {
			path: [coord],
			expendVigour: 0
		};

		function pathLoop(coord) {
			var open = getClosedCoord(coord); //相邻格子
			for (var i = 0; i < open.length; i++) {
				if (data.dataMap[open[i][0]] && data.dataMap[open[i][0]][open[i][1]] != undefined) {
					var currentExpendVigour = data.dataMap[open[i][0]][open[i][1]].material.expendVigour; //当前格子移动消耗
					var totalExpendVigour = path[coord].expendVigour + currentExpendVigour; //总消耗
					if (totalExpendVigour >= vigour || currentExpendVigour == -1) { //行动力超支或格子不可移动
					} else if (data.dataMap[open[i][0]][open[i][1]].char && char.group != data.dataMap[open[i][0]][open[i][1]].char.group) { //有敌方单位
					} else if (path[open[i]] && path[open[i]].expendVigour <= totalExpendVigour) { //路径已存在&原路径较好
					} else {
						path[open[i]] = {};
						path[open[i]].path = path[coord].path.slice(0);
						path[open[i]].path.push(open[i]);
						path[open[i]].expendVigour = totalExpendVigour;
						pathLoop(open[i]);
					}
				}
			};
		}
		pathLoop(coord);
		return path;
	}

	function mapTransform(map) { //map转换
		var returnMap = [];
		for (var i = 0; i < map.length; i++) {
			for (var j = 0; j < map[i].length; j++) {
				returnMap[j] = returnMap[j] || [];
				returnMap[j][i] = map[i][j];
			};
		};
		return returnMap;
	}

	var fiducialPoint = {
		_x: 0,
		_y: 0,
		set x(num) {
			this._x = num;
		},
		get x() {
			return this._x;
		},
		set y(num) {
			this._y = num;
		},
		get y() {
			return this._y;
		}
	};
	var mapW = 1080; //显示宽
	var mapH = 720; //显示高
	var W = 1080; //画布宽
	var H = 720; //画布高
	var R = 30; //六边形半径
	var borderW = 3; //边框间距
	var gridW = (R * 3 + borderW * Math.sqrt(3)) / 2; //格子宽
	var gridH = R * Math.sqrt(3) + borderW; //格子高
	var outAreaBg = '#000'; //超出范围格子的背景
	var materialFloder = './img/mapMaterial/sucai/'; //素材图片文件夹
	var materialPostfix = '.png';
	var charFloder = './img/mapMaterial/char/'; //人物图片文件夹
	var charPostfix = '.gif';
	var container = document.getElementById('canvasContainer');
	var charList = [];
	var currentChar;

	function MapStage(canvasId) { //map层对象
		var self = this;
		self.canvas = document.getElementById(canvasId);
		self.ctx = self.canvas.getContext('2d');
		self.ctx.save();
		self.w = null;
		self.h = null;
		self.lineWidth = null; //边框宽度
		self.lineColor = null; //边框色
		self.material = null; //素材
		self.loadStatus = false; //图片加载状态
		self.init = function() { //初始化
			self.w = gridW * data.map.length + gridW - R;
			self.h = gridH * data.map[0].length + gridH / 2;
			mapW = self.w;
			mapH = self.h;
			self.canvas.width = mapW;
			self.canvas.height = mapH;
		}
		self.drawAll = function() {
			self.ctx.lineWidth = self.lineWidth || 1;
			var pat;
			self.ctx.strokeStyle = self.lineColor;
			for (var i = -1; i < data.map.length + 1; i++) {
				if (i >= 0 && i < data.map.length) {
					data.dataMap[i] = [];
				};
				for (var j = -1; j < data.map[0].length + 1; j++) {
					if (i < 0 || j < 0 || i >= data.map.length || j >= data.map[0].length) {
						self.ctx.fillStyle = outAreaBg;
					} else {
						pat = self.ctx.createPattern(self.material[data.map[i][j]].img, 'repeat');
						self.ctx.fillStyle = pat;
						data.dataMap[i][j] = {};
						data.dataMap[i][j].material = self.material[data.map[i][j]];
						data.dataMap[i][j].char = null;
					}
					polygon(self.ctx, 6, i * gridW + gridW - R / 2, gridH * j + gridH / 2 + (i % 2 == 0 ? 0 : gridH / 2), R, Math.PI / 6);
					self.ctx.fill();
					self.ctx.stroke();
				};
			};
			self.ctx.restore();
			self.mapImageData = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
		}
		self.draw = function(x, y) {
			self.clear();
			self.ctx.putImageData(self.mapImageData, x, y);
			self.ctx.restore();
		}
		self.imgLoad = function(callback) {
			imgLoad(self.material, materialFloder, materialPostfix, function() {
				self.loadStatus = true;
				if (callback) {
					callback();
				}
			})
		}
		self.clear = function() {
			self.ctx.clearRect(0, 0, self.w, self.h);
		}
	}

	function CharStage(canvasId) { //角色层
		var self = this;
		self.canvas = document.getElementById(canvasId);
		self.ctx = self.canvas.getContext('2d');
		self.ctx.save();
		self.chars = null;
		self.loadStatus = false;
		self.init = function(w, h) { //初始化
			self.w = w;
			self.h = h;
			self.canvas.width = w;
			self.canvas.height = h;
		}
		self.drawAll = function() {
			for (var n = 0; n < self.chars.length; n++) {
				var i = self.chars[n].coord[0];
				var j = self.chars[n].coord[1];
				data.dataMap[i][j].char = self.chars[n];
				var charImg = self.chars[n].img;
				self.ctx.globalAlpha = 0.7;
				switch (self.chars[n].group) {
					case 0:
						self.ctx.fillStyle = 'red';
						break;
					case 1:
						self.ctx.fillStyle = 'blue';
						break;
					default:
						self.ctx.fillStyle = '#047154';
						break;
				}
				polygon(self.ctx, 6, i * gridW + gridW - R / 2, gridH * j + gridH / 2 + (i % 2 == 0 ? 0 : gridH / 2), R - 1, Math.PI / 6);
				self.ctx.fill();
				self.ctx.globalAlpha = 1;
				self.ctx.restore();
				self.ctx.drawImage(charImg, i * gridW - charImg.width / 2 + gridW - R / 2 + fiducialPoint.x, gridH * j + (i % 2 == 0 ? 0 : gridH / 2) - charImg.height + gridH + fiducialPoint.y);
			};
		}
		self.clear = function() {
			self.ctx.clearRect(0, 0, self.w, self.h);
		}
		self.draw = function() {
			self.clear();
			for (var n = 0; n < self.chars.length; n++) {
				var i = self.chars[n].coord[0];
				var j = self.chars[n].coord[1];
				var charImg = self.chars[n].img;
				self.ctx.globalAlpha = 0.7;
				self.ctx.fillStyle = '#849251';
				polygon(self.ctx, 6, i * gridW + gridW - R / 2, gridH * j + gridH / 2 + (i % 2 == 0 ? 0 : gridH / 2), R - 1, Math.PI / 6);
				self.ctx.fill();
				self.ctx.globalAlpha = 1;
				self.ctx.restore();
				self.ctx.drawImage(charImg, i * gridW - charImg.width / 2 + gridW - R / 2 + fiducialPoint.x, gridH * j + (i % 2 == 0 ? 0 : gridH / 2) - charImg.height + gridH + fiducialPoint.y);
			};
		}
		self.imgLoad = function(callback) {
			imgLoad(self.chars, charFloder, charPostfix, function() {
				self.loadStatus = true;
				if (callback) {
					callback();
				}
			})
		}
	}

	function FrameStage(canvasId) { //选框层
		var self = this;
		self.canvas = document.getElementById(canvasId);
		self.ctx = self.canvas.getContext('2d');
		self.ctx.save();
		self.init = function(w, h) { //初始化
			self.w = w;
			self.h = h;
			self.canvas.width = w;
			self.canvas.height = h;
		}
		self.drawDottedBorder = function(coord, color, offsetR, lineWidth) {
			self.ctx.lineWidth = lineWidth | 0;
			polygonDotted(self.ctx, 6, coord[0] * gridW + gridW - R / 2, gridH * coord[1] + gridH / 2 + (coord[0] % 2 == 0 ? 0 : gridH / 2), R + offsetR, Math.PI / 6);
			self.ctx.strokeStyle = color;
			self.ctx.stroke();
			self.ctx.restore();
		}
		self.drawMoveRange = function(path) {
			self.ctx.globalAlpha = 0.7;
			self.ctx.fillStyle = '#48DB4C';
			for (var coord in path) {
				coord = coord.split(',');
				polygon(self.ctx, 6, coord[0] * gridW + gridW - R / 2, gridH * coord[1] + gridH / 2 + (coord[0] % 2 == 0 ? 0 : gridH / 2), R - 5, Math.PI / 6);
				self.ctx.fill();
			}
			self.ctx.globalAlpha = 1;
			self.ctx.restore();
		}
		self.drawAttackRange = function(path) {
			self.ctx.globalAlpha = 0.7;
			self.ctx.fillStyle = '#C322B3';
			for (var coord in path) {
				coord = coord.split(',');
				polygon(self.ctx, 6, coord[0] * gridW + gridW - R / 2, gridH * coord[1] + gridH / 2 + (coord[0] % 2 == 0 ? 0 : gridH / 2), R - 5, Math.PI / 6);
				self.ctx.fill();
			}
			self.ctx.globalAlpha = 1;
			self.ctx.restore();
		}
		self.drawPath = function(e, path) {
			self.clear();
			self.drawMoveRange(path);
			var coord = getCoord(e);
			var currentPath = path[coord];
			if (currentPath) {
				for (var n = 0; n < currentPath.path.length; n++) {
					self.drawCircle(currentPath.path[n], '#d30', 4);
				}
				self.drawDottedBorder(coord, '#3e7', 10, 1);
			}
		}
		self.drawCircle = function(coord, color, r) {
			var i = coord[0];
			var j = coord[1];
			self.ctx.beginPath();
			self.ctx.arc(i * gridW + gridW - R / 2, gridH * j + gridH / 2 + (i % 2 == 0 ? 0 : gridH / 2), r || 3, 0, Math.PI * 2, true);
			self.ctx.closePath();
			self.ctx.fillStyle = color || '#70f';
			self.ctx.fill();
		}
		self.clear = function() {
			self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		}
	}

	function MenuStage(canvasId) { //菜单层
		var self = this;
		self.canvas = document.getElementById(canvasId);
		self.ctx = self.canvas.getContext('2d');
		self.ctx.save();
		self.menu = null;
		self.init = function(w, h) { //初始化
			self.w = w;
			self.h = h;
			self.canvas.width = w;
			self.canvas.height = h;
		}
		self.drawCharInfo = function() {
			// body...
		}
		self.drawGridInfo = function() {
			// body...
		}
		self.drawMoveMenu = function() {
			self.menu = {};
			self.menu.name = 'moveMenu';
			self.menu.funs = [];
			var arr = [];
			if (currentChar.moveAble) {
				arr.push('移动');
				self.menu.funs.push('move');
			}
			if (currentChar.attackAble) {
				arr.push('攻击');
				self.menu.funs.push('attack');
			}
			if (currentChar.skillAble) {
				arr.push('技能');
				self.menu.funs.push('skill');
			}
			arr.push('信息');
			self.menu.funs.push('info');
			arr.push('回合结束');
			self.menu.funs.push('end');
			self._drawMenu(arr);
		}
		self._drawMenu = function(arr) {
			var X = gridW * currentChar.coord[0] + fiducialPoint.x + R + borderW;
			var Y = gridH * currentChar.coord[1] + fiducialPoint.y + gridH / 2;
			self.menu.coord = [X, Y];
			var gradient = self.ctx.createLinearGradient(0, 0, 0, 400);
			gradient.addColorStop(0, 'rgba(240,129,0,0.8)');
			gradient.addColorStop(0.5, 'rgba(220,149,0,0.7)');
			gradient.addColorStop(1, 'rgba(200,169,0,0.9)');
			self.ctx.strokeStyle = '#a90c33';
			self.ctx.lineWidth = 2;
			self.ctx.textAlign = 'center';
			self.ctx.textBaseline = 'middle';
			self.ctx.font = 'small-caps bold 16px 微软雅黑';
			for (var i = 0; i < arr.length; i++) {
				self.ctx.fillStyle = gradient;
				self.ctx.fillRect(X, Y + 30 * i, 100, 30);
				self.ctx.strokeRect(X, Y + 30 * i, 100, 30);
				self.ctx.fillStyle = '#049213';
				self.ctx.fillText(arr[i], X + 50, Y + 30 * i + 15, 100)
			};
			self.ctx.restore();
		}
		self.clear = function() {
			self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
		}
	}

	function UIStage(canvasId) { //UI层
		var self = this;
		self.canvas = document.getElementById(canvasId);
		self.ctx = self.canvas.getContext('2d');
		self.ctx.save();
		self.init = function(w, h) { //初始化
			self.w = w;
			self.h = h;
			self.canvas.width = w;
			self.canvas.height = h;
		}
	}

	function Point(x, y) {
		this.x = x;
		this.y = y;
	}

	function Line(point1, point2) {
		this.point1 = point1;
		this.point2 = point2;
		this.length = Math.sqrt((point1.x - point2.x) * (point1.x - point2.x) + (point1.y - point2.y) * (point1.y - point2.y));
	}

	function Char(argument) {
		this.attr = argument.attr;
	}

	var selectCoord = null;
	var speedBarArr = [];

	function initSpeedBar() {
		for (var i = 0; i < charStage.chars.length; i++) {
			speedBarArr.push({
				id: i,
				speed: charStage.chars[i].attr.speed,
				process: 0,
				get: function steps() {
					return ((1000 - this.process) / this.speed | 1) + 1;
				}
			});
		};
	}

	function speedBarRun(callback) {
		for (var i = 0; i < speedBarArr.length; i++) {
			speedBarArr[i].process += speedBarArr[i].speed;
		};
		speedBarArr.sort(function(obj1, obj2) {
			if (obj1.steps < obj2.steps) {
				return -1;
			} else if (obj1.steps == obj2.steps && obj1.speed >= obj2.speed) {
				return -1;
			} else {
				return 1;
			};
		})
		callback();
	}

	function gameLoop() {
		speedBarRun(function() {
			if (speedBarArr[0].process >= 1000) {
				roundStart();
			} else {
				gameLoop();
			}
		});
	}

	function roundStart() {
		var char = data.chars[speedBarArr[0].id];
		currentChar = char;
		var path = getPath(char);
		drawSequenceBar();
		bufferRun();
		autoPosition();
		data.path = path;
		drawMenu('move');
	}

	function drawSequenceBar () {//行动顺序条
		
	}

	function bufferRun() {
		currentChar.moveAble = true;
		currentChar.attackAble = true;
	}

	function autoPosition() {
		var X = gridW * currentChar.coord[0];
		var Y = gridH * currentChar.coord[1];
		var x = W / 2 - X;
		var y = H / 2 - Y;
		x > 0 ? x = 0 : null;
		x < -mapW + W ? x = -mapW + W : null;
		y > 0 ? y = 0 : null;
		y < -mapH + H ? y = -mapH + H : null;
		console.log(fiducialPoint);
		mapStage.canvas.style.left = x + 'px';
		mapStage.canvas.style.top = y + 'px';
		frameStage.canvas.style.left = x + 'px';
		frameStage.canvas.style.top = y + 'px';
		charStage.canvas.style.left = x + 'px';
		charStage.canvas.style.top = y + 'px';
		fiducialPoint.x = x;
		fiducialPoint.y = y;
	}

	function drawMenu(type) {
		switch (type) {
			case 'move':
				menuStage.drawMoveMenu();
				break;
			case 'mvoed':
				menuStage.drawMovedMenu();
				break;
			default:
				break;
		}
		menuShowClock = false;
	}

	function clearMenu() {
		menuStage.clear();
		menuShowClock = true;
	}

	function showSkillList() {
		menuStage.showSkillList();
	}

	function menuHover(e) {
		if (menuShowClock) return;
		var offsetX = container.offsetLeft + container.style.borderLeft.slice(0, -2) * 1;
		var offsetY = container.offsetTop + container.style.borderTop.slice(0, -2) * 1;
		var X = menuStage.menu.coord[0] + offsetX;
		var Y = menuStage.menu.coord[1] + offsetY;
		if (e.x >= X && e.y >= Y && e.x <= X + 100 && e.y <= Y + menuStage.menu.funs.length * 30) {
			cursorPointer();
		} else {
			cursorDefault();
		}
	}

	function menuSelect(e) {
		if (menuShowClock) return;
		var offsetX = container.offsetLeft + container.style.borderLeft.slice(0, -2) * 1;
		var offsetY = container.offsetTop + container.style.borderTop.slice(0, -2) * 1;
		var X = menuStage.menu.coord[0] + offsetX;
		var Y = menuStage.menu.coord[1] + offsetY;
		cursorDefault();
		if (e.x >= X && e.y >= Y && e.x <= X + 100 && e.y <= Y + menuStage.menu.funs.length * 30) {
			var pos = (e.y - Y) / 30 | 0;
			switch (menuStage.menu.funs[pos]) {
				case "move":
					clearMenu();
					move();
					break;
				case "attack":
					clearMenu();
					attack();
					break;
				case "skill":
					clearMenu();
					showSkillList();
					break;
				case "info":
					clearMenu();
					showCharInfo();
					break;
				case "end":
					clearMenu();
					end();
					break;
				default:
					break;
			}
		}
	}
	var data = {};
	var mapStage = new MapStage('map');
	var charStage = new CharStage('char');
	var frameStage = new FrameStage('frame');
	var menuStage = new MenuStage('menu');
	var uiStage = new UIStage('ui');

	function init() {
		data.map = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 2, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0],
			[0, 0, 3, 0, 1, 1, 1, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 3, 0, 1, 1, 1, 0, 2, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 3, 0, 1, 1, 1, 2, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 3, 0, 1, 1, 1, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 3, 0, 1, 1, 1, 2, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 3, 0, 1, 2, 1, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 1, 1, 1, 2, 0, 0, 0, 0, 2, 2, 0, 1, 1, 1, 2, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		data.dataMap = [];
		data.map = mapTransform(data.map);
		data.chars = [{
			imgId: 'char0',
			group: 0,
			coord: [2, 8],
			vigour: 20,
			attr: {
				speed: 10
			}
		}, {
			imgId: 'char1',
			group: 0,
			coord: [3, 5],
			vigour: 10,
			attr: {
				speed: 20
			}
		}, {
			imgId: 'char2',
			group: 1,
			coord: [8, 8],
			vigour: 13,
			attr: {
				speed: 8
			}
		}, {
			imgId: 'char3',
			group: 1,
			coord: [12, 8],
			vigour: 50,
			attr: {
				speed: 16
			}
		}, {
			imgId: 'char3',
			group: 1,
			coord: [22, 8],
			vigour: 50,
			attr: {
				speed: 23
			}
		}, {
			imgId: 'char3',
			group: 0,
			coord: [25, 8],
			vigour: 50,
			attr: {
				speed: 22
			}
		}, {
			imgId: 'char3',
			group: 0,
			coord: [22, 12],
			vigour: 50,
			attr: {
				speed: 23
			}
		}, {
			imgId: 'char3',
			group: 1,
			coord: [20, 8],
			vigour: 10,
			attr: {
				speed: 13
			}
		}];
		data.material = [
			//肉身,轻武器,重武器,弓箭,魔法
			{
				imgId: 'gress',
				expendVigour: 2,
				name: '草地',
			}, {
				imgId: 'gress_sand',
				expendVigour: 5,
				name: '沙草地'
			}, {
				imgId: 'ice',
				expendVigour: -1,
				name: '冰地'
			}, {
				imgId: 'land',
				expendVigour: 1,
				name: '平地'
			}, {
				imgId: 'land_black',
				expendVigour: 5
			}, {
				imgId: 'sand',
				expendVigour: 4
			}, {
				imgId: 'stone',
				expendVigour: 5
			}, {
				imgId: 'stone_black',
				expendVigour: 5
			}, {
				imgId: 'stone_red',
				expendVigour: 2
			}, {
				imgId: 'water',
				expendVigour: 1
			}, {
				imgId: 'water_black',
				expendVigour: 5
			}, {
				imgId: 'water_blue',
				expendVigour: 2
			}
		];
		mapStage.init();
		mapStage.lineWidth = 1;
		mapStage.lineColor = '#081';
		mapStage.material = data.material;
		charStage.init(mapW, mapH);
		charStage.chars = data.chars;
		frameStage.init(mapW, mapH);
		frameStage.drawDottedBorder([2, 2], '#f20', 3, 4);
		menuStage.init(W, H);
		uiStage.init(W, H);
	}

	function eventInit() {
		document.onselectstart = function() { //屏蔽选择即右键
			return false;
		}
		document.oncontextmenu = function() {
			return false;
		}

		document.addEventListener('mousemove', onDrag); //拖拽
		container.addEventListener('mousedown', clearMenu); //清除菜单
		container.addEventListener('mousemove', menuHover); //菜单显示
		container.addEventListener('click', menuSelect); //菜单选择
		container.addEventListener('mousedown', mousedown);
	}

	function start() {
		mapStage.imgLoad(function() {
			mapStage.drawAll();
			if (charStage.loadStatus) {
				initSpeedBar();
				gameLoop();
			}
		});
		charStage.imgLoad(function() {
			charStage.drawAll();
			if (mapStage.loadStatus) {
				initSpeedBar();
				gameLoop();
			}
		});
	}

	function cursorPointer() {
		container.style.cursor = 'pointer';
	}

	function cursorDefault() {
		container.style.cursor = '';
	}

	function mousedown(e) {
		var clicked = false;
		var mouseup;
		var type;
		if (e.button == 0) { //左键
			mouseup = function(e) {
				clicked = true;
				leftClick(e);
			}
			container.addEventListener('mouseup', mouseup);
			setTimeout(function() {
				container.removeEventListener('mouseup', mouseup);
				if (!clicked) {
					document.addEventListener('mouseup', dragOver);
					leftDrag(e);
				}
			}, 150);
		} else if (e.button == 1) { //中键
			mouseup = function(e) {
				clicked = true;
				centerClick(e);
			}
			container.addEventListener('mouseup', mouseup);
			setTimeout(function() {
				container.removeEventListener('mouseup', mouseup);
				if (!clicked) {
					document.addEventListener('mouseup', dragOver);
					centerDrag(e);
				}
			}, 150);
		} else if (e.button == 2) { //右键
			mouseup = function(e) {
				clicked = true;
				rightClick(e);
			}
			container.addEventListener('mouseup', mouseup);
			setTimeout(function() {
				container.removeEventListener('mouseup', mouseup);
				if (!clicked) {
					document.addEventListener('mouseup', dragOver);
					rightDrag(e);
				}
			}, 150);
		}
		mouseEventFun(e, type);
	}

	function clearMenu(e) {
		if (clearMenuClock) return;
		menuStage.clear();
	}

	function mouseEventFun(e, type) {
		// body...
	}

	function leftClick(e) {
		var coord = getCoord(e);
		console.log('leftClick' + coord);
	}

	function rightClick(e) {
		console.log('rightClick');
	}

	function centerClick(e) {
		console.log('centerClick');
	}

	function leftDrag(e) {
		var offsetX = container.offsetLeft + container.style.borderLeft.slice(0, -2) * 1;
		var offsetY = container.offsetTop + container.style.borderTop.slice(0, -2) * 1;
		var startX = e.x - offsetX;
		var startY = e.y - offsetY;
		leftDrag.startPoint = {
			x: startX,
			y: startY
		};
		dragClock = false;
	}

	function onDrag(e) {
		if (dragClock) return;
		var offsetX = container.offsetLeft + container.style.borderLeft.slice(0, -2) * 1;
		var offsetY = container.offsetTop + container.style.borderTop.slice(0, -2) * 1;
		var X = e.x - offsetX;
		var Y = e.y - offsetY;
		var x = fiducialPoint.x + X - leftDrag.startPoint.x;
		var y = fiducialPoint.y + Y - leftDrag.startPoint.y;
		x > 0 ? x = 0 : null;
		x < -mapW + W ? x = -mapW + W : null;
		y > 0 ? y = 0 : null;
		y < -mapH + H ? y = -mapH + H : null;
		console.log(fiducialPoint);
		mapStage.canvas.style.left = x + 'px';
		mapStage.canvas.style.top = y + 'px';
		frameStage.canvas.style.left = x + 'px';
		frameStage.canvas.style.top = y + 'px';
		charStage.canvas.style.left = x + 'px';
		charStage.canvas.style.top = y + 'px';
	}

	function dragOver(e) {
		var offsetX = container.offsetLeft + container.style.borderLeft.slice(0, -2) * 1;
		var offsetY = container.offsetTop + container.style.borderTop.slice(0, -2) * 1;
		var X = e.x - offsetX;
		var Y = e.y - offsetY;
		fiducialPoint.x = mapStage.canvas.style.left.slice(0, -2) * 1;
		fiducialPoint.y = mapStage.canvas.style.top.slice(0, -2) * 1;
		dragClock = true;
	}

	function move(path) {
		
	}

	function showPath(e) {
		if (showPathClock) return;
		frameStage.drawPath(e, data.path);
	}

	function moveTo(e) {

	}



	var eventClock = true;
	var menuShowClock = true;
	var clearMenuClock = true;
	var dragClock = true;
	var showPathClock = true;
	init();
	eventInit();
	start();
}