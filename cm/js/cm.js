var serviceUrl = ''

var cm = {
	fnFixedHintSetItimes:[]
}

/*---& dome -> 需要增加翻页的层，allPg -> 翻页的数目 &---*/
cm.addPageDom = function(dome,allPg,cellback,dataAr,fnRow){
	allPg = Math.floor(allPg);

	dome.append('<div style="position:relative;height:50px;width:100%;left:0;top:0;" onselectstart="return false">'+
					'<div class="pageGo">To Page:<span class="fr go">GO</span><input class="fr" type="number" min="1" max='+allPg+' /></div>'+
					'<div class="nav_page">'+
						'<a href="javascript:void(0)" class="ca prev"> < </a>'+
						'<div class="nav_pages">'+
							'<ul class="nav_pageUl">'+
								
							'</ul>'+
							'<div class="clr"></div>'+
						'</div>'+
						'<a href="javascript:void(0)" class="ca next"> > </a>'+
						'<div class="clr"></div>'+
					'</div>'+
					(fnRow?'<div class="pageRow"><input class="v" type="number" min=1 /></div>':'')+
				'</div>');

	var li_w = dome.find(".nav_page .nav_pageUl").append("<li class='pageList on'>1</li>").find('li:eq(0)').width()

	var pageInfo = dome.find(".nav_page"),
		page_ca	 = pageInfo.find("a.ca"),
		pageSe_w = pageInfo.width()-page_ca.width()*2,        //显示数目区域的宽度
		page_sum = parseInt(pageSe_w/li_w),                   	//显示的个数
		page_x = Math.floor((page_sum-2)/2)-1,
		isFlowPage = allPg > page_sum,
		lisLength = isFlowPage ? page_sum : allPg;

	for(var i = 2; i <= lisLength; i++){
		var addLi;
		if(isFlowPage && i >= page_sum - 1){
			addLi = i == page_sum - 1 ? "<li class='pageList xx'>...</li>" : "<li class='pageList'>"+allPg+"</li>"
		}else{
			addLi = "<li class='pageList'>"+i+"</li>"
		}
		dome.find(".nav_page .nav_pageUl").append(addLi);
	}

	var page_li = dome.find(".nav_page .nav_pageUl li")
	
	dome.find('.nav_page').css('width','auto')
	if(fnRow){
		dome.find('.pageRow').css('left',dome.find('.nav_page').width()+'px')
		if(fnRow instanceof Function){
			dome.off('.page')
			dome.on('change.page','.pageRow .v',function(){
				fnRow($(this).val())
			})
		}
	}
	
	//左右按钮翻页
	page_ca.click(function(){
		var ths = $(this),
			pagesDom = ths.siblings(".nav_pages"),
			onLi = pagesDom.find("ul li.on"),
			seLi = pagesDom.find("ul li");

		if(ths.hasClass('prev')){
			if(onLi.index() > 0){
				onLi = onLi.prev();
			}
		}else{
			if(onLi.index() < seLi.length-1){
				onLi = onLi.next()
			}
		}

		pageContetn(onLi);  //调用显页码方法

	});

	//数目点击方法
	var seFalse=false;

	page_li.click(function(){
		if(seFalse) return;
		var ths = $(this),
			goNum = parseInt(ths.text());
		if(ths.text()!='...'){

			if(ths.index() == 0){
				setGoPageLis(1, 2, goNum);
			}else if(ths.index() == lisLength-1){
				setGoPageLis(2, allPg, goNum);	
			}else{
				pageContetn(ths);  //调用显页码方法				
			}

			seFalse = true;
			setTimeout(function(){
				seFalse = false;
			},200);
		}
	});

	//调用显页码方法
	function pageContetn(onLi){
		var onNum = parseInt(onLi.text()), i = 2, j = onNum - page_x;

		if(j <= 2) j = 2, i = 1;
		
		setGoPageLis(i, j, onNum);

	}

	//跳转翻页
	var pageGo = dome.find('.pageGo');
	var minNum = Math.floor((page_li.length-4)/2 > 2 ? 2+(page_li.length-4)/2 : 3);
	pageGo.find('.go').click(function(){
		var goNum = $(this).next().val();
		if(!isNaN(goNum)){
			var ctPages = Math.floor(goNum-(page_li.length-4)/2)+1;
			page_li = dome.find('.nav_pageUl li');

			if(goNum>0 && goNum<=allPg){
				var ckPageFalse = false;
				var i = j = 0;

				goNum <= minNum ? (i = 1, j = 2) : (i = 2, j = ctPages);

				setGoPageLis(i, j, goNum);
				
			}else{
				cm.fnFixedHint("请输入正确的页码范围（1~"+allPg+")");
			}
		}else{
			cm.fnFixedHint("请输入正确的数字！");
		}
	});

	function setGoPageLis(i, j, goNum){

		var le = page_li.length-2;

		if(j + le > allPg){
			le++;
			j = allPg - le + 2;

			page_li.eq(le-1).removeClass('xx').addClass('pageList');
		}

		var isSetNum = j ==  page_li.eq(i).text();

		if(!isFlowPage || isSetNum) {
			for (var i = 0; i < page_li.length; i++) {
				var _li = page_li.eq(i);
				if(_li.text() == goNum) {
					setLiOn(_li); break;
				}
			}
			return;
		}

		if(j == 2) page_li.eq(1).removeClass('xx').addClass('pageList');

		for (; i < le; i++,j++) {
			page_li.eq(i).text(j);
			if(j == goNum){
				setLiOn(page_li.eq(i));
			}
		}
		if(page_li.eq(2).text() != 3) page_li.eq(1).text('...').removeClass('pageList').addClass('xx');

		if(j != allPg) page_li.eq(le).text('...').removeClass('pageList').addClass('xx');

		if(goNum == 1)
			setLiOn(page_li.eq(0));
		else if(goNum == allPg)
			setLiOn(page_li.eq(le));
	}

	function setLiOn(li){
		!li.hasClass('on') && li.addClass('on').siblings('.on').removeClass('on');
		pageTo(li.text(), li.attr('id'));  //调用翻页方法
	}

	pageGo.find('input').keydown(function(e){
		if(e.keyCode == 13){
			pageGo.find('.go').click();
		}
	})

	//翻页方法
	var pageIo=1;
	function pageTo(page,parentId){
		if(pageIo==page) return;
		pageIo=page;
		//console.log('type='+type+'~thisPage='+page+'~parentId='+parentId);
		if(dataAr){
			if(dataAr instanceof Array){
				cellback(dataAr[page-1]);
			}else{
				cellback(page,dataAr);
			}
		}else{
			cellback(page);
		}
	}
}

/**
* 去除数据前后空格
* 使用方式 => dataTxtRemoveBlank(data)
*/
cm.dataTxtRemoveBlank = function(data){
	fnObj(data);

	return data;

	function fnObj(data){
		if(data instanceof Array){
			for (var i = 0; i < data.length; i++) {
				data[i] = fnIsString(data[i])
			}
		}else{
			for(var d in data){
				data[d] = fnIsString(data[d])
			}
		}
		return data
	}

	function fnIsString(txt){
		if(typeof(txt) == 'string'){
			txt = fnRemove(txt)
		}else{
			txt = fnObj(txt)
		}
		return txt;
	}

	function fnRemove(txt){
		var frontIdx = fnFrontIdx(txt),
				rearIdx = fnRearIdx(txt);
		frontIdx = frontIdx !== undefined ? frontIdx+1 : 0;
		rearIdx = rearIdx !== undefined ? rearIdx : txt.length;
		return txt.slice(frontIdx,rearIdx)
	}

	function fnFrontIdx(txt){
		var idx = undefined;

		for (var i = 0; i < txt.length; i++) {
			if(txt[i] == ' '){
				idx = i;
			}else{
				break;
			}
		}

		return idx;
	}

	function fnRearIdx(txt){
		var idx = undefined;

		for (var i = txt.length-1; i >= 0; i--) {
			if(txt[i] == ' '){
				idx = i;
			}else{
				break;
			}
		}

		return idx;
	}
}

