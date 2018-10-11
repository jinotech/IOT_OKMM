/**
 * 
 * @author Hahm Myung Sun (hms1475@gmail.com)
 *
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com) 
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

 
/////////////// extends ///////////////////
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
///////////////////////////////////////////


var GRAPH_URL = 'https://graph.facebook.com/v2.1/';

var FacebookService = {

	facebookPosts : {},
	accessToken : "",
	
	init: function () {
		window.fbAsyncInit = function() {
			FB.init({
			  appId      : FACEBOOK_APP_ID,
			  xfbml      : true,
			  version    : 'v2.0'
			});
		  };
	
		(function(d, s, id){
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) {return;}
				js = d.createElement(s); js.id = id;
				js.src = "//connect.facebook.net/en_US/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
	},
	
	getUser: function(callback) {
		FB.login(function(response) {
			if(response.authResponse !== undefined && response.authResponse.accessToken !== undefined) {
				accessToken = response.authResponse.accessToken;
				var user_id = response.authResponse.userID;
				var url = GRAPH_URL + user_id + '?access_token=' + accessToken;
				console.log(url);
				$.getJSON(url, function (me) {
					callback(me);
				}).complete(function () {
				});
			}
		}, {
		   scope: 'email', 
		   return_scopes: true
		 });
	},
	
	// joinData : url, facebook, email, username, firstname, lastname, password, password1
	joinFacebook: function(joinData, callback) {
		joinData.confirmed = 1;
		$.ajax({
			type: 'post',
			async: false,
			url: joinData.url,
			data: joinData
		}).done(function( data ) {
			callback(data);
		});
	},
	
	loginFacebook: function(loginData, callback) {
		$.ajax({
			type: 'post',
			async: false,
			url: loginData.url,
			data: loginData
		}).done(function( data ) {
			callback(data);
		});
	},
	
	getPosts: function () {
		FacebookService.facebookPosts = {};
		FB.login(function(response) {
				accessToken = response.authResponse.accessToken;
				
				var graphTYPE = 'posts'; // 'feed';
				var user_id = response.authResponse.userID;
				var limit = '';//'&limit=' + 25;
				var graphPOSTS = GRAPH_URL + user_id + '/' + graphTYPE + '?access_token=' + accessToken + limit + '&callback=?';
				
				FacebookService._getPostsData(graphPOSTS);
		 }, {
		   scope: 'read_stream', 
		   return_scopes: true
		 });
	},
	
	getFeed: function () {
		FacebookService.facebookPosts = {};
		FB.login(function(response) {
				accessToken = response.authResponse.accessToken;
				
				var graphTYPE = 'feed';
				var user_id = response.authResponse.userID;
				var limit = '';//'&limit=' + 25;
				var graphPOSTS = GRAPH_URL + user_id + '/' + graphTYPE + '?access_token=' + accessToken + limit + '&callback=?';
				
				FacebookService._getPostsData(graphPOSTS);
		 }, {
		   scope: 'read_stream', 
		   return_scopes: true
		 });
	},
	
	_getPostsData: function(url) {
		var txt = '<center>Import Facebook</center><br />limit : <br />'+
		      '<input type="text" id="jino_input_facebook_limit"'+ 
		      'name="jino_input_facebook_limit" size ="5" value="5" />';
			function callbackform2(v,m,f){
				//JinoUtil.waitingDialog("Import Facebook");
				if (v) {
					JinoUtil.waitingDialog("Import Facebook");
					var limit = f.jino_input_facebook_limit;
					FacebookService._doGraphPosts(url, limit);
				} else {
					FacebookService._doGraphPosts(url, 50);
				}
				//jMap.paper.work.focus();						
			}
			
			if($.prompt !== undefined) {
				var re = $.prompt(txt,{
					callback: callbackform2,
					  persistent : false,
					  focusTarget : 'jino_input_facebook_limit',
					  top : '30%',
					buttons: { Ok: true }
				});
			} else {
				callbackform2();
			}
	},
	
	_doGraphPosts: function(url, importCount) {
		var nextPostUrl = null;
		
		$.getJSON(url, function (posts) {
					$.each(posts.data, function () {
						if (this.is_hidden === undefined) {
							var item = {};
							
							// 행동
							if (this.message !== undefined) {
								if(importCount == 0) return;
								item.message = this.message;
								importCount--;
							} 
							//else if (this.story !== undefined) {
							//	item.story = this.story;
							//}
							else {
								return;
							}
							
							// 누가 작성했는지
							if (this.from !== undefined) {
								item.from = {};
								item.from.id = this.from.id;
								item.from.name = this.from.name
							} 

							if (this.type === 'link' || this.type === 'photo' || this.type === 'video') {
								
							}
							
							// 사람별대로 데이터를 쌓는다.
							if(!$.isEmptyObject(item)) {
								if(!FacebookService.facebookPosts[item.from.id]) {
									FacebookService.facebookPosts[item.from.id] = {};
									FacebookService.facebookPosts[item.from.id].name = item.from.name;
									FacebookService.facebookPosts[item.from.id].message = new Array;
								}
								FacebookService.facebookPosts[item.from.id].message.push(item.message);
							}
						}
					});
					if(posts.paging !== undefined && importCount > 0) {
						nextPostUrl = posts.paging.next;
					}
				}).complete(function () {
					if(nextPostUrl != null) {
						FacebookService._doGraphPosts(nextPostUrl, importCount);
					} else {
						JinoUtil.waitingDialogClose();
						
						// 출력!!
						FacebookService._printMindMap(FacebookService.facebookPosts);
					}
				});
	},
	
	_printMindMap: function(item) {
		var key = null;
		var value = null;
		
		$.each(item, function (_key, _value) {
			key = _key;
			value = _value;
		});
		
		if(key == null) {
			JinoUtil.waitingDialogClose();
			return;
		}
		
		// 유저 사진 가져오기
		var type = "normal";
		var url = GRAPH_URL + key + '/picture?access_token=' + accessToken + '&type=' + type + '&callback=?';
		$.getJSON(url, function (data) {
			var node = jMap.selectedNodes.getLastElement();
			var param = {parent: node, text: value.name};
			var userNode = jMap.createNodeWithCtrl(param);
			userNode.setImage(data.data.url);
			for (var i = 0; i < value.message.length; i++) {
				var param = {parent: userNode, text: value.message[i]};
				var msgNode = jMap.createNodeWithCtrl(param);
			}
		}).complete(function () {
		
			delete item[key];
			
			FacebookService._printMindMap(item);
		});
	
	
	
	
	
	
	
	
	
	
	
		/*
		var itemSize = Object.size(item);
		
		// 화면에 출력
		$.each(item, function (key, value) {
			// 유저 사진 가져오기
			var type = "normal";
			var url = GRAPH_URL + key + '/picture?access_token=' + accessToken + '&type=' + type + '&callback=?';
			$.getJSON(url, function (data) {
				var node = jMap.selectedNodes.getLastElement();
				var param = {parent: node, text: value.name};
				var userNode = jMap.createNodeWithCtrl(param);
				userNode.setImage(data.data.url);
				for (var i = 0; i < value.message.length; i++) {
					var param = {parent: userNode, text: value.message[i]};
					var msgNode = jMap.createNodeWithCtrl(param);
				}
			}).complete(function () {
				itemSize--;
				if(itemSize == 0) {
					//if(node.folded) node.setFoldingExecute(false);
					//jMap.layoutManager.updateTreeHeightsAndRelativeYOfDescendantsAndAncestors(node);
					//jMap.layoutManager.layout(true);
					
					//(typeof DWR_sendForceRefresh != "undefined")&& DWR_sendForceRefresh(jMap.cfg.userId);
					
					JinoUtil.waitingDialogClose();
				}
			});
		});
		*/
	},
	
	
	postFeed: function (name, link) {
		
		FB.login(function(response) {
				accessToken = response.authResponse.accessToken;
				
				var CLOSE_URL = document.location.origin + '/closewindow.html';
				//var name = "Facebook OKM (맵제목)";
				//var link = "http://dev.jinotech.com:8080/map/NjQ4YTEzNGMtYjMyNS00MzkyLTkyZjUtMGFmYWY4M2IzMDMx";
				var description = "OKMindmap :: Design Your Mind!";
				//var caption = "요건 안적음. okmindmap.com 같이 적힌다.";
				var picture = "http://www.okmindmap.com/images/facebookicon.jpg";			
				var redirect_uri = CLOSE_URL;			

				var url = 'https://www.facebook.com/dialog/feed?'+
							'app_id='+FACEBOOK_APP_ID+'&'+
							'link='+link+'&'+
							'picture='+picture+'&'+
							'name='+name+'&'+
							//'caption='+caption+'&'+
							'description='+description+'&'+
							'access_token='+accessToken+'&'+
							'display=iframe&'+
							'redirect_uri='+redirect_uri;

				//url = 'https://www.facebook.com/dialog/feed?app_id=222424227868957&message=aaa&access_token='+response.authResponse.accessToken+'&redirect_uri=http://dev.jinotech.com:8080&show_error=true&caption=sss&link=http://dev.jinotech.com:8080/images/logo2.png'


				$.modal('<iframe src="'+url+'" frameborder="0" allowtransparency="true" width="600"  height="290" scrolling="no"></iframe>', {
						overlayId: 'okm-overlay',
						containerId: 'sns-container',
						dataId: 'sns-data',
						position: ['0',],
						onOpen: function(d) {
							var self = this;
							d.overlay.fadeIn('slow', function () {
								d.container.slideDown('slow', function () {
									d.data.prepend('<div class="dialog_title">Post to Your Wall</div>');
									d.data.show();
								});
							});
							
						
						}
				});
		 }, {
		   scope: 'publish_actions,publish_stream', 
		   return_scopes: true
		 });
	},
	
	
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
		
