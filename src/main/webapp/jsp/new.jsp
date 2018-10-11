<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/okmindmap.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/opentab.css" type="text/css" media="screen">
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/simplemodal.css" type="text/css">
<script src="${pageContext.request.contextPath}/lib/jquery.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/koottam/jquery.koottam.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js" type="text/javascript" charset="utf-8"></script>
<script src="${pageContext.request.contextPath}/lib/slimScroll.min.js" type="text/javascript" charset="utf-8"></script>

<title><spring:message code='message.newmap'/></title>

<style type="text/css">
	/* active tab uses a id name ${data.tabidx}. its highlight is also done by moving the background image. */
	ul.tabs a#${data.tabidx}, ul.tabs a#${data.tabidx}:hover, ul.tabs li#${data.tabidx} a {
	background-position: -420px -62px;
	cursor:default !important;
	color:#000 !important;
	}

	.search{
		text-align:right;
		margin-bottom:5px;
	}
	.pagenum{
		padding-top:10px; padding-bottom:10px;
	}

	th a {
		color:#ffffff;
	}
	 .<c:out value="${data.sort}"/><c:out value="${data.isAsc}"/>{
		color:yellow; font-weight:bold; font-size:1.2em;
	}
	
	textarea{
		background: #f2f2f2;
	    border: 1px solid #ccc;
	    border-radius: 3px;
	    box-shadow: inset 1px 1px 3px #ccc;
	    -moz-box-shadow: inset 1px 1px 3px #ccc;
	    -webkit-box-shadow: inset 1px 1px 3px #ccc;
	    color: #333;
	    font-size: 12px;
	    padding: 3px;
	    margin: 2px;
	}
	.btn-success {
		background-color: rgb(23, 183, 13) !important;
	}
</style>

	<script type="text/javascript">
		function check(frm) {
			var title = frm.title.value;
			
			frm.title.value = trimAll(title);
			if( !validateNotEmpty(title) ) {
				alert("<spring:message code='map.new.enter_title'/>");
				frm.title.focus();
				return false;
			}
			if( !isDuplicateMapName(title) ) {
				alert("<spring:message code='message.mindmap.new.duplicate.mapName'/>");
				frm.title.focus();
				return false;
			}
			
			
			<c:if test="${user.username eq 'guest'}">
			var email_t = frm.email.value;
			frm.email.value = trimAll(email_t);
			if( !validateNotEmpty(email_t) ) {
				alert("<spring:message code='map.new.enter_email'/>");
				frm.email.focus();
				return false;
			}	
			
			var password_t = frm.password.value;
			frm.password.value = trimAll(password_t);
			if( !validateNotEmpty(password_t) ) {
				alert("<spring:message code='map.new.enter_password'/>");
				frm.password.focus();
				return false;
			}	
			
			</c:if>

			// email과 password를 입력한 경우는 email, password 를 입력하는 페이지로 이동함으로
			// 현재 창을 닫지 않는다. 그 외에는 창을 닫도록 target을 "_parent"로 한다.
			if(    (frm.email == undefined || frm.password == undefined)
				|| ( trimAll(frm.email.value) == "" || trimAll(frm.password.value) == "" ) ) {
					frm.target = "_parent";
			} else {
				// email 형식이 맞는지 체크한다.
				if(!validateEmail(trimAll(frm.email.value))) {
					alert("<spring:message code='user.new.email_not_valid'/>");

					frm.email.focus();

					return false;
				}
			}

			<c:if test="${data.maptype eq 'moodle' and data.tabidx eq 'frm'}">
			if(!create_moodle(frm.title.value, frm.shortname.value, frm.category.value, frm.summary.value)) return false;
			</c:if>

			return true;
		}
		
		function isDuplicateMapName(mapTitle) {
			var params = {
				"mapTitle": mapTitle
			};
			var returnV = false;
			$.ajax({
					type: 'post',
					url: "${pageContext.request.contextPath}/mindmap/isDuplicateMapName.do",
					dataType: 'json',
					data: params,
					async: false,
					success: function (data) {
						if(data.status == "ok") {
							returnV = true;
							
						} else {
							returnV = false;
							
						}
					}
				}
			);
			return returnV;
		}

		function validateEmail(mail) {
			var reg = new RegExp(/^[A-Za-z0-9]([A-Za-z0-9_-]|(\.[A-Za-z0-9]))+@[A-Za-z0-9](([A-Za-z0-9]|(-[A-Za-z0-9]))+)\.([A-Za-z]{2,6})(\.([A-Za-z]{2}))?$/);

			if(!reg.test(mail) || mail == "") {
				return false;
			} else {
				return true;
			}
		}

		function validateNotEmpty( strValue ) {
			var strTemp = strValue;

			strTemp = trimAll(strTemp);
			if(strTemp.length > 0){
				return true;
			}

			return false;
		}

		function trimAll( strValue ) {
			var objRegExp = /^(\s*)$/;

			//check for all spaces
			if(objRegExp.test(strValue)) {
				strValue = strValue.replace(objRegExp, '');

				if( strValue.length == 0)
					return strValue;
			}

			//check for leading & trailing spaces
			objRegExp = /^(\s*)([\W\w]*)(\b\s*$)/;
			if(objRegExp.test(strValue)) {
				//remove leading and trailing whitespace characters
				strValue = strValue.replace(objRegExp, '$2');
			}

			return strValue;
		}
		
		function cancel(){
			parent.$("#dialog").dialog("close");
		}
		
		function create_moodle(title, shortname, category, summary){
			var params = {
				create_moodle: true,
				title: title,
				shortname: shortname,
				category: category,
				summary: summary
			};
			var returnV = false;
			window.parent.JinoUtil.waitingDialog("");
			$.ajax({
				type: 'post',
				url: "${pageContext.request.contextPath}/mindmap/new.do",
				dataType: 'json',
				data: params,
				async: false,
				success: function (data) {
					if(data.status == "ok") {
						document.frm_confirm.moodleCourseId.value = data.course;
						returnV = true;
					} else {
						alert(data.message);
						returnV = false;
						
					}
					window.parent.JinoUtil.waitingDialogClose();
				}
			});
			return returnV;
		}
		
		function goPage(v_curr_page){
		    var frm = document.searchf;
		    frm.page.value = window.Math.max(1,v_curr_page);
		    frm.submit();
		}

		function goSearch(){
			var frm = document.searchf;
		    frm.page.value = 1;
		    frm.submit();
		}
		
		function doConnect(id, title){
			var frm = document.frm_confirm;
			frm.moodleCourseId.value = id;
			frm.title.value = title;
			$('#tblCourses').hide();
			$('#frmConnect').show();
		}
		
		function backToCourses(){
			$('#tblCourses').show();
			$('#frmConnect').hide();
		}
		
		function doOpenMindmap(map_key){
			if(map_key == '') {
				alert('Not found map_key');
				return;
			}
			window.parent.document.location.href = "${pageContext.request.contextPath}/map/" + map_key;
		}
	</script>