/*--信息弹窗--*/
cm.fnInfo = function(type){
	var thsObj = {
		type:type,
		slideDom:'',
		sbm:function(fn){
			this._sbm = fn
			return this
		},
		set:function(data, fn){
			if(data){
				fndata.setData(thsObj.fixedEye,data),
				fn instanceof Function && fn(thsObj.fixedEye)
			}
			return this
		}
	}

	thsObj.fnAddList = function(e){
		var thsCkunk = $(this).parents('.chunk:first'),
			addDom = thsCkunk.find('.dataCollection')

		if(!thsCkunk.attr('data-fix')){
			addDom.append(addDom.find('.dataList:eq(0)').clone(true))
			.find('.dataList:last input,.dataList:last select,.dataList:last textarea').val('')
		}else{
			thsCkunk.removeAttr('data-fix').find('.dataCollection .dataList:eq(0)').css('visibility','visible')
			.find('[data-required]').attr('data-required','true')
		}
	}

	thsObj.fnRemoveList = function(e){
		var removeDom = $(this).parents('.dataList:first')

		if(removeDom.siblings('.dataList').length){
			removeDom.remove()
		}else{
			removeDom.css('visibility','hidden').find('input,select,textarea').val('').parents('.chunk:first').attr('data-fix','true')
			.find('[data-required]').attr('data-required','false')
		}
	}

	thsObj.show = function(showObj,showHeight,callback){
		var ths = this
		var _showHtml = ''
		var cls = null
		var fStyle = ''
		var zIndex = $('.fixedInfo2').length ? parseInt($('.fixedInfo2:last')[0].style.zIndex) + 1 : 101;

		if($('.wangEditor-modal-container').length){
			zIndex = parseInt($('.wangEditor-modal-container').css('zIndex')) + 1
		}

		if(showHeight instanceof Function){
			var callback = showHeight;
			var showHeight = false;
		}

		if(typeof(showObj) == "string"){
			_showHtml = showObj
		}else{
			_showHtml = showObj.showHtml
			cls = showObj.cls
			fStyle = ' style="'+showObj.style+'"'
			var showHeight = showObj.height
		}

		ths.cc = false
		var fixedInfoId = 'fixedInfo'+$('.fixedInfo2').length
		var tHtml = '<div id="'+fixedInfoId+'" class="fixed fixedInfo2" style="display:block;z-index:'+zIndex+';">'+
									'<div class="fixedEye"'+fStyle+'>'+
										'<div class="fixedMian">'+
											'<a href="javascript:void(0)" class="icon-cross cancel2"></a>'+
											'<div class="addEle">'+_showHtml+'</div>'+
										'</div>'+
									'</div>'+
								'</div>';

		$('body').append(tHtml)

		ths.fixedEye = $('.fixedInfo2:last .fixedEye')
		ths.fixedMian = $('.fixedInfo2:last .fixedMian')

		var addList = $('.chunk .TheDivider .btn-add')
		var removeList = $('.chunk .dataCollection .btn-remove')

		var mwg = thsObj.fixedEye.width(),
			wh = $(window).height(),
			mh = wh - 100,
			mhg = showHeight ? (showHeight > mh ? mh : showHeight) : mh,
			thg = (wh - mhg) / 2 <= 100 ? 0 : wh/2 - mhg/2 - 100
		
		// if(wh/2 - mhg/2 - thg < 100) thg = 0;

		if(addList.length){
			addList.on('click', ths.fnAddList)
		}

		if(removeList.length){
			removeList.on('click', ths.fnRemoveList)
		}

		if(showObj.ttl){
			ths.fixedEye.find('h2.ttl').text(showObj.ttl)
		}
		
		cm.fnTitle(ths.fixedEye,true)

		if(cls && cls instanceof Array){
			for (var i = 0; i < cls.length; i++) {
				ths.fixedEye.on(cls[i].event, cls[i].dom, cls[i].fn)
			}
		}

		showEye()

		$(window).on('resize', showEye)

		if(type == 'edit' || type == 'oc'){

			ths.fnSbm = function(e){
				cm.sbm(ths.fixedEye,function(data){
					if(ths._sbm){
						ths._sbm(data, ths.fixedEye, e)
						cancel()
						$(window).off('resize', showEye)
						$(window).off('keypress',wdSbm)
					}
				})
			}

			ths.fixedEye.on('click','.cancel',cancel)
			ths.fixedEye.on('click','.sbm',ths.fnSbm)

			J('#'+fixedInfoId+' input[type="date"]').each(function(index, el) {
				J(el).calendar({ format:'yyyy-MM-dd' })
			});

			J('#'+fixedInfoId+' input[type="datetime-local"]').each(function(index, el) {
				J(el).calendar({ format:'yyyy-MM-ddTHH:mm:ss' })
			});

			$(window).off('keypress',wdSbm)
			$(window).on('keypress',wdSbm)

			function wdSbm(e){
				if(e.keyCode == 13 && e.target.nodeName == 'INPUT'){
					ths.fnSbm(e)
				}
			}
		}

		ths.fixedEye.on('click','.cancel2',cancel)

		if(callback && ths.type != 'oc'){
			callback(ths.fixedMian);
		}

		return thsObj

		function showEye(e){
			ths.fixedEye.find('.addEle').height(mhg)
			thsObj.fixedEye.css('marginTop',-thg+'px').animate({height:mhg+'px',marginTop:-mhg/2 - thg + 'px'},200,function(){
				// thsObj.slideDom = ths.fixedEye.find('.addEle').perfectScrollbar()

				$(this).css('overflow','visible')

				if(callback && ths.type == 'oc') callback(ths.fixedMian);
					
			})
			if(ths.re){
				ths.re(ths.fixedMian,mwg,mhg)
			}
		}

		function cancel(){
			ths.fixedEye.animate({height:'0px',marginTop:0 - thg + 'px'},200,function(){
				$(this).parents('.fixed').remove()
				$(window).off('resize', showEye)
				$(document).off('keypress',wdSbm)
				if(ths.cc)
					ths.cc()
				showObj.isEditor || $('.wangEditor-modal-container').remove()  	//删除编辑器
				// $('#'+thsObj.slideDom.id).remove()  				//删除虚拟滚动条
			})
		}
	}
	// 窗口变化回调
	thsObj.resize = function(fn){
		this.addFn('re', fn)
		return this
	}
	// 关闭回调
	thsObj.cancel = function(fn){
		this.addFn('cc', fn)
		return this
	}
	// 添加回调函数
	thsObj.addFn = function(fnName, fn){
		if(fn instanceof Function)
			this[fnName] = fn
		else
			this[fnName] = function(){ console.log('请把唯一的参数设置成回调函数！') }
		return this
	}

	return thsObj
}

/*--提交数据表单--*/
cm.sbm = function(FormDom,fn,isEmpty){
	var data = fndata.getData(FormDom,isEmpty)

	var verifyData = ER.fnVerify(FormDom)

	if(verifyData.isOk){
		cm.dataTxtRemoveBlank(data) //删除数据前后空格 This function in the comment.js
		fn(data)
	}else{
		var errDom = FormDom.find('.err:first')
		cm.fnFixedHint('请在红色输入框内输入正确的内容！')
		errDom.focus()
		errDom.scrollTo(FormDom,0,400)
		console.log(verifyData)
	}
}

/*--提示弹窗--*/
cm.fnAlert = function (txt,hint,callback){
	var hintTxt = hint ? '' : '!';
	var icon = '';
	if(hint == 'ok'){
		icon = ' icon-checkmark';
	}else if(hint == 'err'){
		icon = ' icon-cross';
	}
	var atHtml = '<div class="fixed fixedAt">'+
					'<div class="fixed_bg"></div>'+
				 	'<div class="atInfoBox">'+
				 		'<div class="atPoRt">'+
				 			'<a class="icon-cross cancel" href="javascript:void(0)"></a>'+
				 			'<div class="info">'+
				 				'<div class="fl radius_a hintImg'+icon+'">'+hintTxt+'</div>'+
				 				'<div class="fl wordWrap txt"><p>'+txt+'</p></div>'+
				 				'<div class="clr"></div>'+
				 			'</div>'+
				 			'<div class="btns"><button class="cancel radius_5" autofocus="autofocus">确 认</button></div>'+
				 		'</div>'
				 	'</div>'+
				 '</div>';
	$('body').append(atHtml);
	var atTxt = $(".fixedAt .txt");
	var txtTop = ($('.fixedAt .info').height()-atTxt.height())/2;
	atTxt.css('marginTop',txtTop+'px');
	$('.fixedAt .cancel').click(function(){
		$(this).parents('.fixed').fadeOut(200,function(){
			$(this).remove()
			if(callback){
				callback()
			}
		});
	})
	$('.fixedAt .btns button').focus()
}

/*--确认弹窗--*/
cm.fnConfirm = function (txt,callback){
	var atHtml = '<div class="fixed fixedAt">'+
					'<div class="fixed_bg"></div>'+
				 	'<div class="atInfoBox">'+
				 		'<div class="atPoRt">'+
				 			'<a class="icon-cross cancel" href="javascript:void(0)"></a>'+
				 			'<div class="info">'+
				 				'<div class="fl radius_a hintImg">？</div>'+
				 				'<div class="fl wordWrap txt"><p>'+txt+'</p></div>'+
				 				'<div class="clr"></div>'+
				 			'</div>'+
				 			'<div class="btns"><button class="ok radius_5">确 认</button> <button class="cancel radius_5">取 消</button></div>'+
				 		'</div>'
				 	'</div>'+
				 '</div>';
	$('body').append(atHtml);
	var atTxt = $(".fixedAt .txt");
	var txtTop = ($('.fixedAt .info').height()-atTxt.height())/2;
	atTxt.css('marginTop',txtTop+'px');
	$('.fixedAt .cancel').click(function(){
		$(this).parents('.fixed').fadeOut(200);
	});
	$('.fixedAt .ok').click(function(){
		$(this).parents('.fixed').fadeOut(200);
		callback();
	});
}

/*--提示小标--*/
cm.fnFixedHint = function (txt){
	var n = cm.fnFixedHintSetItimes.length

	if(!$('#fixedHint')[0]){
		$('body').append('<div id="fixedHint" class="fixedHint"></div>')
	}

	var hintHtml =  '<div class="list rtx3d">'+
						'<a href="javascript:void(0)" class="icon-cross cancel"></a>'+
						'<div>'+
							'<div class="fl fixedIcon">!</div>'+
							'<div class="fl fixedInfos">'+txt+'</div>'+
							'<div class="clr"></div>'+
						'</div>'+
					'</div>';
	$('#fixedHint').append(hintHtml);

	var fixedHintLiLast = $("#fixedHint .list:last");

	fixedHintLiLast.find(".cancel").click(function(){
		cancel($(this).parent(), n);
	})

	var fiedHintIcon = fixedHintLiLast.find(".fixedIcon");
	var iconMrTop = (fiedHintIcon.parent().height()-fiedHintIcon.height())/2;

	// fiedHintIcon.css('marginTop',iconMrTop+'px');

	cm.fnFixedHintSetItimes[n] = setTimeout(function(){
		cancel(fixedHintLiLast, n)
	},5000);

	fixedHintLiLast.hover(function(){
		clearTimeout(cm.fnFixedHintSetItimes[n]);
		fixedHintLiLast.stop().animate({opacity:'1'});

	},function(){
		cm.fnFixedHintSetItimes[n] = setTimeout(function(){
			cancel(fixedHintLiLast, n)
		},1000);
	})

	function cancel(ths, n) {
		ths.stop().animate({opacity:0}, 500, function () {
			ths.remove();
			cm.fnFixedHintSetItimes.splice(n-1,1);
			
			if(!$("#fixedHint .list").length){
				$("#fixedHint").remove();
				cm.fnFixedHintSetItimes = [];
			}
		})
	}
}

cm.fnTitle = function (dom,isFocus){
	var dt = dom?dom:$(body);
	var ev = isFocus?'focus':'mouseenter';
	var unEv = isFocus?'blur':'mouseleave';
	
	dt.off(ev, '[data-title]')
	dt.off(unEv, '[data-title]')

	dt.on(ev, '[data-title]', function(e){
		var ths = $(this);
		var txt = ths.attr('data-title');
		var _offset = ths.offset(),
			t = _offset.top+(ths[0].clientHeight||ths.height())+5,
			l = _offset.left,
			ex = e.offsetX;
		
		if(txt){
			$('body').append('<div class="titleBox" style="top:'+t+'px;left:'+l+'px;"><i></i><content>'+txt+'</content></div>')
			var ttBox_w = $(".titleBox").width()
			var ttBox_oftL = $(".titleBox").offset().left

			if( (ttBox_w+ttBox_oftL+40) >= $(window).width() ){
				// ttBox_w -= 20
				$(".titleBox").css({'width':ttBox_w+'px','left':l-ttBox_w/2+'px'})
				ex = ex + ttBox_w/2
			}

			if(ex > ttBox_w) ex = ttBox_w
			
			$(".titleBox i").css('left',(ex>6?ex-6:ex)+'px')

		}
	})

	dt.on(unEv, '[data-title]', function(){
		$(".titleBox").remove();
	})
}

