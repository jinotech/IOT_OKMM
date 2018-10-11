<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<table class="table">
    <colgroup>
        <col width="/" />
        <col width="20%" />
        <col width="20%" />
        <col width="20%" />
        <col width="/" />
    </colgroup>
    <thead>
        <tr>
            <th>메뉴명</th>
            <th>이미지 URL</th>
            <th>메세지 코드</th>
           <th> 스크립트 함수</th>
            <th>사용여부</th>
        </tr>
    </thead>
    <tbody>
    	<c:forEach items="${data.menuMngList }" var="row" varStatus="i">
        <tr>
            <td>${row.name }</td>
            <td class="text-left">
                ${row.imgurl }
            </td>
            <td class="text-left">
                ${row.message }
            </td>
            <td class="text-left">
                ${row.script }
            </td>
            <td>
            	
                <label>
                    <input type="radio" name="rd01${i.count }" onclick="saveUseyn('${row.seq }','Y');" <c:if test="${row.useyn eq 'Y' }">checked</c:if> /> 사용
                </label>
                <label>
                    <input type="radio" name="rd01${i.count }" onclick="saveUseyn('${row.seq }','N');" <c:if test="${row.useyn ne 'Y' }">checked</c:if> /> 미사용
                </label>
            </td>
        </tr>
        </c:forEach>
    </tbody>
</table>