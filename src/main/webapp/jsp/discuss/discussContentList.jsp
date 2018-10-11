<%@page import="com.okmindmap.util.PagingHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>


<div class="prev-btn">
    <span onclick="javascript:getDiscussMasterList();"><i class="fas fa-angle-left"></i> LIST</span>
</div>
<div class="cont-list scroll">
    <h4 class="cont-header">
        ${param.title }
        <span>
            <i class="far fa-comment"></i>
            ${fn:length(data.discussList) }
       </span>
    </h4>
    <ul class="comment">
    	<c:forEach items="${data.discussList }" var="row" varStatus="i">
    	<li>
            <p class="cont-header">
                ${row.firstname } ${row.created }
            </p>
            <p class="cont">
                ${row.content }
            </p>
        </li>
    	</c:forEach>
    </ul>
</div>

<div class="cont-group">
    <div class="cf-box">
        <h5>Write</h5>
        <textarea name="discusscontent" id="discusscontent"></textarea>
        <div class="btn-group">
        	<c:if test="${data.discussmemberyn eq 'Y' }">
            <input type="button" value="write" onclick="javascript:saveDiscussContent();" />
            </c:if>
            <input type="button" value="cancel" onclick="javascript:getDiscussMasterList();" />
        </div>
    </div>
</div>

<input type="hidden" name="contentDiscussSeq" id="contentDiscussSeq" value="${param.discuss_seq }" />
<input type="hidden" name="contentDiscussTitle" id="contentDiscussTitle" value="${param.title }" />