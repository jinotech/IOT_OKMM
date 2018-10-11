<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="bitly" uri="http://www.servletsuite.com/servlets/bitlytag" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
        "http://www.w3.org/TR/html4/strict.dtd">
<html>
	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8">
		<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
		<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
		<META HTTP-EQUIV="Expires" CONTENT="0">

		<title>Admin Page</title>
		 <link href='http://api.mobilis.co.kr/webfonts/css/?fontface=NanumGothicWeb'  rel='stylesheet' type='text/css' />
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
		<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/jquery.treeview.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">

		<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery-bug.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
		<script src="${pageContext.request.contextPath}/lib/jquery.treeview.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
		
		<script src="${pageContext.request.contextPath}/extends/javascript-chat.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>

		<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/engine.js?v=<env:getEntry name="versioning"/>'></script>
		<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/interface/JavascriptChat.js?v=<env:getEntry name="versioning"/>'></script>		
		<script type='text/javascript' src='${pageContext.request.contextPath}/dwr/util.js?v=<env:getEntry name="versioning"/>'></script>
	
	
		<style>
			.admin_title {
				margin: 20px;
				font-size: 24pt;
			}
			
			/*
			.content {
				width: 1200px;
				border: 1px solid #000;
			}
			
			.admin_tbl {
				height: 500px;
				width: 1200px;
			}
			
			.treeview_left{
				height: 500px;
				border-right: 1px solid #000;
			}
			
			.main{
				height: 500px;
			}
			*/
			
		</style>
		<script type="text/javascript">
		
			var gotoUrl = function(url) {
				document.getElementById('adminframe').src = url;
			}
			
			function adminNotice() {
				var notice = prompt("알림말");
				(typeof DWR_sendAdminNotice != "undefined")&& DWR_sendAdminNotice(notice);
			}

			dwr.engine.setNotifyServerOnPageUnload(true, false);
			
			function init_d(){
				$("#admintree").treeview();
				
				// dwr
				init();
			}
			$(document).ready( init_d );
		</script>

    </head>

    <body>
    
		<!-- -------------트리뷰-------------------! -->
		<div class="treeview_left">
			<div class="treeview_bg">
				<ul id="admintree" class="admintree">
					<li><a class="folder">맵 관리</a>
						<ul>
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/maps/list.do?maptype=all" target="adminContent">전체 맵</a></li>
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/maps/list.do?maptype=guest" target="adminContent">손님 맵</a></li>
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/maps/list.do?maptype=shares" target="adminContent">공유 맵</a></li>							
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/maps/recommend.do" target="adminContent">추천맵</a></li>							
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/maps/management.do" target="adminContent">메인화면관리</a></li>							
						</ul>
					</li>
					<li><a class="folder">사용자 관리</a>
						<ul>
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/users/list.do" target="adminContent">사용자 조회</a></li>									
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/users/useradd.do" target="adminContent">사용자 추가</a></li>
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/users/group.do" target="adminContent">그룹 관리</a></li>									
						</ul>
					</li>
					
					<li><a class="folder">통계</a>
						<ul>
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/stars/mapStats.do" target="adminContent">맵</a></li>									
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/stars/userStats.do" target="adminContent">사용자</a></li>									
						</ul>
					</li>
					<li><a class="folder">알림</a>
						<ul>
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/notice/okmNotice.do" target="adminContent">공지사항</a></li>									
							<li><a class="item" href="${pageContext.request.contextPath}/board/list.do?boardType=3&lang=ko" target="adminContent">Q&A</a></li>									
							<li><a class="item" onclick="adminNotice();">실시간 알림</a></li>									
						</ul>
					</li>
					<li><a class="folder">환경설정</a>
						<ul>
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/setting/function.do" target="adminContent">기능 설정</a></li>									
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/setting/adminManager.do" target="adminContent">관리자 정보 관리</a></li>									
							<li><a class="item" href="${pageContext.request.contextPath}/mindmap/admin/setting/backup.do" target="adminContent">백업/복구</a></li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
    			
	</body>
</html>