/** 数据排序，此函数为构造函数
* 数组对象排序方法，主要用户对数据进行排序
* 方法默认为升序
* result.sort => 排序方法
* result.ab => 升序方法
* result.ba => 降序方法
* result.sort(ar, at, sequence): ar=>数据(object)， at=>数据 key 值(string)， sequence=>排序顺序(function)
**/
cm.fnSort = function(){
	var result = {}
	result.sort = function(ar, at, sequence) {
		for (var i = 0; i < ar.length-1; i++) {
			if(!ar[i] || !ar[i+1]) continue;
			var sortA = ar[i][at],
					srotB = ar[i+1][at]
			if(typeof(sortA) == 'string') sortA = sortA.toLowerCase();
			if(typeof(srotB) == 'string') srotB = srotB.toLowerCase();

			if(sequence ? sequence(sortA, srotB) : sortA > srotB) {
				var ac= ar[i];
				ar[i] = ar[i+1];
				ar[i+1] = ac;
				sequence ? this.sort(ar, at, sequence) : this.sort(ar, at);
				break;
			}
		}
		return ar;
	}
	result.ab = function(a,b){return a > b;}
	result.ba = function(a,b){return a < b;}
	return result;
}

/**
*生成数据表格
* obj => {
	getData:{
		pageDom:'翻页层',
		url:'请求地址',
		setting:'请求参数',
		page:'翻页参数',
		totalPage:'翻页总数',
		dataPath:'内容数据参数',
		thsData:'页面操作数据'
	},
	th:{ 
		name:'数据名称',
		txt:'头标名称',
		style:'sytle',
		filter:'数据过滤 <function(数据){ return 处理后的数据;}> '
	},
	data:'数据',
	dataId:'数据ID',
	csle:[	//控制器
		{
			css:'样式类',
			icon:'图标样式类',
			txt:'名称',
			fnCk:'点击事件触发函数<function>'
		}
	],
	csleType:'控制器类型<btn or menu>',
	tbCss:'表格样式',
	addDom:'添加层',
	isNo:'是否显示序号',
	Noc:'序号系数',
	isChk:'是否增加选项框',
	fixedth:'是否固定头部',
	isShow:'是否显示行，function(item){ retrun Boolean}',
	isColResize:'是否手动调整单元宽度'
}
*/
cm.fnTbList = function (obj,callback){
	var _self = $.extend(true, {}, obj);
	var th = obj.th,    									//头标  object { name:数据名称, txt:投标名称, width:单元宽度<10%,10px>, filter:数据过滤 <function(数据){ return 处理后的数据;}> }
		data = obj.data,  									//外部数据 
		dataId = obj.dataId || 'id',  						//数据id  String
		csle = obj.csle,  				 					//控制器、操作  Array [{css:样式类, icon:图标样式类, txt:名称, fnCk:点击事件触发函数<window.function>}]
		csleType = obj.csleType || 'menu',  				//控制器类型 menu => 菜单，btn => 按钮
		tbCss = obj.tbCss,  								//表格样式  string
		addDom = obj.addDom,  								//表格添加层  element
		getData = obj.getData,   							//进行数据请求  Object {pageDom:翻页层, url:请求地址, setting:请求参数, page:翻页参数, totalPage:翻页总数, dataPath:内容数据参数, thsData:页面操作数据,}
		isNo = obj.No || false,  							//是否显示序号  Boolean
		isChk = obj.chk || false,  							//是否显示选择框  Boolean
		NoC = obj.NoC || 1,     							//序号系数  number
		isFixedTh = obj.fixedth || false,   				//是否固定头标  boolean
		isShow = obj.isShow || false;

	var _pageNum = 0

	var isAddPage = true

	_self.checkedData = []
	_self.ath = obj.th
	_self.slcData = {}
	_self.filters = {}

	for (var i = 0; i < th.length; i++) {
		if(th[i].filter) _self.filters[th[i].name] = th[i].filter
	}
	
	_self.setAg = function(obj){
		if(!(obj instanceof Object)) return this;

		for(var o in obj){
			this[o] = obj[o];
		}

		return this;
	}

	// _self.sbm = function(fn){
	// 	if($.isFunction(fn)) this._sbm = fn;
	// 	return this;
	// }

	_self.resetShow = function(th){
		this.addTb(th).addListCc(this.data)
	}

	_self.search = function(txt){
		this.searchData = cm.searchData(this.data, txt, false, this.filters)
		this.addListCc(this.searchData, true)
		if(callback && callback instanceof Function) callback(this.searchData, _self);
	}

	_self.addTb = function(th){
		if(th) this.th = th;

		var tblistHtml = '<table cellspacing="0" cellpadding="0" class="'+this.tbCss+'"><tr>';


		if(this.No && this.NoC){
			tblistHtml += '<th class="first no">序号</th>';
		}

		if(this.chk){
			tblistHtml += '<th class="first chk"><label><input style="margin-left:0;" type="checkbox" />选择</label></th>';
		}

		for (var i = 0; i < this.th.length; i++) {
			var zAttr = (this.th[i].style?'style="'+this.th[i].style+'"':''),
				txt = (this.th[i].txt||'')

			if(_self.isSort){
				txt = '<span data-sort="up" data-key="'+this.th[i].name+'">'+txt+'<i class="icon-sort-alpha-asc icon-sort-alpha-desc"></i></span>'
			}

			if(!this.csle && i == this.th.length-1){
				zAttr = 'class="last" '+zAttr;
			}else if(this.isColResize){
				txt += '<b class="colResize"></b>';
			}
			tblistHtml += '<th '+zAttr+'>'+txt+'</th>';
		}
		if(this.csle){ tblistHtml += '<th class="last clrTh" style="'+(this.csleBoxStyle || 'width:65px;text-align:center;')+'">操作</th>' }
		tblistHtml += '</tr>';

		tblistHtml += '</table>';
		addDom.html(tblistHtml);

		return this;
	}

	_self.sort = function(){
		var ths = $(this)
		_self.sortKey = ths.attr('data-key')
		_self.sequence = ''
		if(ths.attr('data-sort') == 'up'){
			_self.sequence = cm.fnSort.ab
			ths.attr('data-sort','down')
		}
		else{
			_self.sequence = cm.fnSort.ba
			ths.attr('data-sort','up')
		}
		ths.find('i').toggleClass('icon-sort-alpha-desc')

		var sortData = (_self.searchData || _self.data).filter(function(item,i,items){
			return item !== undefined && item !== null;
		})

		_self.addListCc(cm.fnSort.sort(sortData, _self.sortKey, _self.sequence),Boolean(_self.searchData))
	}

	_self.resize = function(e){
		var ths = $(this),
			resizeDom = ths.parent(),
			resizeDomNext = resizeDom.next(),
			rw = resizeDom.width(),
			rwn = resizeDomNext.width(),
			ridx = resizeDom.index(),
			hideResizeDom = isFixedTh && resizeDom.parent().next().find('th:eq('+ridx+')');
		var x = e.clientX;

		$('body').on('mousemove',function(me){
			var _x = me.clientX - x,
				_sw = rw + _x,
				_swn = rwn - _x;

			resizeDom.css('width',_sw).next().css('width',_swn);

			if(resizeDom.width() != _sw || resizeDomNext.width() != _swn){
			
				if(_x < 0){
					var _w = resizeDom.width() - _sw;
					resizeDom.css('width',_sw + _w).next().css('width',_swn - _w);
				}else{
					var _w = resizeDomNext.width() - _swn;
					resizeDom.css('width',_sw - _w).next().css('width',_swn + _w);
				}
				
				return;
			}
			
			if(hideResizeDom) hideResizeDom.css('width',_sw).next().css('width',_swn);
		})
		$('body').on('mouseup', function(ue){
			$('body').off('mousemove mouseup')
		})
	}

	_self.dataChk = function(e){
		var idx = parseInt($(this).attr('data-path'))
		var thsData = _self.searchData || _self.data
		if(this.checked){
			thsData[idx].chdIdx = _self.checkedData.length
			_self.checkedData.push(thsData[idx])
		}else{
			var thsIdx = thsData[idx].chdIdx
			if(thsIdx !== undefined){
				_self.checkedData.splice(thsIdx,1)
				$.each(thsData,function(i,item){
					if(item.chdIdx && item.chdIdx > thsIdx){
						item.chdIdx -= 1
					}
				})
				delete thsData[idx].chdIdx
			}
		}
		
		if(_self.checkedData.length != thsData.length){
			_self.addDom.find('table th.chk input')[0].checked = false
		}else{
			_self.addDom.find('table th.chk input')[0].checked = true
		}
	}
	_self.dataChkAll = function(e){
		var thsChecked = this.checked
		var thsData = (_self.searchData || _self.data)
		if(thsChecked){
			$.each(thsData,function(i,item){
				item.chdIdx = i
			})
			_self.checkedData = $.extend(true,[],[],thsData)
		}else{
			$.each(thsData,function(i,item){
				delete item.chdIdx
			})
			_self.checkedData = []
		}
		_self.addDom.find('table td.chk input').each(function(i,item){
			item.checked = thsChecked
		})
	}

	_self.getSlcData = function(){
		var ths = $(this),
			path = ths.attr('data-path'),
			listDom = ths.parents('tr:first')

		_self.slcData = cm.getPathData(path, _self.searchData || _self.data)
		_self.slcData.list = listDom

		return _self
	}

	_self.updateList = function(data, isExtend){
		if(data) {
			if(isExtend){
				$.extend(true, _self.data[_self.slcData.idx], data);
				_self.slcData.data = _self.data[_self.slcData.idx];
			}else{
				_self.data[_self.slcData.idx] = data;
				_self.slcData.data = data;
			}
			
		}

		_self.appendList(_self.slcData.data, _self.slcData.idx, true, _self.slcData.list)

		_self.slcData.list.remove()
	}

	_self.deleteList = function(){
		delete _self.data[_self.slcData.idx]
		_self.slcData.list.remove()
	}

	_self.addList = function(data){
		this.appendList(data, this.data.length, true);
		this.data.push(data);
		this.searchData && this.searchData.push(this.data);
		return this.addDom.find("tr:last");
	}

	function setTxt(txt, th, i, item){
		var r = '';
		var attr = 'class="bdcol borderBox editBox" disabled="disabled" data-name="'+th.name+'"'+(th.editAttr?' '+th.editAttr:'')

		r = cm.creatEdit({
			type:th.edit,
			value:txt,
			dataName:th.name,
			attr:th.editAttr+' disabled="disabled" data-path="'+i+'"',
			option:th.slcAr||[],
			isBtnEdit:_self.isShowEditBtn?($.isFunction(_self.isShowEditBtn) && _self.isShowEditBtn(item)):true
		})

		return r;
	}

	_self.appendList = function(item, i, isNew, insertDom){
		if(!item) return;

		var th = this.th;
		var tds = '';

		item.dataPath = i;

		if(this.No && this.NoC) {tds += '<td class="first no">'+(i+1+_pageNum*NoC)+'</td>'}

		if(this.chk) {tds += '<td class="first chk"><input type="checkbox" data-path="'+i+'" /></td>'}

		for (var j = 0; j < th.length; j++) {
			var _k = th[j].name, txt = item[_k] === null ? '' : item[_k]
			var pAttr = (th[j].title?' data-title='+th[j].title(item):'')+(th[j].event?' '+th[j].event.name+'="'+th[j].event.fn+'"':''),
				tdAttr = (th[j].edit?' tdEditBox':'')+'" '+(th[j].style?'style="'+th[j].style+'"':'')

			if(th[j].filter)  txt = th[j].filter(txt,item,_k);

			if(th[j].edit) txt = setTxt(txt, th[j], i, item);

			var _h = !th[j].edit ? '<p'+pAttr+'>'+(txt||'-')+'</p>' : txt
			
			if(!csle && j == th.length-1){
				tds += '<td class="last'+tdAttr+'>'+_h+'</td>'	
			}else{
				tds += '<td '+tdAttr+'>'+_h+'</td>'	
			}
		}
		if(csle){
			tds += this.csleHtml(csle,csleType,item)
		}

		var tr = $('<tr'+(i%2 === 0 ? '' : ' class="bg1"')+'>'+tds+'</tr>')

		if(insertDom)
			insertDom.after(tr)
		else
			this.addDom.find('table').append(tr)

		tr.find('.tdEditBox .e').on('focus', this.getSlcData)

		if(csle) {
			isNew && cm.fnBtnShowOperation(tr);
			if(csle instanceof Array){
				for (var k = 0; k < csle.length; k++) {
					tr.find('.cslBox').on('click', '.'+csle[k].css, this.getSlcData)
					if(csle[k].fnCk)
						tr.find('.cslBox').on('click', '.'+csle[k].css, csle[k].fnCk)
				}
			}else if(csleType == 'chk'){
				tr.find('.cslBox').on('change', '.'+csle.css, csle.fnCk)
			}
		}
	}

	_self.addListCc = function(data,isSearch){
		var thsSelf = this
		if(this.isDataKeyCase) data = cm.dataToLowerCase(data);     			//转换小写

		if(thsSelf.checkedData && thsSelf.checkedData.length){
			thsSelf.addDom.find('table th.chk input')[0].checked = false
			thsSelf.checkedData = []
		}

		if(!isSearch) this.data = data;
		addDom.find('table tr:gt('+(isFixedTh?1:0)+')').remove();

		var _isShowz = this.isShow ? this.isShow : isShow;
		if(!data) return;
		
		$.each(data, function(i, item){
			if(Boolean(_isShowz) && !_isShowz(item)) return true;

			item && _self.appendList(item, i)
		})

		cm.fnTitle(addDom)

		cm.fnBtnShowOperation(addDom)

		if(isFixedTh){
			var tr1 = addDom.find('table tr:eq(0)')
			if(!tr1.hasClass('fixedTh')){
				tr1.after(tr1.clone())
				tr1.addClass('fixedTh')
			}
			fnFixedTh(tr1)
		}

		if(this.sort){
			addDom.find('tr:first').off('click','th [data-sort]',_self.sort)
			addDom.find('tr:first').on('click','th [data-sort]',_self.sort)
		}

		if(this.isColResize){
			addDom.find('tr:first').off('mousedown','th .colResize',_self.resize)
			addDom.find('tr:first').on('mousedown','th .colResize',_self.resize)
			addDom.find('tr td').css('width','auto')
		}

		if(this.chk){
			addDom.find('table th.chk input').on('change',this.dataChkAll)
			addDom.find('table td.chk input').on('change',this.dataChk)
		}

		if(_self.hasEdit){
			cm.FnTbEditCls.call(_self, addDom)
		}

		if(this._over) {
			this._over(this, data)
		}
		return this;
	}

	_self.csleHtml = function(csle,csleType,item){
		var result = ''
		if(csleType == 'menu'){
			result += '<td class="last borderBox cslBox">'+
						  '<a class="icon-menu cslShow" href="javascript:void(0)"></a>'+
						  '<div class="listhide cslList" style="*width:128px;display:none;">'
			for (var n = 0; n < csle.length; n++) {
				var _href = 'javascript:void(0)';
				if(csle[n].href){
					if(typeof(csle[n].href) == 'string'){
						_href = csle[n].href
					}else{
						_href = csle[n].href(item)
					}
				}
				var _isShow = !csle[n].isShow ? true : csle[n].isShow(item)
				if(_isShow){
					result += '<a class="txtEllipsis btn-a '+csle[n].css+(csle[n].status?csle[n].status(item):'')+'" href="'+_href+'" data-id='+item[dataId]+
							  ' data-path='+item.dataPath+'>'+
							  '<i class="'+csle[n].icon+'"></i>'+csle[n].txt+'</a>'
				}
			}
			result += '</div>'

		}else if(csleType == 'btn'){
			result += '<td class="last borderBox cslBox btnInline">'
			for (var n = 0; n < csle.length; n++) {
				var _href = 'javascript:void(0)';
				if(csle[n].href){
					if(typeof(csle[n].href) == 'string'){
						_href = csle[n].href
					}else{
						_href = csle[n].href(item)
					}
				}
				var _isShow = !csle[n].isShow ? true : csle[n].isShow(item)
				if(_isShow){
					var addCss = ''
					if(csle[n].btnCss){
						addCss = csle[n].btnCss + ' ' + csle[n].css+(csle[n].status?csle[n].status(item):'')
					}else{
						addCss = csle[n].css+(csle[n].status?csle[n].status(item):'')
					}
					result += '<a class="txtEllipsis btn-a '+addCss+'" href="'+_href+'" data-id='+item[dataId]+
							  ' data-path='+item.dataPath+'>'+
							  '<i class="'+csle[n].icon+'"></i>'+csle[n].txt+'</a>'
				}
			}
		}else if(csleType == 'chk'){
			result += '<td class="last borderBox cslBox">';
			result += '<input type="checkBox" class="'+csle.css+'" data-id='+item[dataId]+
							  ' data-path='+item.dataPath+' />'
		}
		return result + '</td>'
	}

	_self.success = function(fn){
		if(fn instanceof Function) this._success = fn;
		return this;
	}

	_self.over = function(fn){
		if(fn instanceof Function) this._over = fn;
		return this;
	}

	_self.fnGetData = function(getSetting,isNew){
		var ths = this;
		ths.addDom.find('table tr:gt('+(isFixedTh?1:0)+')').remove();
		if(!ths.addDom.find('.dataLoading').length) ths.addDom.append('<p class="dataLoading">Loading.......</p>');
		if(getSetting) ths.getSetting = getSetting;

		$.get(ths.getUrl, ths.getSetting, function(data, status, xhr){
			if(xhr.status == 200){
				_self._data = data
				_self.addDom.find('.dataLoading').remove()
				if(_self._success){
					_self._success(data,xhr)
				}
				if(!data) {
					_self.addDom.find('.dataLoading').addClass('err').text('没有数据可用！');
					if(_self._over) _self._over(_self, data, xhr);
					return;
				}

				var listData = getData.dataPath ? data[getData.dataPath] : data

				if(_self.isSort){
					listData = cm.fnSort.sort(listData, _self.sortKey||_self.th[0].name, _self.sequence||cm.fnSort.ba)
				}

				_self.addListCc(listData)

				if(_self.pageDom && (isNew || isAddPage)){
					isAddPage = false;
					_self.pageDom.children().remove();
					if((data[_self.totalPages] > 1)){
						cm.addPageDom(_self.pageDom, data[_self.totalPages], function(num){
							getSetting[_self.page] = num;
							_self.fnGetData(getSetting);
							_pageNum = parseInt(num)-1;
						},false,(_self.row && function(rowNum){
							_self.getSetting[_self.row] = rowNum
							_self.fnGetData(_self.getSetting,true)
						}));	
						_self.row && _self.pageDom.find('.pageRow .v').val(_self.getSetting[_self.row]);
					}
				}

				var mh = ths.addDom.parent().height() - cm.calcSibingsHeightSum(ths.addDom)
				ths.addDom.height(mh);

				$(window).on('resize',function(e){
					var mh = ths.addDom.parent().height() - cm.calcSibingsHeightSum(ths.addDom)
					ths.addDom.height(mh);
				})

				if(callback && callback instanceof Function) callback(listData, _self);

			}else{
				_self.addDom.find('.dataLoading').addClass('err').text(xhr.status+'错误，数据请求失败！')
				if(_self._over) _self._over(_self, data, xhr);
			}
		}).error(function(xhr,err){
			if(_self._over) _self._over(_self, err, xhr);
			_self.addDom.find('.dataLoading').addClass('err').text(xhr.status+'错误，数据请求失败！')
		})
		return _self
	}

	_self.addTb()  //添加表格

	setTimeout(function(){
		if(getData){
			_self.pageDom = getData.pageDom  //添加翻页层
			_self.totalPages = getData.totalPage  //获取翻页总数
			_self.getUrl = getData.url  //数据请求地址
			_self.getSetting = getData.setting  //数据请求参数
			_self.page = getData.page || 'page'  //翻页参数

			_self.fnGetData(_self.getSetting,true)
		}else if(data){
			_self.addListCc(data)
			if(callback && callback instanceof Function) callback(data, _self);
		}
	}, 50);

	return _self

	function fnFixedTh(dom){
		var domNextTh = dom.next().find('th')
		dom.find('th').each(function(i, item){
			if(!$(this).hasClass('no')){
				var w = domNextTh.eq(i).width(); 
				domNextTh.eq(i).width(w);
				$(this).width(w);
			}
		})
		dom.next().css('visibility','hidden')
		// dom.find('th').height(domNextTh.outerHeight()+1)
	}
}

