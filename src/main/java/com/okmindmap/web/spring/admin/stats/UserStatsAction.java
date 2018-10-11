package com.okmindmap.web.spring.admin.stats;

import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.report.DateCount;
import com.okmindmap.report.StatisticsReport;
import com.okmindmap.service.UserService;
import com.okmindmap.web.spring.BaseAction;

public class UserStatsAction extends BaseAction {
	@Autowired
	private UserService userService;
	private StatisticsReport statisticsReportService;
	
	public void setStatisticsReportService(StatisticsReport statisticsReportService) {
		this.statisticsReportService = statisticsReportService;
	}
	
	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		String func = request.getParameter("func");
		
		User adminuser = getUser(request);
		if(adminuser.getRoleId()!=1){
			HashMap<String, String> data = new HashMap<String, String>();
			data.put("messag", "권한이 없습니다.");
			data.put("url", "/");
			return new ModelAndView("error/index", "data", data);
		}
		
		if("countMonth".equals(func)) {
			String month = request.getParameter("month");
			int period = Integer.parseInt(request.getParameter("period"));
			List<DateCount> dateCount = this.statisticsReportService.getUserRegistersGroupMonth(month, period, "ASC");
			dateCount.add(0, this.statisticsReportService.getMapCreationsAccrue(month+"-01"));
			
			JSONArray json = JSONArray.fromObject(dateCount);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		} else if ("countYear".equals(func)) {
			String year = request.getParameter("year");
			int period = Integer.parseInt(request.getParameter("period"));
			List<DateCount> dateCount = this.statisticsReportService.getUserRegistersGroupYear(year, period, "ASC");
			dateCount.add(0, this.statisticsReportService.getMapCreationsAccrue(year+"-01-01"));
			
			JSONArray json = JSONArray.fromObject(dateCount);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		} else if ("countDay".equals(func)) {
			String day = request.getParameter("day");
			int period = Integer.parseInt(request.getParameter("period"));
			List<DateCount> dateCount = this.statisticsReportService.getUserRegistersGroupDay(day, period, "ASC");
			dateCount.add(0, this.statisticsReportService.getMapCreationsAccrue(day));
			
			JSONArray json = JSONArray.fromObject(dateCount);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		}
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		int countAllUsers = userService.countAllUsers(null);
		data.put("countAllUsers", countAllUsers);
		
		List<DateCount> allUserRegisters = this.statisticsReportService.getUserRegisters(-1, "ASC", "%Y-%m-%d");
		data.put("allUserRegisters", allUserRegisters);
	
		return new ModelAndView("admin/stats/user", "data", data);
	}

}
