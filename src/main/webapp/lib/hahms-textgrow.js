
/**
 * jQuery Plugin textGrow (leftlogic.com/info/articles/auto_grow_text)을 고침
 *
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

jQuery.fn.textGrow = function(options) {
	var beforeLeftWidth = 0;
	var nodeWidth = 0;
	var isleft = false;
	if (!options.pad) options.pad = 25;	
	return this.each(function(i){
		var e = jQuery(this);
		// create copy for each element
		var o = { pad: options.pad, min_limit: options.min_limit, max_limit: options.max_limit };		 
		if (e.prop('type') == 'textarea' || e.prop('type') == 'text') {
			if (!o.min_limit) o.min_limit = parseInt(e.css('min-width'));
			if (!o.max_limit) o.max_limit = parseInt(e.css('max-width'));
			
			// Safari reads a non-existant value as -1 making our calcs a mess
			if (o.min_limit < 0 || isNaN(o.min_limit)) o.min_limit = 0;
			if (o.max_limit < 0 || isNaN(o.max_limit)) o.max_limit = 0;

			var html = '<' + 'div style="position:absolute; top:0; visibility:hidden; left:0; padding:0 ' + o.pad + 'px 0 0!important; margin:0!important" id="_grow' + i + '"></' + 'div>';
			var c = jQuery('body').append(html);
			// adjust the style of the container to match the font of this element
			var ff = e.css('font-family');
			var fs = e.css('font-size');

			jQuery('div#_grow' + i).css({ 'font-size': fs, 'font-family': ff });

			resize = function(){
				var text = e.val()
				while (text.indexOf("\n") > -1)
					text = text.replace("\n","<br>");				
				var dl = jQuery('div#_grow' + i).html(text.replace(/ /g,'&nbsp;')).get(0).offsetWidth;
				if (o.max_limit && (dl + o.pad) > o.max_limit) {
					e.css('width', o.max_limit + 'px');
					isleft && e.css('left', beforeLeftWidth - (o.max_limit - nodeWidth));
				} else if ((dl + o.pad) <= o.min_limit) {
					e.css('width', o.min_limit + 'px');
					isleft && e.css('left', beforeLeftWidth - (o.min_limit - nodeWidth));
				} else { // resize					
					e.css('width', dl + 'px');
					isleft && e.css('left', beforeLeftWidth - (dl - nodeWidth));
				}
			}

			// auto resize based on current content
			resize();
			e.keydown(resize);
			
//			e.bind('focus', function () {
			e.focus(function () {
				beforeLeftWidth = parseInt(e.css('left'))+6;
				nodeWidth = parseInt(e.css('width'));
				//isleft = e.css('isleft')?true:false;	// left이면 true, right이면 빈문자열
				isleft = e[0].isleft?true:false;	// left이면 true, right이면 빈문자열
				
				
				var ff = e.css('font-family');
				var fs = e.css('font-size');
	
				jQuery('div#_grow' + i).css({ 'font-size': fs, 'font-family': ff });
				
				resize();
	        })
		}
	});
};