/**
*生成目录列表
*obj => {
	get:{
		url:'请求路径',
		setting:'请求数据',
		dataPath:'数据Key'
	},
	ttl:'头标',								String
	cls:'控制器',							Araay{css:'class',txt:'name',fn:function(){}}
	addDir:'添加目录',						Funtion Or Objecte => {url:'新增接口地址',dataType:'数据类型'}
	data:'数据',  							Array{}
	nextData:'下一级数据Key',  				Objecte => {dataPath:'数据Key',dirName:'显示名称'}
	id:'数据库Id',							String
	dirName:'目录名称Key',					String
	addDom:'添加列表层', 					Element
	css:'主体样式',							String
	href:'目录链接',						function(item){ return value; }
	on:0									Number
}
*
*<ul> <li> <a href="obj.herf||javascript:void(0);" data-id=""></a> (nextData？<span class="btn-a icon-folder"></span>)</li> (nextData？<ul>...</ul>) </ul>
*
*/
cm.fnDirList = function (obj,callback){
	var ttl = obj.ttl !== null ? $('<h2 class="ttl">'+(obj.ttl||'目录')+'</h2>') : ''
	var _self = obj || {};

	_self.on = _self.on || 0
	_self.ona = {}
	_self.clsDom = ''
	_self.pd = 18;

	_self.click = function(fn){
		if(fn instanceof Function){
			_self.ck = fn;
		}
		return this;
	}

	_self.dom = $('<div class="'+(obj.css || 'dirlists')+'"></div>');

	_self.lists = $('<div class="lists"></div>')

	_self.ul = $('<ul></ul>');

	_self.lists.append(_self.ul)

	_self.nottl || _self.dom.append(ttl);
	_self.dom.append(_self.lists);
	_self.addDom.append(_self.dom);

	if(obj.addDir instanceof Function){
		var addDirDom = $('<span class="btn-addDir icon-plus"></span>');
		ttl.append(addDirDom);
		addDirDom.on('click',$.proxy(obj.addDir, _self));
	}

	_self.showNext = function(e){
		$(this).toggleClass('icon-folder-open').next('ul').slideToggle(200)
	}

	_self.updateAll = function(data){
		_self.addLists(this.ul, data || this.data, true)
	}

	_self.update = function(type,thsLi,name){
		switch(type){
			case 'delete':
			this.deleteList(thsLi)
			break;

			case 'update':
			this.updateList(thsLi,name)
		}
	}

	_self.deleteList = function(thsLi){
		
		function setListDataPath(thslists, le){
			thslists.each(function(i, item){
				var thsDataPath = $(this).data('dataPath')
				var ar = thsDataPath.split('-')

				ar[le] -= 1 
				var t = ''

				for (var i = 0; i < ar.length; i++) {
					if(i != ar.length-1){
						t += ar[i] + '-'
					}else{
						t += ar[i]
					}
				}

				thsDataPath = t
				
				$(this).data('dataPath',thsDataPath)
				$(this).find('>p>a').attr('data-path',thsDataPath)

				if($(this).find('>ul').length && $(this).find('>ul>li').length){
					setListDataPath($(this).find('>ul>li'), ar.length-1)
				}
			})
		}

		var isRemoveUl = false;
		
		if(thsLi.nextAll().length) {
			setListDataPath(thsLi.nextAll(), thsLi.data('dataPath').split('-').length-1);
			thsLi.find('>p').hasClass('on') && thsLi.next().find(">p").addClass('on').find(">a").click()
		}else if(thsLi.prev().length){
			thsLi.find('>p').hasClass('on') && thsLi.prev().find(">p").addClass('on').find(">a").click()
		}else if(thsLi.parents('li:first').length){
			var thsbtnA = thsLi.parents('li:first').find('>.btn-a').remove()
			thsLi.find('>p').hasClass('on') && thsbtnA.prev("p").addClass('on').find(">a").click()
			isRemoveUl = true;
		}else{
			window.showTmain && window.showTmain.addListCc([])
		}

		var zd = cm.getPathData(thsLi.data('dataPath'), this.data, this.nextData, true)

		zd.parentData.splice(zd.idx, 1)

		isRemoveUl?thsLi.parent().remove():thsLi.remove()
	}

	_self.updateList = function(thsLi,name){
		thsLi.find('>p>a').text(name)
	}

	_self.getOnData = function (path) {
		return cm.getPathData(path, this.data, this.nextData, true).data;
	}

	_self.listOn = function(_ths){
		_self.ul.find('.on').removeClass('on')
		_ths.parent().addClass('on')

		var preLi = _ths.parents('li:first')

		while(preLi.length){
			preLi.find('>p').addClass('on')
			preLi = preLi.parents('li:first')
		}

		this.ona.dom = _ths
		this.ona.id = _ths.attr('data-id')
		this.ona.data = _self.getOnData(_ths.attr('data-path'))

		if(this.ck instanceof Function){
			this.ck(this.ona)
		}
	}

	_self.addList = function(data, addDom, dirName){
		var _addDom = addDom || this.ul, zd = null, ndobj = this.nextData, ndPath = ndobj.dataPath;

		if(_addDom[0].tagName == 'LI'){
			zd = cm.getPathData(_addDom.data('dataPath'), this.data, ndPath, true);

			if(ndPath) {
				if(!zd.data[ndPath]) zd.data[ndPath] = [];
				zd.data[ndPath].push(data);
			}

			this.addNextDom(_addDom, zd.data, false, dirName);

			return;
		}

		if(_addDom[0].tagName != 'UL') return;

		var lis = _addDom.find('>li:last'),
			ali = lis.length ? lis : _addDom.parent('li');

		if(!lis.length && !ali.lengh){
			this.data.push(data)
		}else{
			zd = cm.getPathData(ali.data('dataPath'), this.data, ndPath, true);
			zd.parentData.push(data)
		}

		this.appendList(data, _addDom, undefined, false, dirName);
	}

	_self.addNextDom = function(domLi, data, pd, dirName){
		var ths = this, ndobj = ths.nextData, nd = ndobj && data[ndobj.dataPath], _pd = pd ? pd - ths.pd : (domLi.parent('ul').length ? parseInt(domLi.parent().parent().find('>p>a').css('paddingLeft')): 0);
		var nextMenu = nd ? $('<span class="btn-a icon-folder" style="padding-left:'+_pd+'px"</span>') : '',
			nextUl = nextMenu !== '' ? $('<ul style="display:none;"></ul>') : '';

		if(nextMenu){
			domLi.append(nextMenu);
			domLi.append(nextUl);
			ths.addLists(nextUl, nd, false, false, (dirName||ndobj.dirName));
			nextMenu.on('click',ths.showNext);
		}

		return nextUl;
	}

	_self.appendList = function(item, addDom, i, pd, dirName){
		var ths = this
		var _addDom = addDom || ths.ul
		if(i === undefined) i = _addDom.find('>li').length;
		var _pd = pd || (_addDom.parent('li').length ? parseInt(_addDom.parent('li').find('>p>a').css('paddingLeft')) + ths.pd : false) || ths.pd;
		var parent2Dom = _addDom.parent(), isParent2Li = parent2Dom[0].tagName == 'LI', parentPath = isParent2Li ? parent2Dom.data('dataPath')+'-'+i : i + '';

		var name = item[dirName||ths.dirName]

		var li = $('<li><p><a style="padding-left:'+_pd+'px" href="'+(obj.href?obj.href(item):'javascript:void(0);')+'" data-id="'+item[ths.id||'_id']+'" data-path="'+parentPath+'">'+name+'</a></p></li>')

		_addDom.append(li);

		var _lica = li.find('>p>a');

		if(_lica[0].scrollWidth > _lica[0].clientWidth){
			_lica.attr('data-title',name)
		}

		li.data('dataPath',parentPath)

		_self.addNextDom(li, item, false, dirName)

		if(obj.cls){
			var clsDom = ''
			clsDom = '<div class="cls"><b class="icon-menu showBtn"></b> <span class="btnbox">'
			
			for (var j = 0; j < obj.cls.length; j++) {
				if(obj.cls[j].isNoShow instanceof Function && obj.cls[j].isNoShow(item)){
					continue;
				}
				clsDom += '<span class="btn-c '+obj.cls[j].css+'" data-id="'+item[ths.id||'_id']+'" data-path="'+parentPath+'" data-clsIdx="'+j+'">'+obj.cls[j].txt+'</span>'
			}
			clsDom += '</span></div>'

			li.data('cls',clsDom)
		}

		li.on('click', '>p>a', function(){
			var _ths = $(this)
			_self.listOn(_ths)
		})

		if(_self.cls){
			li.find('>p').hover(function(){
				var thsLi = $(this).parent()
				var _clsDom = thsLi.data('cls')

				thsLi.addClass('zIndex99');
				$(this).append(_clsDom)

				var cls = $(this).find('>.cls')

				cls.find('.btn-c').attr('data-path',thsLi.data('dataPath'))

				cls.on('click','.showBtn', function(){
					$(this).next('.btnbox').css('display','block')
				})

				cls.on('mouseleave','.btnbox', function(){
					$(this).css('display','none')
				})
			},function(){
				$(this).parent().removeClass('zIndex99').find('.cls').remove()
			})

			for (var i = 0; i < _self.cls.length; i++) {
				li.on('click', '>p .'+_self.cls[i].css, function(e){ e.preventDefault(); e.returnValue = false; _self.cls[$(this).attr('data-clsIdx')].fn(this, $(this).parents('li:first'), _self.getOnData($(this).attr('data-path'))) })
			}
		}
	}

	_self.addLists = function(addDom, data, isFirstAdd, pd, dirName){
		if(!data) return;
		var ths = this;
		isFirstAdd && ths.ul.children().remove();

		$.each(data, function(i, item){
			_self.appendList(item, addDom, i, pd, dirName)
		})

		cm.fnTitle(addDom)

		if(isFirstAdd && ths.on){
			var _onDom = ths.ul;
			if($.isArray(ths.on)){
				for (var i = 0; i < ths.on.length; i++) {
					if(!_onDom.length) break;
					_onDom = i == 0 ? _onDom.find('> li:eq('+ths.on[i]+')') : _onDom.find('> ul > li:eq('+ths.on[i]+')')
					_onDom.find('> .btn-a').click()
				}
				_onDom = _onDom.find('a:eq(0)')
				
			}else{
				if(isNaN(ths.on)) return;
				_onDom = _onDom.find('li:eq('+ths.on+') a:eq(0)')
			}
			_self.listOn(_onDom)
		}
	}

	_self.getData = function(obj){
		ths = this;
		if(obj) ths.get = obj;

		ths.data = [];

		$.get(ths.get.url, (ths.get.setting||{}), function(data, status, xhr){
			if(data){
				ths.dataPath ? ths.data = data[ths.dataPath] : ths.data = data, ths.addLists(ths.ul, ths.data, true), $.isFunction(callback) && callback(ths.data, ths.ul)
			}
		})

		return ths
	}

	obj.data && _self.addLists(_self.ul, obj.data, true)

	obj.get && _self.getData()

	return _self
}

