function block () {
	var bgColors = ['#333','#435','#f3e','#5ae','#cc7','#a8a'];
	var borderColors = ['#a33','#4d5','#f8e','#52e','#fa7','#68a'];
	var blockW = 16;
	var borderW = 2;
	var blockMap = [];
	var W = 500;
	var H = 600;
	var X = 18;
	var Y = 30;
	var ctx = document.getElementById('block').getContext('2d');
	var currentBlock;
	var nextBlock;
	var T;
	ctx.lineWidth = borderW;
	var blockShapes = [
		[[[0,1],[1,1],[2,1],[3,1]], [[1,0],[1,1],[1,2],[1,3]]],//shu
		[[[0,0],[0,1],[1,1],[1,2]], [[0,1],[1,1],[1,0],[2,0]]],//z
		[[[0,2],[0,1],[1,1],[1,0]], [[0,0],[1,0],[1,1],[2,1]]],//反 z
		[[[0,0],[0,1],[1,1],[2,1]], [[0,2],[1,2],[1,1],[1,0]], [[2,1],[2,0],[1,0],[0,0]], [[1,0],[0,0],[0,1],[0,2]]],//7
		[[[0,1],[0,0],[1,0],[2,0]], [[1,2],[0,2],[0,1],[0,0]], [[2,0],[2,1],[1,1],[0,1]], [[0,0],[1,0],[1,1],[1,2]]],//反7
		[[[0,1],[1,0],[1,1],[1,2]], [[1,1],[0,0],[1,0],[2,0]], [[1,1],[0,2],[0,1],[0,0]], [[1,0],[2,1],[1,1],[0,1]]],//tu
		[[[0,0],[0,1],[1,0],[1,1]]]//fangkuai
	];
	function blockCreate () {
		var returnObj = {};
		var i = bgColors.length*Math.random()|0;
		returnObj.colorPos = i+1;
		returnObj.bgColor = bgColors[i];
		returnObj.borderColor = borderColors[i];
		i = blockShapes.length*Math.random()|0;
		returnObj.blockPos = [i, blockShapes[i].length*Math.random()|0];
		returnObj.x = 5;
		returnObj.y = 0;
		return returnObj;
	}
	function init () {
		blockMap = [];
		var line = []
		for(var i = 0; i < Y; i++) {
			line = []
			for(var j = 0; j < X; j++) {
				line.push(0);
			}
			blockMap.push(line)
		}
		currentBlock = blockCreate();
		nextBlock = blockCreate();
		nextBlockDraw();
		T = setInterval(moveDown,500);
		ctx.fillStyle = '#0f6';
		ctx.strokeStyle = '#f26';
		ctx.beginPath();
		ctx.lineCap='butt';
		ctx.moveTo(X*20+2,0);
		ctx.lineTo(X*20+2,H);
		ctx.fill();
		ctx.stroke();
	}
	function clear () {
		var shape = blockShapes[currentBlock.blockPos[0]][currentBlock.blockPos[1]];
		var l = shape.length;
		for (var i = 0; i < l; i++) {
			ctx.clearRect(20*(shape[i][1]+currentBlock.x),20*(shape[i][0]+currentBlock.y),blockW+2*borderW,blockW+2*borderW);
		};
	}
	function draw () {
		ctx.strokeStyle = currentBlock.borderColor;
		ctx.fillStyle = currentBlock.bgColor;
		var shape = blockShapes[currentBlock.blockPos[0]][currentBlock.blockPos[1]];
		var l = shape.length;
		for (var i = 0; i < l; i++) {
			ctx.fillRect(20*(shape[i][1]+currentBlock.x)+borderW,20*(shape[i][0]+currentBlock.y)+borderW,blockW,blockW);
			ctx.strokeRect(20*(shape[i][1]+currentBlock.x)+borderW/2,20*(shape[i][0]+currentBlock.y)+borderW/2,blockW+borderW/2,blockW+borderW/2);
		};
	}
	function blockMapDraw () {
		ctx.clearRect(0,0,20*X,30*Y);
		for(var i = 0; i < Y; i++) {
			for(var j = 0; j < X; j++) {
				if(blockMap[i][j]!=0) {
					ctx.strokeStyle = borderColors[blockMap[i][j]-1];
					ctx.fillStyle = bgColors[blockMap[i][j]-1];
					ctx.fillRect(20*j+borderW,20*i+borderW,blockW,blockW);
					ctx.strokeRect(20*j+borderW/2,20*i+borderW/2,blockW+borderW/2,blockW+borderW/2);
				}
			}
		}
	}
	function nextBlockDraw () {
		ctx.clearRect(400,100,100,100);
		ctx.strokeStyle = nextBlock.borderColor;
		ctx.fillStyle = nextBlock.bgColor;
		var shape = blockShapes[nextBlock.blockPos[0]][nextBlock.blockPos[1]];
		var l = shape.length;
		for (var i = 0; i < l; i++) {
			ctx.fillRect(20*shape[i][1]+400+borderW,20*shape[i][0]+100+borderW,blockW,blockW);
			ctx.strokeRect(20*shape[i][1]+400+borderW/2,20*shape[i][0]+100+borderW/2,blockW+borderW/2,blockW+borderW/2);
		};
	}
	function hitTest () {
		try {
			var shape = blockShapes[currentBlock.blockPos[0]][currentBlock.blockPos[1]];
			var l = shape.length;
			for (var i = 0; i < l; i++) {
				if(shape[i][0]+currentBlock.y<0||shape[i][0]+currentBlock.y>=Y||shape[i][1]+currentBlock.x<0||shape[i][1]+currentBlock.x>=X||blockMap[shape[i][0]+currentBlock.y][shape[i][1]+currentBlock.x]!=0) {
					return true;
				};
			};
			return false;
		} catch (e) {
			debugger
			return true;
		}
	}
	function clearTest() {
		for(var i = Y-1; i >= 0; i--) {
			if(blockMap[i].indexOf(0)==-1) {
				for(var j = i; j > 0; j--) {
					blockMap[j] = blockMap[j-1];
				};
				blockMap[0] = [];
				for(var j = 0; j < X; j++) {
					blockMap[0].push(0);
				}
				i++;
			}
		}
		blockMapDraw();
	}
	function moveLeft () {
		clear();
		currentBlock.x--;
		if(hitTest()) {
			currentBlock.x++;
		}
		draw();
	}
	function moveRight () {
		clear();
		currentBlock.x++;
		if(hitTest()) {
			currentBlock.x--;
		}
		draw();
	}
	function moveDown () {
		clearInterval(T);
		clear();
		currentBlock.y++;
		if(hitTest()) {
			currentBlock.y--;
			draw();
			currentEnd();
		} else {
			draw();
		}
		T = setInterval(moveDown,500);
	}
	function rotate () {
		clear();
		var blockPosBackup = currentBlock.blockPos[1];
		currentBlock.blockPos[1] = ++currentBlock.blockPos[1]%blockShapes[currentBlock.blockPos[0]].length;
		draw();
	}
	function currentEnd() {
		var shape = blockShapes[currentBlock.blockPos[0]][currentBlock.blockPos[1]];
		var l = shape.length;
		for (var i = 0; i < l; i++) {
			blockMap[shape[i][0]+currentBlock.y][shape[i][1]+currentBlock.x]=currentBlock.colorPos;
		};
		clearTest();
		currentBlock = nextBlock;
		nextBlock = blockCreate();
		nextBlockDraw();
		if(hitTest()) {
			clearInterval(T);
			document.removeEventListener('keydown',keyDown);
			gameover();
		}
	}
	function gameover () {
		ctx.clearRect(0,0,W,H);
		ctx.fillText('GAMEOVER!!!',0,0);
		ctx.font="30px Verdana";
		// 创建渐变
		var gradient=ctx.createLinearGradient(0,0,300,0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		// 用渐变填色
		ctx.fillStyle=gradient;
		ctx.fillText("GAMEOVER!!!",100,90);
	}
	var keyCOdeObj = {
		W:87,
		A:65,
		S:83,
		D:68
	}
	function keyDown(e) {
		switch(e.keyCode) {
			case keyCOdeObj.A: {
				moveLeft();
				break;
			}
			case keyCOdeObj.D: {
				moveRight();
				break;
			}
			case keyCOdeObj.W: {
				rotate();
				break;
			}
			case keyCOdeObj.S: {
				moveDown();
				break;
			}
		}
	}
	document.addEventListener('keydown',keyDown);
	init();
}

window.addEventListener('load', block);