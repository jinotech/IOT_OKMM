/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

function IMPORT_TWITTER_TIMELINE_TRIGGER(){
	_gaq.push(['_trackEvent', 'SNS', 'Import', 'Twiter']);
	
	var txt = '<div class="dialog_title">Import Twitter Timeline</div>' +
			'<div class="dialog_content">' +	
			'<br />Twitter ID : <br />'+
			'<input type="text" id="jino_input_twitter_id"'+ 
			'name="jino_input_twitter_id" value="" /> &nbsp&nbsp&nbsp&nbsp '+
			'limit : <input type="text" id="jino_input_twitter_limit"'+ 
			'name="jino_input_twitter_limit" size ="5" value="25" />' +
			'</div>';
	
	function callbackform_twitter(v,m,f){					
		if (v) {
			JinoUtil.waitingDialog("Import Twitter Timeline");
			
			var owner = f.jino_input_twitter_id;						
			var limit = f.jino_input_twitter_limit;
			TWITTER_MINDMAP_FROM_ID(owner, limit);
		}
		//jMap.paper.work.focus();						
	}	
	var re = $.prompt(txt,{
	      callback: callbackform_twitter,
		  persistent : false,
		  focusTarget : 'jino_input_twitter_id',
		  top : '30%',
		  prefix:'okm',
		  buttons: {
		  	Ok: true,
		  	Cancel: false
		  }
	});
}


/////////////////////////////////////////////////////////

function TWITTER_MINDMAP_FROM_ID(t_id, limit){
	var node = jMap.getSelected();	
	//if(!node.getParent().isRootNode()) return;
	YUI().use('gallery-yql', function(Y) {
	    //Using events
	    var q = new Y.yql('select * from twitter.user.timeline where (id = "' + t_id + '")');
	    q.on('query', function(response) {
			if (response.results) {
				var status = response.results.statuses.status;
				for(var i=0; i < status.length; i++){
					if(i == limit) break;
					var param = {parent: node,
							text: status[i].text};
					var newNode = jMap.createNodeWithCtrl(param);
					//newNode.setHyperlinkExecute(response.results.entry[i].link[0].href);
				}
				
				if(node.folded) node.setFoldingExecute(false);
				jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
				jMap.layoutManager.layout(true);
				
				(typeof DWR_sendForceRefresh != "undefined")&& DWR_sendForceRefresh(jMap.cfg.userId);
				
				JinoUtil.waitingDialogClose();
			} else {
				JinoUtil.waitingDialogClose();
				alert("해당 아이디의 가져올 목록이 없습니다.");
			}
			
			
	    });
	    q.on('error', function(response) {
	    });
		
	    //Or the callback approach
//		    new Y.yql('select * from twitter.user.timeline where (id = "hms1475")', function(r) {
//		        //Do something here.
//		        r.query; //The result
//		        r.error; //The error message
//		    });

	});
}

