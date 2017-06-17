route.navOnGist = [
	['home'],
	['userAttentions','quantity'],
	['attention']
]

route.cfg('home',{
	url:'view/home.html',
	script:'js/viewjs/home.js'
}).cfg('logStatistics', {
	url:'view/logStatistics.html',
	script:'js/viewjs/logStatistics.js'
}).cfg('runTimeStatistics', {
	url:'view/runTimeStatistics.html',
	script:'js/viewjs/runTimeStatistics.js'
}).cfg('realTimeLog', {
	url:'view/realTimeLog.html',
	script:'js/viewjs/realTimeLog.js'
}).cfg('logGather', {
	url:'view/logGather.html',
	script:'js/viewjs/logGather.js'
}).cfg('searchPS', {
	url:'view/searchPS.html',
	script:'js/viewjs/searchPS.js'
}).cfg('viewSearch', {
	url:'view/viewSearch.html',
	script:'js/viewjs/viewSearch.js'
}).cfg('userAttentions', {
	url:'view/userAttentions.html',
	script:'js/viewjs/userAttentions.js'
}).cfg('quantity', {
	url:'view/quantity.html',
	script:'js/viewjs/quantity.js'
}).cfg('quantitySystem', {
	url:'view/quantitySystem.html',
	script:'js/viewjs/quantitySystem.js'
}).cfg('quantityMenuEdit', {
	url:'view/quantityMenuEdit.html',
	script:'js/viewjs/quantityMenuEdit.js'
}).cfg('attention', {
	url:'view/attention.html',
	script:'js/viewjs/attention.js'
}).otherCfg('home').run();

ltNav()

$(window).resize(function(){
	ltNav()
})

function ltNav(){
	var nav = $('#header>.nav'),
		nav_abox = $('#header>.nav>.abox'),
		nav_w = nav.width(),
		nav_abox_w = nav_abox.width();
	var tw = 0,
			f = 0,
			q = nav_abox_w - nav_w,
			isInNav = false,
			lt;

	if(nav_abox_w > nav_w){

		nav.mouseleave(function(e){
			isInNav = false
		})

		nav.mousemove(function(e){
			var x = e.clientX
			if(!isInNav){
				tw = x
				isInNav = true
				return;
			}
			if(Math.abs(x - tw) > 1){
				if(lt) clearInterval(lt)
				var l = x - tw
				tw = x
				f += l
				if(f < 0) f = 0;
				if(f > q) f = q;
				nav_abox.css('left', -f+'px')
			}
		})
	}else{
		nav_abox.css('left', '0px')
		nav.off('mouseleave mousemove')
	}
}