<%@page import="com.okmindmap.util.PagingHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<div class="prev-btn">
    <span onclick="javascript:getDiscussMasterList();"><i class="fas fa-angle-left"></i> LIST</span>
</div>
<h6>팀장</h6>

<c:forEach items="${data.userList }" var="row">
<c:if test="${row.leaderyn eq 'Y' }">
<div class="scroll-table">
    <table class="list-table">
        <thead>
            <tr>
                <th>이름</th>
                <th>아이디</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${row.firstname }</td>
                <td>${row.email }</td>
            </tr>
        </tbody>
    </table>
</div>
</c:if>
</c:forEach>

<h6>팀원</h6>
 <div class="scroll-table">
    <table class="list-table">
        <thead>
            <tr>
                <th>이름</th>
                <th>아이디</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
        	<c:forEach items="${data.userList }" var="row">
        	<c:if test="${row.leaderyn ne 'Y' }">
            <tr class="__userCnt__">
                <td>${row.firstname }</td>
                <td>${row.email }</td>
                <td>
                	<c:if  test="${user.id eq data.leaderid }">
                    <a href="#" onclick="deleteDiscussUser('${row.id}');" class="btn">삭제</a>
                    </c:if>
                </td>
            </tr>
            </c:if>
            </c:forEach>
        </tbody>
    </table>
</div>


<c:if  test="${user.id eq data.leaderid }">
<div class="cont-group">
    <div class="cf-box">
        <h5>사용자 초대</h5>
        <div class="radio-group">
            <label>
                <input type="radio" name="discussUserSearchType" value="id" onclick="javascript:$('#__id__').show();$('#__mail__').hide();$('#discussUserSearchKeyword').val('');$('#discussAddUserEmail').val('');" checked/>
                사용자 검색후 초대
            </label>
            <label>
                <input type="radio" name="discussUserSearchType" value="email" onclick="javascript:$('#__id__').hide();$('#__mail__').show();$('#discussUserSearchKeyword').val('');$('#discussAddUserEmail').val('');" />
                이메일 입력초대
            </label>
        </div>
        <div class="toggle-cont">
            <div id="__id__" class="on">
                 <div class="inline-search">
                    <input type="text" name="discussUserSearchKeyword" id="discussUserSearchKeyword" value="${param.keyword }" placeholder="아이디/이메일을 입력해주세요." />
                    <input type="button" onclick="getDiscussUserSearchList();" value="검색" />
                </div>
                <div class="scroll-table" id="__discussUserSearchList__">
                </div>
            </div>
            <div id="__mail__">
                <div class="inline-search">
                    <input type="text" name="discussAddUserEmail" id="discussAddUserEmail" placeholder="이메일을 입력해주세요." />
                    <input type="submit" onclick="addDiscussUser('searchUser');" value="추가" />
                </div>
                <p class="cmt">*마인드맵을 사용하는 사용자의 이메일을 입력해주세요.</p>
            </div>
        </div>
    </div>
</div>
</c:if>



<script>
<c:if test="${!empty param.keyword}">
getDiscussUserSearchList();
</c:if>
</script>