function CodeShow() {
	var asInfo = {_html:'', nbsp:'  ', rowNum:0, cssAr:['cl1', 'cl2', 'cl3'], addClass:''};

	asInfo.structureHtml = function (data) {
		this._html = this.addClass = '';
		if(typeof data == 'object' && data) asInfo.fnObj(data, this.nbsp);
		return this._html;
	}

	asInfo.fnObj = function (obj, nbspz) {
		var n = 0, m = asInfo.length(obj), c = ',';
		for(var dr in obj){
			n++;
			if(n == m){ c = '' }

			if(!obj[dr]){
				asInfo.fnAsHTml( (nbspz.length ? (nbspz.slice(2)+''+dr) : dr)+':', obj[dr], c);
				continue;
			}

			if (typeof obj[dr] == 'object') {
				if(obj[dr] instanceof Array){
					asInfo.fnArray( nbspz.length?(nbspz.slice(2)+dr):dr, obj[dr], nbspz, c )
				}else{
					asInfo.fnAsHTml( (nbspz.length?(nbspz.slice(2)+dr):dr)+':{', '' )
					asInfo.fnObj(obj[dr], nbspz+this.nbsp)
					asInfo.fnAsHTml( nbspz.length?(nbspz.slice(2)+'}'):'}', '', c)
				}
				continue;
			} else {
				asInfo.fnAsHTml( (nbspz.length ? (nbspz.slice(2)+''+dr) : dr)+': ', obj[dr], c);
			}
		}
	}

	asInfo.fnArray = function (name, arr, nbspz, c) {
		var isListStr = false, _c = ',';
		if(!arr.length) return;

		asInfo.fnAsHTml(name+':[', '')

		for (var i = 0; i < arr.length; i++) {
			if (typeof arr[i] == 'object') {
				if(arr[i] instanceof Array){
					asInfo.fnArray(arr[i])
				}else{
					var _nbspz = i == arr.length-1 ? nbspz+'}' : nbspz+'},'
					asInfo.fnAsHTml( nbspz+'{', '' )
					asInfo.fnObj( arr[i], nbspz+this.nbsp+this.nbsp )
					asInfo.fnAsHTml( _nbspz,'' )
				}
			} else {
				if(i == arr.length-1) { _c = '' }
				asInfo.fnAsHTml( nbspz, arr[i], _c)
			}
		}

		asInfo.fnAsHTml(nbspz.slice(2)+']', '', c)
	}

	asInfo.fnAsHTml = function (ttl, str, c) {
		asInfo.fnAddClass()
		._html += ttl+'<span class='+this.cssAr[0]+'>'+(typeof(str)=='number'?str:(str?'"'+str+'"':''))+'</span>'+(c?c:'')+' <br/>';
	}

	asInfo.fnAddClass = function () {
		this.addClass = this.rowNum%2==0 ? this.cssAr[0] : this.cssAr[1];
		this.rowNum++;
		return this;
	}

	asInfo.length = function (obj) {
		var i = 0;
		for(var d in obj){
			i++;
		}
		return i;
	}

	return asInfo;
}

var cd = new CodeShow()