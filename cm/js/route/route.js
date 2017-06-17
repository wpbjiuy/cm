//prototype
String.prototype.searchToObj = function(k) {
	var _r = {};
	var _ar = this.toString().slice(1).split('&');

	for (var i = 0; i < _ar.length; i++) {
		var n = _ar[i].split('=');
		_r[n[0]] = n[1];
	}

	if(k && _r[k]){
		return _r[k];
	}else{
		return _r;
	}
};


//route
var route = {
	urls:{},
	search:{}, 														//location.hash对象
	goBackHref:'',  											//上一级路径
	_v:new Date().getTime(),							//加载script版本
	view:document.getElementById('view')
}
route.run = function(callback){
	var _self = this
	var ihref = location.href
	route.hashChangeFire()
	_self.rc = callback

	if( ("onhashchange" in window) && ((typeof document.documentMode==="undefined") || document.documentMode==8)) {
	    window.onhashchange = _self.hashChangeFire;

	} else {
	    setInterval(function() {  
	        var ischanged = isHashChanged();
	        if(ischanged) {  
	            _self.hashChangeFire();
	        }  
	    }, 150);  
	}

	return _self


	function isHashChanged(){
		if(ihref !== location.href){
			ihref = location.href;
			return true;
		}else{
			return false;
		}
	}
}

route.loadHTml = function(url,callback){
	var xmlhttp;
	if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp = new XMLHttpRequest();
	}else{// code for IE6, IE5
	  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange = function(){
		if (callback instanceof Function) {
			callback(xmlhttp)
		}
	}
	xmlhttp.open("GET",url,true);
	xmlhttp.setRequestHeader('If-Modified-Since','0');
	xmlhttp.setRequestHeader('Cache-Control','no-cache');
	xmlhttp.send();
}

route.hashChangeFire = function(){
	var _self = route;
	var _tm = location.hash.slice(2);
	var shIdx = _tm.indexOf('?');
	var search = '';

	if(shIdx >= 0){
		search = _tm.slice(shIdx);
		_tm = _tm.slice(0,shIdx);
	}

	var viewjs = document.getElementById('viewjs');

	if(Boolean(viewjs)){
		if(Boolean(viewjs.remove))
			viewjs.remove();
		else
			viewjs.parentNode.removeChild(viewjs)
	}
	
	if(!_self.urls[_tm] && _self.otherUrl){
		_tm = _self.otherUrl || null
	}

	if(_self.rc instanceof Function) _self.rc(location.hash);

	if(window.webSocket) webSocket.close();  // home webSocket
	window.webSocketAttention && webSocketAttention.close();  // attention webSocket

	_self.toLoad(_self.urls[_tm],search);

	if(_self.navOn instanceof Function){
		_self.navOn(_tm)
	}

	$('#header .loadingf').remove()

}

route.toLoad = function(urlObj, search, _tm){
	if(!urlObj) return;
	var _self = this;
	_self.loadHTml(urlObj.url, function(xhr){
		if (xhr.readyState == 4 && xhr.status == 200) {
			
			if(jQuery){
				$(_self.view).html(xhr.responseText);
			}else{
				_self.view.innerHTML = xhr.responseText.replace(/<script[\s\S]*?<\/script>/ig, '');
				_self.addScript(xhr.responseText);
			}

			if(urlObj.script){
				var _script = document.createElement('script');
				_script.id = 'viewjs';
				_script.src = urlObj.script+'?v='+route._v;
				document.getElementsByTagName('body')[0].appendChild(_script);
			}
			
			if(search){
				route.search = search.searchToObj()
				urlObj.cbk && urlObj.cbk(search);
			}else{
				route.search = {}
			}

			var goBack = document.getElementById('goBack')
			if(goBack){
				goBack.href = route.goBackHref
			}
			route.goBackHref = location.hash;
		}
	})
}

route.addScript = function(txt){
	var scripts = txt.match(/<script[\s\S]*?<\/script>/ig) || []

	for (var i = 0; i < scripts.length; i++) {
		var s = document.createElement('script');
		s.type = 'text/javascript';
		s.innerHTML = scripts[i].replace(/<script[\s\S]*?>/,'').replace('</script>','')
		this.view.appendChild(s);
	}
}

route.loadHtmlOk = function(xhr){
	route.toLoad.call(this)
}

/**
* obj => {url:url,srcipt:scirptUrl}
*/
route.cfg = function(path,obj){
	this.urls[path] = obj;
	return this;
}
route.otherCfg = function(path){
	this.otherUrl = path;
	return this;
}

route.navOn = function(hash){
	$('#header .libox a.on').removeClass('on')
	var idx = hash.indexOf('?')
	var _hash = idx != -1 ? hash.slice(0, idx) : hash
	_hash = _hash.replace('#/','')
	if(_hash){
		for (var i = 0; i < route.navOnGist.length; i++) {
			if(route.navOnGist[i].indexOf(_hash) != -1){
				if($('#header .nav>.libox>li').length){
					$('#header .nav>.libox>li:eq('+i+') a:eq(0)').addClass('on')
				}else{
					$('#header .abox a:eq('+i+')').addClass('on')
				}
				break;
			}
		}
	}else{
		// $('#header a.home').addClass('on')
	}
}

