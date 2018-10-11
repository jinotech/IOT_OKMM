		$(document).ready(function () {
			$('#ribbon').ribbon();
			
			$('#enable-btn').click(function() {
				$('#del-table-btn').enable();
				$('#del-page-btn').enable();
				$('#copy').enable();
				$('#other-btn-2').enable();
				
				$('#enable-btn').hide();
				$('#disable-btn').show();	
			});
			
			$('#disable-btn').click(function() {
				$('#del-table-btn').disable();
				$('#del-page-btn').disable();
				$('#copy').disable();
				$('#other-btn-2').disable();
				
				$('#disable-btn').hide();
				$('#enable-btn').show();	
			});
			
			//��ü�� ����/���
			$('#foldingall').click(function(){
						if($(this).attr('folding_check')==1){
							$(this).attr('folding_check',0);
							foldingAllAction();							
						}else{
							$(this).attr('folding_check',1);
							unfoldingAllAction();						
						}

			});
			$('.ribbon-button').click(function() {
				var ind = $('#ribbon-tab-header-strip .sel').index();
				var panel = $('#rightpanel');	
				var googlePanel = $("#text_search");
				var rpc = $('#rightpanel-close');
				if (this.isEnabled()) {
					if($(this).attr('id')=='folding-RB'){		// wonho 
						if($(this).attr('folding-stat')==1){
							if(panel.css('display') == 'block' || googlePanel.css('display') == 'block'){		// 리본메뉴 버튼을 눌러 위로 접을때 오른쪽 패널이 나와있으면 이동
								panel.animate({							//chat 패널 이동
									top : -98
								}, 400, function() {				
								});
								rpc.animate({							// 버튼 이동
									top : -98
								}, 400, function() {
									$(this).css("background-position-y", 0);
								});
								googlePanel.animate({					// gooogle 패널 이동
									top : 78
								}, 400, function() {				
								});
							}
							
							$('#ribbon .ribbon-tab').slideUp();
							$('#top .okm-sns').css('top',80);
						//	$('#ribbon #'+"format-tab").slideUp();	// wonho 추가 
						//	$('#ribbon #'+"next-tab").slideUp();	// wonho 추가 
							$(this).attr('folding-stat',0);
                            $('#folding-RB').css('-webkit-transform', 'rotate(180deg)').css('-moz-transform','rotate(180deg)'); //Folding,unfolding button img change
						}else{
							if(panel.css('display') == 'block' || googlePanel.css('display') == 'block'){		// 리본메뉴 버튼을 눌러 아래로 펼칠때 오른쪽 패널이 나와있으면 이동
								panel.animate({
									top : 0
								}, 400, function() {						
								});
								rpc.animate({
									top : 0
								}, 400, function() {
								});
								$(this).css("background-position-y", -30);
								googlePanel.animate({
									top :176
								}, 400, function() {						
								});
							}
							$('#ribbon #ribbon-tab-'+ind).slideDown();	
							$('#top .okm-sns').css('top',180);
							$('#ribbon #ribbon-tab-'+ind).css("display","block");
						//	$('#ribbon #ribbon-tab$('.sel').index()]).slideDown();	//wonho-show()를 slideDown으로 바꿈
                            $('#folding-RB').css('-webkit-transform', 'rotate(0deg)').css('-moz-transform','rotate(0deg)'); //Folding,unfolding button img change
							$(this).attr('folding-stat',1);
						}
					}else{
						// wonho 추가 
						
						var action = $(this).attr('id');
						//alert(action + ' clicked'); // wonho 실행 스크립트와 연결
						if(action == "open") {
							//openMap();
							alert("open map");
						}
						
					}
				}
			});
			
			
		});
