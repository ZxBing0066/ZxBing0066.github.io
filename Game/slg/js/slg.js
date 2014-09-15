function slg() {
	var mapCanvas = document.getElementById('map');//地图层
	var mapCtx = mapCanvas.getContext('2d');
	mapCanvas.width = 1080;
	mapCanvas.height = 720;
	mapCtx.save();
	var frameCanvas = document.getElementById('frame');//边框层
	var frameCtx = frameCanvas.getContext('2d');
	frameCanvas.width = 1080;
	frameCanvas.height = 720;
	frameCtx.save();
	var charCanvas = document.getElementById('char');//人物层
	var charCtx = charCanvas.getContext('2d');
	charCanvas.width = 1080;
	charCanvas.height = 720;
	charCtx.save();
	var menuCanvas = document.getElementById('menu');//menu层
	var menuCtx = menuCanvas.getContext('2d');
	menuCanvas.width = 1080;
	menuCanvas.height = 720;
	menuCtx.save();
	var uiCanvas = document.getElementById('ui');//UI层
	var uiCtx = uiCanvas.getContext('2d');
	uiCanvas.width = 1080;
	uiCanvas.height = 720;
	uiCtx.save();

	var canvas = document.getElementById('ui');//地图层
	var ctx = canvas.getContext('2d');
	canvas.width = 1080;
	canvas.height = 720;
	ctx.save();

	var R = 30;
	var borderW = 3;
	var lineWidth = 1;
	var selectedLineWidth = 2;
	var gridW = (R*3+borderW*Math.sqrt(3))/2;
	var gridH = R*Math.sqrt(3)+borderW;
	var fiducialPoint = new Point(-gridW+R/2,-gridH/2);

	var materialFloder = '';
	var materialImgIds = ['gress','gress_sand','ice','land'
	// ,'land_black','sand','stone','stone_black','stone_red','water','water_black','water_blue'
	];//格子素材
	var material = [
	{id:'gress',expendVigour:2,name:'草地'},
	{id:'gress_sand',expendVigour:5,name:'沙草地'},
	{id:'ice',expendVigour:-1,name:'冰地'},
	{id:'land',expendVigour:1,name:'平地'},
	// {"id":"land_black","expendVigour":5},
	// {"id":"sand","expendVigour":4},
	// {"id":"stone","expendVigour":5},
	// {"id":"stone_black","expendVigour":5},
	// {"id":"stone_red","expendVigour":2},
	// {"id":"water","expendVigour":1},
	// {"id":"water_black","expendVigour":5},
	// {"id":"water_blue","expendVigour":2}
	];
	// for(var i = 0; i < materialImgIds.length; i++){
	// 	material[i] = {};
	// 	material[i].id = materialImgIds[i];
	// 	material[i].expendVigour = 1+5*Math.random()|0;
	// }
	// JSON.stringify(material);
	var map = [];//素材地图
	var dataMap = [];
	for (var i = 0; i < 30; i++) {
		map[i] = [];
		dataMap[i] = [];
		for (var j = 0; j < 30; j++) { 
			map[i].push(materialImgIds.length*Math.random()|0);
			dataMap[i].push(null);
		}
	};
	var charImgIds = ['char1','char2'];
	var charImgs = [];
	var mapImageData;
	var mapMaterialImgs = [];

	var chars = [
	{id:0,position:{x:2,y:2}}, 
	{id:0,position:{x:12,y:6}}, 
	{id:1,position:{x:6,y:9}}
	];

	function imgLoad (ids,path,postfix,imgs,callback) {
		var imgNum = ids.length;
		var imgLoadedNum = 0;
		for(var i = 0; i < imgNum; i++) {
			(function () {
				var img = new Image();
				var pos = i;
				img.src = path + ids[pos] + postfix;
				imgs[pos] = img;
				img.onload = function () {
					imgLoadedNum ++;
					if (imgLoadedNum == imgNum) {
						callback();
					};
				}
			})();
		}
	}
	function drawDottedBorder (i,j,color,offsetR) {
		var offsetY = i%2==0?0:gridH/2;
		ctx.lineWidth = selectedLineWidth;
		polygonDotted(ctx, 6, i*gridW, gridH*j+offsetY, R+offsetR, Math.PI/6);
		ctx.strokeStyle = color;
		ctx.stroke();
		ctx.restore();
	}
	function initMap () {
		ctx.lineWidth = lineWidth;
		var offsetY;
		ctx.strokeStyle = "#008";
		for (var i = 0; i < map.length; i++) {
			offsetY = i%2==0?0:gridH/2;
			for (var j = 0; j < map[i].length; j++) {
				var pat = ctx.createPattern(mapMaterialImgs[map[i][j]],"repeat");
				ctx.fillStyle = pat;
				polygon(ctx, 6, i*gridW, gridH*j+offsetY, R, Math.PI/6);
				ctx.fill();
				ctx.stroke();
				// ctx.drawImage(mapMaterialData[materialId[map[i][j]]], i*gridW, gridH*j+offsetY);
				// ctx.drawImage(mapMaterialImgs[map[i][j]], i*gridW, gridH*j+offsetY);
			};
		};
		ctx.restore();
		mapImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		// ctx.clip();
		// ctx.fill();
		// polygon(ctx, 6, 365, 53, 20, Math.PI/6);
		// ctx.beginPath();
		// ctx.arc(365, 53, 2, 0, 2*Math.PI);
		// ctx.closePath();
		// ctx.fillStyle = "#c1d";
		// ctx.fill();
	}
	function drawMap () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(mapImageData, 0, 0);
	}
	function saveMap () {
		mapImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	}
	function restoreMap () {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.putImageData(mapImageData, 0, 0);
	}
	function drawChar () {
		for (var n = 0; n < chars.length; n++) {
			var i = chars[n].position.x;
			var j = chars[n].position.y;
			var offsetY = i%2==0?0:gridH/2;
			dataMap[i][j] = chars[n];
			var charImg = charImgs[chars[n].id];
			ctx.drawImage(charImg, i*gridW-charImg.width/2, gridH*j+offsetY-charImg.height+gridH/2);
		};
	}
	function getPath (coord,vigour) {
		var path = {};
		function getClosedCoord (coord) {
			var closedCoord = [];
			var closedOffsetArr = coord[0]%2==0?[[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]:[[1,1],[-1,1],[1,0],[-1,0],[0,1],[0,-1]];
			for (var i = 0; i < closedOffsetArr.length; i++) {
				closedCoord.push([closedOffsetArr[i][0]+coord[0],closedOffsetArr[i][1]+coord[1]]);
			};
			return closedCoord;
		}
		path[coord] = {path:[],expendVigour:0};
		function pathLoop (coord) {
			var open = getClosedCoord(coord);//相邻格子
			var close = [];//判断完的格子
			for (var i = 0; i < open.length; i++) {
				if(map[open[i][0]]&&map[open[i][0]][open[i][1]]!=undefined) {
					var currentExpendVigour = material[map[open[i][0]][open[i][1]]].expendVigour;//当前格子移动消耗
					var totalExpendVigour = path[coord].expendVigour+currentExpendVigour;//总消耗
					if (totalExpendVigour>=vigour||currentExpendVigour==-1) {//行动力超支或格子不可移动
						close.push(open[i]);
					} else if (path[open[i]]&&path[open[i]].expendVigour<=totalExpendVigour) {//路径已存在&原路径较好
						close.push(open[i]);
					} else {
						path[open[i]] = {};
						path[open[i]].path=path[coord].path.slice(0);
						path[open[i]].path.push(coord);
						path[open[i]].expendVigour = totalExpendVigour;
						pathLoop(open[i]);
					}
				}
			};
		}
		pathLoop(coord);
		return path;
	}
	function clickTest (point) {
		var X = point.x - fiducialPoint.x;
		var Y = point.y - fiducialPoint.y;
		var w = gridW;
		var h = gridH;
		var i = X/w|0;
		var j = i%2==0?Y/h|0:(Y-h/2)/h|0;
		var x = X%w;
		var y = i%2==0?Y%h:(Y-h/2)%h;
		if (x>=w-R&&x<=w) {
		} else {
			var pointLT = new Point(-R/2,0);
			var pointLB = new Point(-R/2,h);
			var pointSelf = new Point(w-R/2,h/2);
			var point = new Point(x,y);
			var lineLT = new Line(point,pointLT);
			var lineLB = new Line(point,pointLB);
			var lineSelf = new Line(point,pointSelf);
			if (lineSelf.length<=lineLT.length&&lineSelf.length<=lineLB.length) {

			} else if (lineLT.length<=lineLB.length&&lineLT.length<=lineSelf.length) {
				i%2==0?j--:null;
				i--;
			} else {
				i%2==0?null:j++;
				i--;
			}
		};
		clickFun(i, j);
	}
	function clickFun (i, j) {
		drawMap();
		var offsetY = i%2==0?0:gridH/2;
		drawDottedBorder(i,j,'#802',1);
		drawChar();
		if(dataMap[i][j]) {
			var time = new Date;
			var path = getPath([i,j],20);
			console.log(new Date-time);
			console.log(JSON.stringify(path));
			console.log(path);
			console.log(i,j);
			var offsetX = canvas.offsetLeft + canvas.style.borderLeft.substring(0,canvas.style.borderLeft.indexOf('px'))*1;
			var offsetY = canvas.offsetTop + canvas.style.borderTop.substring(0,canvas.style.borderTop.indexOf('px'))*1;
			mapImageData = ctx.getImageData(0,0,canvas.width,canvas.height);
			canvas.addEventListener('mousemove', function (e) {
				move(new Point(e.x-offsetX,e.y-offsetY),path);
			});
		}
	}
	function move (point,path) {
		var X = point.x - fiducialPoint.x - $('#canvasContainer').offset().left;
		var Y = point.y - fiducialPoint.y - $('#canvasContainer').offset().top;
		var w = gridW;
		var h = gridH;
		var i = X/w|0;
		var j = i%2==0?Y/h|0:(Y-h/2)/h|0;
		var x = X%w;
		var y = i%2==0?Y%h:(Y-h/2)%h;
		if (x>=w-R&&x<=w) {
		} else {
			var pointLT = new Point(-R/2,0);
			var pointLB = new Point(-R/2,h);
			var pointSelf = new Point(w-R/2,h/2);
			var point = new Point(x,y);
			var lineLT = new Line(point,pointLT);
			var lineLB = new Line(point,pointLB);
			var lineSelf = new Line(point,pointSelf);
			if (lineSelf.length<=lineLT.length&&lineSelf.length<=lineLB.length) {

			} else if (lineLT.length<=lineLB.length&&lineLT.length<=lineSelf.length) {
				i%2==0?j--:null;
				i--;
			} else {
				i%2==0?null:j++;
				i--;
			}
		};
		moveFun(i, j, path);
	}
	function moveFun (i, j, path) {
		// drawMap();
		var coord = [2,2];
		var currentCoord = [2,2];
		var targetCoord = [i,j];
		var arr = [[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]];
		var arr0 = [[1,1],[-1,1],[1,0],[-1,0],[0,1],[0,-1]];
		function arrAdd (arr1,arr2) {
			return [arr1[0]+arr2[0],arr1[1]+arr2[1]]
		}
		function arrLength (arr1,arr2) {
			return Math.abs(arr1[0]-arr2[0])+Math.abs(arr1[1]-arr2[1]);
		}
		var nextCoord = [2,2];
		var array = [];
		var nextArr = [];
		var nextLength = [];
		if(!path[[i,j]]) {
			return
		}
		var currentPath = path[[i,j]].path;
		drawMap();
		drawDottedBorder(i,j,'#3e7',10);
		for (var n = 0; n < currentPath.length; n++) {
			var i = currentPath[n][0];
			var j = currentPath[n][1];
			var offsetY = i%2==0?0:gridH/2;
			ctx.beginPath();
			ctx.arc(i*gridW,gridH*j+offsetY,3,0,Math.PI*2,true);
			ctx.closePath();
			ctx.fillStyle = '#70f';
			ctx.fill();
		};
		// drawChar();
		// if(dataMap[i][j]) {
		// 	var offsetX = canvas.offsetLeft + canvas.style.borderLeft.substring(0,canvas.style.borderLeft.indexOf('px'))*1;
		// 	var offsetY = canvas.offsetTop + canvas.style.borderTop.substring(0,canvas.style.borderTop.indexOf('px'))*1;
		// 	canvas.addEventListener('mousemove', function (e) {
		// 		move(new Point(e.x-offsetX,e.y-offsetY));
		// 	});
		// }
	}
	function Line (point1,point2) {
		this.point1 = point1;
		this.point2 = point2;
		this.length = Math.sqrt((point1.x - point2.x)*(point1.x - point2.x) + (point1.y - point2.y)*(point1.y - point2.y));
	}
	function start () {
		initMap();
		drawChar();
		var container = document.getElementById('canvasContainer');
		var offsetX = container.offsetLeft + container.style.borderLeft.substring(0,container.style.borderLeft.indexOf('px'))*1;
		var offsetY = container.offsetTop + container.style.borderTop.substring(0,container.style.borderTop.indexOf('px'))*1;
		canvas.oncontextmenu = function () {
			return false;
		};
		canvas.addEventListener('contextmenu',function (e) {
			console.log(e);
		})
		canvas.addEventListener('mousedown',function (e) {
			drag(new Point(e.x-offsetX,e.y-offsetY))
		});
		canvas.addEventListener('click',function(e){
			clickTest(new Point(e.x-offsetX,e.y-offsetY));
		});
	}
	function drag (point) {
		var X = point.x - fiducialPoint.x;
		var Y = point.y - fiducialPoint.y;
		// initMap();
	}
	function Solid () {
		this.img = {
			url: '',
			x:10,
			y:10,
			w:20,
			h:20,
		};

		this.draw = function () {
			
		}
		// this.imageData = 
	}
	function Point (x,y) {
		this.x = x;
		this.y = y;
	}

	function polygonDotted(ctx, n, x, y, r, angle, counterclockwise) {//多边形绘制
		ctx.beginPath();
		angle = angle || 0;
		counterclockwise = counterclockwise || false;
		ctx.moveTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
		var delta = 2 * Math.PI / n;
		for (var i = 0; i < n; i++) {
			var angle0 = angle;
			angle += counterclockwise ? -delta : delta;
			ctx.lineTo(x + r * Math.sin(angle0) + r * (Math.sin(angle) - Math.sin(angle0))/3, y - r * Math.cos(angle0) - r * (Math.cos(angle) - Math.cos(angle0))/3);
			ctx.moveTo(x + r * Math.sin(angle0) + r * (Math.sin(angle) - Math.sin(angle0))*2/3, y - r * Math.cos(angle0) - r * (Math.cos(angle) - Math.cos(angle0))*2/3);
			ctx.lineTo(x + r * Math.sin(angle), y - r * Math.cos(angle));

			// ctx.lineTo(x + r * Math.sin(angle), y - r * Math.cos(angle))
			// ctx.lineTo(x + r * Math.sin(angle0), y - r * Math.cos(angle0))
		}
		ctx.closePath();
	}

	function polygon(ctx, n, x, y, r, angle, counterclockwise) {//多边形绘制
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
	function getMapBlock () {
		canvas.width = 2*R;
		canvas.height = R*Math.sqrt(3);
		var blockUrlArr = ['gress','gress_sand','ice','land','land_black','sand','stone','stone_black','stone_red','water','water_black','water_blue'];
		var blockDataUrlArr = {};
		for(var i = 0; i < blockUrlArr.length; i++) {
			(function () {
				var img = new Image();//绘制地图
				var type = name;
				img.src = '../img/game/slg/mapMaterial/'+blockUrlArr[i]+'.png';
				imgOnloadNum ++;
				var pos = i;
				img.onload = function () {
					imgOnloadNum --;
					polygon(ctx, 6, R, R*Math.sqrt(3)/2, R, Math.PI/6);
					ctx.clip();
					ctx.drawImage(img,0,0);
					// mapMaterialData[type] = ctx.getImageData(0, 0, 2*R, R*Math.sqrt(3));
					// mapMaterialData[type] = new Image();
					blockDataUrlArr[blockUrlArr[pos]] = canvas.toDataURL();
					// ctx.restore();
					if (imgOnloadNum==0) {
						start();
						for(var name in blockDataUrlArr) {
							console.log(name+'\n'+blockDataUrlArr[name]);
						}
					};
				}
			})();
		}
	}
	// getMapBlock();//造地图块

	imgLoad(materialImgIds, '../img/game/slg/mapMaterial/sucai/', '.png', mapMaterialImgs, function () {
		imgLoad(charImgIds, '../img/game/slg/mapMaterial/char/', '.gif', charImgs, function () {
			start();
		});
	});
}

// ctx.putImageData(mapMaterialData[materialImgIds[map[i][j]]], i*gridW, gridH*j+offsetY)
// polygon(ctx, 6, i*gridW, gridH*j+offsetY, R, Math.PI/6);
// function polygon(ctx, n, x, y, r, angle, counterclockwise) {//多边形绘制
// 	angle = angle || 0;
// 	counterclockwise = counterclockwise || false;
// 	ctx.moveTo(x + r * Math.sin(angle),
// 		y - r * Math.cos(angle));
// 	var delta = 2 * Math.PI / n;
// 	for (var i = 1; i < n; i++) {
// 		angle += counterclockwise ? -delta : delta;
// 		ctx.lineTo(x + r * Math.sin(angle), y - r * Math.cos(angle));
// 	}
// 	ctx.closePath();
// }
// polygon(ctx, 3, 50, 70, 50);
// polygon(ctx, 4, 150, 60, 50, Math.PI / 4);
// polygon(ctx, 5, 255, 55, 50);
// polygon(ctx, 4, 365, 53, 20, Math.PI / 4, true);
// initMap();

// function getHexagonImageData () { //获取多边形imadata
// 	var saveMap = ctx.getImageData(0, 0, canvas.width, canvas.height);
// 	ctx.clearRect(0, 0, canvas.width,canvas.height);
// 	ctx.fillStyle = "#000";
// 	ctx.lineWidth = 0;
// 	polygon(ctx, 6, R, R*Math.sqrt(3)/2, R, Math.PI/6);
// 	ctx.fill();
// 	var hexagonImageData = ctx.getImageData(0,0,2*R,Math.sqrt(3)*R);
// 	ctx.putImageData(saveMap, 0, 0);
// 	return hexagonImageData;
// }

// var img = new Image();
// img.src = 'C:/Users/Zx/Downloads/pic225_大地图素材合集/ddt/daditu1.png';
// console.log(img);
// img.onload = function () {
// 	var hexagonImageData = getHexagonImageData();
// 	console.log(hexagonImageData);
// 	polygon(ctx, 6, R, R*Math.sqrt(3)/2, R, Math.PI/6);
// 	ctx.clip();
// 	ctx.drawImage(img,0,0);
// 	ctx.restore();
// 	ctx.drawImage(img,0,0);
// }

// canvas.width = 2*R;
// canvas.height = R*Math.sqrt(3);
// for(var name in mapMaterial) {
// 	(function () {
// 		var img = new Image();//绘制地图
// 		var type = name;
// 		img.src = mapMaterial[type];
// 		imgOnloadNum ++;
// 		img.onload = function () {
// 			imgOnloadNum --;
// 			polygon(ctx, 6, R, R*Math.sqrt(3)/2, R, Math.PI/6);
// 			ctx.clip();
// 			ctx.drawImage(img,0,0);
// 			// mapMaterialData[type] = ctx.getImageData(0, 0, 2*R, R*Math.sqrt(3));
// 			mapMaterialData[type] = new Image();
// 			mapMaterialData[type].url = canvas.toDataURL();
// 			ctx.restore();
// 			if (imgOnloadNum==0) {
// 				start();
// 			};
// 		}
// 	})();
// }

window.addEventListener('load', slg);