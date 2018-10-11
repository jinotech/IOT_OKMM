
/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

OKMAdsense = (function () {
	var $wnd = null;
	var nodeSelectedListener = null;	// 노드 삭제 리스너
	
	function OKMAdsense(el){
		$wnd = $('#'+el);
		createPanel();
	}
	
	var createPanel = function() {
//		var $panel = $('<div id ="adsensepanel">' +
//				'<iframe src="'+jMap.cfg.contextPath+'/cse" frameborder="0" width="100%" height="200" margin-top="5px"> </iframe>' +
//					'</div>');
		
		
		var $panel = $('<div id ="adsensepanel">' +
				'<form action="'+jMap.cfg.contextPath+'/cse.html" id="cse-search-box11" target="googleiframe11">' +
		  '<div>' +
		   ' <input type="hidden" name="cx" value="partner-pub-9335493349192720:3052004774" />' +
		   ' <input type="hidden" name="cof" value="FORID:10" />' +
		   ' <input type="hidden" name="ie" value="UTF-8" />' +
		   ' <input type="text" name="q" size="55" />' +
		   ' <input type="submit" name="sa" value="&#xac80;&#xc0c9;" />' +
		  '</div>' +
		'</form>' +
		'<script type="text/javascript" src="http://www.google.co.kr/coop/cse/brand?form=cse-search-box&amp;lang=ko"></script>' +
		'<iframe name ="googleiframe11" id ="googleiframe11" frameborder=0 framespacing=0 marginheight=0 marginwidth=0 height="250">' +
					'</div>');
		
		
		
		$wnd.append($panel);
		
		// 디폴트로 자동검색을 체크하기 때문에 리스너 추가
		triggerListener();
		$('#googleconnection').click(function() {
			var checked = $(this).attr('checked');
			if(checked) {
				triggerListener();
			} else {
				destroyListener();
			}
		});
	}
	
	var triggerListener = function () {
		nodeSelectedListener = jMap.addActionListener(ACTIONS.ACTION_NODE_SELECTED, function(){
			var node = arguments[0];
			var frm = document.getElementById("cse-search-box");
			frm.q.value = node.getText();
			frm.submit();
		});
	}
	
	var destroyListener = function () {
		jMap.removeActionListener(nodeSelectedListener);	// 노드 선택 리스너 해제
		nodeSelectedListener = null;		
	}
	
	return OKMAdsense;
})();