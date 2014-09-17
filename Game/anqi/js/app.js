var ZxGame = {};
ZxGame.anqi = (function anqi() {
	var anqi = {};
	anqi.blackChessPieces = ['兵', '炮', '马', '車', '相', '士', '帅'];
	anqi.redChessPieces = ['卒', '砲', '马', '車', '象', '士', '将'];
	anqi.chessPiecesVal = ['0', '1', '2', '3', '4', '5', '6'];
	anqi.nums = [5, 2, 2, 2, 2, 2, 1];
	anqi.config = {
		gridW: 80,
		gridH: 80,
		totalNum: 32
	}
	// 总棋子(懒得一个一个写)
	anqi.allChessPieces = [];
	(function allChessPiecesSet() {
		var i, j, l;
		for (i = 0, l = anqi.blackChessPieces.length; i < l; i++) {
			for (j = 0; j < anqi.nums[i]; j++) {
				anqi.allChessPieces.push({
					name: anqi.blackChessPieces[i],
					color: 'black',
					val: anqi.chessPiecesVal[i]
				});
			};
		};
		for (i = 0, l = anqi.redChessPieces.length; i < l; i++) {
			for (j = 0; j < anqi.nums[i]; j++) {
				anqi.allChessPieces.push({
					name: anqi.redChessPieces[i],
					color: 'red',
					val: anqi.chessPiecesVal[i]
				});
			};
		};
	})()
	console.log(anqi.allChessPieces);
	/**
	 * 初始化
	 */
	anqi.init = function init() {
		this.stageDom = $('#stage');
		this.chessBoardDom = $('#chessboard');
		this.piecesDom = $('#pieces');
		this.tipAreaDom = $('#tip_area')
		this.player1 = {
			color: null,
			name: '玩家1'
		}
		this.player2 = {
			color: null,
			name: '玩家2'
		}
		this.colorDecided = 0;
		this.changePlayer(1);
		this.initChessBoard();
		this.initPieces();
		this.initClick();
	}
	/**
	 * 棋盘初始化
	 */
	anqi.initChessBoard = function initChessBoard() {
		this.chessBoardDom.find('tr').each(function(y, trDom) {
			$(trDom).find('td').each(function(x, tdDom) {
				$(tdDom).data({
					x: x,
					y: y
				})
			})
		})
	}
	/**
	 * 初始化棋子数据(乱序等)
	 */
	anqi.initPieces = function initPieces() {
		var randomIndex, pieceDom, dom, chessPiece, coords = [];
		this.chessPieces = this.allChessPieces.slice();
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 4; j++) {
				coords.push({
					x: i,
					y: j
				})
			};
		};
		for (var k = 0, l = this.chessPieces.length; k < l; k++) {
			randomIndex = Math.floor(Math.random() * coords.length);
			chessPiece = this.chessPieces[k];
			chessPiece.isBack = 1;
			dom = chessPiece.dom = $('<div></div>');
			dom.addClass('piece ' + chessPiece.color).data({
				index: i
			});
			this.piecesDom.append(dom);
			this.setCoord(k, coords[randomIndex]);
			coords.splice(randomIndex, 1);
		};
	}
	/**
	 * 初始化点击操作逻辑
	 */
	anqi.initClick = function initClick() {
		var self = this;
		self.chessBoardDom.click(function(e) {
			var clickedChessPiece, clickedChessPieceIndex, selectedChessPiece;
			//没点到棋盘
			if ($(e.target).data('x') == null) {
				return;
			}
			clickedChessPieceIndex = self.getChessPiecesIndexByCoord({
				x: $(e.target).data('x'),
				y: $(e.target).data('y')
			})
			//点击区域没有棋子
			if (clickedChessPieceIndex == -1) {
				return;
			}
			clickedChessPiece = self.chessPieces[clickedChessPieceIndex];
			//点击的棋子异常
			if (clickedChessPiece.isDead) {
				return;
			}
			//存在被选中棋子
			if (self.selectedIndex != null) {
				selectedChessPiece = self.chessPieces[self.selectedIndex];
				//异常情况
				if (selectedChessPiece.color != self.currentPlayer.color || selectedChessPiece.isDead || !self.colorDecided) {
					console.warn(selectedChessPiece, self.currentPlayer, "异常");
					return;
				}
				// 点击棋子未翻转
				if (clickedChessPiece.isBack) {
					self.removeSelect();
					return;
				}
				if (self.currentPlayer.color == clickedChessPiece.color) {
					//点击自己棋子
					self.select(clickedChessPieceIndex);
					return;
				} else {
					//点击对方棋子 
					if (self.attack(self.selectedIndex, clickedChessPieceIndex)) {
						// 攻击成功
						self.changePlayer();
						return;
					}
				}
			}
			if (clickedChessPiece.isBack) {
				// 点击未翻转棋子
				self.turn(clickedChessPieceIndex);
				self.changePlayer();
			} else if (self.colorDecided && clickedChessPiece.color == self.currentPlayer.color) {
				// 选中自己棋子
				self.select(clickedChessPieceIndex);
			}
		})
	}
	/**
	 * 通过棋盘坐标获取当前坐标棋子索引
	 * @param  {x:0,y:0} coord 棋盘坐标
	 * @return {Int} 当前坐标中棋子的索引
	 */
	anqi.getChessPiecesIndexByCoord = function getChessPiecesIndexByCoord(coord) {
		for (var i = 0; i < this.chessPieces.length; i++) {
			if (this.chessPieces[i].coord.x == coord.x && this.chessPieces[i].coord.y == coord.y) {
				return i;
			}
		};
		return -1
	}
	/**
	 * 选择棋子
	 * @param  {Int} index 被选择的棋子的索引
	 */
	anqi.select = function select(index) {
		if (this.selectedIndex == index) {
			return;
		}
		this.removeSelect();
		this.chessPieces[index].dom.addClass('selected');
		this.selectedIndex = index;
	}
	/**
	 * 去除棋子被选中状态
	 */
	anqi.removeSelect = function removeSelect() {
		if (this.selectedIndex != null) {
			this.chessPieces[this.selectedIndex].dom.removeClass('selected');
			this.selectedIndex = null;
		}
	}
	/**
	 * 设置棋子坐标
	 * @param {Int} index 棋子索引
	 * @param {x:0,y;0} coord 棋子坐标
	 */
	anqi.setCoord = function setCoord(index, coord) {
		this.chessPieces[index].dom.css({
			left: coord.x * this.config.gridW + 5,
			top: coord.y * this.config.gridH + 5
		})
		this.chessPieces[index].coord = coord;
	}
	anqi.move = function move(index, targetCoord) {}
	/**
	 * 背面状态翻转
	 * @param  {Int} index 翻转棋子的索引
	 */
	anqi.turn = function turn(index) {
		var chessPiece = this.chessPieces[index];
		chessPiece.isBack = 0;
		chessPiece.dom.text(chessPiece.name);
		if (!this.colorDecided) {
			if (this.currentPlayer == this.player1) {
				this.player1.color = chessPiece.color;
			} else if (this.player1.color != chessPiece.color) {
				this.player2.color = chessPiece.color;
				anqi.colorDecided = 1;
			}
		}
	}
	/**
	 * 改变当前操作玩家
	 */
	anqi.changePlayer = function changePlayer(playerId) {
		if (playerId != null) {
			anqi.currentPlayer = playerId == 1 ? anqi.player1 : anqi.player2;
		} else {
			anqi.currentPlayer = anqi.currentPlayer == anqi.player1 ? anqi.player2 : anqi.player1;
		}
		$('.piece.selected').removeClass('selected');
		this.tipAreaDom.text('当前玩家为' + this.currentPlayer.name);
	}
	anqi.attack = function attack(formIndex, toIndex) {
		var formChessPiece = this.chessPieces[formIndex],
			toChessPiece = this.chessPieces[toIndex];
		if (formChessPiece.val == 1) {
			if (this._haveAChessAmong(formIndex, toIndex)) {

			}
		}
	}
	anqi.eat = function eat(formIndex, toIndex) {
		var formChessPiece = this.chessPieces[formIndex],
			toChessPiece = this.chessPieces[toIndex];
		this.setCoord(formIndex, toIndex.coord);
		toChessPiece.isDead = 1;
		toChessPiece.coord = {
			x: -1,
			y: -1
		};
		toChessPiece.dom.addClass('hidden');
	}
	/**
	 * 判断两个棋子是否相邻
	 * @param  {Int}  index       比较的棋子1
	 * @param  {Int}  targetIndex 比较的棋子2
	 * @return {Boolean}             是否相邻
	 */
	anqi._isBeside = function _isBeside(index, targetIndex) {
		// 异常情况
		if (index == targetIndex || index == null || targetIndex == null || index < 0 || targetIndex < 0 || index > this.config.totalNum - 1 || targetIndex > this.config.totalNum - 1) {
			console.warn(index, targetIndex, "异常")
		}
		var chessPiece = this.chessPieces[index],
			targetChessPiece = this.chessPiece[targetIndex];
		if ((chessPiece.x == targetChessPiece.x && Math.abs(chessPiece.y - targetChessPiece.y) == 1) || (chessPiece.y == targetChessPiece.y && Math.abs(chessPiece.x - targetChessPiece.x) == 1)) {
			return 1;
		}
		return 0;
	}
	/**
	 * 两个棋子中间夹着一个用于炮
	 * @param  {Int} index       棋子1的索引
	 * @param  {Int} targetIndex 棋子2的索引
	 * @return {Boolean}             是否夹着
	 */
	anqi._haveAChessAmong = function _haveAChessAmong(index, targetIndex) {
		// 异常情况
		if (index == targetIndex || index == null || targetIndex == null || index < 0 || targetIndex < 0 || index > this.config.totalNum - 1 || targetIndex > this.config.totalNum - 1) {
			console.warn(index, targetIndex, "异常")
		}
		var chessPiece = this.chessPieces[index],
			targetChessPiece = this.chessPieces[targetIndex],
			min, max, index, totalNum;
		if (chessPiece.x == targetChessPiece.x) {
			totalNum = 0;
			min = Math.min(chessPiece.coord.y, targetChessPiece.coord.y);
			max = Math.max(chessPiece.coord.y, targetChessPiece.coord.y);
			for (var i = min + 1; i < max; i++) {
				index = this.getChessPiecesIndexByCoord({
					x: chessPiece.coord.x,
					y: i
				})
				if (index >= 0 && !this.chessPieces[index].isDead) {
					totalNum++;
				}
			};
			return totalNum == 1 ? 1 : 0;
		} else if (chessPiece.coord.y == targetChessPiece.coord.y) {
			totalNum = 0;
			min = Math.min(chessPiece.coord.x, targetChessPiece.coord.x);
			max = Math.max(chessPiece.coord.x, targetChessPiece.coord.x);
			for (var i = min + 1; i < max; i++) {
				index = this.getChessPiecesIndexByCoord({
					x: i,
					y: chessPiece.coord.y
				})
				if (index >= 0 && !this.chessPieces[index].isDead) {
					totalNum++;
				}
			};
			return totalNum == 1 ? 1 : 0;
		}
		return 0;
	}
	/**
	 * 游戏开始
	 */
	anqi.start = function start() {
		this.init();
	}
	return anqi;
})()
ZxGame.anqi.start();