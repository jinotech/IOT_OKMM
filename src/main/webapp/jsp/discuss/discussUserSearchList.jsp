<%@page import="com.okmindmap.util.PagingHelper"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<table class="list-table">
    <thead>
        <tr>
            <th>이름</th>
            <th>아이디</th>
            <th>추가</th>
        </tr>
    </thead>
    <tbody>
    	<c:forEach items="${data.userList }" var="row">
        <tr>
            <td>${row.username }</td>
            <td>${row.email }</td>
            <td>
            	<c:if test="${empty row.mapid }">
				<a href="#" onclick="addDiscussUser('searchUserKeyword','${row.id}');" class="btn">추가</a>
				</c:if>
            </td>
        </tr>
        </c:forEach>
    </tbody>
</table>