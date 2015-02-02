var ZxSort = (function() {
	var a = function() {
		this.init();
	}
	var b = a.prototype;
	// 初始化
	b.init = function() {
		this._initDefaultArr(100);
	}
	// 重置自带乱序数组
	b._initDefaultArr = function(l) {
		this.defaultArr = [];
		while (l) {
			l--;
			this.defaultArr.push(Math.random() * 200 | 0);
		}
		console.log("自带数组重置为" + this.defaultArr);
	}
	// 数组浅克隆
	b._arrClone = function(arr) {
		return arr.slice(0);
	}
	// 快速排序
	b.quickSort = function(arr) {
		var clonedArr = b._arrClone(arr);
		var lowIndex = 0;
		var highIndex = clonedArr.length - 1;

		function sort(low, high) {
			if (low === high) {
				return;
			};
			var key = clonedArr[low];
			while (low < high) {
				key > clonedArr[high] ? exchange(clonedArr, low, key) : null;
			}
		}

		function exchange(arr, index0, index1) {
			var copy = arr[index0];
			arr[index0] = arr[index1];
			arr[index1] = copy;
		}
		return clonedArr;
	}

	b.sortQuick = function(arr) {
		if (!arr) {
			arr = this.defaultArr;
		};
		console.log(quickSort(arr, 0, arr.length - 1));

		function quickSort(arr, l, r) {
			debugger
			if (l < r) {
				var mid = arr[parseInt((l + r) / 2)],
					i = l - 1,
					j = r + 1;
				while (true) {
					while (arr[++i] < mid);
					while (arr[--j] > mid);
					if (i >= j) break;
					var temp = arr[i];
					arr[i] = arr[j];
					arr[j] = temp;
				}
				quickSort(arr, l, i - 1);
				quickSort(arr, j + 1, r);
			}
			return arr;
		}
	}

	return a;
})()

new ZxSort().sortQuick();