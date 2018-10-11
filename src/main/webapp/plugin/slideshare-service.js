
/**
 *  jQuery 필요.
 *  참고로 searchTag로 검색후 next를 해서 다음것을 가져오면 앞에 한개는 이전 불러왔던 데이터와 중복된다.
 *  이는 next로 다음것을 가져오는 중에서 슬라이드쉐어측에서 데이터가 생성되기 때문이다.
 *  
 * @author Hahm Myung Sun (hms1475@gmail.com)
 * @created 2011-06-14
 * 
 * Copyright (c) 2011 JinoTech (http://www.jinotech.com)
 * Licensed under the LGPL v3.0 license (http://www.gnu.org/licenses/lgpl.html).
 */

var SlideshareService = {
	init: function () {
		
	},
	canvas : null,
	start: 0,
	end: 0,	
	tag : "",
	// Slideshare 작업 공간 생성
	createCanvas: function () {
		var pos = "bottom: 0px;";		
		var padding = "padding: 10px;";
		var margin = "margin: 0 5% 25px;";
		var size = "width: 90%; height: 200px;";
		
		this.canvas = $('<div id="slideshare_canvas" style="position:absolute; '+pos+' '+size+' '+padding+' '+margin+' border:1px solid; background-color: #F0F0F0;"></div>').appendTo('#main');
	},
	// 화면에 보이기
	show: function () {
		if(!this.canvas) this.createCanvas();
		else this.canvas.show();
	},
	// 화면에서 가리기
	hide: function () {
		this.canvas.hide();
	},
	setTag: function (tag) {
		this.tag = tag;
	},
	// 서버에서 데이터 가져오기
	_searchTagCall: function (offset, limit) {
		var that = this;
		if(this.tag == "") {
			alert("검색할 Tag가 지정되지 않았습니다.");
			return false;
		}
		$.ajax({
			type: "POST",
			url: "/okmindmap/mashup/slideshare.do",
			data: "q=" + this.tag + "&offset=" + offset + "&limit=" + limit,
			success: function(data, textStatus, jqXHR){
				var result = jqXHR.responseText;
				that.start = offset; 
				that.end = offset + limit;
				
				var ss = JSON.parse(result);				
				for(var i = 0; i < ss.length; i++){
					var slide = ss[i];
					var canvas = $('#slideshare_canvas');
					var img = $('<img src="'+slide.thumbnail+'" style="padding: 5px;">');					
					img.get(0).embedCode = slide.embedCode;	// 이 주소는 클릭 이벤트에서 사용되어야 할 주소이므로 저장
					img.dblclick(function(e){
						var node = jMap.getSelecteds().getLastElement();
						
						// embedCode에서 화면의 크기인 width와 height를 가져온다.
						var re = /width="([^"]*)" height="([^"]*)"/ig;
						var match = re.exec(this.embedCode);
						var width = match[1];
						var height = match[2];
						
						// Flash이므로 노드에 ForeignObject로 넣는다.
						node.setForeignObject(this.embedCode, width, height);
						
						jMap.layoutManager.updateTreeHeightsAndRelativeYOfAncestors(node);
						jMap.layoutManager.layout(true);
					});
					canvas.append(img);					
				}
				
			},
			error:function (xhr, ajaxOptions, thrownError){
				alert("error11 : " + xhr.status);
				alert("error11 : " + thrownError);
			}
		});
	},
	// 기존 데이터 삭제
	cleanCanvas: function () {
		this.canvas.empty();
	},
	// Tag로 검색
	searchTag: function (limit) {		
		if(!limit) limit = 10;		
		this.cleanCanvas();
		this._searchTagCall(0, limit);
	},
	// Tag로 검색 후 다음 페이지?
	next: function (limit) {
		if(!limit) limit = 10;
		var offset = this.end + 1;
		this.cleanCanvas();
		this._searchTagCall(offset, limit);		
	},
	// Tag로 검색 후 이전 페이지?
	prev: function (limit) {
		if(!limit) limit = 10;
		var offset = this.start - limit;
		if(offset < 0) return; // 검색 시작인 offset이 0이하이면 검색할 것이 없음
		this.cleanCanvas();
		this._searchTagCall(offset, limit);		
	}

};
SlideshareService.init();

