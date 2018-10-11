<%@page import="com.okmindmap.util.PagingHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="search-area">
    <input type="text" name="discussKeyword" id="discussKeyword" value="${param.keyword }" />
    <input type="button" name="sbm01" onclick="getDiscussMasterList();" value="검색" />
</div>
	
<c:if test="${empty data.discussList }">
	<div class="cont-list">
	    <h4 class="cont-header">등록된 토론이 없습니다.</h4>
	    토론주제를 등록하고 의견을 나누세요.
	</div>
</c:if>

<c:if test="${!empty data.discussList }">
    <div class="cont-list">
        <h4 class="cont-header">${data.listCount } Issue opend</h4>
        <ul class="d-list">
        	<c:forEach items="${data.discussList }" var="row" varStatus="i">
        	<li>
                <a href="#" onclick="getDiscussContentList('${row.discuss_seq}' , '${row.title }');">${row.title }</a>
                <span>
                     <i class="far fa-comment"></i>
                     ${row.contentcount }
                </span>
            </li>
        	</c:forEach>
        </ul>
    </div>
</c:if>

<c:if  test="${user.id eq data.leaderid }">
<div class="cont-group">
	<div class="cf-box">
	    <h5>토론만들기</h5>
	    <textarea style="resize: none;" name="discussTitle" id="discussTitle"></textarea>
	    <input type="button" onclick="saveDiscussMaster();" value="만들기" />
	</div>
	<div class="cf-box">
	    <h5>사용자초대</h5>
	    <div class="inline-search">
	        <input type="text" name="discussAddUserEmail" id="discussAddUserEmail" placeholder="이메일을 입력해주세요." />
	        <input type="button" onclick="addDiscussUser();" value="추가" />
	    </div>
	    <p class="cmt">*마인드맵을 사용하는 사용자의 이메일을 입력해주세요.</p>
	</div>
</div>
</c:if>

<script>
$("#__discussUserCount__").text("${data.userCount}");
</script>