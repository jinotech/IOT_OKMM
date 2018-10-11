(function( $ ){
	$.fn.ribbon = function(id) {
		if (!id) {
			if (this.attr('id')) {
				id = this.attr('id');
			}
		}
		
		
		//$(".ribbon-tab").hide();
		
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
						$('#folding-RB').attr('folding-stat',1);
						if($.cookie('currentTab') ==null){
							that.selectedTabIndex = 0;
						}else{
							that.selectedTabIndex = $.cookie('currentTab');
						}
						thisTabHeader.addClass('sel');
					}
					
					thisTabHeader.click(function() {
						that.returnFromBackstage();
						that.switchToTabByIndex(index);
					});
				}
				
				
				
				//$(this).hide();
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
			$.cookie('currentTab',index);
			var currnetTab = $.cookie('currentTab');
			var headerStrip = $('#ribbon #ribbon-tab-header-strip');
			headerStrip.find('.ribbon-tab-header').removeClass('sel');
			headerStrip.find('#ribbon-tab-header-'+currnetTab).addClass('sel');

			$('#ribbon .ribbon-tab').css('display','none');
			$('.ribbon-tab').scrollLeft(0);
             if($('#folding-RB').attr('folding-stat')==0)  //�묓��덈뒗 寃쎌슦 臾댁“嫄��щ씪�대뱶濡��대┝
             {
             $('#ribbon #'+tabNames[index]).slideDown();	//wonho-show()瑜�slideDown�쇰줈 諛붽퓞
             $('#top .okm-sns').css('top',180);
             $('#folding-RB').attr('folding-stat',1);   //wonho 異붽� 由щ낯���대젮 �덈떎��寃껋쓣 �뚮젮以�
             $('#folding-RB').css('-webkit-transform', 'rotate(0deg)').css('-moz-transform','rotate(0deg)'); //Folding,unfolding button img change
             }else                        //�쇱퀜�덈뒗 寃쎌슦 �щ씪�대뱶�섏� 留먭퀬 吏곸젒 蹂댁뿬以�留뚯빟 �숈씪��寃껋씠 �먮쾲 �뚮졇�ㅻ㈃ �묒뼱以�
             {
                if(index != $('#folding-RB').attr('sel-tab'))
                {
                    $('#ribbon #'+tabNames[index]).css("display","block");	//wonho-show()瑜�show濡�諛붽퓞
                    $('#folding-RB').attr('folding-stat',1);   //wonho 異붽� 由щ낯���대젮 �덈떎��寃껋쓣 �뚮젮以�
                    $('#folding-RB').css('-webkit-transform', 'rotate(0deg)').css('-moz-transform','rotate(0deg)'); //Folding,unfolding button img change
                }else
                {
                    $('#ribbon #'+tabNames[index]).css("display","block").slideUp();	//wonho-show()瑜��щ씪�대뱶瑜��꾨줈 �щ┝
                    $('#top .okm-sns').css('top',80);
                    $('#folding-RB').attr('folding-stat',0);   //wonho 異붽� 由щ낯���ロ� �덈떎��寃껋쓣 �뚮젮以�
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