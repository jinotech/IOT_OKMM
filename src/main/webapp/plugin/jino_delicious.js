/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */


var Delicious2Service = {	
	getFeed: function () {
		var txt = '<div class="dialog_title">Import Delicious Feed</div>' +
				'<div class="dialog_content">' +
				'<br />Delicious ID : <br />'+
				'<input type="text" id="jino_input_delicious_id"'+ 
				'name="jino_input_delicious_id" value="" /> &nbsp&nbsp&nbsp&nbsp '+
				'limit : <input type="text" id="jino_input_delicious_limit"'+ 
				'name="jino_input_delicious_limit" size ="5" value="25" />'+
				'</div>';
		function callbackform2(v,m,f){					
			if (v) {
				JinoUtil.waitingDialog("Import Delicious Feed");
				var owner = f.jino_input_delicious_id;
				var limit = f.jino_input_delicious_limit;
				
				var url = 'http://feeds.delicious.com/v2/json/'+owner;
				var verifyUrl = 'http://feeds.delicious.com/v2/json/networkmembers/'+owner;
				
		        // Get Number of Delicious Bookmarks
		        //$.getJSON(url+'&callback=?', Delicious2Service.getFeedCallback);
				
				$.ajax({
					type: 'post',
					dataType: 'jsonp',
					async: false,
					url: verifyUrl,
					success: function(data){
						if(data[0]){
							if(data[0].result.code == 1000) {
								alert("존재하지 않는 아이디 입니다.");
								JinoUtil.waitingDialogClose();
								return false;
							}
						}
					},
					error: function(data, status, err) {
						alert("Delicious Error");
					}
				});
								
				
				
				$.ajax({
					type: 'post',
					dataType: 'jsonp',
					async: false,
					url: url,
					data: {	'count': limit },
					success: Delicious2Service.getFeedCallback,
					error: function(data, status, err) {
						alert("Delicious Error");
					}
				});
		        
			}
			//jMap.paper.work.focus();						
		}	
		var re = $.prompt(txt,{
		    callback: callbackform2,
			  persistent : false,
			  focusTarget : 'jino_input_delicious_id',
			  top : '30%',
			  prefix:'okm',
				buttons: {
					Ok: true,
					Cancel: false
				}
		});
		
	},
	
	getFeedCallback: function(data) {
		var rootNode = jMap.getSelected();
		//rootNode.setTextExecute(data[0].a);
		
		var tags = new Array();	
		for (var k in data) {
			var ts = data[k].t;
			if(!ts) continue;		
			for(var i=0; i < ts.length; i++) {
				if(!tags[ts[i]]) tags[ts[i]] = 0;
				tags[ts[i]]++;			
			}		
		}	
		
		for (var t in tags) if(tags[t] > 1){
			var param = {parent: rootNode,
					text: t};
			var newNode = jMap.createNodeWithCtrl(param);
		}
		
		for (var k in data) {
			var ts = data[k].t;
			if(!ts) continue;
			Delicious2Service.createTagsHierarchy(rootNode, ts, data[k]);		
		}
		
		// 필요없는 노드 삭제
		var children = rootNode.getChildren();
		for(var i=children.length-1; i--; ){
			if(children[i].getChildren().isEmpty()) children[i].remove();
		}
		
		jMap.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		jMap.layoutManager.layout(true);
		
		JinoUtil.waitingDialogClose();
	},
	
	createTagsHierarchy: function (node, tags, data) {
		if(tags.length == 0){
			var param = {parent: node,
					text: data.d};
			var newNode = jMap.createNodeWithCtrl(param);
			data.u && newNode.setHyperlink(data.u);
			return;		
		}
		
		for(var i=0; i< tags.length; i++){
			var fNode = jMap.findNode(tags[i], true, true, node);		
			if(!fNode.isEmpty()){
				tags.splice(i,1);
				this.createTagsHierarchy(fNode[0].node, tags, data);
				return;
			}
		}
		
		var param = {parent: node,
				text: tags[0]};
		var newNode = jMap.createNodeWithCtrl(param);
		tags.splice(0,1);
		this.createTagsHierarchy(newNode, tags, data);
	}
};