</head>
<body>
	
	<c:if test="${data.message eq ''}">
		<c:if test="${data.maptype ne 'moodle'}">
			<div id='newmap-body'>
				<div class="newmap_con">
					<form id="frm_confirm" name="frm_confirm" action="${pageContext.request.contextPath}/mindmap/new.do" onsubmit="return check(this);" method="post">
						<div id='newmap-content'>
							<table class="map-new" width="100%" border="0" cellspacing="0" cellpadding="0" class="jinotable">
								<tr>
									<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.title'/></span></td>
									<td class="map-new-input nobody"><input type="text" class="user-login-input" name="title" value="" /></td>
								</tr>
									
								<c:if test="${user.username eq 'guest'}">
									<tr>
										<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.email'/></span></td>
										<td class="map-new-input nobody"><input type="text" class="user-login-input" name="email" value="" /></td>
									</tr>
									<tr>
										<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.password'/></span></td>
										<td class="map-new-input nobody"><input type="text" class="user-login-input" name="password" value="" /></td>
									</tr>
								</c:if>
								<tr>
									<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.mapstyle'/></span></td>
									<td class="map-new-input nobody">
										<div id="newmap-style">
											<select id="mapstyle" name="mapstyle">
												<option value="jMindMapLayout"><spring:message code='common.mapstyle.mindmap'/></option>
												<option value="jTreeLayout"><spring:message code='common.mapstyle.tree'/></option>
												<option value="jFishboneLayout"><spring:message code='common.mapstyle.fishbone'/></option>
												<!-- <option value="jBrainLayout"><spring:message code='common.mapstyle.brain'/></option> -->
											</select>
										</div>						
									</td> 
								</tr>
								<tr style="padding-top:15px">
									<td class="map-new-label nobody"></td><td class="map-new-input nobody" ><span style="padding-left:6px;"><input type="checkbox" id="openmap" checked name="openmap" value="1"><label for="openmap">&nbsp;&nbsp;<spring:message code='message.mindmap.new.sharemymap'/></label></span></td>
								</tr>
							</table>
						</div>
						<div class="btncenter">
							<input type="submit" class="create_btn" value="<spring:message code='button.apply'/>" />
						</div>
					</form>
				</div>
			</div>
		</c:if>
		
		<c:if test="${data.maptype eq 'moodle'}">
			<div class="openmapwrap">
				<!-- the tabs -->
				<ul class="tabs">
					<li><a id="frm" href="${pageContext.request.contextPath}/mindmap/new.do?type=moodle&tab=frm">New course</a></li>
					<li><a id="tbl" href="${pageContext.request.contextPath}/mindmap/new.do?type=moodle&tab=tbl">Course list</a></li>
				</ul>
				
				<div class="panes">
					<c:choose>
						<c:when test="${data.tabidx eq 'frm'}">
							<div id='newmap-body'>
								<div class="newmap_con">
									<form id="frm_confirm" name="frm_confirm" action="${pageContext.request.contextPath}/mindmap/new.do" onsubmit="return check(this);" method="post">
										<input type="hidden" name="moodleCourseId">
											
										<div id='newmap-content'>
											<table class="map-new" width="100%" border="0" cellspacing="0" cellpadding="0" class="jinotable">
												<tr>
													<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.title'/></span></td>
													<td class="map-new-input nobody"><input type="text" class="user-login-input" name="title" value="" /></td>
												</tr>
												
												<tr>
													<td class="map-new-label nobody"><span style="padding-left:6px;">Shortname</span></td>
													<td class="map-new-input nobody"><input type="text" class="user-login-input" name="shortname" value="" /></td>
												</tr>
												
												<c:if test="${user.username eq 'guest'}">
													<tr>
														<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.email'/></span></td>
														<td class="map-new-input nobody"><input type="text" class="user-login-input" name="email" value="" /></td>
													</tr>
													<tr>
														<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.password'/></span></td>
														<td class="map-new-input nobody"><input type="text" class="user-login-input" name="password" value="" /></td>
													</tr>
												</c:if>
												<tr>
													<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.mapstyle'/></span></td>
													<td class="map-new-input nobody">
														<div id="newmap-style">
															<select id="mapstyle" name="mapstyle">
																<option value="jMindMapLayout"><spring:message code='common.mapstyle.mindmap'/></option>
																<option value="jTreeLayout"><spring:message code='common.mapstyle.tree'/></option>
																<option value="jFishboneLayout"><spring:message code='common.mapstyle.fishbone'/></option>
																<!-- <option value="jBrainLayout"><spring:message code='common.mapstyle.brain'/></option> -->
															</select>
														</div>						
													</td> 
												</tr>
												<tr style="padding-top:15px">
													<td class="map-new-label nobody"></td><td class="map-new-input nobody" ><span style="padding-left:6px;"><input type="checkbox" id="openmap" checked name="openmap" value="1"><label for="openmap">&nbsp;&nbsp;<spring:message code='message.mindmap.new.sharemymap'/></label></span></td>
												</tr>
												
												<tr>
													<td class="map-new-label nobody"><span style="padding-left:6px;">Category</span></td>
													<td class="map-new-input nobody">
														<div id="newmap-style">
															<select id="category" name="category">
																<c:forEach var="category" items="${data.categories}">
																	<option value="${category.id}">
																		<c:forEach var = "i" begin = "1" end = "${category.depth}">
																			-
																		</c:forEach>
																		${category.name}
																	</option>
																</c:forEach>
															</select>
														</div>						
													</td> 
												</tr>
												<tr>
													<td class="map-new-label nobody"><span style="padding-left:6px;">Summary</span></td>
													<td class="map-new-input nobody"><textarea rows="4" cols="50" class="user-login-input" name="summary" value=""></textarea></td>
												</tr>
											</table>
										</div>
									
										<div class="btncenter">
											<input type="submit" class="create_btn" value="<spring:message code='button.apply'/>" />
										</div>
									</form>
								</div>
							</div>
						</c:when>
						<c:when test="${data.tabidx eq 'tbl'}">
							<div id="tblCourses">
								<div class="search">
									<form method=post name="searchf" onsubmit="goSearch()">
										<input type = "text" name="search" class="group_search_input" value="${data.search}">
										<input type="hidden" name="page" value="${data.page}">
										<input type="hidden" name="type" value="${data.maptype}">
										<input type="hidden" name="tab" value="${data.tabidx}">
										<input type="submit" class="search_btn" value="<spring:message code='common.search'/>">
									</form>
								</div>
								
								<table width="540" cellspacing="0" cellpadding="5">
									<tr>
										<th>Course name</th>
										<th></th>
										<th style="width: 100px;"></th>
									</tr>
									
									<c:if test="${fn:length(data.courses)<1}">
										<tr height=28>
											<td colspan="2" align="center">
												No courses yet.
											</td>
										</tr>
									</c:if>
									<c:forEach var="course" items="${data.courses}">
										<c:if test="${course.is_teacher eq '1' and course.map_key eq ''}">
										<tr>
											<td><c:out value="${course.fullname}"/></td>
											<td align="center">(1)</td>
											<td align="right">
												<input type="button" value="Connect" class="btn-success" onclick="doConnect(${course.id}, '${course.fullname}')">
											</td>
										</tr>
										</c:if>
									</c:forEach>
									
									<c:forEach var="course" items="${data.courses}">
										<c:if test="${course.is_teacher eq '1' and course.map_key ne ''}">
										<tr>
											<td><c:out value="${course.fullname}"/></td>
											<td align="center">(2)</td>
											<td align="right">
												<input type="button" value="Open" class="btn-success" onclick="doOpenMindmap('${course.map_key}')">
											</td>
										</tr>
										</c:if>
									</c:forEach>
									
									<c:forEach var="course" items="${data.courses}">
										<c:if test="${course.is_teacher eq '0'}">
										<tr>
											<td><c:out value="${course.fullname}"/></td>
											<td align="center">(3)</td>
											<td align="right"></td>
										</tr>
										</c:if>
									</c:forEach>
									
								</table>
								<c:if test="${fn:length(data.courses)>=1}">
								<p>(1) Great! You are the teacher of the course. Connect now ...</p>
								<p>(2) This course has been connected to mindmap. Open now...</p>
								<p>(3) You can't connect, because you are not teacher of this course.</p>
								</c:if>
								<div class="pagenum" style="text-align:center;">
									<input type="button" value="Prev" onclick="goPage(${data.page - 1})" />
									<input type="button" value="Next" onclick="goPage(${data.page + 1})" />
								</div>
							</div>
							
							<div id='frmConnect' style="display: none;">
								<div class="newmap_con">
									<form id="frm_confirm" name="frm_confirm" action="${pageContext.request.contextPath}/mindmap/new.do" onsubmit="return check(this);" method="post">
										<input type="hidden" name="moodleCourseId">
											
										<div id='newmap-content'>
											<table class="map-new" width="100%" border="0" cellspacing="0" cellpadding="0" class="jinotable">
												<tr>
													<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.title'/></span></td>
													<td class="map-new-input nobody"><input type="text" class="user-login-input" name="title" value="" /></td>
												</tr>
												
												<c:if test="${user.username eq 'guest'}">
													<tr>
														<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.email'/></span></td>
														<td class="map-new-input nobody"><input type="text" class="user-login-input" name="email" value="" /></td>
													</tr>
													<tr>
														<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.password'/></span></td>
														<td class="map-new-input nobody"><input type="text" class="user-login-input" name="password" value="" /></td>
													</tr>
												</c:if>
												<tr>
													<td class="map-new-label nobody"><span style="padding-left:6px;"><spring:message code='common.mapstyle'/></span></td>
													<td class="map-new-input nobody">
														<div id="newmap-style">
															<select id="mapstyle" name="mapstyle">
																<option value="jMindMapLayout"><spring:message code='common.mapstyle.mindmap'/></option>
																<option value="jTreeLayout"><spring:message code='common.mapstyle.tree'/></option>
																<option value="jFishboneLayout"><spring:message code='common.mapstyle.fishbone'/></option>
																<!-- <option value="jBrainLayout"><spring:message code='common.mapstyle.brain'/></option> -->
															</select>
														</div>						
													</td> 
												</tr>
												<tr style="padding-top:15px">
													<td class="map-new-label nobody"></td><td class="map-new-input nobody" ><span style="padding-left:6px;"><input type="checkbox" id="openmap" checked name="openmap" value="1"><label for="openmap">&nbsp;&nbsp;<spring:message code='message.mindmap.new.sharemymap'/></label></span></td>
												</tr>
											</table>
										</div>
									
										<div class="btncenter">
											<input type="submit" class="create_btn" value="<spring:message code='button.apply'/>" />
											<input type="button" class="create_btn" onclick="backToCourses()" value="<spring:message code='button.cancel'/>" />
										</div>
									</form>
								</div>
							</div>
							
						</c:when>
					</c:choose>
				</div>
			</div>
		</c:if>	
	</c:if>
	
	<c:if test="${data.message ne ''}">
		<h3 style="margin: 100px;">${data.message}</h3>
	</c:if>
	
</body>
</html>