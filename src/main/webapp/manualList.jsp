<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<table class="table">
       <colgroup>
           <col width="50px" />
           <col width="50%" />
           <col width="/" />
           <col width="/" />
           <col width="/" />
       </colgroup>
       <thead>
           <tr>
               <th>no</th>
               <th>제목</th>
               <th>작성자명</th>
               <th>작성일</th>
               <th>삭제여부</th>
           </tr>
       </thead>
       <tbody>
       	<c:forEach items="${data.noticeList }" var="row" varStatus="i">
       	<tr>
		    <td>${(data.listCount - i.index) - ( (param.page - 1)  *  10 ) } </td>
		    <td class="text-left">
		        <a href="#" onclick="goNoticeView('${row.id}');">${row.title }</a>
		    </td>
		    <td>${row.regid }</td>
		    <td>${row.created }</td>
		    <td>
		    	<c:choose>
		    		<c:when test="${row.hide eq '0' }">N</c:when>
		    		<c:otherwise>Y</c:otherwise>
		    	</c:choose>
		    </td>
		</tr>
		</c:forEach>
       </tbody>
   </table>
   
   <div class="paging">
   		<c:out value="${data.pagedLink}" escapeXml="false"/>
       <!-- <a href="#" class="prev">prev</a>
       <a href="#" class="on">1</a>
       <a href="#">2</a>
       <a href="#">3</a>
       <a href="#">4</a>
       <a href="#">5</a>
       <a href="#" class="next">prev</a> -->
   </div>