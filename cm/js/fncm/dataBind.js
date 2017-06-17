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

// dataBind.app(function(s){
// 	s.svName = 'a'
// })