/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

// Google AJAX API 로드
google.load("search", "1");
//////

var AL_GOOGLE_SEARCHER = null;
function SET_GOOGLE_SEARCHER(isSet){
	if (isSet) {
		AL_GOOGLE_SEARCHER = jMap.addActionListener(ACTIONS.ACTION_NODE_SELECTED, function(){			
			var node = arguments[0];
			var jsc = $('#jino_searchcontrol');			
			if(!jsc[0]) jsc = $('<div id="jino_searchcontrol" style="position:absolute; border:1px solid; background-color: #F0F0F0;">Loading...</div>').appendTo('#jinomap');
			
			//jsc.hide();						
			var body_width = node.body.getBBox().width;			
			var left = node.body.getBBox().x + body_width + 20;
			var top = node.body.getBBox().y;
			jsc.css('left', left);
			jsc.css('top', top);			
			//jsc.fadeIn("slow");
			
			var searchControl = new google.search.SearchControl();
			searchControl.addSearcher(new google.search.WebSearch());
			//searchControl.addSearcher(new google.search.ImageSearch());
			searchControl.draw(jsc[0]);
			searchControl.execute(node.getText());
		});
	}
	else {
		$('#jino_searchcontrol').remove();
		jMap.removeActionListener(AL_GOOGLE_SEARCHER);
		AL_GOOGLE_SEARCHER = null;
	}
}
	
