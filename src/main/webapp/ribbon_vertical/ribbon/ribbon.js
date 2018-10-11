(function( $ ){
	$.fn.ribbon = function(id) {
		if (!id) {
			if (this.attr('id')) {
				id = this.attr('id');
			}
		}
		
		var that = function() { 
			return thatRet;
		};
		
		
		
		var thatRet = that;
		
		that.selectedTabIndex = -1;
		
		var tabNames = [];
		
		that.goToBackstage = function() {
			ribObj.addClass('backstage');
		}
			
		that.returnFromBackstage = function() {
			ribObj.removeClass('backstage');
		}	
		var ribObj = null;
		
		that.init = function(id) {
			if (!id) {
				id = 'ribbon';
			}
		
			ribObj = $('#'+id);
			ribObj.find('.ribbon-window-title').after('<div id="ribbon-tab-header-strip"></div>');
			var header = ribObj.find('#ribbon-tab-header-strip');
			
			ribObj.find('.ribbon-tab').each(function(index) {
				var id = $(this).attr('id');
				if (id == undefined || id == null)
				{
					$(this).attr('id', 'tab-'+index);
					id = 'tab-'+index;
				}
				tabNames[index] = id;
			
				var title = $(this).find('.ribbon-title');
				var isBackstage = $(this).hasClass('file');
				header.append('<div id="ribbon-tab-header-'+index+'" class="ribbon-tab-header"></div>');
				var thisTabHeader = header.find('#ribbon-tab-header-'+index);
				thisTabHeader.append(title);
				if (isBackstage) {
					thisTabHeader.addClass('file');
					
					thisTabHeader.click(function() {
						that.switchToTabByIndex(index);
						that.goToBackstage();
					});
				} else {
					if (that.selectedTabIndex==-1) {
						that.selectedTabIndex = index;
						thisTabHeader.addClass('sel');
					}
					
					thisTabHeader.click(function() {
						that.returnFromBackstage();
						that.switchToTabByIndex(index);
					});
				}
				
				
				
				$(this).hide();
			});
			
			
			ribObj.find('.ribbon-button').each(function(index) {
				var title = $(this).find('.button-title');
				title.detach();
				$(this).append(title);
											
				var el = $(this);
				
				this.enable = function() {
					el.removeClass('disabled');
				}
				this.disable = function() {
					el.addClass('disabled');
				}
				this.isEnabled = function() {
					return !el.hasClass('disabled');
				}
								
				if ($(this).find('.ribbon-hot').length==0) {
					$(this).find('.ribbon-normal').addClass('ribbon-hot');
				}			
				if ($(this).find('.ribbon-disabled').length==0) {
					$(this).find('.ribbon-normal').addClass('ribbon-disabled');
					$(this).find('.ribbon-normal').addClass('ribbon-implicit-disabled');
				}
				
				$(this).tooltip({
					bodyHandler: function () {
						if (!$(this).isEnabled()) { 
							$('#tooltip').css('visibility', 'hidden');
							return '';
						}
						
						var tor = '';

						if (jQuery(this).children('.button-help').size() > 0)
							tor = (jQuery(this).children('.button-help').html());
						else
							tor = '';

						if (tor == '') {
							$('#tooltip').css('visibility', 'hidden');
							return '';
						}

						$('#tooltip').css('visibility', 'visible');

						return tor;
					},
					left: 0,
					extraClass: 'ribbon-tooltip'
				});
			});
			
			

			ribObj.find('div').attr('unselectable', 'on');   
			ribObj.find('span').attr('unselectable', 'on');

			ribObj.attr('unselectable', 'on');

			that.switchToTabByIndex(that.selectedTabIndex);
		}
		
		that.switchToTabByIndex = function(index) {
			var headerStrip = $('#ribbon #ribbon-tab-header-strip');
			headerStrip.find('.ribbon-tab-header').removeClass('sel');
			headerStrip.find('#ribbon-tab-header-'+index).addClass('sel');

			$('#ribbon .ribbon-tab').hide();

             if($('#folding-RB').attr('folding-stat')==0)  //접혀있는 경우 무조건 슬라이드로 열림
             {
             $('#ribbon #'+tabNames[index]).slideDown();	//wonho-show()를 slideDown으로 바꿈
             $('#folding-RB').attr('folding-stat',1);   //wonho 추가 리본이 열려 있다는 것을 알려줌
             $('#folding-RB').css('-webkit-transform', 'rotate(0deg)').css('-moz-transform','rotate(0deg)'); //Folding,unfolding button img change
             }else                        //펼쳐있는 경우 슬라이드하지 말고 직접 보여줌 만약 동일한 것이 두번 눌렸다면 접어줌
             {
                if(index != $('#folding-RB').attr('sel-tab'))
                {
                    $('#ribbon #'+tabNames[index]).show();	//wonho-show()를 show로 바꿈
                    $('#folding-RB').attr('folding-stat',1);   //wonho 추가 리본이 열려 있다는 것을 알려줌
                    $('#folding-RB').css('-webkit-transform', 'rotate(0deg)').css('-moz-transform','rotate(0deg)'); //Folding,unfolding button img change
                }else
                {
                    $('#ribbon #'+tabNames[index]).show().slideUp();	//wonho-show()를 슬라이드를 위로 올림
                    $('#folding-RB').attr('folding-stat',0);   //wonho 추가 리본이 닫혀 있다는 것을 알려줌
                    $('#folding-RB').css('-webkit-transform', 'rotate(180deg)').css('-moz-transform','rotate(180deg)'); //Folding,unfolding button img change
                }
             }
             $('#folding-RB').attr('sel-tab',index);
		}
		
		$.fn.enable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].enable) {
					this[0].enable(); alert(this.attr(id));
				}	
			}
			else {
				this.find('.ribbon-button').each(function() {
					$(this).enable(); alert(this.attr(id));
				});
			}				
		}
		
				
		$.fn.disable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].disable) {
					this[0].disable(); 
				}	
			}
			else {
				this.find('.ribbon-button').each(function() {
					$(this).disable();
				});
			}				
		}
	
		$.fn.isEnabled = function() {
			if (this[0] && this[0].isEnabled) {
				return this[0].isEnabled();
			} else {
				return true;
			}
		}
	
	
		that.init(id);
	
		$.fn.ribbon = that;
	};

})( jQuery );