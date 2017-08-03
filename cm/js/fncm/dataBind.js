/**
* data-bind = dataBind.strSet.string
**/

var dataBind = {}

dataBind.doms = []

dataBind.strSet = {}

dataBind.isVal = ['INPUT','TEXTAREA']

dataBind.run = function(s){
	var domsIdx = 0
	for(var _d in s){
		var _m = $('[data-bind="'+_d+'"]')
		this.doms.push(_m)

		if(_m.length > 1){
			_m.each(function(i,item){
				if( dataBind.setValue($(this),s[_d]) ) dataBind.keyVal($(this), domsIdx)
			})
		}else{
			if( dataBind.setValue(_m.eq(0),s[_d]) ) dataBind.keyVal(m, domsIdx)
		}

		domsIdx++
	}
}

dataBind.keyVal = function(m, idx){
	var _m = this.doms[idx]
	m.keyup(function(e){
		var ths = $(this)
		var v = ths.val()

		if(_m.length > 1){
			_m.each(function(i,item){
				dataBind.setValue($(this),v)
			})
		}else{
			dataBind.setValue(_m.eq(0),v)
		}
	})
}

dataBind.app = function(f){
	$.isFunction(f) && f(this.strSet);
	this.run(this.strSet)
}

dataBind.mTypeIsVal = function(m){
	var t = m.prop('tagName')
	return this.isVal.indexOf(t) != -1;
}

dataBind.setValue = function(m,t){
	if(this.mTypeIsVal(m)){
		m.val(t)
		return true
	}else{
		m.text(t)
		return false
	}
}

//格外添加进行input动态数据绑定其它非input的内容, mt => 数据名称,t => 与input数据绑定
dataBind.atKeyVal = function(mt,t){
	var _m = $('[data-bind="'+mt+'"]'),
		inputM = $('input[data-bind="'+mt+'"]'),
		initV = t||inputM.val()

	_m.each(function(i,item){
		dataBind.setValue($(this),initV)
	})

	if(!inputM.length) return;

	inputM.focus(function(){
		$(this).addClass('isEdit')
	})
	inputM.blur(function(){
		$(this).removeClass('isEdit')
	})

	inputM.off('keyup change')
	inputM.on('keyup change',function(e){
		var ths = $(this)
		var v = ths.val() || t || ''

		if(_m.length > 1){
			_m.each(function(i,item){
				if(!$(this).hasClass('isEdit'))
					dataBind.setValue($(this),v)
			})
		}else{
			dataBind.setValue(_m.eq(0),v)
		}
	})
}  

/**
* 监听数据变化
*/
dataBind.jtObj = function (obj,callback){
	for(var k in obj){
		this.defineReactive(obj, k, obj[k], callback)
	}
}

/**
* 数据绑定
* obj => 输数， key => 绑定数据的key值， val => 绑定初始值， customSetter => 当设置数据属性值后进行的回调函数
*/
dataBind.defineReactive = function (obj, key, val, customSetter) {

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
		return val;
    },
    set: function reactiveSetter (newVal) {
		if (newVal === val || (newVal !== newVal && val !== val)) {
			return;
		}
		if (customSetter && Object.prototype.toString.call(customSetter) == '[object Function]') {
			customSetter(key, newVal);
		}
		val = newVal;
    }
  });
}

/**
* ES5 下的数据绑定
* dom => 数据层的祖节点(数据绑定节点必须是标签数据属性'data-bind="dataKey"')， data => 数据
*/
dataBind._bind = function(data,dom){
	var rsult = {
		data:data
	};
	rsult._dom = dom || document;

	rsult.seEls = (function(d){
		var r = {}
		for(let k in d) r[k] = [];
		return r
	})(data)

	rsult._bindSet = function(k,_el){
		_el.onkeydown = function(){
			var _self = this
			
			setTimeout(function(){
				data[k] = _self.value
			},50)
		}
		_el.onchange = function(){
			data[k] = this.value
			this.blur()
		}
	}

	rsult._bindEl = function(el){
		var _k = el.dataset.bind, seEls = rsult.seEls;
		var _set = function(k,v){
			seEls[k].forEach(function(_el){
				_el.value === undefined ? (_el.innerText = v) : (_el.value = v)
			})
		}
		
		if(_k in data){
			var v = data[_k]

			seEls[_k].push(el);

			el.value === undefined ? (el.innerText = v) : (el.value = v, rsult._bindSet(_k, el));

			if(seEls[_k].length < 2) dataBind.defineReactive(data, _k, v, _set);
		}
	}

	rsult._dom.querySelectorAll('[data-bind]').forEach(rsult._bindEl)

	rsult.add = function(el,v){
		var _k = el.dataset.bind
		if(v !== undefined) this.data[_k] = v;
		if(this.data[_k] === undefined) this.data[_k] = null;

		this.seEls[_k] ? (v = this.data[_k], (el.value === undefined ? (el.innerText = v) : (el.value = v)), this.seEls[_k].push(el)) : (this.seEls[_k] = [], this._bindEl(el))
	}

	return rsult
}


// dataBind.app(function(s){
// 	s.svName = 'a'
// })