var createHtml = {}

createHtml.editAttr = function(d,_key,placeholder,isInput){
	var inputAttr = isInput ? ' type="'+d.type+'" value="'+(d.value||'')+'"' : '';
	return 'class="bdcol borderBox"'+inputAttr+' placeholder="'+placeholder+'" '+_key+'="'+d.dataName+'"'+(d.disabled?' disabled="disabled"':'')+(d.title?' data-title="'+d.title+'"':'')+
					 	(d.required?' data-required="true"':'')+(d.verify?' data-verify="'+d.verify+'"':'')+(d.fix?' data-fix="true"':'')+(d.isExData?' data-isExData="'+d.isExData+'"':'')+
					 	(d.attr?d.attr:'')
}

/**用于生成弹窗编辑框HTML
*ttl => 标题
*data =>[[obj,obj],[obj,obj]] obj >> {
	name:'名称',
	type:'类型',
	placeholder:'提示',
	dataName:'数据名称',
	style:'样式',
	verify:'验证', 
	fix:'是否提交数据',
	eId:'输入层ID',
	slcId:'select ID',
	html:'html 字符串',
	required:'是否必填'
}
**/
createHtml.fnEditInputHtml = function (ttl, sbmTxt, data){
	var _html = '<h2 class="ttl">'+ttl+'</h2><div class="borderBox editFrom">'

	for (var i = 0; i < data.length; i++) {
		var dt = data[i];
		if(!(dt instanceof Array)){
			if(dt.isChunk){
				_html += '<div class="chunk"'+(dt.tDataNmae?'data-type="'+(dt.dataType||'object')+'" data-name="'+dt.tDataNmae+'"':'')+(dt.arType?' data-artype="'+dt.arType+'"':'')+(dt.dataPath?' data-path="'+dt.dataPath+'"':'')+'>'

				if(dt.TheDivider) {
					if(!dt.isAdd)
						_html += '<div class="TheDivider"><span class="test">'+dt.TheDivider+'</span></div>'
					else
						_html += '<div class="TheDivider"><span class="test btn-add"><i class="icon-plus"></i>'+dt.TheDivider+'</span></div>'
				}

				if(dt.tableData){
					_html += createHtml.fnTableEidtAr(dt.tableData,dt.isAdd)
				}else{
					for (var j = 0; j < dt.content.length; j++) {
						mainHtml(dt.content[j],dt.tDataKey,j)
					}
				}

				_html += '</div>'
			}else{
				_html += '<div class="etxt2" data-name="'+dt.dataName+'" data-type="'+dt.dataType+'">'+dt.html+'</div>'
			}
		}else{
			mainHtml(dt)
		}	
	}

	function mainHtml(itemData,key,num){
		var _key = key || 'data-name',
			isHide = itemData[itemData.length-1] === null,
			lg = isHide?itemData.length-1:itemData.length

		_html += '<div class="etxt2'+(num===0?' first':'')+'"'+(isHide?' style="display:none;"':'')+'>'

		for (var i = 0; i < lg; i++) {
			var f = ''
			if(lg != 1){
				f = i==0?'fl':'fr'
			}else{
				f = 'one'
			}
			var d = itemData[i];
			var editCc = '';
			var namepld = d.name.indexOf('*') == d.name.length-1 ? d.name.slice(0,d.name.length-1) : d.name
			var placeholder = d.placeholder||'请输入'+namepld

			if(d.html){
				editCc = d.html
			}else{
				if(d.type == 'select'){
					editCc = '<select class="bdcol" id="'+(d.slcId?d.slcId:'')+'" '+_key+'="'+d.dataName+'"'+(d.disabled?' disabled="disabled"':'')+'>'
					if(d.slcAr.length){
						for (var j = 0; j < d.slcAr.length; j++) {
							editCc += '<option value="'+d.slcAr[j].value+'">'+d.slcAr[j].name+'</option>'
						}
					}
					editCc += '</select>'
				}else if(d.type == 'radio'){
					if(d.slcAr.length){
						for (var j = 0; j < d.slcAr.length; j++) {
							editCc += '<label><input type="radio" value="'+d.slcAr[j].value+'" name="'+d.dataName+'" '+_key+'="'+d.dataName+'" '+(d.slcAr[j].checked||'')+' />'+d.slcAr[j].name+'</label>'
						}
					}
				}else if(d.type == 'textarea'){
					editCc = '<textarea '+createHtml.editAttr(d,_key,placeholder)+'>'+(d.value||'')+'</textarea>'
				}else{
					editCc = '<input '+createHtml.editAttr(d,_key,placeholder,true)+' />'
				}
			}
			_html += '<div class="'+f+' etxte"'+(d.style?' style="'+d.style+'"':'')+(d.dataTypeZ?' data-type="'+d.dataTypeZ+'"':'')+(d.eId?' id="'+d.eId+'"':'')+'>'+
						 '<p class="'+(d.type=='radio'?'fl tn ':'w2 txtEllipsis ')+'txtname">'+d.name+'</p>'+
						 '<div class="w2">'+editCc+'</div>'+
					'</div>'
		}

		_html += '<div class="clr"></div></div>'
	}

	_html += '<div class="etxt sbmBox">'
	
	if($.isArray(sbmTxt)){
		_html += fnClsBtn(sbmTxt)
	}else{
		_html += '<span class="btn-info sbm">'+sbmTxt+'</span>';
	}

	_html += '<span class="btn-warning cancel">取消</span</div></div>'

	return _html

	function fnClsBtn(o){
		var r = ''

		for (var i = 0; i < o.length; i++) {
			r += '<span class="'+o[i].css+'">'+o[i].name+'</span>'
		}

		return r;
	}
}

