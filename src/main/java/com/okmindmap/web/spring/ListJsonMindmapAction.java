package com.okmindmap.web.spring;

import java.io.OutputStream;
import java.util.Base64;
import java.util.Base64.Decoder;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Map;
import com.okmindmap.service.MindmapService;

import io.jsonwebtoken.ClaimJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import net.sf.json.JSONArray;

public class ListJsonMindmapAction  extends BaseAction{
	
	private static final String SALT =  "okmmSecret";
	
	private MindmapService mindmapService;
	
	
	public void setMindmapService(MindmapService mindmapService) {
		this.mindmapService = mindmapService;
	}

	@Override
	public ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		HashMap<String, Object> data = new HashMap<String, Object>();
		/*User user = getUser(request);
		data.put("user", user);*/
		
		HashMap<String, Object> jwtMap = jwtSignature(request);
		boolean isOK = Boolean.valueOf(jwtMap.get("isOk").toString());
		
		if(isOK) {
			int page = ServletRequestUtils.getIntParameter(request, "page", 1);
			int sharetype = ServletRequestUtils.getIntParameter(request, "sharetype", 1);
			
			int pagelimit = 10;
			String search = ServletRequestUtils.getStringParameter(request, "search");
			String searchfield = ServletRequestUtils.getStringParameter(request, "searchfield");
			
			String sort = ServletRequestUtils.getStringParameter(request, "sort", "created");
			boolean isAsc = ServletRequestUtils.getBooleanParameter(request, "isAsc", false);
			// param으로 넘어온 값으로 맵 선택
			// param : user, myshares, 
			String mapType = ServletRequestUtils.getStringParameter(request, "maptype");
			/*if(mapType == null){
				mapType = user.getUsername().equals("guest")?"public":"user";
			}*/
			data.put("sort", sort);
			data.put("mapType", mapType);
			data.put("isAsc", isAsc);
			data.put("sharetype", sharetype);
			data.put("searchfield", searchfield);
			data.put("search", search);
			
			int totalMaps =  0;
			List<Map> maps = mindmapService.getAllMaps(sharetype, page, pagelimit, searchfield, search, sort, isAsc);
			totalMaps = mindmapService.countAllMaps(sharetype, searchfield,search);
			data.put("isOk", "ok");
			//data.put("maps", maps);
			data.put("pages", pages(totalMaps, pagelimit));
			
			JSONArray jsonArray = new JSONArray();
			data.put("mapList", jsonArray.fromObject(maps));
		}else {
			data.put("isOk", "fail");
			data.put("msg", jwtMap.get("msg"));
		}	
		
		response.setContentType("text/html;charset=UTF-8"); 
		OutputStream out = response.getOutputStream();
		out.write(new JSONObject(data).toString().getBytes("UTF-8"));
		out.close();
		return null;
	}
	
	/**
	 * JWT 인증.
	 * @param request
	 * @return
	 * @throws Exception
	 */
	private HashMap<String, Object> jwtSignature(HttpServletRequest request) throws Exception{
		HashMap<String, Object> rMap = new HashMap<String, Object>();
		boolean isOk = false;
		String returnMsg = "OK";
		String decodedString = "";
		String code = "";
		
		try {

			Cookie[] cookies = request.getCookies();
			if (cookies != null) {
			    for (Cookie cookie : cookies) {
			        if("okmm_jwt".equals(cookie.getName())){
			        	code = cookie.getValue();
			        }
			    }
			}
	        
			Decoder decoder = Base64.getDecoder();
			byte[] decodedBytes = decoder.decode(code);
			decodedString = new String(decodedBytes, "UTF-8");

			Jwts.parser().setSigningKey(SALT.getBytes("UTF-8")).parseClaimsJws(decodedString);
			
			isOk = true;
			
			rMap.put("isOk", isOk);
			rMap.put("msg", returnMsg);
			
		} catch (SignatureException se) {
			System.out.println("인증 실패");
			rMap.put("msg", "인증 실패");
			rMap.put("isOk", isOk);
		} catch (MalformedJwtException mje) {
			System.out.println("구조적 문제 JWT");	
			rMap.put("msg", "구조적 문제");
			rMap.put("isOk", isOk);
		} catch (ExpiredJwtException eje) {
			System.out.println("유효기간이 지남");
			rMap.put("msg", "유효기간이 지남");
			rMap.put("isOk", isOk);
		} catch (UnsupportedJwtException uje) {
			System.out.println("JWT 형식이 맞지 않음");
			rMap.put("msg", "형식이 맞지 않음");
			rMap.put("isOk", isOk);
		} catch (ClaimJwtException cje) {
			System.out.println("JWT 권한claim 검사가 실패");
			rMap.put("msg", "권한claim 검사가 실패");
			rMap.put("isOk", isOk);
		} catch (IllegalArgumentException iae) {
			System.out.println("encode 조작");
			rMap.put("msg", "encode 조작");
			rMap.put("isOk", isOk);
		}
		
		return  rMap;
	}
	
	// page 갯수 계산 
	private int pages(int total, int pagelimit) {
		int extra = total % pagelimit;
        
        if ( extra > 0 ){           
            return (total - extra )/pagelimit + 1;
        } else {
            return total/pagelimit;
        }
	}
}
