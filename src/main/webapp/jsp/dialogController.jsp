<%@ page contentType="text/html; charset=utf-8" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
/*
 * SimpleModal Basic Modal Dialog
 * http://www.ericmmartin.com/projects/simplemodal/
 * http://code.google.com/p/simplemodal/
 *
 * Copyright (c) 2010 Eric Martin - http://ericmmartin.com
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 *
 */

jQuery(function ($) {
	$('.newmm').click(function (e) {
		//$('#popcontainer').modal();
		//return false;
		
		$.get("${pageContext.request.contextPath}/mindmap/new.do", function(data){
			// create a modal dialog with the data
			$(data).modal({
				closeHTML: "<a href='#' title='Close' class='modal-close'>x</a>",
				position: ["15%"],
				containerCss:{
					height:"320px",
					width:"600px",
					color:"#bbb",
					"background-color":"#fff",
					border:"4px solid #32363F",
					padding:"12px"
				},
				overlayId: 'contact-overlay',
				containerId: 'contact-container'
			});
		});


	});
});