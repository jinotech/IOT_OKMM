<%@ page contentType="text/html; charset=UTF-8" %>
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

<!DOCTYPE HTML>
<html>
    <head>
    	<meta charset="utf-8">
        <META HTTP-EQUIV="Content-Type" CONTENT="text/html;">
		<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
		<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
		<META HTTP-EQUIV="Expires" CONTENT="0">
		
		
       <title>OKMindmap :: Design Your Mind!</title>
       
       	<meta property="og:type" content="website">
		<meta property="og:title" content="OKMindmap">
		<meta property="og:description" content="Design Your Mind!">
		<meta property="og:url" content="http://open.jinotech.com:8088/">
		<meta property="og:image" content="http://open.jinotech.com:8088/okmmkakao.JPG">
       
       	<!--CSS-->
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/main_style.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/reset.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
       	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/style_vertical.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
      
        <!--폰트-->
        <link href='http://fonts.googleapis.com/css?family=Noto+Sans:700' rel='stylesheet' type='text/css'>
        <link href='${pageContext.request.contextPath}/webfont.css' rel='stylesheet' type='text/css' />
		<link href='http://fonts.googleapis.com/css?family=Yanone+Kaffeesatz' rel='stylesheet' type='text/css'>
		
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
<%
 	if(lang.startsWith("ko")){
%>
		<%@include file="login.jsp" %>
<% 
 	}else{
%>
 		<%@include file="main_en.jsp" %>
<%  		
 	}
 %>
       
<div id="footer">
    <p><b>주소</b>&nbsp; 대전시 유성구 대덕대로 590번길 12-8 &nbsp;|&nbsp; <b>전화</b>&nbsp;  042 - 867 - 7964 &nbsp;|&nbsp; <b>팩스</b>&nbsp;  042 - 867 - 5964</p>
    <p>Copyright ⓒ 2014 JinoTech Co. All rights reserved</p>
</div>
<!-- Start of StatCounter Code for Default Guide -->
<script type="text/javascript">
var sc_project=7775078; 
var sc_invisible=1; 
var sc_security="aab0f358"; 
</script>
<script type="text/javascript" 
src="http://www.statcounter.com/counter/counter.js"></script>
<noscript><div class="statcounter"><a title="tumblr
tracker" href="http://statcounter.com/tumblr/" 
target="_blank"><img class="statcounter" 
src="http://c.statcounter.com/7775078/0/aab0f358/1/" 
alt="tumblr tracker"></a></div></noscript>
<!-- End of StatCounter Code for Default Guide -->

    </body>
</html>