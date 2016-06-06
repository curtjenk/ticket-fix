exports.generateCode = function (prefix, size) {
	var output = prefix;
	var digest="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	for(var i=0; i<size; i++) {
		var ndx = Math.floor(Math.random() * digest.length);
		//console.log(ndx);
		output += digest[ndx];
	}
	return output;
};
