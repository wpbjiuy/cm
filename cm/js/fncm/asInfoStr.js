function FnAsInfo(){
	var asInfo = {_html:'', ttl:'', rowNum:0, cssAr:['fl list w2 mr', 'fl list w2'], addClass:''};

	asInfo.structureHtml = function (data) {
		if(typeof data == 'object' && data) asInfo.fnObj(data, this.ttl);
		return this._html;
	}

	asInfo.fnObj = function (obj, ttl) {
		for(var dr in obj){
			if (typeof obj[dr] == 'object') {
				var _ttl = ttl?ttl+' -> '+dr:dr
				if(obj[dr] instanceof Array){
					asInfo.fnArray(_ttl, obj[dr])
				}else{
					asInfo.fnObj(obj[dr], _ttl)
				}
			} else {
				asInfo.fnAsHTml(_ttl, obj[dr])
			}
		}
		this.ttl = '';
	}

	asInfo.fnArray = function (name, arr) {
		var isListStr = false;
		if(!arr.length) return;
		for (var i = 0; i < arr.length; i++) {
			if (typeof arr[i] == 'object') {
				if(arr[i] instanceof Array){
					asInfo.fnArray(arr[i])
				}else{
					asInfo.fnObj(arr[i], name)
				}
			} else {
				isListStr = true;
			}
		}
		if(isListStr) asInfo.fnAsHTml(name, arr.join(', '));
	}

	asInfo.fnAsHTml = function (ttl, str) {
		asInfo.fnAddClass()
		._html += '<div class="'+this.addClass+'">'+
							 '<h4 class="ttl dname">'+ttl+'</h4>'+
							 '<div class="attrlists"><p>'+(str?str:'&nbsp;')+'</p></div>'+
						 '</div>';
	}

	asInfo.fnAddClass = function () {
		this.addClass = this.rowNum%2==0 ? this.cssAr[0] : this.cssAr[1];
		this.rowNum++;
		return this;
	}

	return asInfo;
}

function FnAsInfo2(initData,KVMap,csObj,attrStr){
	this._html = '',
	this.ttl = '',
	this.rowNum = 0,
	this.cssAr = ['fl list w2 mr', 'fl list w2'],
	this.addClass = '',
	this.initData = initData,
	this.KVMap = KVMap,
	this.csObj = csObj,
	this.attrStr = attrStr;

	this.structureHtml = function (data) {
		this._html = '',
		this.ttl = '',
		this.rowNum = 0,
		this.addClass = '';

		if(typeof data == 'object' && data) this.fnObj(data, this.ttl);
		return this._html;
	}

	this.fnObj = function (obj, ttl) {
		var txt = '';
		for(var dr in obj){
			if (typeof obj[dr] == 'object') {
				var _ttl = ttl?ttl[dr]:this.initData[dr];
				if(obj[dr] instanceof Array){
					this.fnArray(_ttl, obj[dr], dr)
				}else{
					if(this.KVMap.indexOf(dr) != -1){
						this.fnAsHTml(_ttl, '<div class="cd wordWrap">'+cd.structureHtml(obj[dr])+'</div>');
					}else{
						this.fnObj(obj[dr], _ttl)
					}	
				}
			} else {
				if(obj[dr]){
					if(this.attrStr && this.attrStr[dr]) {
						txt = this.attrStr[dr][obj[dr]]
					}else{
						txt = obj[dr]
					}
					this.fnAsHTml(ttl?ttl[dr]:this.initData[dr], txt);
				}
			}
		}
		this.ttl = '';
	}

	this.fnArray = function (name, arr, od) {
		if(!arr.length) return;
		var _str = '';

		if(this.csObj[od]){
			if(this.csObj[od] instanceof Function){
				_str += this.csObj[od](arr)
			}else{
				_str +=  this.secondObj(arr, this.csObj[od])
			}
		}else{
			for (var i = 0; i < arr.length; i++) {
				var _br = i == arr.length-1 ? '' : ', <br/>'
				if (typeof arr[i] == 'object') {
					for(var dr in arr[i]){
						if(!arr[i][dr]) delete arr[i][dr]
					}
					_str +=  JSON.stringify(arr[i])+_br
				}else{
					_str += arr[i]+_br
				}
			}
		}

		this.fnAsHTml(name, _str);
	}

	this.fnAsHTml = function (ttl, str) {
		this.fnAddClass()
		._html += '<div class="'+this.addClass+'">'+
							 '<h4 class="ttl dname">'+ttl+'</h4>'+
							 '<div class="attrlists">'+(str?str:'&nbsp;')+'</div>'+
						 '</div>';
	}

	this.fnAddClass = function () {
		this.addClass = this.rowNum%2==0 ? this.cssAr[0] : this.cssAr[1];
		this.rowNum++;
		return this;
	}

	this.secondObj = function(dataAr,toObj){
		var _objStr = ''
		for (var i = 0; i < dataAr.length; i++) {
			_objStr += '<p class="scObj">'
			
			for(var d in toObj){
				if(toObj[d].indexOf(this.csObj.split) != -1){console.log(dataAr[i][d].toString())
					var _toObjAr = toObj[d].split(this.csObj.split)
					var _dataAr = dataAr[i][d].toString().split(this.csObj.split)
					for (var j = 0; j < _toObjAr.length; j++) {
						_objStr += '<b>' + _toObjAr[j] + '</b>: ' + _dataAr[j]
					}
				}else{
					_objStr += '<b>' + (toObj[d]||'') + '</b>: ' + (dataAr[i][d]||'')	
				}
			}
			_objStr += '</p>'
		}
		
		return _objStr
	}
}