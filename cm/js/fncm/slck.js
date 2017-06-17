//实例化对象  example => var slck = new Slck
var Slck = function () {
	/**
	*定义选择区域，获取选择区内的元素
	*选择后对被选择区的元素遍历，判断元素是否在选择区内
	*/

	var slck = {
		slcBoxCss:'wdslcBox', 						//选择层
		skCss:'skCss',  								//选择后的样式
		slcOpt:'.slck',  								//选择元素
		slcBoxStyle:{top:0,left:0},
		isMove: true,
		isRemove: true,
		scrollDoms:[],
		ckSetTime:null
	}

	//检测父元素集合中是否有滚动条
	slck.chckScrollDom = function(ele){
		var ths = this
		var thisOffsetParent = ele.offsetParent
		chck(ele)
		function chck(ele){
			var p = ele.parentNode

			if(p.scrollHeight > p.offsetHeight){
				ths.scrollDoms.push(p)
			}

			if(p !== thisOffsetParent){
				chck(p)
			}
		}
	}

	//选择区点击事件
	slck.slcDomCk = function(e, ths, sk){
		e.preventDefault()
		e.returnValue = false

		sk.removeSkCss()
		if(sk.inDom(e.toElement)){
			sk.slcedCss(e.toElement)
		}
	}
	slck.inDom = function(ele){
		var result = false
		var slcOpt = slck.slcDom.querySelectorAll(slck.slcOpt)
		
		for (var i = 0; i < slcOpt.length; i++) {
			if(slcOpt[i] === ele){
				result = true
				break
			}
		}
		return result
	}

	//按住‘Shift’键可以取消删除选中样式
	slck.slcKeydown = function(e, sk){
		if(e.key == 'Shift'){
			sk.isRemove = false
		}
	}
	slck.slcKeyup = function(e, sk){
		sk.isRemove = true
	}

	//进行选择
	slck.slcMousedown = function(e, ths, sk){
		e.preventDefault()
		e.returnValue = false
		sk.slcBoxStyle.top = e.clientY
		sk.slcBoxStyle.left = e.clientX
		ths.onmousemove = function(e){ sk.slcMousemove(e, this, sk) }
	}
	slck.slcMousemove = function(e, ths, sk){
		e.preventDefault()
		e.returnValue = false
		e.bubbles = false

		if(e.clientX === sk.slcBoxStyle.left && e.clientY === sk.slcBoxStyle.top) return false

		var tox = e.clientX - sk.slcBoxStyle.left,
				toy = e.clientY - sk.slcBoxStyle.top

		var slcBox = ths.querySelector('.'+sk.slcBoxCss)

		if(sk.isMove){
			sk.isMove = false
			sk.removeSkCss()
			sk.isRemove = false
		}

		if(slcBox){
			slcBox.style.width = Math.abs(tox)+ 'px'
			slcBox.style.height = Math.abs(toy) + 'px'

			if(tox < 0){
				slcBox.style.left = sk.slcBoxStyle.left + tox + 'px'
			}

			if(toy < 0){
				slcBox.style.top = sk.slcBoxStyle.top + toy + 'px'
			}
		}else{
			var slcBox = document.createElement('div')
			slcBox.className = sk.slcBoxCss
			slcBox.style.top = sk.slcBoxStyle.top+'px'
			slcBox.style.left = sk.slcBoxStyle.left+'px'
			sk.slcDom.appendChild(slcBox)
		}
	}
	slck.slcMouseup = function(e, ths, sk){
		e.preventDefault()
		e.returnValue = false
		ths.onmousemove = null
		sk.isMove = true

		var slcBox = ths.querySelector('.'+sk.slcBoxCss)
		if(slcBox){
			sk.addEleTs(slcBox)
			slcBox.remove()
		}
		setTimeout(function(){
			sk.isRemove = true
		},50)
	}

	//判断元素是否在选择框
	slck.addEleTs = function(slcBox){
		var t = parseInt(slcBox.style.top),
			  b = parseInt(slcBox.style.height)+t,
				l = parseInt(slcBox.style.left),
				r = parseInt(slcBox.style.width)+l
		var slcks = slck.slcDom.querySelectorAll(slck.slcOpt)
		var zTop = this.zTop || 0,
				zLeft = this.zLeft || 0

		if(slck.scrollDoms.length){
			for (var i = 0; i < slck.scrollDoms.length; i++) {
				zTop += slck.scrollDoms[i].scrollTop
			}
		}

		for (var i = 0; i < slcks.length; i++) {
			if(isEleTs(slcks[i]))
				slck.slcedCss(slcks[i])
		}

		function isEleTs(ele){
			var et = ele.offsetTop-zTop,
					eb = et + ele.offsetHeight,
					el = ele.offsetLeft-zLeft,
					er = el + ele.offsetWidth
			var ist =  (et >= t && et <= b) || (eb >= t && eb <= b),
					isl = (el >= l && el <= r) || (er >= l && er <= r),
					isnt = et <= t && t <= eb,
					isnl = el <= l && er >= l,
					ism = el <= l && er >= r,
					ismt = et <= b && eb >= b,
					ismb = et >= t && eb <= b
			var isz = (ist & isl) || ( (isnt && isnl) || (isnt && isl) )
			var ismz = (ism && ismt) || (ism && ismb)
			if(isz || ismz){
				return true
			}else{
				return false
			}
		}
	}

	//给选中的元素增加和取消选中样式
	slck.slcedCss = function(dom){
		var thsCssAr = dom.className.split(' ')
		var skCssIdx = thsCssAr.indexOf(slck.skCss)

		if(skCssIdx >= 0){
			thsCssAr.splice(skCssIdx)
			dom.className = thsCssAr.join(' ')
		}else{
			dom.className += dom.className?' '+slck.skCss:slck.skCss
		}
	}

	//清楚选中元素的样式
	slck.removeSkCss = function(){
		var ths = this
		var slcks = ths.slcDom.querySelectorAll('.'+ths.skCss)

		if(!ths.isRemove || !slcks.length) return
		
		if(slcks.length){
			for (var i = 0; i < slcks.length; i++) {
				ths.slcedCss(slcks[i])
			}
		}
	}

	//运行入口
	slck.run = function(slcDom, options){

		if(!slcDom || !slcDom.tagName) return

		var sk = this

		sk.slcDom = slcDom

		//事件绑定
		slcDom.onclick = function(e){ sk.slcDomCk(e, this, sk) }
		slcDom.onmousedown = function(e){ sk.slcMousedown(e, this, sk) }
		slcDom.onmouseup = function(e){ sk.slcMouseup(e, this, sk) }
		slcDom.onmouseenter = function(e){
			document.onkeydown = function(e){ sk.slcKeydown(e, sk) }
			document.onkeyup = function(e){ sk.slcKeyup(e, sk) }
		}
		slcDom.onmouseleave = function(e){ sk.slcMouseup(e, this, sk) }

		// 参数设置
		if(options !== void 0 & options instanceof Object){
			sk.skCss = options.skCss || sk.skCss
			sk.slcOpt = options.slcOpt
			sk.scrollDoms = options.scrollDoms || []
			sk.zTop = -options.zTop || 0
			sk.zLeft = -options.zLeft || 0
			if(options.notRemoveDom && options.notRemoveDom.tagName){
				options.notRemoveDom.onmouseenter = function(e){ sk.isRemove = false }
				options.notRemoveDom.onmouseleave = function(e){ sk.isRemove = true }
			}
		}

		sk.chckScrollDom(slcDom.querySelector(sk.slcOpt))
	}

	return slck
}

const slck = new Slck