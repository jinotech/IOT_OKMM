
PopupExpiredays = (function () {				
	function P(){}
	
	//설정한 날짜만큼 쿠키가 유지되게. expiredays가 1 이면 하루동안 유지
	P.setCookie = function(name, value, expiredays) {		
		var expire_date = new Date();
		expire_date.setDate(expire_date.getDate() + expiredays );
		document.cookie = name + "=" + escape( value ) + "; expires=" + expire_date.toGMTString() + "; path=/";
	}

	//쿠키 소멸 함수
	P.clearCookie = function(name) {
		var expire_date = new Date();
		//어제 날짜를 쿠키 소멸 날짜로 설정한다.
		expire_date.setDate(expire_date.getDate() - 1)
		document.cookie = name + "= " + "; expires=" + expire_date.toGMTString() + "; path=/"
	}

//	//체크 상태에 따라 쿠키 생성과 소멸을 제어하는 함수
//	P.controlCookie = function(elemnt) {
//		if (elemnt.checked) {
//			//체크 박스를 선택했을 경우 쿠키 생성 함수 호출
//			this.setCookie("okm_popup","true", 1)
//		} else {
//			//체크 박스를 해제했을 경우 쿠키 소멸 함수 호출
//			this.clearCookie("okm_popup")
//		}
//		self.close();
//		return;
//	}


	//쿠키값을 가져오는 함수
	P.getCookie = function(name) {
		var from_idx = document.cookie.indexOf(name+'=');
		
		if (from_idx != -1) {
			from_idx += name.length + 1
			to_idx = document.cookie.indexOf(';', from_idx)
			if (to_idx == -1) {
				to_idx = document.cookie.length
			}
			return unescape(document.cookie.substring(from_idx, to_idx))
		}
	}

	P.showPopupNotice = function(date) {
		var CloseDate = new Date(date); //팝업 윈도우를 닫고자 하는 날짜를 입력하세요.
		var Today = new Date(); //오늘 날짜		
		
		if (Today < CloseDate) {			
			//getCookie 함수를 호출하여 쿠키값을 가져온다.
			var blnCookie = this.getCookie("okm_popup");

			var message = i18n.msgStore["notice_message"];
			var title = i18n.msgStore["notice_title"];
			
			//쿠키값이 true가 아닐 경우에만 새 창을 띄운다.
			if ( !blnCookie ) {
				if( ISMOBILE ) {
					var re = /<br[ ]?\/?>/ig;
					var message = message.replace(re, "\n");					
					message = message.replace(/<[^>]*>/ig, "");
					alert(message);
				} else {
					var callback = function(v, m, f) {
						if(v == 'later') {
							P.setCookie("okm_popup","true", 1);
						}
					}
					
					if(!title) title = "NOTICE";
					var txt = '<center><font color="#0000ff">'+title+'</font></center><br />' +
					message +						
					'<br />';

					var button_skip = {title:i18n.msgStore["notice_button_skip"], value: 'later'};
					var button_ok = {title:i18n.msgStore["notice_button_ok"], value: true};
					var popup = $.prompt(txt, {
						callback: callback,
						persistent: false,
						top: '30%',
						buttons: {
							skip:button_skip,
							ok  :button_ok
						}
					});
				}
			}
		}
	}

	return P;
})();