//	onFacebookLoginStatus: function (response) {
//	console.log(response.status);
//	if (response.status === 'connected') {
//    // the user is logged in and has authenticated your
//    // app, and response.authResponse supplies
//    // the user's ID, a valid access token, a signed
//    // request, and the time the access token 
//    // and signed request each expire
//    var uid = response.authResponse.userID;
//    var accessToken = response.authResponse.accessToken;
//  } else if (response.status === 'not_authorized') {
//  console.log("nnnn");
//  FB.login(function(){
//	console.log("llll");
//}, {scope: 'publish_actions'});
//    // the user is logged in to Facebook, 
//    // but has not authenticated your app
//  } else {
//    // the user isn't logged in to Facebook.
//  }
//	
//		//if (response.status=="connected" && response.authResponse) {
//		//	FacebookService.isLogin = true;
//		//	FacebookService.loginCompletedFnc && FacebookService.loginCompletedFnc(response, FB);
//		//} else {
//		//	if(FacebookService.loginRequestFnc) {
//		//		FacebookService.loginRequestFnc(response, FB);
//		//	} /*else {
//		//		FacebookService.facebookLogin();
//		//	}*/
//		//}
//	},
//	
//	facebookLogout: function () {
//		FB && FB.logout();
//	},
//	
//	facebookLogin: function () {
//		var popupWidth=500;
//		var popupHeight=300;
//		var xPosition=($(window).width()-popupWidth)/2;
//		var yPosition=($(window).height()-popupHeight)/2;
//		var loginUrl="http://www.facebook.com/dialog/oauth/?"+
//			"scope=email,read_stream,publish_stream,offline_access&"+
//			"client_id="+FACEBOOK_APP_ID+"&"+
//			"redirect_uri="+CLOSE_URL+"&"+
//			"response_type=token&"+
//			"display=popup";
//		
//		this.facebookLoginWindow=window.open(loginUrl, "LoginWindow", 
//			"location=1,scrollbars=1,"+
//			"width="+popupWidth+",height="+popupHeight+","+
//			"left="+xPosition+",top="+yPosition);
//			
//		this.loginWindowTimer=setInterval(this.onTimerCallbackToCheckLoginWindowClosure, 1000);
//	},
//	
//	onTimerCallbackToCheckLoginWindowClosure: function () {
//		if (FacebookService.facebookLoginWindow.closed) 
//		{
//			clearInterval(FacebookService.loginWindowTimer);
//			FacebookService.initFacebook();
//		}
//    },
//	
//	onLoginCompleted: function(fnc) {
//		this.loginCompletedFnc = fnc;
//	},
//	onLoginRequest: function(fnc) {
//		this.loginRequestFnc = fnc;
//	},
//	
//	/////////////////////////////////// API Service ////////////////////////////////////
//	
//	/*getFeed: function () {
//	console.log("vv");
//	//FB.getLoginStatus(this.onFacebookLoginStatus);
//	FB.login(function(){}, {scope: 'read_stream'});
//		var txt = '<center>Import Facebook</center><br />limit : <br />'+
//		      '<input type="text" id="jino_input_facebook_limit"'+ 
//		      'name="jino_input_facebook_limit" size ="5" value="5" />';
//			function callbackform2(v,m,f){
//				if (v) {
//					JinoUtil.waitingDialog("Import Facebook");
//					var limit = f.jino_input_facebook_limit;
//					
//					FB.api(
//    "/me?fields=posts.limit(10)",
//    function (response) {
//	console.log(response);
//      if (response && !response.error) {
//        
//      }
//    }
//);
//					
//				}
//				//jMap.paper.work.focus();						
//			}	
//			var re = $.prompt(txt,{
//			    callback: callbackform2,
//				  persistent : false,
//				  focusTarget : 'jino_input_facebook_limit',
//				  top : '30%',
//			    buttons: { Ok: true }
//			});
//	},*/
//	
//	postFeed: function (name, link) {
//		FacebookService.onLoginCompleted(function(response, FB) {
//			//var name = "Facebook OKM (맵제목)";
//			//var link = "http://dev.jinotech.com:8080/map/NjQ4YTEzNGMtYjMyNS00MzkyLTkyZjUtMGFmYWY4M2IzMDMx";
//			var description = "OKMindmap :: Design Your Mind!";
//			//var caption = "요건 안적음. okmindmap.com 같이 적힌다.";
//			var picture = "http://www.okmindmap.com/images/facebookicon.jpg";			
//			var redirect_uri = CLOSE_URL;			
//
//			var url = 'https://www.facebook.com/dialog/feed?'+
//						'app_id='+FACEBOOK_APP_ID+'&'+
//						'link='+link+'&'+
//						'picture='+picture+'&'+
//						'name='+name+'&'+
//						//'caption='+caption+'&'+
//						'description='+description+'&'+
//						'access_token='+response.authResponse.accessToken+'&'+
//						'display=iframe&'+
//						'redirect_uri='+redirect_uri;
//
//			//url = 'https://www.facebook.com/dialog/feed?app_id=222424227868957&message=aaa&access_token='+response.authResponse.accessToken+'&redirect_uri=http://dev.jinotech.com:8080&show_error=true&caption=sss&link=http://dev.jinotech.com:8080/images/logo2.png'
//
//
//			$.modal('<iframe src="'+url+'" frameborder="0" allowtransparency="true" width="600"  height="290" scrolling="no"></iframe>', {
//					overlayId: 'okm-overlay',
//					containerId: 'sns-container',
//					dataId: 'sns-data',
//					position: ['0',],
//					onOpen: function(d) {
//						var self = this;
//						d.overlay.fadeIn('slow', function () {
//							d.container.slideDown('slow', function () {
//								d.data.prepend('<div class="dialog_title">Post to Your Wall</div>');
//								d.data.show();
//							});
//						});
//						
//					
//					}
//			});
//		});
//
//		FacebookService.facebookLogin();
//		
//		
//		
//		/*
//		FacebookService.onLoginCompleted(function(response, FB) {
//			FB.ui({
//				method: 'feed',
//				redirect_uri: 'http://dev.jinotech.com:8080'
//				//name: 'Facebook OKM (맵제목)',
//				//link: 'http://dev.jinotech.com:8080/map/NjQ4YTEzNGMtYjMyNS00MzkyLTkyZjUtMGFmYWY4M2IzMDMx',
//				//picture: 'http://dev.jinotech.com:8080/images/logo2.png',
//				//caption: 'Reference Documentation',
//				//description: 'OKMindmap :: Design Your Mind!',
//				//message: 'Facebook Dialogs are easy!'
//			}, function(response) {
//				if (response && response.post_id) {
//					alert('Post was published.');
//				} else {
//					alert('Post was not published.');
//				}
//			});
//		});
//		FacebookService.initFacebook();
//		*/
//
//
//		/*
//		FacebookService.onLoginCompleted(function(response, FB) {
//			var message = "Facebook 테스트하냐고 만들엇슴다!!! 설명이 길어질지 모르니 여기에 설명을 적고~!! 맵을 만들면 자신의 담벼락에 이렇게 표시된다";
//			var picture = "http://www.okmindmap.com/images/facebookicon.jpg";
//			var link = "http://dev.jinotech.com:8080/map/NjQ4YTEzNGMtYjMyNS00MzkyLTkyZjUtMGFmYWY4M2IzMDMx";
//			var name = "Facebook OKM (맵제목)";
//			var icon = "http://www.okmindmap.com/images/logo.png";
//			var caption = "요건 안적음. okmindmap.com 같이 적힌다.";
//			var description = "OKMindmap :: Design Your Mind!";
//			var type = "";
//
//			FB.api("/me/feed", "post", { message:message, picture:picture, link: link, name: name, icon:icon, description:description }, function(response){
//				console.log(response);
//				if (!response || response.error){  
//					alert("Error occured: " + response.error.message);  
//				} else {  
//					alert("Post ID: " + response + ", 글쓰기 완료~!");  
//				}
//			});
//		});
//
//		FacebookService.initFacebook();
//		*/
//	}
};

