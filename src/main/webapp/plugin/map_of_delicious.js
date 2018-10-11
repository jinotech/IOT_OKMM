
/**
 *  jQuery 필요.
 *  
 *  
 * @author Hahm Myung Sun (hms1475@gmail.com)
 * @created 2011-06-14
 * 
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com)
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

var DeliciousService = {
	init: function (map) {
		this.map = map;
		if(this.login(function(){
			this.loadMap();
			this.setConfig();
		})) {
			this.loadMap();
			this.setConfig();
		}
	},
	cfg: {
		
	},	
	login: function(_callback) {
		var ret = false;
		if(!this.session()) {
			var txt = '<div class="dialog_title">Delicious Login</div>' +
					'<div class="dialog_content">' +
					'<br />ID : <br />'+
					'<input type="text" id="input_delicious_id"'+ 
					'name="input_delicious_id" value="" />'+
					'<br />PW : <br />'+
					'<input type="password" id="input_delicious_pw"'+ 
					'name="input_delicious_pw" value="" />'+
					'</div>';

			var that = this;
			function callbackform_delicious(v,m,f){					
				if (v) {
					JinoUtil.waitingDialog("Delicious Login...");
					
					var id = f.input_delicious_id;						
					var pw = f.input_delicious_pw;
					
					$.ajax({
						type: "POST",						
						url: "/okmindmap/mashup/delicious.do",
						data: {"action": "login",
									"id": id,
									"pw": pw},
						success: function(data, textStatus, jqXHR){
							if(jqXHR.responseText == "1") {	// 로긴시
								JinoUtil.waitingDialogClose();
								_callback.call(that);
							} else {					// 로긴 실패시
								JinoUtil.waitingDialogClose();
								alert("Your username and password don't match.");
								that.login(_callback);		// 다시 아이디 비번을 묻는다.
							}
						},
						error:function (xhr, ajaxOptions, thrownError){
							alert("error5 : " + xhr.status);
							alert("error5 : " + thrownError);
						}
					});
				}
			}
			
			var re = $.prompt(txt,{
			    callback: callbackform_delicious,
				  persistent : false,
				  focusTarget : 'input_delicious_id',
				  top : '30%',
				  prefix:'okm',
				  buttons: {
				  	Ok: true,
				  	Cancel: false
				  }
			});
		} else { ret = true;}
		
		return ret;
	},
	logout: function() {
		$.ajax({
			type: "POST",
			async: false,
			url: "/okmindmap/mashup/delicious.do",
			data: {"action": "logout"},
			success: function(data, textStatus, jqXHR){
				
			},
			error:function (xhr, ajaxOptions, thrownError){
				alert("error6 : " + xhr.status);
				alert("error6 : " + thrownError);
			}
		});
	},
	session: function() {
		var ret = false;
		$.ajax({
			type: "POST",
			async: false,
			url: "/okmindmap/mashup/delicious.do",
			data: {"action": "session"},
			success: function(data, textStatus, jqXHR){				
				if(jqXHR.responseText == "1") ret = true;
				else ret = false;
			},
			error:function (xhr, ajaxOptions, thrownError){
				alert("error7 : " + xhr.status);
				alert("error7 : " + thrownError);
			}
		});
		return ret;
	},
	loadMap: function() {
		if(this.map == null) return;
		
		JinoUtil.waitingDialog("Loading Delicious");
		
		var that = this;
		$.ajax({
			type: "POST",
			url: "/okmindmap/mashup/delicious.do",
			data: {"action": "getAllPosts"},
			success: function(data, textStatus, jqXHR){
				
				console.log(jqXHR.responseText);
				//that.map.newMap("Delicious");
				
				// 태그 노드의 중복을 막는다.
				var checkExisting = function(parentNode, text) {
					var children = parentNode.getChildren()
					if(children.length > 0){
						for(var i=0; i<children.length; i++) {
							if(text == children[i].getText()) {return children[i];}
						}
					}					
					return null;
				};
				
				
				var delicious = JSON.parse(jqXHR.responseText);
				for(var i=0; i < delicious.length; i++) {
					var d = delicious[i];
					
					// tag 기반으로 노드를 만든다.
					var tags = d.tag.split(" ");					
					var tailNode = that.map.getRootNode();					
					for(var j=0; j < tags.length; j++) {
						var tag = tags[j];
						var checkNode = checkExisting(tailNode, tag);
						if(checkNode){
							tailNode = checkNode;
						} else {
							var param = {parent: tailNode,
									text: tag};
							tailNode = that.map.createNodeWithCtrl(param);
						}
					}
					
					var param = {parent: tailNode,
							text: d.description};
					var postNode = that.map.createNodeWithCtrlExecute(param);
					postNode.setHyperlinkExecute(d.href);
					
				}
				
				that.map.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
				
			},
			error:function (xhr, ajaxOptions, thrownError){
				alert("error8 : " + xhr.status);
				alert("error8 : " + thrownError);
			}
		});
		
		
		//if(this.rootNode) RAPHAEL.clear();
		
//		// 노드 레이아웃	
//		this.map.layoutManager.updateTreeHeightsAndRelativeYOfWholeMap();
		
		JinoUtil.waitingDialogClose();
	},
	setConfig: function() {
		this.listeners = [];
		
		
		var pathToTags = function(node) {
			var ts = '';
			var currentNode = node;			
			while (currentNode = currentNode.parent) {
				if(currentNode.isRootNode()) break;
				ts = currentNode.getText() + ' ' + ts;
			}
			return ts;
		};
		
		this.listeners.push(jMap.addActionListener(ACTIONS.ACTION_NODE_HYPER, function(){
			var node = arguments[0];
			var url = (node.hyperlink)? node.hyperlink.attr().href : null;
			if(url) {
				var url = url;
				var description = node.getText();
				var extended = '';
				var tags = pathToTags(node);
								
				var that = this;
				$.ajax({
					type: "POST",
					url: "/okmindmap/mashup/delicious.do",
					data: {"action": "addPost",
								"url": url,
								"description": description,
								"extended": extended,
								"tags": tags},
					success: function(data, textStatus, jqXHR){
						
						console.log(result);
						
					},
					error:function (xhr, ajaxOptions, thrownError){
						alert("error9 : " + xhr.status);
						alert("error9 : " + thrownError);
					}
				});
				
				
			}
		}));
	}

};

