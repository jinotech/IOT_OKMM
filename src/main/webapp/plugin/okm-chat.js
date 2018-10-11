
/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

OKMChat = (function () {
	var $wnd = null;
	var userName = '';
	
	function OKMChat(el, username){
		$wnd = $('#'+el);
		userName = username;
		createPanel();
				
		$('#rightpanel').bind('resize', function() {
			var topheight = parseInt($(this).children()[0].style.height);
			if(!topheight) topheight = 0;
			
			$(this).find('#chatlog').height($(this).height() - topheight - 100);
		});
		
		// chatting 창 처음에 보여줄지 여부
//		if(document.body.clientWidth<1024){
//			document.getElementById("openpanel").style.display = "";
//			document.getElementById("rightpanel").style.display = "none";
//		}else{
//			document.getElementById("openpanel").style.display = "none";
//			document.getElementById("rightpanel").style.display = "";
//		}
		
		OKMChat.getMessages(1);
	}
	
	var createPanel = function() {
		var $panel = $('<div id ="titlepanel">' +
									'<span id="people" width="49%">'+i18n.msgStore["chatting"]+'</span>	'+'<input type="hidden" id="username" value="'+userName+'"/>'+
								'</div>	' +
								'<div id ="chatpanel">' +
									'<div id="chatlog"></div>' +
									'<div class="input_text_bar">' +					
										'<input id="text" onkeypress="dwr.util.onReturn(event, OKMChat.sendMessage)"/>' +
										'<input type="button" class="send_btn"  value="'+i18n.msgStore["send"]+'" onclick="OKMChat.sendMessage()"/>' +
									'</div>' +
								'</div>');
		
		var $panelVer2 = $('<input type="hidden" id="username" value="'+userName+'"/>' + 
							'<div class="chat-cont" id="chatlog"></div>' +
							'<div class="cht-footer"><textarea style="resize: none;" id="text" onkeypress="dwr.util.onReturn(event, OKMChat.sendMessage)"/></textarea><input type="button" value="보내기" class="chat-btn" onclick="OKMChat.sendMessage()" />');
		
		$wnd.append($panelVer2);
	}

	OKMChat.logOut = function(){
		JavascriptChat.logout( {
		  callback:function(data) {},
		  async:false
		});
	}

	OKMChat.updateUserInfo = function(username, userList){
		var names;
		for (var data in userList) {
			
		}
	}
	
	
	
	OKMChat.sendMessage = function() {
		if(dwr.util.getValue("text")){
			var username = dwr.util.getValue("username");
			var text = dwr.util.getValue("text");
  			dwr.util.setValue("text", "");

  			JavascriptChat.sendMessage(username, text,mapId, jMap.cfg.userId );
  			//JavascriptChat.sendMessage(username, text );
  			_gaq.push(['_trackEvent', "Chatting", mapId]);
		}
	}
	var lastIdx = 0;
	var chatAmount = 10;
	
	
	OKMChat.getMessages = function(isFirst) {
		$.ajax({
			type: 'post'
	        , async: true
	        , url: jMap.cfg.contextPath+'/chat/getMessages.do'
	        , dataType: 'json'
	        , data: {
				"roomnumber": mapId,
				"lastIdx":lastIdx,
				"amount":chatAmount
				}
	        , beforeSend: function() {
	        
	          }
	        , success: function(data2) {
	        	var oldText = "";
	        	$.each(data2.message, function (){ //me
	        		if( (jMap.cfg.userId>2 && jMap.cfg.userId==this.userid) || dwr.util.getValue("username")==this.username){
	        			//2018.06.28 이전버전
	        			//oldText = '<div class="user_name" style="text-align:right"><span class="user_messages">' + (this.message) + '</span></div>'+oldText;
	        			
	        			oldText = '<div class="me"><span class="cht-name">'+this.username+'</span><p class="cht-txt">' + (this.message) + '</p></div>'+oldText;
	        		}else{ //other
	        			//2018.06.28 이전버전
	        			//oldText = '<div class="user_name_others" style="text-align:left"><strong>'+(this.username)+'</strong><span class="user_messages">' + (this.message) + '</span></div>' +oldText;
	        			
	        			oldText = '<div class="other"><span class="cht-name">'+(this.username)+'</span><p class="cht-txt">' + (this.message) + '</p></div>'+oldText;
	        		}
	        		lastIdx = this.id;
	        		
	        	});
	        	
	        	
	        	var chatlog =  $("#chatlog").html();
	        	
	        	$("#chatlog").html(oldText+chatlog);
	        	if(isFirst==1)
	        		$("#chatlog").scrollTop($("#chatlog")[0].scrollHeight);
	        	
	        	

	        	
	        	
	            
	          }
	        , error: function(data2, status, err) {
	        	console.log("error forward : "+data2+" "+status+" "+err);
	            alert('서버와의 통신이 실패했습니다.');
	          }
	        , complete: function() {
	        
	        }
		});
	}
	
	OKMChat.onGetMessages = function() {
		if (http.readyState == 4) {
			if (http.status == 200) {
				var jsonData = JSON.parse(http.responseText);
				if (jsonData.status == "ok") {
					console.log(jsonData.message);
				} else {
					alert("error3 : " + jsonData.message);
				}
			} else {
			}
		}
	}
	
	OKMChat.receiveMessages = function(username, messages, isMe, timecreated) {
		var chatlog =  $("#chatlog").html();
  		
		if(isMe == 1){
			//chatlog = chatlog+'<div class="user_name" style="text-align:right"><span class="user_messages">' + dwr.util.escapeHtml(messages) + '</span></div>';
			chatlog = chatlog+'<div class="me"><span class="cht-name">'+username+'</span><p class="cht-txt">' + dwr.util.escapeHtml(messages) + '</p></div>';
		} else {
			//chatlog = chatlog+'<div class="user_name_others" style="text-align:left"><strong>'+dwr.util.escapeHtml(username)+'</strong><span class="user_messages">' + dwr.util.escapeHtml(messages) + '</span></div>';		
			chatlog = chatlog+'<div class="other"><span class="cht-name">'+dwr.util.escapeHtml(username)+'</span><p class="cht-txt">' + dwr.util.escapeHtml(messages) + '</p></div>';
		}
  		
		$("#chatlog").html(chatlog);
		
		var elem = $('#chatlog');
		$("#chatlog").scrollTop($("#chatlog")[0].scrollHeight);
		/*
		if ((elem[0].scrollHeight - elem.scrollTop() - 50) < elem.outerHeight()) {
			$("#chatlog").scrollTop($("#chatlog")[0].scrollHeight);
		}*/
		var rp = $('#rightpanel-wrap');
		var chatbutton = $('#chat-button');
		
		if(parseInt(rp.css('right')) != 0) {
			chatbutton.css('background-color', '#ff8800');
    		/*for(blinkI = 0; blinkI <5; blinkI++){
    			
    			if(blinkI%2==0){
    				rp.css('background-color', '#ff8800');
    				alert("0");
    			}else{
    				alert("1");
    				//rp.css('background-color', '#4B89A9');
    			}
    			setTimeout(500);
    			
    		}*/
    	}
	}
	
		
	return OKMChat;
})();