/**
* 根据路径(0-0-0)获取数据 & 数组对象
* path => 路径
* data => 数据
* nextData => 下一级数据路径   String Or Array
* isNotNew => 是否放回新对象
*/
cm.getPathData = function (path, data, nextData, isNotNew) {
	if(!path || !data || !data.length) return false;
	if (path.indexOf('-')) {
		var p = path.split('-');
		var r = !isNotNew ? $.extend(true, {}, data) : data;
		var idx = 0;

		for (var i = 0; i < p.length; i++) {
			var nt = nextData ? (typeof nextData == 'string' ? nextData : $.isPlainObject(nextData) ? nextData.dataPath : nextData[i]) : false;
			idx = p[i];
			if(i == p.length-1)
				r = nt && r[nt] ? r[nt] : r;
			else
				r = nt && r[nt] ? r[nt][p[i]] : r[p[i]];
		}
		
		return {data:r[idx], parentData:r, idx:idx};
	}else {
		return {data:data[path], parentData:data, idx:path};
	}
}

/*--生成检测表格视图--*/
cm.fnTbCheck = function(obj,callback){
	var r = {
		html:'<table class="table-info">'
	}

	if(obj.th){
		r.html += '<tr>'
		$.each(obj.th,function(i, item){
			r.html += '<th>'+item+'</th>'
		})
		r.html += '</tr>'
	}
	
	$.each(obj.data,function(n, item){
		var td1 = {r:0}

		for (var i = 0; i < item.check.length; i++){
			td1.r += item.check[i].gist.length
		}

		td1.t = '<td rowspan="'+td1.r+'">'+item.name+'</td>'

	  for (var i = 0; i < item.check.length; i++) {
	  	var gistLength = item.check[i].gist.length
	  	var tdh2 = '<td rowspan="'+gistLength+'">'+item.check[i].name+'</td>'

	  	for (var j = 0; j < gistLength; j++) {
	  		r.html += '<tr>'
	  		if(i == 0 && j == 0){
	  			r.html += td1.t
	  		}
	  		if(j == 0){
	  			r.html += tdh2
	  		}
	  		r.html += '<td>'+item.check[i].gist[j].name+'</td>'
	  		r.html += '<td><input type="checkBox" class="chk" '+(item.check[i].gist[j].result == 'Y'?'checked="checked"':'')+' data-path="'+n+'-'+i+'-'+j+'" /></td>'
	  		r.html += '</tr>'
	  	}
	  }
	})
	return r
}

