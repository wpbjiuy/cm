/**
*正则表达式 var result = RE.eg.object.test(str);
**/
var ER = {}

ER.isTrues = ['abc', 'number', 'abcNumber', 'notSubtract']
// ER.isFalse = ['email', 'mobile', 'mobile1', 'phoneAreaNum', 'phone']

ER.eg = {}
ER.eg.abc = new RegExp("[^a-z-]","g");  //找出除小写字母或‘-’的字符
ER.eg.number = /[^0-9]/g;
ER.eg.abcNumber = /[^a-z0-9.-/]/g;
ER.eg.BabcTNumber = /^[a-zA-Z][a-zA-Z0-9]*$/;  //开头为字母的字母数字组合
ER.eg.BabcTNumber_ = /^[a-zA-Z][a-zA-Z0-9_]*$/; //开头为字母的字母数字"_"组合
ER.eg.notSubtract = /-/g;

ER.eg.email = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,3}$/;  //邮箱
ER.eg.mobile=/^((13[0-9]{1})|159|153)+\d{8}$/;  //对于手机号码的验证 1
ER.eg.mobile1=/^(13+\d{9})|(159+\d{8})|(153+\d{8})$/;  //对于手机号码的验证 2

ER.eg.phoneAreaNum = /^\d{3,4}$/;  //对于区号的验证
ER.eg.phone =/^\d{7,8}$/;  //对于电话号码的验证

ER.eg.ip = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
ER.eg.ipe = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]|(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])+[+-]|(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])+[~](\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))$/;

ER.fnVerify = function (dom){
	var result = {isOk:true, requireds:[], verifys:[]};	

	dom.find('[data-required]').each(function(){
		var ths = $(this);
		var required = ths.attr('data-required');

		if(!ths.attr('data-fix')){
			if(!ths.val()){
				ER.fnVerifyErr(ths);
				result.requireds.push(ths);
				if(result.isOk){
					result.isOk = false;
				}
			}
		}
		
	})

	dom.find('[data-verify]').each(function(){
		var ths = $(this);
		var thsVal = ths.val();
		var verify = ths.attr('data-verify');
		
		if(!ths.attr('data-fix')){
			if(thsVal != ''){
				if(ER.eg[verify]){
					var testVerify = !ER.eg[verify].test(thsVal)

					if(ER.isTrues.indexOf(verify) != -1){
						testVerify = !testVerify
					}
					
					if(testVerify){
						ER.fnVerifyErr(ths);
						result.verifys.push(ths);
						if(result.isOk){
							result.isOk = false;
						}
					}
				}else{
					console.log(ER);
				}
			}
		}
	})
	return result;
}

//增加错误提示样式
ER.fnVerifyErr = function (ths){
	ths.addClass('err');
	ths.bind({
		keyup:function(){
			if(ths.hasClass('err')){
				ths.removeClass('err');
			}
		},
		change:function(){
			if(ths.hasClass('err')){
				ths.removeClass('err');
			}
		}
	})
}


/**
*附加项
*/ 
/*--判断ip的合法性--*/
ER.isIP = function (value){
    var reg = value.match(ER.eg.ip);
    if(reg==null)
    {
	    return false;
    }else{
    	return true;
    }
}