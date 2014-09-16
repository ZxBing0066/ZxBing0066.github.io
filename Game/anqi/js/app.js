var ZxGame = {};
ZxGame.anqi = (function anqi() {
	var anqi = {};
	anqi.blackChessPieces = ['兵', '炮', '马', '車', '相', '士', '帅'];
	anqi.redChessPieces = ['卒', '砲', '马', '車', '象', '士', '将'];
	anqi.chessPiecesVal = ['0', '1', '2', '3', '4', '5', '6'];
	anqi.nums = [5, 2, 2, 2, 2, 2, 1];
	// 总棋子(懒得一个一个写)
	anqi.allChessPieces = [];
	(function allChessPiecesSet() {
		for (var i = 0; i < anqi.blackChessPieces.length; i++) {
			for (var j = 0; j < anqi.nums[i]; j++) {
				anqi.allChessPieces.push({
					name: anqi.blackChessPieces[i],
					color: 'black',
					val: anqi.chessPiecesVal[i]
				});
			};
		};
		for (var i = 0; i < anqi.redChessPieces.length; i++) {
			for (var j = 0; j < anqi.nums[i]; j++) {
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
		anqi.stageDom = $('#stage');
		anqi.chessBoardDom = $('#chessboard');
		anqi.piecesDom = $('#pieces');
		anqi.player1 = {
			color: null,
			name: "玩家1"
		}
		anqi.player2 = {
			color: null,
			name: "玩家2"
		}
		anqi.colorDecided = 0;
		anqi.changePlayer(1);
		anqi.initChessBoard();
		anqi.initPieces();
		anqi.initClick();
	}
	anqi.initClick = function initClick() {
		var piecesDoms = $('.piece');
		piecesDoms.click(function clickHandle(e) {
			var index = $(e.currentTarget).data('index');
			var isBack = $(e.currentTarget).data('back');
			var color = $(e.currentTarget).data('color');
			isBack ? anqi.turn(index) : (anqi.colorDecided && color == anqi.currentPlayer.color ? anqi.select(index) : null);
			if (anqi.getSelectedIndex() >= 0) {}
		})
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
		var randomIndex, pieceDom, coords = [],
			dom, chessPiece;
		anqi.chessPieces = anqi.allChessPieces.slice();
		for (var i = 0; i < 8; i++) {
			for (var j = 0; j < 4; j++) {
				coords.push({
					x: i,
					y: j
				})
			};
		};
		for (var k = 0, l = anqi.chessPieces.length; k < l; k++) {
			randomIndex = Math.floor(Math.random() * coords.length);
			chessPiece = anqi.chessPieces[k];
			dom = chessPiece.dom = $('<div></div>');
			dom.addClass("piece", chessPiece.color).data({
				index: i
			});
			anqi.piecesDom.append(dom);
			anqi.setCoord(k, coords[randomIndex]);
			coords.splice(randomIndex, 1);
		};
	}
	anqi.config = {
		gridW: 80,
		gridH: 80
	}
	anqi.select = function select(index) {
		$('.piece.selected').removeClass('selected');
		anqi.piecesDoms[index].addClass('selected');
	}
	/**
	 * 设置棋子坐标
	 * @param {Int} index 棋子索引
	 * @param {x:0,y;0} coord 棋子坐标
	 */
	anqi.setCoord = function setCoord(index, coord) {
		anqi.chessPieces[index].dom.css({
			left: coord.x * anqi.config.gridW + 5,
			top: coord.y * anqi.config.gridH + 5
		})
		anqi.chessPieces[index].coord = coord;
	}
	anqi.move = function move(index, targetCoord) {
		anqi.piecesDoms[index].css("left", anqi.config.gridW * targetCoord.x + 5);
		anqi.piecesDoms[index].css("top", anqi.config.gridH * targetCoord.y + 5);
	}
	anqi.turn = function turn(index) {
		anqi.piecesDoms[index].text(anqi.piecesDoms[index].data('name')).data('back', 0);
		if (!anqi.colorDecided) {
			var color = anqi.piecesDoms[index].data('color');
			if (anqi.currentPlayer == anqi.player1) {
				anqi.player1.color = color;
			} else if (anqi.player1.color == color) {
				anqi.player1.color = null
			} else {
				anqi.player2.color = color;
				anqi.colorDecided = 1;
			}
		}
		anqi.changePlayer();
	}
	anqi.getSelectedIndex = function getSelectedIndex() {
		return $('.piece.selected').length > 0 ? $('.piece.selected').index() : -1;
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
	}
	anqi.start = function start() {}
	return anqi;
})()
ZxGame.anqi.init();
ZxGame.anqi.start();
/**
 * 棋子乱序
 * 点击事件
 *
 */