/*--判断下拉框位置 true=bottom,false=top--*/
cm.fnSelectPosition = function (ths,ctHg){
	var thsWdBm = $(window).height()-( ths.height()+( ths.offset().top-$(document).scrollTop() ) );  //弹出框距离窗口底部的距离

	if(!isNaN(ctHg)){
		return thsWdBm-ctHg > 0
	}
}

/*--模糊匹配数据--*/
cm.searchData = function(data, sTxt, keys, filters){
	var _rsult = []

	$.each(data, function(i, item){
		for(var d in item){
			if(keys && keys.indexOf(d) == -1) continue;

			var thsData;

			if(filters && filters[d]) thsData = filters[d](item[d], item);
			else thsData = item[d]

			if(thsData && thsData.toString().toLowerCase().indexOf(sTxt.toString().toLowerCase()) >= 0){
				_rsult.push(item)
				break;
			}
		}
	})

	return _rsult
}

/*--计算元素集的所占位置的宽度--*/
cm.calcElesWidth = function(eles,lose){
	var w = 0;

	eles.each(function(i, el) {
		if(!lose || lose.indexOf(i) == -1)  w += $(el).outerWidth(true);
	});

	return w;
}

/*--计算元素集的所占位置的宽度--*/
cm.calcElesHeight = function(eles,lose){
	var w = 0;

	eles.each(function(i, el) {
		w += $(el).outerHeight(true);
	});

	return w;
}

/*--计算相邻元素所占位置的高度--*/
cm.calcSibingsHeightSum = function(ele,lose){
	return cm.calcElesHeight(ele.siblings())
}

/*--显示按钮下拉框方法，@功能操作框--*/
cm.fnBtnShowOperation = function(dom){
	var cslBox = dom ? dom.find('.cslBox') : $('.cslBox'); 
	var btnToShow = dom ? dom.find('.cslShow') : $('.cslShow');
	var showOptions = dom ? dom.find('.cslList') : $('.cslList');
	var fh = btnToShow.outerHeight();
	
	btnToShow.off('click',clsShow)
	btnToShow.on('click',clsShow)
	$(document).off('click',clsHide)
	$(document).on('click',clsHide)

	function clsShow(e){
		var ths = $(this);
		var ctHg = ths.next().height();
		var _fh = fh + ths.position().top + 'px';
		
		if(cm.fnSelectPosition(ths,ctHg)){
			ths.next().css({'top':_fh,'bottom':'auto'})
		}else{
			ths.next().css({'top':'auto','bottom':_fh})
		}

		if(!ths.parent().hasClass('zIndex100')){
			ths.parent().addClass('zIndex100')
			ths.addClass('active');
			ths.next().slideDown(200)
		}else{
			ths.parent().removeClass('zIndex100').addClass('zIndex99');
			ths.next().slideUp(200,function(){
				ths.parent().removeClass('zIndex99')
				ths.removeClass('active');
			})
		}
	}

	function clsHide(e){
		$('.cslList:visible').each(function(){
			var ths = $(this);
			if(ths.height() > 2){
				ths.parent().removeClass('zIndex100').addClass('zIndex99');
				ths.slideUp(280,function(){
					ths.parent().removeClass('zIndex99')
					ths.prev().removeClass('active');
				})
			}
		})
	}
}

/**
*create: select >> option
* d => data，t => text， v => value, e => selectedValue
*/
cm.fnCreateSelectOption = function(d,t,v,e,ist){
	var h = ist?'<option value="">--请选择--</option>':''
	if(!d || !d.length) return '<option value="">--没有选项--</option>';
	$.each(d,function(i,m){
		var _v,_t
		if(typeof(m) == 'string'){
			_v = _t = m
		}
		else if(m[v||t]){
			_v = m[v||t].toString(),
			_t = m[t]
		}
		h += '<option value="'+_v+'"'+(_v==e || m.selected?' selected="selected"':'')+'>'+_t+'</option>'
	})
	return h
}

cm.creatEdit = function(d){
	var r = '',
		t = d.type,
		a = d.dataName,
		txt = d.value||'',
		verify = d.verify||'',
		editBtn = d.isBtnEdit ? '<div class="clsBox"><span class="icon-quill btn-edit"></span><span class="icon-checkmark btn-sbm" style="display:none;"></span><span class="icon-cross btn-cancel" style="display:none;"></span></div>' : '';

	switch(t){
		case 'select':
		r = '<select class="e" data-name="'+a+'"'+d.attr+'>';
		r += cm.fnCreateSelectOption(d.option, 'txt', 'value', d.selectedValue, true);
		r += '</select>'+editBtn;
		break;

		case 'radio':
		var s = d.option
		for (var i = 0; i < s.length; i++) {
			r += '<label><input type="radio" value="'+s[i].value+'" name="'+a+'" data-name="'+a+'"'+verify+(s[i].checked?' checked="checked"':'')+' />'+s[i].txt+'</label>';
		}
		break;

		case 'checkbox':
		var s = d.option
		for (var i = 0; i < s.length; i++) {
			r += '<label><input class="echk" type="checkbox" value="'+s[i].value+'" name="'+a+'" data-name="'+a+'"'+verify+(s[i].checked?' checked="checked"':'')+' />'+s[i].txt+'</label>';
		}
		break;

		case 'textarea':
		r = '<textarea class="e" data-name="'+a+'"'+d.attr+'>'+txt+'</textarea>'+editBtn;
		break;

		default:
		r = '<input class="e" type="'+t+'" data-name="'+a+'"'+d.attr+' value="'+txt+'" />'+editBtn;
	}

	return r
}

/*输入框表格*/
cm.createTbEdit = function(){

	var sf = this

	sf.sbm = function(fn){
		if(fn instanceof Function) sf._sbm = fn;

		return sf;
	}

	/*
	* d => [
		[
			{
				type:'类型',
				style:'内联样式',
				name:'数据名称',
				txt:'字段名',
				option:'类型多选的选项',
				verify:'验证',
				required:'是否必填'
			}
		]
	]
	*/
	sf.creatHtml = function(d, isEdit){
		var h = '<table class="editTb'+(isEdit?' at':'')+'">';
	
		for (var i = 0; i < d.length; i++) {
			h += '<tr>'
			for (var j = 0; j < d[i].length; j++) {
				if(d[i][j].type == "hide"){
					 h += '<td></td><td></td>';
					 break;
				}
				var e = fe(d[i][j]);
				if(d[i][j].style) console.log(d[i][j].style);
				h += '<td class="t"'+(d[i][j].tstyle?' style="'+d[i][j].tstyle+'"':'')+'>'+d[i][j].txt+'</td> <td class="u"'+(d[i][j].ustyle?' style="'+d[i][j].ustyle+'"':'')+'>'+e+'</td>';
			}
			h += '</tr>';
		}

		h += '</table>';

		return h;

		function fe(d){
			var e = '',
				t = d.type,
				a = d.name;
			var verify = d.verify ? ' data-verify="'+d.verify+'"' : '',
				required = d.required ? ' data-required="true"' : '',
				disabled = isEdit ? ' disabled="disabled"' : '',
				attr = d.attr ? ' '+d.attr:'',

			e = cm.creatEdit({
				type:t,
				dataName:a,
				verify:verify,
				attr:verify+required+disabled+attr,
				option:d.option,
				isBtnEdit:isEdit && !d.notEdit
			})

			return e;
		}
	}

	sf.add = function(addDom){
		addDom.replaceWith(sf.editDom);
		sf.fnBind(sf.d);
		sf.btnEditOn(sf.editDom);
	}

	sf.btnEditOn = function(dom){
		dom.on('click','.scBtns .sbm',sf.fnsbm);
		dom.on('click','.scBtns .cancel',sf.fncancel);
		dom.on('click','.scBtns .reset',sf.reset);
	}

	sf.fnBind = function(d){
		for (var i = 0; i < d.length; i++) {
			for (var j = 0; j < d[i].length; j++) {
				var t = d[i][j];
				if(t.fn){
					sf.editDom.on(t.event, '[data-name="'+t.name+'"]', t.fn);
				}
			}
		}
	}

	sf.fnsbm = function(e){
		var ths = $(this);
		cm.sbm(sf.editDom.find(".scMaim"),function(data){
			sf._sbm && sf._sbm(data,ths);
			sf.fncancel(e);
		})

		return sf;
	}

	sf.reset = function(e){
		sf.editDom.find('[data-name]').val('');
	}
}

