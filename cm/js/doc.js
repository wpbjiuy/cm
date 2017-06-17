(function(fn){
	window.jQuery && fn(jQuery);
})(function($){
	var leftNav = $('#left-nav')

	var leftNavData = [
		{
			name:'CM方法(cm)',
			href:'index.html',
			nextData:[
				{
					name:'目录树(cm.fnDirList)',
					href:'index.html#@dir'
				},
				{
					name:'数据表(cm.fnTbList)',
					href:'index.html#@table'
				},
				{
					name:'下拉框(cm.fnEleSelect)',
					href:'index.html#@select'
				},
				{
					name:'输入框联动(cm.fnDataLinkage)',
					href:'index.html#@linkage'
				},
				{
					name:'提示框',
					href:'index.html#@message'
				}
			]
		},
		{
			name:'输入框数据处理(fndata)',
			href:'data.html',
			nextData:[
				{
					name:'说明',
					href:'data.html'
				},
				{
					name:'数据获取(fndata.getData())',
					href:'data.html#@get'
				},
				{
					name:'数据赋值(fndata.setData())',
					href:'data.html#@set'
				},
				{
					name:'数据绑定(dataBind)',
					href:'data.html#@bind'
				}
			]
		}
	]

	var on = {
		dir:0,
		table:1,
		select:2,
		linkage:3,
		message:4,
		get:0,
		set:1,
		bind:2
	}

	var isDataHtml = location.href.indexOf('data') >= 0,
		wIds = isDataHtml ? ['dir','table','select','linkage','message'] : ['dir','dir','dir']

	var hash = location.hash, zn = hash ? on[hash.slice(2)] : 0, xz = isDataHtml ? 1 : 0;

	var leftDir = cm.fnDirList({
		css:'dirlists',
		data:leftNavData, 
		dirName:'name',
		nextData:{dataPath:'nextData',dirName:'name'},
		ttl:' ',
		addDom:leftNav, 
		href:function(item){return item.href;},
		on:[xz,zn]
	})

	leftNav.mCustomScrollbar()
	$('#main-right').mCustomScrollbar()

	route.navOnGist = [
		['index','data']
	]

	route.run(function(hash){
		zIdTo(hash)
	})

	zIdTo(hash)

	function zIdTo(t){
		t = t.replace('@','')
		var z = $(t), to = z.length ? z[0].offsetTop : false
		
		if(to === false) return;

		$('#main-right').mCustomScrollbar('scrollTo',to)
	}

	window.zwheel = function(m){
		$('.infoList').each(function(i, el){
			if(el.offsetTop + $(el).height() > m){
				var leftNavOnDom = $('.dirlists > .lists > ul >li:eq('+xz+') > ul > li:eq('+$(el).index()+') > p > a')
				leftDir.listOn(leftNavOnDom)
				return false;
			}
		})

	}
})