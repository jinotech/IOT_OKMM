<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<ul class="guide-list">
	<c:if test="${not empty guideList}">
		<c:forEach var="tmp" items="${guideList }">
			<li>
				<div class="img-area">
					<img src="${tmp.filepath}" alt="" />
				</div>
				<div class="txt-area">
					<h5>${tmp.title }</h5>
					${tmp.content }
				</div>
			</li>
		</c:forEach>
	</c:if>
</ul>