<%@ page contentType="text/html; charset=utf-8" %>
<%@ page import="java.util.Locale" %>
<%@ page import="org.springframework.web.servlet.support.RequestContextUtils" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<%
request.setAttribute("user", session.getAttribute("user"));

Locale locale = RequestContextUtils.getLocale(request);
request.setAttribute("locale", locale);
String lang = request.getHeader("Accept-Language") == null ? "ko" : request.getHeader("Accept-Language");

%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
		"http://www.w3.org/TR/html4/strict.dtd">
<html>
    <head>
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
		<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
		<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
		<META HTTP-EQUIV="Expires" CONTENT="0">
       
       <title>OKMindmap :: Design Your Mind!</title>
       
       	<!--CSS-->
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/main_style.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
      
        <!--폰트-->
        <link href='http://fonts.googleapis.com/css?family=Noto+Sans:700' rel='stylesheet' type='text/css'>
		<link href='http://api.mobilis.co.kr/webfonts/css/?fontface=NanumGothicWeb' rel='stylesheet' type='text/css' />
		<link href='http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz' rel='stylesheet' type='text/css'>
		<link href='http://api.mobilis.co.kr/webfonts/css/?fontface=NanumBrushWeb' rel='stylesheet' type='text/css' />
		
    	<!--Google API-->
        <script src="http://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
        <script>			
			window.onload = function() {
				new google.translate.TranslateElement({
					pageLanguage: 'ko',
					includedLanguages: 'en,ja,zh-CN,zh-TW,ko',
					layout: google.translate.TranslateElement.InlineLayout.SIMPLE
				}, 'google_translate_element');			
			}
			
			var baseHeight=document.getElementById("boardframe").scrollHeight; 

			function resizeHeight(obj){
				thisHeight=obj.contentWindow.document.body.scrollHeight;

				if(thisHeight>baseHeight){
				obj.height=thisHeight;
				}else{
					obj.height=baseHeight;
				}
			}
		</script>
		
        <!-- The JavaScript -->
        <script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
        <script src="${pageContext.request.contextPath}/lib/jquery.easing.1.3.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
        <script type="text/javascript">
        
			function init(){
				
				// easing
	        	$('ul.nav a').bind('click',function(event){
	                var $anchor = $(this);
	                
	                $('html, body').stop().animate({
	                    scrollTop: $($anchor.attr('href')).offset().top
	                }, 1500,'easeInOutExpo');
	                /*
	                if you don't want to use the easing effects:
	                $('html, body').stop().animate({
	                    scrollTop: $($anchor.attr('href')).offset().top
	                }, 1000);
	                */
	                event.preventDefault();
	            });
				
	        }
	        
	        $(document).ready( init );
        </script>

<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-30732410-1']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
    </head>
 
<body>
	    <div id="pagetitle_re">
	    	<%
 				if(lang.startsWith("ko")){
			%>
					<span>갤러리</span>
			<% }else{ %>	
					<span>Gallery</span>
			<% } %>
            
        </div>
        <div id="ex_mindmap">
			<jsp:include page="/thumbnails/recommend/mainhtml.jsp" />
		</div>
		<div id="re_footer">
		<%
 			if(lang.startsWith("ko")){
		%>
				<div id="tagline">생각의 날개를 펼쳐 줄 <font style="color: #00b4cc; font-weight: 700;">OKMindmap!</font><br>사용할 준비가 되셨나요?</div>
        		<div class="startbutton"><a href="${pageContext.request.contextPath}/index.do" id="button2">시작</a></div>
		<% }else{ %>	
				<div id="tagline">Best knowledge tool <font style="color: #00b4cc; font-weight: 700;">OKMindmap!</font><br>Ready to use?</div>
        		<div class="startbutton"><a href="${pageContext.request.contextPath}/index.do" id="button2">Start</a></div>
		<% } %>
		
		</div>
    	
    <div id="footer">
  		<p><b>주소</b>&nbsp; 대전시 유성구 대덕대로 590번길 12-8 &nbsp;|&nbsp; <b>전화</b>&nbsp;  042 - 867 - 7964 &nbsp;|&nbsp; <b>팩스</b>&nbsp;  042 - 867 - 5964</p>
  		<p>Copyright ⓒ 2014 JinoTech Co. All rights reserved</p>
	</div>
</body>
</html>