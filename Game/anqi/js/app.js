var ZxGame = {};
ZxGame.anqi = (function anqi() {
	var anqi = {};
	anqi.blackChessPieces = ['兵', '炮', '马', '車', '相', '士', '帅'];
	anqi.redChessPieces = ['卒', '砲', '马', '車', '象', '士', '将'];
	anqi.chessPiecesVal = ['0', '1', '2', '3', '4', '5', '6'];
	anqi.nums = [5, 2, 2, 2, 2, 2, 1];
	// 总棋子
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
		anqi.chessboardDom = $('#chessboard');
		anqi.piecesDom = $('#pieces');
		anqi.piecesDoms = [];
		anqi.player1 = {
			color: null
		}
		anqi.player2 = {
			color: null
		}
		anqi.colorDecided = 0;
		anqi.currentPlayer = anqi.player1;

		function initPieces() {
			var clonedAllChessPieces = anqi.allChessPieces.slice(),
				randomIndex, pieceDom;
			anqi.randomedChessPieces = [];
			for (var i = 0, l = clonedAllChessPieces.length; i < l; i++) {
				randomIndex = Math.floor(Math.random() * clonedAllChessPieces.length)
				anqi.randomedChessPieces.push(clonedAllChessPieces[randomIndex]);
				pieceDom = $('<div></div>');
				pieceDom.addClass("piece").addClass(clonedAllChessPieces[randomIndex].color);
				pieceDom.data('val', clonedAllChessPieces[randomIndex].val);
				pieceDom.data('name', clonedAllChessPieces[randomIndex].name);
				pieceDom.data('index', i);
				pieceDom.data('back', 1)
				pieceDom.data('color', clonedAllChessPieces[randomIndex].color)
				anqi.piecesDom.append(pieceDom);
				anqi.piecesDoms.push(pieceDom);
				clonedAllChessPieces.splice(randomIndex, 1);
			}
		}
		initPieces();
		for (var i = 0, l = anqi.piecesDoms.length; i < l; i++) {
			anqi.move(i, {
				x: i % 8,
				y: i / 8 | 0
			})
		};

		function initClick() {
			var piecesDoms = $('.piece');
			piecesDoms.click(function clickHandle(e) {
				var index = $(e.currentTarget).data('index');
				var isBack = $(e.currentTarget).data('back');
				var color = $(e.currentTarget).data('color');
				isBack ? anqi.turn(index) : (anqi.colorDecided && color == anqi.currentPlayer.color ? anqi.select(index) : null);
				if (anqi.getSelectedIndex() >= 0) {}
			})
		}
		initClick();
	}
	anqi.config = {
		gridW: 80,
		gridH: 80
	}
	anqi.select = function select(index) {
		$('.piece.selected').removeClass('selected');
		anqi.piecesDoms[index].addClass('selected');
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
	anqi.changePlayer = function changePlayer() {
		anqi.currentPlayer == anqi.player1 ? anqi.currentPlayer = anqi.player2 : anqi.currentPlayer = anqi.player1;
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