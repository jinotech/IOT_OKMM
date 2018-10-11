
JinoMap.prototype.cfg = {
		contextPath: "",								// jsp페이지에서 사용하는 ${pageContext.request.contextPath}와 같음
		mapId:	0,
		mapKey: "",
		mapName: "",
		userId: 0,
		lazyLoading: false,						   // lazy 로딩인 경우 true
		realtimeSave: true,						   // 실시간 저장을 할것인지
		scale: 1.0,									   // 실제 scale 값
		nodeFontSizes: ['30', '18', '12'],		   // 루트, 첫번째, 나머지
		mapBackgroundColor: "#ffffff",		   // 맵 배경색상
		nodeSelectedColor: "#E02405",		   // 노드가 선택되었을때 나타나는 색상
		nodeDropFocusColor: "#808080",	   // 노드 위에 노드가 올라 왔을때 색상 (노드 위치 변경시)
		nodeDefalutColor: "#F4F4F4",			   // 기본 배경색
		textDefalutColor: "#000000",			   // 기본 글자 색상
		edgeDefalutColor: "#CCCCCC",			// 기본 테두리 색상
		branchDefalutColor: "#CCCCCC",		// 기본 가지 색상		
		edgeDefalutWidth: "1",						// 기본 테두리 두께
		branchDefalutWidth: "2",					// 기본 가지 두께		
		nodeStyle: "jRect",							// 노드 기본 스타일
		mapLayout: "jMindMapLayout",			// 기본 맵 스타일
		default_img_size: 200,						// 이미지 추가시 기본 사이즈
		default_video_size: 200,					    // 이미지 추가시 기본 사이즈
		default_menu_opacity: false,
		restrictEditing : false,                        // 내가 생성한 노드만 편집가능 하도록 제한
		mapOwner: false                             // 맵 생성자일 경우 true
};