/**
 * 时间格式化函数
 * @param  {date} date
 * @param  {string} typeString
 * @return {string}
 */
function format(date, typeString) {
	var dateObj = {
		y: date.getFullYear(), //年
		M: date.getMonth(), //月
		d: date.getDate(), //日
		w: date.getDay(), //星期
		h: date.getHours(), //时
		m: date.getMinutes(), //分
		s: date.getSeconds(), //秒
		S: date.getMilliseconds() //毫秒
	};
	var formatedString = "";
	for (var i = 0; i < typeString.length; i++) {
		if (typeString[i] == "y" && typeString[i + 1] == "y" && typeString[i + 2] != "y") {
			formatedString += dateObj["y"].toString().substr(2);
			i++;
		} else if (dateObj[typeString[i]]) {
			var arg = typeString[i];
			if (dateObj[typeString[i]].toString().length == 1 && typeString[i + 1] == arg && typeString[i + 2] != arg) {
				formatedString += "0" + dateObj[typeString[i]];
			} else {
				formatedString += dateObj[typeString[i]];
			}
			while (typeString[i + 1] == arg) {
				i++;
			}
		} else {
			formatedString += typeString[i];
		}
	};
	return formatedString;
}