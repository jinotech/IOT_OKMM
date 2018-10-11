<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="UTF-8"%>

<%@page import="com.okmindmap.model.User"%>
<script type="text/javascript">

	var onMenuItemClick = function () {
		alert("Callback for MenuItem: " + this.cfg.getProperty("text"));
	};
	
	var okmLogin = function() {
		$("#dialog iframe").remove();
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/user/login.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		 
		$("#dialog").dialog({
			autoOpen:false,
		    closeOnEscape: true,	//esc키로 창을 닫는다.
		    modal:true,		//modal 창으로 설정
		    resizable:false,	//사이즈 변경
		    close: function( event, ui ) {
		      	$("#dialog iframe").remove();
		    	$("#dialog").dialog("destroy"); 
		    },
		});
		
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog("option","dialogClass","okmLogin");
		$("#dialog").dialog( "option", "title", "<spring:message code='message.login' />" );
		$("#dialog").dialog("open");
	}
	var joinmember = function() {
		$("#dialog iframe").remove();
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/user/signup.do" frameborder="0" allowtransparency="true" scrolling="yes"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog("option","dialogClass","joinmember");
		  $("#dialog").dialog( "option", "title", "<spring:message code='message.member.new'/>" );
		  $("#dialog").dialog("open");
	}
	var editProfile = function() {
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/user/update.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog("option","dialogClass","editProfile");
		  $("#dialog").dialog( "option", "title", "<spring:message code='user.edit_information' />" );
		  $("#dialog").dialog("open");
		
	}
	var okmLogout = function() {
		$.cookie('currentTab',0);
		document.location.href = "${pageContext.request.contextPath}/user/logout.do?return_url=/";
// 		FacebookService && FacebookService.facebookLogout();
	}
	
	var newMap = function () {
// 		<c:if test="${data.guest_map_allow == 0}">
// 			alert("Not allow");
// 			return;
// 		</c:if>
		
		_gaq.push(['_trackEvent', "Map", "New"]);
		
		if(ISMOBILE){
			$("#dialog").append('<iframe src="${pageContext.request.contextPath}/mindmap/new.do" frameborder="0" scrolling="no"></iframe>');
		} else {
			<%
			Object obj = request.getSession().getAttribute("user");
			
			if(obj==null||((User)obj).getUsername().equalsIgnoreCase("guest")){
			%>
			$("#dialog").append('<iframe class="guest" src="${pageContext.request.contextPath}/mindmap/new.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
			<%} else {%>
			$("#dialog").append('<iframe class="loginUser" src="${pageContext.request.contextPath}/mindmap/new.do" frameborder="0" allowtransparency="true" width="320"  height="130" scrolling="no"></iframe>');
			
			<%}%>
			
		}
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		      	},
			  });
		  $("#dialog").dialog("option","dialogClass","editProfile");
		  $("#dialog").dialog( "option", "title", "<spring:message code='message.newmap'/>" );
		  $("#dialog").dialog("open");
		
		//document.location.href = "${pageContext.request.contextPath}/mindmap/new.do";
	};
	
	var createMoodle = function () {
		_gaq.push(['_trackEvent', "Map", "New"]);
		
		if(ISMOBILE){
			$("#dialog").append('<iframe src="${pageContext.request.contextPath}/mindmap/new.do?type=moodle" frameborder="0" scrolling="yes"></iframe>');
		} else {
			<%
			Object usr = request.getSession().getAttribute("user");
			
			if(usr==null||((User)usr).getUsername().equalsIgnoreCase("guest")){
			%>
			$("#dialog").append('<iframe class="guest" src="${pageContext.request.contextPath}/mindmap/new.do?type=moodle" frameborder="0" allowtransparency="true" scrolling="yes"></iframe>');
			<%} else {%>
			$("#dialog").append('<iframe class="loginUser" src="${pageContext.request.contextPath}/mindmap/new.do?type=moodle" frameborder="0" allowtransparency="true" width="320"  height="430" scrolling="yes"></iframe>');
			
			<%}%>
			
		}
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog("option","dialogClass","openMap");
		  $("#dialog").dialog( "option", "title", "Add a new course" );
		  $("#dialog").dialog("open");
		
		//document.location.href = "${pageContext.request.contextPath}/mindmap/new.do";
	};
	
	var openMap = function () {
		_gaq.push(['_trackEvent', "Map", "Open"]);
		
		if(ISMOBILE){
			$("#dialog").append('<iframe src="${pageContext.request.contextPath}/mindmap/list.do" frameborder="0" scrolling="yes"></iframe>');
		} else {
				  
		    $("#dialog").append('<iframe src="${pageContext.request.contextPath}/mindmap/list.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');	
		}
				  var iframeWidth = $("#dialog iframe").width();
							  				 
				  $("#dialog").dialog({
					  autoOpen:false,
				      closeOnEscape: true,	//esc키로 창을 닫는다.
				      modal:true,		//modal 창으로 설정
				      resizable:false,	//사이즈 변경
				      close: function( event, ui ) {
				    	  	$("#dialog iframe").remove();
				    		$("#dialog").dialog("destroy"); 
				      	},
					  });
				  $("#dialog").dialog("option", "width", "none" );
				  $("#dialog").dialog("option","dialogClass","openMap");
				  $("#dialog").dialog( "option", "title", "<spring:message code='menu.mindmap_open'/>" );
				  $("#dialog").dialog("open");
		
		//document.location.href = "${pageContext.request.contextPath}/mindmap/list.do";
	};
	
	var importMap = function () {
		_gaq.push(['_trackEvent', 'Map', "Import", "Mindmap"]);
		
		$("#dialog_c").append('<iframe src="${pageContext.request.contextPath}/mindmap/importMap.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		var iframeWidth = $("#dialog_c iframe").width();
		 
		  $("#dialog_c").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog_c iframe").remove();
		    		$("#dialog_c").dialog("destroy"); 
		      	},
			  });
		  $("#dialog_c").dialog("option", "width", "none" );
		  $("#dialog_c").dialog("option","dialogClass","importMap");
		  $("#dialog_c").dialog( "option", "title", "<spring:message code='message.import.freemind.upload'/>" );
		  $("#dialog_c").dialog("open");
		
		//document.location.href = "${pageContext.request.contextPath}/mindmap/importMap.do";
	};
	
	var importBookmark = function () {
		_gaq.push(['_trackEvent', 'Map', "Import", "Bookmark"]);
		
		$("#dialog_c").append('<iframe src="${pageContext.request.contextPath}/mindmap/importBookmark.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		 
		$("#dialog_c").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog_c iframe").remove();
		    		$("#dialog_c").dialog("destroy"); 
		      	},
			  });
		$("#dialog_c").dialog("option", "width", "none" );
		$("#dialog_c").dialog("option","dialogClass","importBookmark");
		$("#dialog_c").dialog( "option", "title", "<spring:message code='message.import.bookmark.upload'/>" );
		$("#dialog_c").dialog("open");
		
	};
	
	var groupManage = function () {
		_gaq.push(['_trackEvent', "Share", "Manage", "Group"]);
		
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/group/list.do" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog("option","dialogClass","groupManage");
		  $("#dialog").dialog( "option", "title", "<spring:message code='menu.setting.group'/>" );
		  $("#dialog").dialog("open");
		//document.location.href = "${pageContext.request.contextPath}/mindmap/new.do";
	}
	
	var shareManage = function () {
		_gaq.push(['_trackEvent', "Share", "Manage", "Map"]);
		
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/share/list.do?map_id=${data.mapId}" frameborder="0" allowtransparency="true" scrolling="no"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog("option","dialogClass","shareManage");
		  $("#dialog").dialog( "option", "title", "<spring:message code='menu.setting.share'/>" );
		  $("#dialog").dialog("open");
		  
		//document.location.href = "${pageContext.request.contextPath}/mindmap/new.do";
	}
	
	var courseEnrolment = function(){
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/moodle/courseEnrolment.do?mapid=${data.map.id}&tabtype=okmmusers" frameborder="0" allowtransparency="true" scrolling="yes"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		    		jMap.work.focus();
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog( "option", "dialogClass", "imageProviderAction" );
		  $("#dialog").dialog( "option", "title", "Course enrolment" );
		  $("#dialog").dialog("open");
	};
	
	var notice = function () {
		
		 window.open("<spring:message code='menu.cs.notice.url'/>", 'new', 'left=50, top=50, width=900, height=400, scrollbars=yes');
	};
	
	
	
	var qna = function () {
		window.open("<spring:message code='menu.cs.qna.url'/>", 'new', 'left=50, top=50, width=1050, height=600, scrollbars=yes');
	};
	
	var requestFunction = function () {
		current_lang = $("select.lang option:selected").val();
		$("#dialog").append('<iframe src="${pageContext.request.contextPath}/board/list.do?boardType=3&lang='+current_lang+'" frameborder="0" allowtransparency="true" width="480"  height="370" scrolling="yes"></iframe>');
		 
		  $("#dialog").dialog({
			  autoOpen:false,
		      closeOnEscape: true,	//esc키로 창을 닫는다.
		      modal:true,		//modal 창으로 설정
		      resizable:false,	//사이즈 변경
		      close: function( event, ui ) {
		    	  	$("#dialog iframe").remove();
		    		$("#dialog").dialog("destroy"); 
		      	},
			  });
		  $("#dialog").dialog("option", "width", "none" );
		  $("#dialog").dialog("option","dialogClass","requestFunction");
		  $("#dialog").dialog( "option", "title", "<spring:message code='menu.cs.qna'/>" );
		  $("#dialog").dialog("open");
	};
	
	var shorturlFunction = function () {
		$("#dialog").append('<iframe src="../jsp/short_url.jsp?short_url=${data.short_url}" frameborder="0" allowtransparency="true" width="480"  height="380" scrolling="no"></iframe>');

		//KHANG
		var types = 'Dynamic Box Aero Linear Mindmap-Basic Mindmap-Zoom'.split(' ');
		var text = '<div class="dialog_content_nod"><form>' +
		'<select id="type_presentation"><option value="Box">--Presentation Type--</option>';
		for (var t = 0; t < types.length; t++) {
			var type = types[t];			
  			text += ('<option value="' + type + '">' + type + '</option>');
		}
		text += '</select>';
		
		text += '<select id="style_presentation"><option value="Basic">--Presentation Theme--</option>';
		var themes = 'BlackLabel Basic Sunshine Sky BlueLabel'.split(' ');
		for (var t = 0; t < themes.length; t++) {
			var theme = themes[t];			
  			text += ('<option value="' + theme + '">' + theme + '</option>');
		}
		text += '</select><button type="button" id="btn_url_presentation">Create URL</button><br>';

		text += '<input id="url_presentation" type="text" style="width:100%" readonly value="URL link of presentation"/>' +
				'</form></div>';
		$("#dialog").append(text);
		
		$('#btn_url_presentation').click(function() {
			var url = document.location.protocol + '//' + document.location.host + '${pageContext.request.contextPath}/show/map/' + jMap.cfg.mapKey +
					'?type=' + $('#type_presentation').val() + '&style=' + $('#style_presentation').val();
			
			$('#url_presentation').val(url);
			
			document.querySelector("#url_presentation").select();
			// Copy to the clipboard
			document.execCommand('copy');
			alert('URL is copied to clipboard.');
		});

		$("#dialog").dialog({
			autoOpen:false,
			closeOnEscape: true,	//esc키로 창을 닫는다.
			modal:true,		//modal 창으로 설정
			resizable:false,	//사이즈 변경
			close: function( event, ui ) {
				$("#dialog iframe").remove();
				$("#dialog .dialog_content_nod").remove();
			 	$("#dialog").dialog("destroy"); 
			},
		});
		$("#dialog").dialog("option", "width", "none" );
		$("#dialog").dialog("option","dialogClass","shorturlFunction");
		$("#dialog").dialog( "option", "title", "${data.map.name}" );
		  		  
		$("#dialog").dialog("open");
	};
	
	var howtoUse = function () {
		  window.open("<spring:message code='menu.help.usage.url'/>", 'new', 'left=50, top=50, width=1050, height=600, scrollbars=yes');
	};
	
	var aboutOKMindmap = function () {
	
	      window.open("<spring:message code='menu.help.intromindmap.url'/>", 'new', 'left=50, top=50, width=1050, height=600, scrollbars=yes');
	};
	
	var aboutJinoTech = function () {
		window.open("<spring:message code='menu.help.introjino.url'/>", 'new', 'left=50, top=50, width=1050, height=600, scrollbars=yes');
	};
	
	var screenFocusAction = function() {
		jMap.controller.screenFocusAction();
	};
	
	var okmNoticeAction = function(check) {
		check = typeof check !== 'undefined' ? check : false;
		$.ajax({
			url: '${pageContext.request.contextPath}/mindmap/admin/notice/okmNotice.do?func=view',
            dataType: "json",
            cache: false,
			async: false,
            success: function(data) {
            	var ck_name = "okm_notice";
            	var updated = new Date(data[0].updated).getTime();          
            	var lastChecked = PopupExpiredays.getCookie(ck_name);
            	if(typeof lastChecked == 'undefined') lastChecked = 0;            	
            	lastChecked = parseInt(lastChecked);
            	
            	if(check==true || lastChecked < updated) {
            		var notice = "";
            		for(var i = data[0].notices.length-1; i >= 0 ; i--) {
            			var n = data[0].notices[i];
            			if(typeof n == 'undefined') continue;            			
            			var title = n["content_${locale.language}"];
            			var hyperlink = '';
            			if(n["link_${locale.language}"]) hyperlink = '<a class="noticehyperlink" href="'+n["link_${locale.language}"]+'" target="_blank"></a>';
            			notice = notice + '<div class="okm-notice">' + title + hyperlink + '</div>';
            		}
            		var txt = '<div class="dialog_content_nod" align="center">' +
		        		'<div>'+notice+'</div>' +
		        		'</div>';
		        	
		        	function callbackform_okm_notice(v, m, f){
		        		if (v) {
		        			var expire_date = new Date();
		        			var value = new Date().getTime ();
		        			expire_date.setDate(expire_date.getDate() + 99 );
		        			document.cookie = ck_name + "=" + escape( value ) + "; expires=" + expire_date.toGMTString() + "; path=/";
		        		}
		        		jMap.work.focus();
		        	}
		        	
		        	var button_close = {title:i18n.msgStore["okm_notice_button_close"], value: true};
		        	
		        	$("#dialog").append(txt);
		        	 
		        	$("#dialog").dialog({
		        		autoOpen:false,
		        		closeOnEscape: true,	//esc키로 창을 닫는다.
		        		modal:true,		//modal 창으로 설정
		        		resizable:false,	//사이즈 변경
		        		close: function( event, ui ) {
		        		  	$("#dialog .dialog_content_nod").remove();
		        			$("#dialog").dialog("destroy"); 
		        		},
		            });
		        	$("#dialog").dialog("option", "width", "none" );
		        	$("#dialog").dialog( "option", "buttons", [{
		        		text: i18n.msgStore["okm_notice_button_close"], 
		        		click: function() {
		        			var formValue = parseCallbackParam($("#dialog form").serializeArray());   //dialog 안에 있는 form안의 값을 직렬화 배열로 반환
		        			callbackform_okm_notice(true, formValue);
		        			$("#dialog .dialog_content_nod").remove();
		        			$("#dialog").dialog("destroy"); 
		        		} 
		        	}]);
		        	$("#dialog").dialog("option","dialogClass","okmNoticeAction");  
		        	$("#dialog").dialog( "option", "title", i18n.msgStore["okm_notice_title"] );
		        	$("#dialog").dialog("open");
            	}
            },
            error: function(error) {            	
            	//alert("notice error : " + error);
            }
        });
	}
	
	var setRestrictEditing = function() {
		var checked = $( "#restrict_editing" )[0].checked;
		DWR_setRestrictEditing(checked);
		jMap.cfg.restrictEditing = checked;
	}

</script>



