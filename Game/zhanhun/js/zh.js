(function($) {
	var ZhanHun = (function() {
		var a = function(data) {
			this.init(data);
		}
		var b = a.prototype;
		b.init = function(data) {
			this.data = data;
		}
		b.talk = function() {
			console.log("My name is " + this.name + "!\n" + "My level is " + this.level);
		}
		b.compound = function() {
			if (this.data.rebirth) {
				return;
			}
			if (!this.compoundable) {
				console.log("You need more!")
				return;
			}
			if (REQUESTS.compoundZhanHun(this.id)) {
				console.log("成功");
			} else {
				console.log("重试");
			}
		}
		b.stageUpdate = function() {

		}
		Object.defineProperty(b, "compoundable", {
			get: function() {
				if (this.data.num >= 10) {
					return 1;
				}
				return 0;
			}
		})
		return a;
	})()

	var REQUESTS = (function() {
		var a = {};
		a.compoundZhanHun = function(id) {
			$.ajax({
				url: "",
				data: "",
				success: function() {

				}
			})
		}
		return a;
	})()

	var PLAYER = (function() {
		var a = {};
		a.init = function(data) {
			this.data = data;
		}
		a.gain = function(obj) {
			for (name in obj) {
				if (name == "ZhanHun") {
					for (zhName in obj[name]) {
						a.data.soul[zhName].data.num += obj[name][zhName];
						a.data.soul[zhName].stageUpdate();
					}
					return;
				}
				a.data[name] += obj[name];
			}
		}
		return a;
	})()

})(JQuery)