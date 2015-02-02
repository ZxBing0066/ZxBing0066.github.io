/**
 * 获取浏览器cookie
 * @param  {String} name
 * @return {String}
 */
function getCookie(name) {
	var cookieStr = document.cookie;
	if (cookieStr.length <= 0) {
		return
	}
	var cookieArr = cookieStr.split('; '),
		cookieObj = {},
		splitNameVal;
	for (var i = cookieArr.length - 1; i >= 0; i--) {
		splitNameVal = cookieArr[i].split('=');
		cookieObj[splitNameVal[0]] = splitNameVal[1];
	};
	if (!name || name == '') {
		return cookieObj;
	}
	return cookieObj[name];
}
/**
 * 设置浏览器cookie
 * @param {String} name
 * @param {String} value
 * @param {Int} expires
 * @param {String} path
 * @param {String} domain
 */
function setCookie(name, value, expires, path, domain) {
	var cookieStr = '';
	cookieStr = name + '=' + escape(value) + ';';
	//cookie有效期时间
	if (expires != undefined) {
		expires = +expires;
		var now = new Date();
		var time = +now + expires * 1000;
		var newDate = new Date(time);
		var expiresDate = newDate.toGMTString(); //转换成GMT 格式。
		cookieStr += 'expires=' + expiresDate + ';';
	}
	//目录
	if (path != undefined) {
		cookieStr += 'path=' + path + ';';
	}
	//域名
	if (domain != undefined) {
		cookieStr += 'domain=' + domain + ';';
	}
	document.cookie = cookieStr;
}
/**
 * 删除某cookie
 * @param  {String} name
 */
function deleteCookie(name) {
	setCookie(name, '', -999);
}