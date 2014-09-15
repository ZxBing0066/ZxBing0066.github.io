function reset() {
	var allChessPieces = [];
	var anqi = document.getElementById('anqi');
	function allChessPiecesSet () {
		for (var i = 0; i < blackChessPieces.length; i++) {
			for (var j = 0; j < nums[i]; j++) {
				allChessPieces.push({
					name : blackChessPieces[i],
					color : 'black',
					val : chessPiecesVal[i]
				});
			};
		};
		for (var i = 0; i < redChessPieces.length; i++) {
			for (var j = 0; j < nums[i]; j++) {
				allChessPieces.push({
					name : redChessPieces[i],
					color : 'red',
					val : chessPiecesVal[i]
				});
			};
		};
	}
	allChessPiecesSet();
	console.log(allChessPieces);
	var chessList = arrClone(allChessPieces);
	for (var i = 0; i < allChessPieces.length; i++) {
		var pos = Math.random()*chessList.length|0;
		var qige = document.createElement('span');
		qige.className = 'qige';
		var qizi = document.createElement('span');
		qizi.className = 'qizi back ' + allChessPieces[i].color;
		qizi.text = allChessPieces[i].val;
		qige.appendChild(qizi);
		anqi.appendChild(qige);
	};
}

function arrClone (clonedArr) {
	var arr = [];
	for (var i = 0; i < clonedArr.length; i++) {
		arr.push(clonedArr[i]);
	};
	return arr;
}

var blackChessPieces = ['兵', '炮', '马', '車', '相', '士', '帅'];
var redChessPieces = ['卒', '砲', '马', '車', '象', '士', '将'];
var chessPiecesVal = ['0','1','2','3','4','5','6'];
var nums = [5, 2, 2, 2, 2, 2, 1];

reset();

