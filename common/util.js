const util = {

}

util.formatUrl = (context,url) => {
	var index = url.indexOf("http");
	if (index == 0) {
		return url;
	}
	
	return context.$store.state.baseUrl + url;
}
util.formatSize = (context) => {
	let that = context;
	plus.cache.calculate(function(size) {
		let sizeCache = parseInt(size);
		if (sizeCache == 0) {
			that.fileSizeString = "0B";
		} else if (sizeCache < 1024) {
			that.fileSizeString = sizeCache + "B";
		} else if (sizeCache < 1048576) {
			that.fileSizeString = (sizeCache / 1024).toFixed(2) + "KB";
		} else if (sizeCache < 1073741824) {
			that.fileSizeString = (sizeCache / 1048576).toFixed(2) + "MB";
		} else {
			that.fileSizeString = (sizeCache / 1073741824).toFixed(2) + "GB";
		}
	});
}
export default util
 