/*添加查询表格*/ 
cm.addSearch = function(obj){
	var r = {
		h: '',
		d: obj.data,
		cls: obj.cls,
		editDom: obj.addDom,
		showBtn: obj.showBtn
	};

	r.fncancel = function(e){
		r.editDom.slideUp(280);
	}
	r.show = function(e){
		r.editDom.slideDown(280);
	}

	this.createTbEdit.call(r);

	r.h = '<div id="dlSearchBox" class="dlSearchBox">'+
			'<div class="scMaim">'+r.creatHtml(r.d)+'</div>'+
			'<div class="scBtns">'+
				'<span class="btn-info radius_5 sbm ascyns">异步查询</span>'+
				'<span class="btn-info radius_5 sbm">查询</span>'+
				'<span class="btn-warning radius_5 cancel">取消</span>'+
				'<span class="btn-primary radius_5 reset">重置</span>'+
			'</div>'+
		'</div>';

	r.editDom = $(r.h);

	r.add(obj.addDom);

	r.showBtn.on('click',r.show);

	J('.dlSearchBox .scMaim input[type="date"]').each(function(index, el) {
		J(el).calendar({ format:'yyyy-MM-dd' })
	});

	J('.dlSearchBox .scMaim input[type="datetime-local"]').each(function(index, el) {
		J(el).calendar({ format:'yyyy-MM-ddTHH:mm:ss' })
	});

	return r;

}

/*添加编辑表格*/
cm.addEditTb = function(obj, isEdit){
	var r = {
		h: '',
		d: obj.data,
		cls: obj.cls,
		editDom: obj.addDom,
		cancel: function(fn){
			if(fn instanceof Function){
				this._cancel = fn;
			}
			return this;
		},
		set:function(data, fn){
			if(data){
				fndata.setData(this.editDom,data),
				fn instanceof Function && fn(thsObj.fixedEye)
			}
			return this
		}
	};


	r.fncancel = function(e){
		r._cancel && r._cancel(this, r)
	}

	this.createTbEdit.call(r);

	if(isEdit){
		r.h = r.creatHtml(r.d, true)
	}else{
		r.h = '<div class="eform">'+
				'<div class="scMaim">'+r.creatHtml(r.d)+'</div>'+
				'<div class="scBtns">'+
					'<span class="btn-info radius_5 sbm">提交</span>'+
					'<span class="btn-warning radius_5 cancel">取消</span>'+
					'<span class="btn-primary radius_5 reset">重置</span>'+
				'</div>'+
			'</div>';
	}

	

	r.editDom = $(r.h);

	r.add(obj.addDom);

	if(isEdit){
		cm.FnTbEditCls.call(r, r.editDom)
	}

	return r;
	
}

/*表格编辑框控件*/
cm.FnTbEditCls = function(aDom){
	var sf = this;
	var isSbm = false;
	var isEidtk = ['INPUT','SELECT','TEXTAREA']

	aDom.find('.btn-edit').on('click', dataEdit)
	aDom.find('.btn-sbm').on('click', dataSbm)
	aDom.find('.btn-sbm').on('mousedown', function(){ isSbm = true; })
	aDom.find('.btn-cancel').on('click', dataCancelEdit)
	aDom.find('.e').on('blur', dataCancelEdit)

	function dataEdit (e){
		isSbm = false;
		var ths = $(this), editDom = ths.parent().prev()
		
		editDom.removeAttr('disabled').data('v',editDom.val()).focus()

		ths.css('display','none').siblings().css('display','initial')

	}

	function dataSbm (e){
		var ths = $(this), editDom = ths.parent().prev()

		editDom.attr('disabled','disabled')

		ths.siblings('.btn-edit').css('display','initial').siblings().css('display','none')

		sf._sbm(fndata.getData(aDom),fndata.getData(editDom.parent()))
	}

	function dataCancelEdit (e){
		if(isSbm) return;
		var ths = $(this), isInput = isEidtk.indexOf(this.tagName) >= 0, dom = isInput ? ths : ths.parent().prev(), btnEdit = isInput ? ths.next().find('.btn-edit') : ths.siblings('.btn-edit')

		dom.attr('disabled','disabled').val(dom.data('v')).change()

		btnEdit.css('display','initial').siblings().css('display','none')
	}
}

/**
* 获取今天的时间 (yyyy-MM-ddTHH:mm:ss)
* toTime => 过去的时间（毫秒）
*/ 
cm.getFormatDatetimeLocal = function(toTime){
	var format = "";
	var nTime = new Date((new Date).getTime()-(toTime||0));
	format += nTime.getFullYear()+"-";
	format += (nTime.getMonth()+1)<10?"0"+(nTime.getMonth()+1):(nTime.getMonth()+1);
	format += "-";
	format += nTime.getDate()<10?"0"+(nTime.getDate()):(nTime.getDate());
	format += "T";
	format += nTime.getHours()<10?"0"+(nTime.getHours()):(nTime.getHours());
	format += ":";
	format += nTime.getMinutes()<10?"0"+(nTime.getMinutes()):(nTime.getMinutes());
	format += ":00";
	return format;
}

cm.getFormatDateLocal = function(tTime){
	var format = "";
	var nTime = new Date((new Date).getTime()-(tTime||(1000*60*5)));
	format += nTime.getFullYear()+"-";
	format += (nTime.getMonth()+1)<10?"0"+(nTime.getMonth()+1):(nTime.getMonth()+1);
	format += "-";
	format += nTime.getDate()<10?"0"+(nTime.getDate()):(nTime.getDate());
	return format;
}

/*--根据毫秒设置时间--*/
cm.initTime = function(d){
	var t = new Date(d)
	return t.toLocaleString()
}