$(document).ready( FacebookService.init );




////////////////////// 참고 //////////////////////////////
/*
FB.ui({method: 'auth.logintofacebook'},
	function() {
		location.reload(true);
	}
);

*/

/*
FB.login(function(response) {
	if (response.authResponse) {
		FB.api('/me', function(response) {
			console.log(response);
			console.log('Good to see you, ' + response.name + '.');
		});
	} else {
		console.log('User cancelled login or did not fully authorize.');
	}
});
*/


/*

FB.getLoginStatus(function (response) {
	if (response.status=="connected" && response.authResponse) {
		FB.ui({
			method: 'permissions.request',
			'perms': 'email',
			'display': 'popup'
			},
			function(response) {
				//console.log(response);
				FB.api('/'+response.selected_profiles, function(response) {
					//console.log("me");
					//console.log(response);
					var frm = document.getElementById("frm-user-new");
					frm.email.value = response.email;
					frm.firstname.value = response.first_name;
					frm.lastname.value = response.last_name;
					if(response.username) frm.username.value = response.username;
					FB.getLoginStatus(function (r) {
						console.log(r);

						if (r.status=="connected" && r.authResponse) {

							

							frm.facebook.value = r.authResponse.accessToken;
						}
					});
				});
			}
		);
	} else {
		FB.ui({method: 'auth.logintofacebook'},
			function() {
				location.reload(true);
			}
		);				
	}
});

*/

