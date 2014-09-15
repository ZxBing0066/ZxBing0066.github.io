// findPath
ZxGame.findPath = function(map, w, h, x1, y1, x2, y2) {
	var startT = new Date();
	if(!(x1>=0&&x1<w&&y1>=0&&y1<h&&x2>=0&&x2<w&&y2>=0&&y2<h)) {
		console.log("寻路花费" + (new Date-startT) + "ms");
		return -1;
	}
	if(x1===x2&&y1===y2) {
		console.log("寻路花费" + (new Date-startT) + "ms");	
		return [[x1, y1]];
	}
	var open = [];
	var close = [];
	open.push({
		x: x1,
		y: y1,
		g: 0
	});
	function getH(coord) {
		return Math.abs(coord.x-x1)+Math.abs(coord.y-y1);
	}
	function getG(coord) {
		return coord.g;
	}
	function getF(coord) {
		return getH(coord) + getG(coord);
	}
	function getCloseCoords(coord) {
		var coords = [];
		coord.x>0&&map[coord.x-1][coord.y]>=0&&coords.push({
			x: coord.x-1,
			y: coord.y,
			parent: coord,
			g: coord.g+1
		});
		coord.x<w-1&&map[coord.x+1][coord.y]>=0&&coords.push({
			x: coord.x+1,
			y: coord.y,
			parent: coord,
			g: coord.g+1
		});
		coord.y>0&&map[coord.x][coord.y-1]>=0&&coords.push({
			x: coord.x,
			y: coord.y-1,
			parent: coord,
			g: coord.g+1
		});
		coord.y<h-1&&map[coord.x][coord.y+1]>=0&&coords.push({
			x: coord.x,
			y: coord.y+1,
			parent: coord,
			g: coord.g+1
		});
		return coords;
	}
	function getMinFCoord() {
		var coord = open[0];
		var index = 0;
		for (var i = 0; i < open.length; i++) {
			if(getF(open[i]) < getF(coord)) {
				coord = open[i];
				index = i;
			}
		};
		return coord;
	}
	function getMinFCoordIndex() {
		var coord = open[0];
		var index = 0;
		for (var i = 0; i < open.length; i++) {
			if(getF(open[i]) < getF(coord)) {
				coord = open[i];
				index = i;
			}
		};
		return index;
	}
	function findArrayIndex(arg, arr) {
		for (var i = 0; i < arr.length; i++) {
			if(arr[i]===arg) {
				return i;
			}
		};
		return -1;
	}
	function inOpen(coord) {
		for (var i = 0; i < open.length; i++) {
			if(open[i].x===coord.x&&open[i].y===coord.y) {
				return i;
			}
		};
		return -1;
	}
	function inClose(coord) {
		if (arguments.length==1) {
			for (var i = 0; i < close.length; i++) {
				if(close[i].x===coord.x&&close[i].y===coord.y) {
					return i;
				}
			};
		} else {
			for (var i = 0; i < close.length; i++) {
				if(close[i].x===arguments[0]&&close[i].y===arguments[1]) {
					return i;
				}
			};
		}
		return -1;
	}
	while(open.length>0) {
		var minFCoordIndex = getMinFCoordIndex();
		var minFCoord = open[minFCoordIndex];
		open.splice(minFCoordIndex,1);
		if(inClose(minFCoord)===-1) {
			close.push(minFCoord);
		} else {
			var index = inClose(minFCoord);
			if(minFCoord.g<close[index].g) {
				close[index] = minFCoord;
			}
		}
		if(minFCoord.x===x2&&minFCoord.y===y2) {
			continue;
		}
		var closeCoords = getCloseCoords(minFCoord);
		var targetCoordIndex = inClose(x2, y2);
		for (var i = 0; i < closeCoords.length; i++) {
			// 优化 排除无意义路径
			if (targetCoordIndex!=-1) {
				if (close[targetCoordIndex].g<closeCoords[i].g) {
					continue;
				};
			};
			// 优化 排除无意义路径

			if(inClose(closeCoords[i])!=-1) {
				var index = inClose(closeCoords[i]);
				if(getF(closeCoords[i])<getF(close[index])) {
					close[index] = closeCoords[i];
				}
				continue;
			}
			if(inOpen(closeCoords[i])!=-1) {
				var index = inOpen(closeCoords[i]);
				if(getF(closeCoords[i])<getF(open[index])) {
					open[i] = closeCoords[i];
				}
			} else {
				open.push(closeCoords[i]);
			}
		};
	}
	function getPath(x, y) {
		var index = inClose(x,y);
		if(index===-1) {
			return -1;
		}
		var coord = close[index];
		var path = [];
		while(coord) {
			path.unshift([coord.x,coord.y])
			coord = coord.parent;
		}
		return path;
	}
	console.log("寻路花费" + (new Date-startT) + "ms");
	return getPath(x2, y2);
}
