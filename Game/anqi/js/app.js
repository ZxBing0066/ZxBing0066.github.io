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
		this.tipAreaDom = $('#tip_area');
		this.curTopIndex = 2;
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
		this.piecesDom.html('');
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
		self.chessBoardDom.unbind();
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
			//存在被选中棋子
			if (self.selectedIndex != null) {
				selectedChessPiece = self.chessPieces[self.selectedIndex];
				//异常情况
				if (selectedChessPiece.color != self.currentPlayer.color || selectedChessPiece.isDead || !self.colorDecided) {
					console.warn(selectedChessPiece, self.currentPlayer, "异常");
					return;
				}
				//点击区域没有棋子
				if (clickedChessPieceIndex == -1) {
					if (self._isBeside2(self.selectedIndex, {
						x: $(e.target).data('x'),
						y: $(e.target).data('y')
					})) {
						self.setCoord(self.selectedIndex, {
							x: $(e.target).data('x'),
							y: $(e.target).data('y')
						});
						self.changePlayer();
					}
					self.removeSelect();
					return;
				}
				clickedChessPiece = self.chessPieces[clickedChessPieceIndex];
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
						self.removeSelect();
						self.changePlayer();
						return;
					}
				}
			}
			//点击区域没有棋子
			if (clickedChessPieceIndex == -1) {
				return;
			}
			clickedChessPiece = self.chessPieces[clickedChessPieceIndex];
			//点击的棋子异常
			if (clickedChessPiece.isDead) {
				return;
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
		this.tipAreaDom.text('当前玩家为:' + this.currentPlayer.name + (this.colorDecided ? '  ' + this.currentPlayer.color : ''));
	}
	/**
	 * 攻击操作
	 * @param  {Int} formIndex 发起棋子索引
	 * @param  {Int} toIndex   被攻击棋子索引
	 * @return {[type]}           [description]
	 */
	anqi.attack = function attack(formIndex, toIndex) {
		var formChessPiece = this.chessPieces[formIndex],
			toChessPiece = this.chessPieces[toIndex];
		if (formChessPiece.isDead) {
			console.warn(formIndex, toIndex, "异常");
			return 0;
		}
		if (formChessPiece.val == 1) {
			if (this._haveAChessAmong(formIndex, toIndex)) {
				this.eat(formIndex, toIndex);
				return 1;
			}
		} else {
			if (this._isBeside(formIndex, toIndex)) {
				if (formChessPiece.val == 6 && toChessPiece.val == 0) {
					return 0;
				}
				if (formChessPiece.val == 0 && toChessPiece.val == 6) {
					this.eat(formIndex, toIndex);
					return 1;
				};
				if (formChessPiece.val >= toChessPiece.val) {
					this.eat(formIndex, toIndex);
					return 1;
				}
			}
		}
		return 0;
	}
	/**
	 * 吃子
	 * @param  {Int} formIndex 吃的棋子索引
	 * @param  {Int} toIndex   被吃的棋子索引
	 */
	anqi.eat = function eat(formIndex, toIndex) {
		var formChessPiece = this.chessPieces[formIndex],
			toChessPiece = this.chessPieces[toIndex];
		formChessPiece.dom.css('z-index', this.curTopIndex++);
		this.setCoord(formIndex, toChessPiece.coord);
		toChessPiece.isDead = 1;
		this.setCoord(toIndex, {
			x: -1,
			y: -1
		});
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
			coord = chessPiece.coord,
			targetChessPiece = this.chessPieces[targetIndex],
			targetCoord = targetChessPiece.coord;
		if ((coord.x == targetCoord.x && Math.abs(coord.y - targetCoord.y) == 1) || (coord.y == targetCoord.y && Math.abs(coord.x - targetCoord.x) == 1)) {
			return 1;
		}
		return 0;
	}
	anqi._isBeside2 = function _isBeside(index, targetCoord) {
		var chessPiece = this.chessPieces[index],
			coord = chessPiece.coord;
		if ((coord.x == targetCoord.x && Math.abs(coord.y - targetCoord.y) == 1) || (coord.y == targetCoord.y && Math.abs(coord.x - targetCoord.x) == 1)) {
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
			coord = chessPiece.coord,
			targetChessPiece = this.chessPieces[targetIndex],
			targetCoord = targetChessPiece.coord,
			min, max, index, totalNum;
		if (coord.x == targetCoord.x) {
			totalNum = 0;
			min = Math.min(coord.y, targetCoord.y);
			max = Math.max(coord.y, targetCoord.y);
			for (var i = min + 1; i < max; i++) {
				index = this.getChessPiecesIndexByCoord({
					x: coord.x,
					y: i
				})
				if (index >= 0 && !this.chessPieces[index].isDead) {
					totalNum++;
				}
			};
			return totalNum == 1 ? 1 : 0;
		} else if (coord.y == targetCoord.y) {
			totalNum = 0;
			min = Math.min(coord.x, targetCoord.x);
			max = Math.max(coord.x, targetCoord.x);
			for (var i = min + 1; i < max; i++) {
				index = this.getChessPiecesIndexByCoord({
					x: i,
					y: coord.y
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