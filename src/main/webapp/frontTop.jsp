<%@ page contentType="text/html; charset=utf-8" %>

<div class="tp-right-block">
  	<c:if test="${!empty param.returnPage }">
  	<a href="${param.returnPage }" class="arrow-back">맵으로 돌아가기</a>
  	</c:if>
   

   <p><i class="fas fa-user-circle"></i></p>
   <div class="user-block">
       <p class="user-img">
           <img src="${pageContext.request.contextPath}/css/images/user.png" alt="">
       </p>
       <p class="user-nm">
           <strong>${user.username }</strong>
           <span>${user.email }</span>
       </p>
       <ul>
           <li>
               <a href="${pageContext.request.contextPath}/profile.do">
                   <i class="far fa-address-card"></i>
                   프로필관리
               </a>
           </li>
           <li>
               <a href="${pageContext.request.contextPath}/front.do">
                   <i class="fas fa-sitemap"></i>
                   내마인드맵
               </a>
           </li>
       </ul>
       <input type="button" class="btn point w100" value="로그아웃" onclick="okmLogout()">
    </div>
</div>