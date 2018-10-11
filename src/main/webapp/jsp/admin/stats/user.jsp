<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="env" uri="http://www.servletsuite.com/servlets/enventry" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<META HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
	<META HTTP-EQUIV="Pragma" CONTENT="no-cache">
	<META HTTP-EQUIV="Expires" CONTENT="0">
		
	<title>Stats</title>
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/admin.css">
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/admin/tables.css">
	
	<link rel="stylesheet" href="${pageContext.request.contextPath}/css/jquery-ui/jquery-ui.custom.css?v=<env:getEntry name="versioning"/>" type="text/css" media="screen">
	
	<script src="${pageContext.request.contextPath}/lib/jquery.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery-ui.min.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
	<script src="${pageContext.request.contextPath}/lib/jquery.ui.monthpicker.js?v=<env:getEntry name="versioning"/>" type="text/javascript" charset="utf-8"></script>
		<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	
	
	<style type="text/css">
	.ui-datepicker {
		font-size: 62.5%;
	}
	
	.stats_tbl {		
		border-top: 1px solid #bbbbbb;
		margin: 5px;
	}
	
	.stats_tbl tr td {
		padding: 5px;
		font-size: 12px;
		color: #666666;
		text-align: center;
		border-bottom: 1px solid #bbbbbb;
		border-left: 1px solid #bbbbbb;
	}
	
	.stats_tbl tr th {
		padding: 5px;
		font-size: 12px;
		color: #333333;
		font-weight: bold;
		text-align: center;
		border-bottom: 1px solid #bbbbbb;
		border-left: 1px solid #bbbbbb;
		background-color: #f3f3f3;
	}
	
	.border_last{
		border-right:1px solid #bbbbbb; 
	}
	
	.dateSep {
		text-decoration:none;
		color: black;
	}
	.dateSelected {		
		color: red;
		font-weight: bold;		
	}
	</style>
	
	<script type="text/javascript">
		google.load("visualization", "1", {packages:["corechart"]});
		//google.setOnLoadCallback(drawChart);
		
		function drawAllUserChart() {
			var data = new google.visualization.DataTable();
			
			data.addColumn('string', 'Day');
			data.addColumn('number', 'Count');
			
			<c:forEach var="userRegister" items="${data.allUserRegisters}">
				data.addRow(["<c:out value="${userRegister.date}"></c:out>", <c:out value="${userRegister.count}"></c:out>]);
			</c:forEach>
						
			var options = {
				title: 'User Registers',
				hAxis: {title: 'Day'},
				'width':600,
                'height':300
			};

			var chart = new google.visualization.AreaChart(document.getElementById('allUserRegisters_chart'));
			chart.draw(data, options);
			
			//////////////////////
			
			var data_addition = new google.visualization.DataTable();
			
			data_addition.addColumn('string', 'Day');
			data_addition.addColumn('number', 'Count');
			
			var amount = 0;
			<c:forEach var="userRegister" items="${data.allUserRegisters}">
				amount += <c:out value="${userRegister.count}"></c:out>;
				data_addition.addRow(["<c:out value="${userRegister.date}"></c:out>", amount]);
			</c:forEach>
						
			var options_addition = {
				title: 'User Registers',
				hAxis: {title: 'Day'},
				colors:['red'],
				'width':600,
                'height':300
			};

			var chart_addition = new google.visualization.AreaChart(document.getElementById('allUserRegisters_chart_addition'));
			chart_addition.draw(data_addition, options_addition);
		}
		
		function drawDayChart(jsonData) {
			var data = new google.visualization.DataTable();
			
			data.addColumn('string', 'Day');
			data.addColumn('number', 'Count');
			
			for(var d in jsonData) {
				if(jsonData[d].date == 'prev') continue;
				data.addRow([jsonData[d].date, jsonData[d].count]);
			}
			
			var options = {
				title: 'User Registers - Day',
				hAxis: {title: 'Day'},
				'width':600,
                'height':300
			};

			var chart = new google.visualization.AreaChart(document.getElementById('day_chart'));
			chart.draw(data, options);
			
			////////////////////
			
			var data_addition = new google.visualization.DataTable();
			
			data_addition.addColumn('string', 'Day');
			data_addition.addColumn('number', 'Count');
			
			var amount = 0;
			for(var d in jsonData) {
				amount += jsonData[d].count;
				data_addition.addRow([jsonData[d].date, amount]);
			}
			
			var options_addition = {
				title: 'User Registers - Day',
				hAxis: {title: 'Day'},
				colors:['red'],
				'width':600,
                'height':300
			};

			var chart_addition = new google.visualization.AreaChart(document.getElementById('day_chart_addition'));
			chart_addition.draw(data_addition, options_addition);
			
		}
		
		function drawMonthChart(jsonData) {
			var data = new google.visualization.DataTable();
			
			data.addColumn('string', 'Month');
			data.addColumn('number', 'Count');
			
			for(var d in jsonData) {
				if(jsonData[d].date == 'prev') continue;
				data.addRow([jsonData[d].date, jsonData[d].count]);
			}
			
			var options = {
				title: 'User Registers - Month',
				hAxis: {title: 'Month'},
				'width':600,
                'height':300
			};

			var chart = new google.visualization.AreaChart(document.getElementById('month_chart'));
			chart.draw(data, options);
			
			////////////////////
			
			var data_addition = new google.visualization.DataTable();
			
			data_addition.addColumn('string', 'Month');
			data_addition.addColumn('number', 'Count');
			
			var amount = 0;
			for(var d in jsonData) {
				amount += jsonData[d].count;
				data_addition.addRow([jsonData[d].date, amount]);
			}
			
			var options_addition = {
				title: 'User Registers - Month',
				hAxis: {title: 'Month'},
				colors:['red'],
				'width':600,
                'height':300
			};

			var chart_addition = new google.visualization.AreaChart(document.getElementById('month_chart_addition'));
			chart_addition.draw(data_addition, options_addition);
		}
		
		function drawYearChart(jsonData) {
			var data = new google.visualization.DataTable();
			
			data.addColumn('string', 'Year');
			data.addColumn('number', 'Count');
			
			for(var d in jsonData) {
				if(jsonData[d].date == 'prev') continue;
				data.addRow([jsonData[d].date, jsonData[d].count]);
			}
			
			var options = {
				title: 'User Registers - Year',
				hAxis: {title: 'Year'},
				'width':600,
                'height':300
			};

			var chart = new google.visualization.AreaChart(document.getElementById('year_chart'));
			chart.draw(data, options);
			
			////////////////////
			
			var data_addition = new google.visualization.DataTable();
			
			data_addition.addColumn('string', 'Year');
			data_addition.addColumn('number', 'Count');
			
			var amount = 0;
			for(var d in jsonData) {
				amount += jsonData[d].count;
				data_addition.addRow([jsonData[d].date, amount]);
			}
			
			var options_addition = {
				title: 'User Registers - Year',
				hAxis: {title: 'Year'},
				colors:['red'],
				'width':600,
                'height':300
			};

			var chart_addition = new google.visualization.AreaChart(document.getElementById('year_chart_addition'));
			chart_addition.draw(data_addition, options_addition);
		}
		
		function loadDay(day, period) {
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/stars/userStats.do',
				data: {'func': 'countDay',
							'day': day,
							'period': period
							},
				success: function(data, textStatus, jqXHR) {
					drawDayChart(data);
					drawTable('day_table', data);
				},
				error: function(data, status, err) {
					alert("loadDay error: " + status);
				}
			});
		}
		
		function loadMonth(month, period) {
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/stars/userStats.do',
				data: {'func': 'countMonth',
							'month': month,
							'period': period
							},
				success: function(data, textStatus, jqXHR) {
					drawMonthChart(data);
					drawTable('month_table', data);
				},
				error: function(data, status, err) {
					alert("loadMonth error: " + status);
				}
			});
		}
		
		function loadYear(year, period) {
			$.ajax({
				type: 'post',
				dataType: 'json',
				async: false,
				url: '${pageContext.request.contextPath}/mindmap/admin/stars/userStats.do',
				data: {'func': 'countYear',
							'year': year,
							'period': period
							},
				success: function(data, textStatus, jqXHR) {
					drawYearChart(data);
					drawTable('year_table', data);
				},
				error: function(data, status, err) {
					alert("loadYear error: " + status);
				}
			});
		}
		
		function drawTable(el, data) {
			var $tb = $('#'+el);
			$tb.empty();
			$tb.append('<tr><th>날짜</th><th>Count</th><th class="border_last">Accrue</th></tr>');
			var amount = 0;
			for(d in data) {
				if(data[d].date == 'prev') continue;
				amount += data[d].count;
				$tb.append('<tr>' +
						'<td>'+data[d].date+'</td>' +
						'<td>'+data[d].count+'</td>' +
						'<td class="border_last">'+amount+'</td>' +
						'</tr>');
			}
			
		}
		
		function createYearCombobox(el, s, c, asc) {
			var currentMonth = parseInt(s);
			c = parseInt(c);
			
			$(el).empty();
			if(asc) {
				for(var i = currentMonth; i < currentMonth + c; i++) {
					if(i == currentMonth) $(el).append('<option value="'+i+'" selected>'+i+'</option>');
					else $(el).append('<option value="'+i+'">'+i+'</option>');
				}
			} else {
				for(var i = currentMonth; i > currentMonth - c; i--) {
					if(i == currentMonth) $(el).append('<option value="'+i+'" selected>'+i+'</option>');
					else $(el).append('<option value="'+i+'">'+i+'</option>');
				}
			}			
		}
		
		function day_result() {
			var from = $("#daypicker_from").val();
			var to = $("#daypicker_to").val();
			
			var fromDate = new Date(from);
			var toDate = new Date(to);
			
			var period = (toDate.valueOf() - fromDate.valueOf()) / (1000 * 3600 * 24)+1;
			loadDay(from, period);
		}
		
		function month_result() {
			var from = $("#monthpicker_from").val();
			var to = $("#monthpicker_to").val();
			
			var fromDate = new Date(from);
			var toDate = new Date(to);
			
			var period = Math.floor((toDate.valueOf() - fromDate.valueOf()) / (1000 * 3600 * 24 * 30))+1;
			//var period = (parseInt(to.split("-")[1]) - parseInt(from.split("-")[1]))+1;
			loadMonth(from, period);
		}
		
		function year_result() {
			var from = parseInt($('#year_combobox_from').val());
			var to = parseInt($('#year_combobox_to').val());
			var period = (to - from)+1;
			loadYear(from, period);
		}
		
		function TabClick(el) {
			var tabs = [$("#content_day"), $("#content_month"), $("#content_year")];
			
			for(var tab in tabs) {
				if(tabs[tab].attr("id") == "content_"+el.id)
					tabs[tab].show();
				else
					tabs[tab].hide();
			}
			
			$('.dateSep').removeClass('dateSelected');
			$(el).addClass('dateSelected');
			
		}
	
		function init_d(){
			var currentYear = new Date().getFullYear();
			createYearCombobox('#year_combobox_from', currentYear-1, 10);
			createYearCombobox('#year_combobox_to', currentYear, 10, true);
			$( "#year_combobox_from" ).change(function(){				
				createYearCombobox('#year_combobox_to', $(this).val(), 10, true);
			});						
			
			
			$("#daypicker_from").datepicker({
				dateFormat: 'yy/mm/dd'
			});
			$("#daypicker_to").datepicker({
				dateFormat: 'yy/mm/dd'
			});
			
			$("#monthpicker_from").monthpicker({
				showOn:     "both",
				buttonImage: "${pageContext.request.contextPath}/images/monthpicker_calendar.png",
				dateFormat: 'yy/mm',
				yearRange: 'c-10:c',
				onSelect: function(date) {
					//loadDay(date, 1);
				}
			});
			$("#monthpicker_to").monthpicker({
				showOn:     "both",
				buttonImage: "${pageContext.request.contextPath}/images/monthpicker_calendar.png",
				dateFormat: 'yy/mm',
				yearRange: 'c-10:c'
			});
			
			var today = new Date ();
			
			//var monthInDigits = today.getMonth () + 1;
			//monthInDigits = ((monthInDigits < 10) ? "0" : "") + monthInDigits;			
			//loadYear(today.getFullYear(), 1);
			//
			
			var _7otherday = new Date(  today.valueOf() -  (1000 * 3600 * 24) * 7  );
			$("#daypicker_from").val(_7otherday.format("yyyy/MM/dd"));			
			$("#daypicker_to").val(today.format("yyyy/MM/dd"));
			loadDay(_7otherday.format("yyyy/MM/dd"), 7);
			
			var _6otherMonth = new Date(  today.valueOf() -  (1000 * 3600 * 24 * 30) * 6  );
			$("#monthpicker_from").val(_6otherMonth.format("yyyy/MM"));
			$("#monthpicker_to").val(today.format("yyyy/MM"));
			loadMonth(_6otherMonth.format("yyyy/MM"), 6);
			
			loadYear(today.getFullYear(), 2);
			
			$("#content_month").hide();
			$("#content_year").hide();
			
			//drawAllUserChart();
			
		}
		$(document).ready(init_d);
	</script>
	
	<script type="text/javascript">
		Date.prototype.format = function(f) {
	    if (!this.valueOf()) return " ";
	 
	    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
	    var d = this;
	     
	    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
	        switch ($1) {
	            case "yyyy": return d.getFullYear();
	            case "yy": return (d.getFullYear() % 1000).zf(2);
	            case "MM": return (d.getMonth() + 1).zf(2);
	            case "dd": return d.getDate().zf(2);
	            case "E": return weekName[d.getDay()];
	            case "HH": return d.getHours().zf(2);
	            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
	            case "mm": return d.getMinutes().zf(2);
	            case "ss": return d.getSeconds().zf(2);
	            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
	            default: return $1;
	        }
	    });
	};
	 
	String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
	String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
	Number.prototype.zf = function(len){return this.toString().zf(len);};
	</script>