Date.prototype.localeDate = function(type) {
	var d = this.toLocaleDateString().replace(/\//g,'-')
	var ar = d.split('-')
	for (var i = 1; i < ar.length; i++) {
		if(ar[i].length < 2){
			d = d.replace('-'+ar[i],'-0'+ar[i])
		}
	}
	return d;
};

cm.dataToLowerCase = function(data){
	var isA = $.isArray(data),r = isA?[]:{}
	if(isA){
		for (var i = 0; i < data.length; i++) {
			r[i] = {}
			for(var d in data[i]){
				var _d = d.toLowerCase()
				r[i][_d] = data[i][d]
			}
		}
	}else{
		for(var d in data){
			var _d = d.toLowerCase()
			r[_d] = data[d]
		}
	}
	
	return r;
}

/*--上传文件--*/
cm.upload = function(path, data, callback, errCallback){
	$.ajax({
    url: path,
    type: 'POST',
    data: data,
    cache: false,
    contentType: false, //不可缺参数
    processData: false, //不可缺参数
    success: function(data,status,xhr) {
      if(xhr.status == 201){
      	callback(data)
      }
      else{
      	if(errCallback){
      		errCallback(data)
      	}else{
      		cm.fnFixedHint(data.err)
      	}
      }
    },
    error: function(err) {
    	if(errCallback){
    		errCallback(data)
    	}else{
    		cm.fnFixedHint(err)
    	}
    }
	});
}

/*--显示上传的图片--*/
cm.addImg = function(fileInput,imgBox){
	this.uploadImgObj = {
		fileValue:fileInput.val(),
		fileSize:0,
		imgSrc:'',
		isUpoad:true
	}

  if (!/(.gif|png|jpeg|jpg)$/.test(this.uploadImgObj.fileValue)){
    alert("图片类型必须是.gif、.png、.jpeg、jpg中的一种");
    return false;
  } else {
    if (window.ActiveXObject){
      var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
      var file = fileSystem.GetFile(this.uploadImgObj.fileValue);
      this.uploadImgObj.fileSize = file.size;
      this.uploadImgObj.imgSrc = fileInput.val();
    } else {
      this.uploadImgObj.imgSrc = window.URL.createObjectURL(fileInput[0].files[0]);
      this.uploadImgObj.fileSize = fileInput[0].files[0].size;
    }
    this.uploadImgObj.fileSize = (Math.round(this.uploadImgObj.fileSize * 100 / 1024) / 100);
    if (this.uploadImgObj.fileSize > 2000){
    	this.uploadImgObj.isUpoad = false
      alert("图片不能大于2MB");
      return false;
    }else{
    	this.uploadImgObj.isUpoad = true
    }
    imgBox.html('<img src="'+this.uploadImgObj.imgSrc+'"" />')
	}
}

/*--上传图片--*/
cm.uploadImg = function(fileInput, path, callback, errCallback){
	if(this.uploadImgObj && !this.uploadImgObj.isUpoad) return;
	var fileName = fileInput.val();
	var extension = fileName.substring(fileName.lastIndexOf('.'), fileName.length).toLowerCase();
	if (extension == ".jpg" || extension == ".png") {
	    var fileImgData = new FormData();
	    fileImgData.append('upload', fileInput[0].files[0]);
	    this.upload(path, fileImgData, callback, errCallback)
	} 
}

/**
* 下拉框
* {
	ele:'input',
	data:'data',
	name:'name',
	val:'val',
	type:'type'    type => 'checkbox' or 'select'
}
*/
cm.fnEleSelect = function(obj, isRepetitive){
	var so = {
		slcInput:obj.ele,
		isHasCmslc:Boolean(obj.ele.parent('.cmslc').length),
		optsDom:obj.ele.next('.opts').length ? obj.ele.next('.opts') : $('<ul class="opts"></ul>'),
		optData:obj.data,
		showData:obj.data,
		slced:obj.slced || obj.ele.data('exData') || null,
		ttlName:obj.ttlName,
		name:obj.name||'name',
		val:obj.val||'val',
		isCkOpt:false,
		type:obj.type||'select',
		slc:function(fn){
			if(fn instanceof Function) this._slc = fn;
			return this;
		}
	}

	if(so.isHasCmslc) {
		so.slcInput.removeData('exData').val('');
		so.slced = null;
	}

	if( obj.type == 'checkbox' && (!so.slced || !(so.slced instanceof Array)) ) so.slced = [];

	if(!obj.ele || !obj.ele.length) return so;
	
	$.each(so.optData,function(i, item) {
		item.soIndex = i;
	});

	if(!so.slcInput.hasClass('slctxt')) so.slcInput.addClass('slctxt');

	so.slcBox = so.isHasCmslc ? so.slcInput.parent('.cmslc') : so.slcInput.wrap('<div class="cmslc" style="width:'+so.slcInput.outerWidth(true)+'px;"></div>').parent();

	so.showOps = function(){
		if(this.slcInput.hasClass('focus')) return;
		var pvhDom = this.slcInput.parentsOverflowHide();   //This function in jqueryExtend.js
		var optBoxH = pvhDom.outerHeight() - (this.slcInput.offset().top - pvhDom.offset().top) - this.slcInput.outerHeight();  //选项框距离视图窗口底部的距离
		
		this.slcBox.addClass('slcing');
		this.optData && this.optsDom.css({display:'block', top:this.slcInput.outerHeight(true)+'px', maxHeight:optBoxH+'px'});
	}

	so.hideOps = function(e){
		if(this.isCkOpt) return;
		
		this.optsDom.css('display','none');
		
		if(so.type == 'checkbox') return;

		if(this.slcInput.hasClass('focus')) this.slcInput.removeClass('focus')

		if(this.slced && this.slcInput.val()){
			this.slced[this.name] != this.slcInput.val() && this.slcInput.val(this.slced[this.name]);
		}else{
			this.slcInput.val('');
			this.slcInput.removeData('exData');
			this.slced = null;
		}

		so.slcBox.removeClass('slcing');
		this.addOpt(this.optData);
	}

	so.fnslced = function(e){
		var slcData = so.showData[parseInt($(this).attr('data-path'))];
		if(so.slced && so.slced.soIndex == slcData.soIndex) {
			if(e) so.isCkOpt = false;
			return;
		}

		so.slcInput.val($(this).text());
		so.slcInput.data('exData', slcData);
		so.slcInput.change();
		so.slced = slcData;

		if(so._slc) so._slc(so.slced);

		if(e) so.isCkOpt = false;
	}

	so.fnChecked = function(e){
		so.slced = [];

		so.slcInput.val(so.optsDom.find('input:checked').map(function(){
			so.slced.push(so.showData[parseInt($(this).attr('data-path'))])
			return $(this).attr('data-value');
		}).get().join(','));

		so.slcInput.data('exData', so.slced)

		if(so._slc) so._slc(so.slced);

		so.slcInput.focus().change();

	}

	so.hasData = function(data,soi){
		var r = {has:false};

		for (var i = 0; i < data.length; i++) {
			if(data[i].soIndex == soi){
				r.has = true;
				r.idx = i;
				r.data = data[i];
				break;
			}
		}

		return r;
	}

	so.setSlced = function(dir){
		var slcDom = this.optsDom.find('.slced');

		if(dir){
			if(slcDom.length){
				slcDom = slcDom.removeClass('slced').parent()[dir]().length ? slcDom.parent()[dir]().find('>a').addClass('slced') : this.optsDom.find('li:'+(dir == 'prev' ? 'last' : 'first')+'>a').addClass('slced');
			}else{
				slcDom = this.optsDom.find('li:first>a').addClass('slced');
			}

			slcDom.scrollTo(this.optsDom, this.optsDom.height()/2-20, 120);
		}else{
			this.isCkOpt = false;
		}

		slcDom.length && $.proxy(so.fnslced, slcDom[0])();
	}

	so.preSlced = function(){
		var slcDom = this.optsDom.find('.slced');

		if(slcDom.length){
			slcDom.removeClass('slced').parent().prev().length ? slcDom.prev().find('>a').addClass('slced') : this.optsDom.find('li:last>a').addClass('slced');
		}else{
			this.optsDom.find('li:first>a').addClass('slced');
		}
	}

	so.upSlc = function(e){
		var c = e.keyCode;

		switch(c){
			case 38:
			so.setSlced('prev');
			break;

			case 40:
			so.setSlced('next');
			break;

			default:
			so.search($(this).val())
		}
	}

	so.downSlc = function(e){
		if(so.type == 'checkbox'){
			if(e.keyCode == 9) {
				so.slcInput.removeClass('focus');
				so.isCkOpt = false;
			}else{
				e.preventDefault()
				e.returnValue = false
			}
				
		}else{
			if(e.keyCode == 9) so.setSlced();
		}
		
	}

	so.addOpt = function(data){
		so.showData = data;
		so.optsDom.children().remove();
		$.each(data, function(i, item){
			// if(Array.isArray(item)){
			// 	so.addTtl()
			// }
			if(so.type == 'select')
				so.addSelectOpt(i, item)
			else
				so.addCheckboxOpt(i, item)
		})
	}

	so.addTtl = function(data){
		var ttl = $('<li class="ttl">'+data.name+'</li>')
		so.optsDom.append(ttl);
	}

	so.addSelectOpt = function(i, item){
		var slcedCss = so.slced && item[so.name] == so.slced[so.name] ? 'slced' : '';
		var opt = $('<li class="opt"><a class="'+slcedCss+'" href="javascript:void(0);" tabIndex="-1" data-value="'+(item[so.val] || item[so.name])+'" data-path="'+i+'">'+item[so.name]+'</a></li>');
		
		opt.find('>a').on('mousedown',so.fnslced);
		so.optsDom.append(opt);
	}

	so.addCheckboxOpt = function(i, item){
		var opt = $('<li class="opt"><label tabIndex="-1"><input type="checkbox"  data-value="'+(item[so.val] || item[so.name])+'" data-path="'+i+'" />'+item[so.name]+'</label></li>');
		
		if(so.hasData(so.slced, item.soIndex).has){
			opt.find('label>input[type="checkbox"]')[0].checked = true;
		}

		opt.find('label>input').on('change',so.fnChecked);
		so.optsDom.append(opt);
	}

	so.search = function(txt){
		so.addOpt(cm.searchData(this.optData, txt));
	}

	// so.slcInput.after(so.slcInput);
	!so.isHasCmslc && so.slcInput.after(so.optsDom).css('top', so.slcInput[0].clientHeight + so.slcInput[0].offsetTop);

	if(so.optData) so.addOpt(so.optData);

	so.slcInput.off('.so');

	so.slcInput.on('focus.so',$.proxy(so.showOps, so));
	so.slcInput.on('blur.so',$.proxy(so.hideOps, so));

	so.slcInput.on('keydown.so',so.downSlc);

	if(so.type == 'select'){
		so.slcInput.on('keyup.so',so.upSlc);
	}

	so.optsDom.off('.so');

	so.optsDom.on('mouseenter.so', function(){
		so.slcInput.addClass('focus').focus();
		so.isCkOpt = true;
	})

	so.optsDom.on('mouseleave.so', function(){
		so.slcInput.removeClass('focus');
		so.isCkOpt = false;
	})

	return so;
}

/**
* 数据联动
* arObj => 联动数据集   -> Array  -> {
	dom:'input节点', 
	getData:{url:'',dKey:'可选，数据存放的key',setting:{传递后台的参数}},    //后台请求数据 与 data 二选一
	data:'数据',    // 与 getData 二选一 
	nextKey:'用于获取下一级数据的当前数据key',
	toKey:'getData.setting -> 传入给下一级数据参数key', 
	showKey:'显示key', 
	showType:'显示类型'}
*/
cm.fnDataLinkage = function(arObj){

	// 获取数据
	function getData(toObj){
		var getD = toObj.getData, _d;
		$.get(getD.url, getD.setting||{}, function(data, status, xhr){
			if(data){
				if(getD.dKey)
					_d = data[getD.dKey]
				else
					_d = data
				setToData(toObj, _d)
			}
		})
	}

	// 赋值对象DOM
	function setToData(toObj, data){
		cm.fnEleSelect({
			ele:toObj.dom,
			data:data,
			name:toObj.showKey,
			type:toObj.showType
		})
	}

	// 查找下一级数据
	function fnToData(item, thsData, toObje){
		if(!thsData){
			setToData(toObje, []);
			return;
		}


		var getToData = toObje.getData

		if(getToData){
			var nexData = Array.isArray(thsData) ? concatData(thsData, item.nextKey) : thsData[item.nextKey];
			if(getToData.setting){
				getToData.setting[item.toKey] = nexData
			}else{
				getToData.setting = {}
				getToData.setting[item.toKey] = nexData
			}
			getData(getToData, toObje)
		}else{
			if(toObje.isDataToPrev)
				var toData = Array.isArray(thsData) ? concatData(thsData, item.toKey) : thsData[item.toKey];
			else
				var nexData = Array.isArray(thsData) ? concatData(thsData, item.nextKey) : thsData[item.nextKey], toData = cm.searchData(toObje.data, nexData, item.toKey);
			setToData(toObje, toData)
		}
	}

	function concatData(d,k){
		var r = []
		var _a = d.map(function(a){
			return a[k]
		})

		for (var i = 0; i < _a.length; i++) {
			for (var j = 0; j < _a[i].length; j++) {
				r.push(_a[i][j])
			}
		}

		return r;
	}

	if(arObj[0].getData){
		getData(arObj[0])
	}else{
		setToData(arObj[0], arObj[0].data)
	}

	// 进行数据关联
	$.each(arObj, function(i, item) {
		if(i == arObj.length - 1) return false;
		item.dom.on('change', function(){
			fnToData(item, $(this).data('exData'), arObj[i+1])
		})
	});
}

/*--合并表格上下相等--*/
cm.mergeTbsm = function(tbDom){
	var tds = []
	var _trs = tbDom.find('tr'),
		_tds = _trs.eq(1).find('td')

	for (var i = 0; i < _tds.length-1; i++) {
		for (var j = 0, k = 0; j < _trs.length-1; j++) {
			
			var tk = true
			var idx = tds.length

			while(tk){
				var _td1 = _trs.eq(j+1).find('td:eq('+i+')'),
					_td2 = _trs.eq(j+2).find('td:eq('+i+')')

				if(!_td2.length) break;

				if(_td1.text() == _td2.text()){
					if(k == 0){
						tds[idx] = [_td1,_td2]
					}else{
						tds[idx].push(_td2)
					}
					j++
					k++
				}else{
					tk = false;
					k = 0
				}
			}

		}
	}

	for (var i = 0; i < tds.length; i++) {
		for (var j = 0; j < tds[i].length; j++) {
			if(j == 0){
				tds[i][j][0].rowSpan = tds[i].length
			}else{
				tds[i][j].remove()
			}
		}
	}
}

/*--ajax--*/
cm.FnAjax1 = function(atype){
	var ajaxType = atype;
	return function (Url, callback) {
		$.ajax({
			url:Url,
			type:ajaxType,
			error:function(xhr,err){
				if(callback && callback instanceof Function)
					callback(xhr)
			},
			success:function(data,status,xhr){
				if(callback && callback instanceof Function)
					callback(xhr,data)
			}
		})
	}
	
}
cm.FnAjax2 = function (atype){
	var ajaxType = atype;
	return function (Url,Data,callback) {
		$.ajax({
			url:Url,
			type:ajaxType,
			data:JSON.stringify(Data),
			dataType:'json',
			contentType:'application/json',
			error:function(xhr,err){
				if(callback && callback instanceof Function)
					callback(xhr,err)
			},
			success:function(data,status,xhr){
				if(callback && callback instanceof Function)
					callback(xhr,data)
			}
		})
	}
}