/**生成表格编辑框（只适合数组数据）
* data =>{
		css:'表格样式',
		tname:'数据对象名称',
		type:'数据类型',
		td:[
			{	
				name:'数据中文名称'
				dataName:'数据名称',
				type:'类型',
				placeholder:'输入框提示'
			}
		]
	}
*/
createHtml.fnTableEidtAr = function (data, isAddReomveBtn) {
	var r = '<table class="dataCollection '+data.css+'">'
	var td = data.td
	var _key = 'data-arname'

	for (var i = 0; i < 2; i++) {
		var isFirstTr = i == 0
		if(isFirstTr)
			r += '<tr>'
		else
			r += '<tr class="dataList" data-ar="obj">'
		
		for (var j = 0; j < td.length; j++) {
			if(isFirstTr)
				r += '<th>'+td[j].name+'</th>'
			else
				r += '<td><input '+createHtml.editAttr(td[j], _key, (td[j].placeholder || ''), true)+' /></td>'
		}

		if(!isFirstTr && isAddReomveBtn) r += '<td style="width:20px;"><span class="icon-minus btn-remove"></span></td>'

		r += '</tr>'
	}

	return r += '</table>'
}

/**
*生成数据表格
*/
createHtml.fnCreateTbList = function (obj,callback){
	var th = obj.th,    //头标
		data = obj.data,  //数据
		dataId = obj.dataId || 'id',
		csle = obj.csle,   //控制器、操作
		tbCss = obj.tbCss,  //表格样式
		addDom = obj.addDom,  //表格添加层
		getData = obj.getData   //进行数据请求
	
	var pageDom,page,totalPages,getUrl,getSetting

	var isAddPage = true
	var tblistHtml = '<table cellspacing="0" cellpadding="0" class="'+tbCss+'"><tr>'

	for (var i = 0; i < th.length; i++) {
		if(!csle && i == th.length-1){
			tblistHtml += '<th class="last">'+th[i].txt+'</th>'	
		}else{
			tblistHtml += '<th>'+th[i].txt+'</th>'	
		}
	}
	if(csle){ tblistHtml += '<th class="last">操作</th>' }
	tblistHtml += '</tr>'

	tblistHtml += '</table>'	
	addDom.html(tblistHtml)

	if(getData){
		pageDom = getData.pageDom  //添加翻页层
		page = getData.page   //翻页参数
		totalPages = getData.totalPage  //获取翻页总数
		getUrl = getData.url  //数据请求地址
		getSetting = getData.setting  //数据请求参数

		fnGetData()
	}else if(data){
		addListCc(data)
	}

	function fnGetData(num,isPage){
		if(num) getSetting[page] = num
		$.get(getUrl, getSetting, function(data, status, xhr){
			if(xhr.status == 200){console.log(data)
				if(getData.dataPath){
					if(callback) callback(data[getData.dataPath])
					addListCc(data[getData.dataPath], isPage)
				}else{
					if(callback) callback(data)
					addListCc(data, isPage)
				}
				if(isAddPage){
					isAddPage = false
					pageOnSet(pageDom, data[totalPages], function(num){
						fnGetData(num);
					});				
				}
			}else{
				fnAlert('数据请求失败！', 'err')
			}
		})
	}

	function addListCc(data, isPage){
		if(!data.length) return;
		var _html = '';
		addDom.find('table tr:gt(0)').remove()

		$.each(data, function(i, item){
			item.dataPath = i
			_html += '<tr>'
			for (var j = 0; j < th.length; j++) {
				if(!csle && j == th.length-1){
					_html += '<td class="last"><p>'+(item[th[j].name] === null ? '' : item[th[j].name])+'</p></td>'	
				}else{
					_html += '<td><p>'+(item[th[j].name] === null ? '' : item[th[j].name])+'</p></td>'	
				}
			}
			if(csle){
				_html += '<td class="last borderBox cslBox">'+
							  '<a class="icon-dots-three-vertical cslShow" href="javascript:void(0)"></a>'+
							  '<div class="listhide cslList" style="*width:128px;">'
				for (var n = 0; n < csle.length; n++) {
					if(!csle[n].isAdd || item[csle[n].isAdd]) {
						_html += '<a class="'+csle[n].css+'" href="javascript:void(0)" data-id='+item[dataId]+
									  ' data-path='+item.dataPath+' onclick="'+csle[n].fnCk+'">'+
									  '<i class="'+csle[n].icon+'"></i>'+csle[n].txt+'</a>'
					}
				}
				_html += '</div></td>'
			}
			_html += '</tr>'
		})

		addDom.find('table').append(_html)

		if(csle) fnBtnShowOperation(addDom)
	}
}

/**
*create: select >> option
* d => data，t => text， v => value
*/
createHtml.fnCreateSelectOption = function (d,t,v){
	var h = '<option value=""></option>'
	$.each(d,function(i,m){
		h += '<option value="'+m[v||t]+'>'+m[t]+'"</option>'
	})
	return h
}