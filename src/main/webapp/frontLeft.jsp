<%@ page contentType="text/html; charset=utf-8" %>

<div class="ok-lnb">
    <div class="lnb-more"></div>
    <div class="lnb-logo">
        <a href="${pageContext.request.contextPath}/front.do"><img src="./images/logo.png" alt="okmainmpa" /></a>
    </div>
    <ul>
        <li class="on">
            <a href="${pageContext.request.contextPath}/front.do">나의 마인드맵</a>
         </li>
        <li class="on">
            <a href="#" onclick="newMap()">새로운 마인드맵</a>
        </li>
        
       <c:if test="${user.auth eq 'admin' }"> 
	        <li>
	        	<a href="#">게시판 관리</a>
	        	<ul>
	        		<li>
	        			<a href="${pageContext.request.contextPath}/notice.do?bbs_gb=NTC">공지사항</a>
	        		</li>
	        		<li>
	        			<a href="${pageContext.request.contextPath}/notice.do?bbs_gb=QA">Q&A</a>
	        		</li>
	        		<li>
	        			<a href="${pageContext.request.contextPath}/notice.do?bbs_gb=FAQ">FAQ</a>
	        		</li>
	        	</ul>
	        </li>
	        <li>
	        	<a href="${pageContext.request.contextPath}/manual.do" onclick="">사용자 매뉴얼</a>
	        </li>
	        <li>
	        	<a href="${pageContext.request.contextPath}/menuMng.do" onclick="">사용자 메뉴관리</a>
	        </li>
	        <li>
	        	<a href="${pageContext.request.contextPath}/userMngList.do" onclick="">사용자 관리</a>
	        </li>
	        <li>
	        	<a href="#" onclick="">시스템 관리</a>
	        </li>
        </c:if>
        
    </ul>
    
    <div class="board-list">
        <p>
            <a href="${pageContext.request.contextPath}/notice.do?bbs_gb=NTC" >공지사항</a>
        </p>
        <p>
            <a href="${pageContext.request.contextPath}/notice.do?bbs_gb=QA">Q&amp;A</a>
        </p>
        <p>
            <a href="${pageContext.request.contextPath}/notice.do?bbs_gb=FAQ">FAQ</a>
        </p>
    </div>
    <div class="lnb-footer">
        <a href="/guide.do" class="gd">사용가이드</a>
    </div>
</div>