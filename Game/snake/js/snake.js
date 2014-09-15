function snake() {
	var ctx = document.getElementById('snake').getContext('2d');
	var W = 500;
	var N = 25;
	var pause = false;
	var position = 'w';
	var snakeHead = [22,12];
	var snakeBody = [[23,12],[24,12]];
	var food = foodCreate();
	var T;
	var levelObj = {
		score:0,
		get level() {
			return this.score/10|0;
		},
		get interval() {
			return 500-20*this.level;
		}
	}
	function move() {
		snakeBody.unshift(snakeHead.slice(0));
		switch(position) {
			case 'w': {
				snakeHead[0]--;
				break;
			} case 'a': {
				snakeHead[1]--;
				break;
			} case 's': {
				snakeHead[0]++;
				break;
			} case 'd': {
				snakeHead[1]++;
				break;
			} 
		};
		if(hitTest(snakeHead,[food])) {
			levelObj.score++;
			food = foodCreate();
		} else {
			snakeBody.pop();
		}
		if(hitTest(snakeHead,snakeBody)||snakeHead[0]>24||snakeHead[0]<0||snakeHead[1]>24||snakeHead[1]<0) {
			over();
			return false;
		};
		return true;

	}
	function over() {
		clearTimeout(T);
		alert("over");
	}
	function foodCreate() {
		var point;
		while(!point||hitTest(point,snakeBody)||hitTest(point,[snakeHead])) {
			var y = Math.floor(25*Math.random());
			var x = Math.floor(25*Math.random());
			point = [y,x];
		}
		return point;
	}
	function hitTest(point,arr) {
		for (var i = arr.length - 1; i >= 0; i--) {
			if(arr[i][0] == point[0]&&arr[i][1] == point[1]) {
				return true;
			}
		};
		return false
	}

	function mainLoop(){
		T = setTimeout(mainLoop, levelObj.interval);
		if(move()) {
			draw();
		}
	}

	function draw() {
		ctx.canvas.width = ctx.canvas.width;
		ctx.font='20px Georgia';
		ctx.fillText('score:'+levelObj.score,200,20);
		ctx.fillText('level:'+levelObj.level,300,20);
		ctx.fillStyle='rgba(50,50,50,0.7)';
		ctx.fillRect(snakeHead[1]*20,snakeHead[0]*20,20,20);
		ctx.fillStyle='rgba(150,10,50,0.7)';
		ctx.fillRect(food[1]*20,food[0]*20,20,20);
		ctx.fillStyle='rgba(50,0,0,0.7)';
		for (var i = snakeBody.length - 1; i >= 0; i--) {
			ctx.fillRect(snakeBody[i][1]*20,snakeBody[i][0]*20,20,20);
		};
	}

	function start(e) {
		draw();
		if(e.keyCode==13) {
			document.removeEventListener('keyup',start);
			document.addEventListener('keydown',keyDown);
			mainLoop();
		}
	}

	var keyCOdeObj = {
		W:87,
		A:65,
		S:83,
		D:68
	}

	function keyDown(e) {
		if (position=='w'||position=='s') {
			switch(e.keyCode) {
				case keyCOdeObj.A: {
					position = 'a';
					break;
				}
				case keyCOdeObj.D: {
					position = 'd';
					break;
				}
			}
		} else if (position=='a'||position=='d') {
			switch(e.keyCode) {
				case keyCOdeObj.W: {
					position = 'w';
					break;
				}
				case keyCOdeObj.S: {
					position = 's';
					break;
				}
			}
		};
	}
	document.addEventListener('keyup',start);
	draw();
}

window.addEventListener('load', snake);