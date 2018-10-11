package com.okmindmap.web.spring.admin.stats;

import java.io.OutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.User;
import com.okmindmap.report.DateCount;
import com.okmindmap.report.StatisticsReport;
import com.okmindmap.service.GroupService;
import com.okmindmap.service.MindmapService;
import com.okmindmap.service.ShareService;
import com.okmindmap.web.spring.BaseAction;

public class MapStatsAction extends BaseAction {
	private MindmapService mindmapService;
	private GroupService groupService;
	private ShareService shareService;
	private StatisticsReport statisticsReportService;
	
	public void setStatisticsReportService(StatisticsReport statisticsReportService) {
		this.statisticsReportService = statisticsReportService;
	}

	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}
	
	public void setGroupService(GroupService groupService) {
		this.groupService = groupService;
	}
	
	public void setShareService(ShareService shareService) {
		this.shareService = shareService;
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
			List<DateCount> dateCount = this.statisticsReportService.getMapCreationsGroupMonth(month, period, "ASC");			
			dateCount.add(0, this.statisticsReportService.getMapCreationsAccrue(month+"-01"));
			
			JSONArray json = JSONArray.fromObject(dateCount);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		} else if ("countYear".equals(func)) {
			String year = request.getParameter("year");
			int period = Integer.parseInt(request.getParameter("period"));
			List<DateCount> dateCount = this.statisticsReportService.getMapCreationsGroupYear(year, period, "ASC");
			dateCount.add(0, this.statisticsReportService.getMapCreationsAccrue(year+"-01-01"));
			
			JSONArray json = JSONArray.fromObject(dateCount);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		} else if ("countDay".equals(func)) {
			String day = request.getParameter("day");
			int period = Integer.parseInt(request.getParameter("period"));
			List<DateCount> dateCount = this.statisticsReportService.getMapCreationsGroupDay(day, period, "ASC");
			dateCount.add(0, this.statisticsReportService.getMapCreationsAccrue(day));
			
			JSONArray json = JSONArray.fromObject(dateCount);
			OutputStream out = response.getOutputStream();
			out.write(json.toString().getBytes("UTF-8"));
			out.close();
			return null;
		}
		
		HashMap<String, Object> data = new HashMap<String, Object>();
		
		// 맵
		int countAllMaps = this.mindmapService.countAllMaps(null, null);
		int countGuestMaps = this.mindmapService.countGuestMaps(null, null);
		int countPublicMaps = this.mindmapService.countPublicMaps(1, null, null);
		
		data.put("countAllMaps", countAllMaps);
		data.put("countGuestMaps", countGuestMaps);
		data.put("countPublicMaps", countPublicMaps);
		
		// 쉐어 맵
		//this.shareService.countShares(userId, search);
		
		// 그룹
		int countAllGroups = this.groupService.countAllGroups();
		data.put("countAllGroups", countAllGroups);
		
		return new ModelAndView("admin/stats/map", "data", data);
	}

}
