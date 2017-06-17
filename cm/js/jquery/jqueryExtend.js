
/*---自定义 jQuery 插件--*/
(function($, wd){
	$.fn.extend({

		/*
		*基于祖元素滚动到元素的位置
		*sclDom => 滚动层， offsetTop => 额外距离顶部偏移量
		**/
		cmScrollTo: function(sclDom, offsetTop, time){
			if(this[0].offsetTop){
				sclDom.stop().animate({scrollTop:this[0].offsetTop-offsetTop+'px'},time||280)
			}
			// sclDom.scrollTop($(this)[0].offsetTop-offsetTop)
			return this;
		},

		/*
		*查找溢出隐藏的祖元素
		*/
		parentsOverflowHide: function () {
			var hasCssAt = ['hidden','auto'];
			var parentDom;

			parent(this);
			
			return parentDom;

			function parent(dom){
				// 'user strict';
				parentDom = dom.parent();

				if(hasCssAt.indexOf(parentDom.css('overflow')) == -1){
					parent(parentDom);
				}
			}
		}
	})
})(jQuery, window) 