</head>
<body>
	<div class="table_box">
	<div class="table_box_title">
			<a id="day" class="dateSep dateSelected" href="#" onclick="TabClick(this)">일별</a> | 
			<a id="month" class="dateSep" href="#" onclick="TabClick(this)">월별</a> | 
			<a id="year" class="dateSep" href="#" onclick="TabClick(this)">년별</a>
	</div>
	<div class="table_box_con">
	<div class="cur_map">총사용자: <a id="total_user"><c:out value="${data.countAllUsers}"/></a></div>
	
	
	
	
	<div id="content_day">
			
		<div class="small_box option">
		<div class="sml_box_title">Option</div>
		<div class="sml_box_con">
			<input type='text' id='daypicker_from'>
			<input type='text' id='daypicker_to'>
			<button onclick="day_result();">확인</button>
		</div>
		
		<table id="day_table" class="stats_tbl" cellspacing="0" cellpadding="0"></table>
		</div>
		
		
		<div class="small_box mapno">
		<div class="sml_box_title">일별 맵수</div>
		<div class="sml_box_con">
		<table>
			<tr>
				<td><div>생성된 유저수</div><div id="day_chart"></div></td>				
			</tr>
			<tr>
				<td><div>전체 유저수</div><div id="day_chart_addition"></div></td>
			</tr>
		</table>
		</div>
		</div>
	</div>
	
	
	
	<div id="content_month">
		<div class="small_box option">
		<div class="sml_box_title">Option</div>
		<div class="sml_box_con">
			<input type='text' id='monthpicker_from'>
			<input type='text' id='monthpicker_to'>
			<button onclick="month_result();">확인</button>
		</div>
		<table id="month_table" class="stats_tbl" cellspacing="0" cellpadding="0"></table>
		</div>
		
		<div class="small_box mapno">
		<div class="sml_box_title">일별 맵수</div>
		<div class="sml_box_con">		
		<table>
			<tr>
				<td><div>생성된 유저수</div><div id="month_chart"></div></td>				
			</tr>
			<tr>
				<td><div>전체 유저수</div><div id="month_chart_addition"></div></td>
			</tr>
		</table>
		</div>
		</div>
	</div>
	
	
	
	
	
	<div id="content_year">
		<div class="small_box option">
		<div class="sml_box_title">Option</div>
		<div class="sml_box_con">
			<select id="year_combobox_from"></select>
			<select id="year_combobox_to"></select>
			<button onclick="year_result();">확인</button>
		</div>		
		<table id="year_table" class="stats_tbl" cellspacing="0" cellpadding="0"></table>
		</div>
		
		<div class="small_box mapno">
		<div class="sml_box_title">일별 맵수</div>
		<div class="sml_box_con">	
		<table>
			<tr>
				<td><div>생성된 유저수</div><div id="year_chart"></div></td>				
			</tr>
			<tr>
				<td><div>전체 유저수</div><div id="year_chart_addition"></div></td>
			</tr>
		</table>
		</div>
		</div>
	</div>		
						
		</div>
	</div>
</body>
</html>
