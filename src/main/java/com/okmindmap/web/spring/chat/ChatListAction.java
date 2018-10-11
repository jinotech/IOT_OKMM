package com.okmindmap.web.spring.chat;

import java.io.BufferedOutputStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JSONSerializer;

import org.springframework.web.bind.ServletRequestUtils;
import org.springframework.web.servlet.ModelAndView;

import com.okmindmap.model.Chat;
import com.okmindmap.service.ChatService;
import com.okmindmap.web.spring.BaseAction;

public class ChatListAction extends BaseAction {

	private ChatService chatService;

	
	public void setChatService(ChatService chatService) {
		this.chatService = chatService;
	}


	@Override
	public ModelAndView handleRequest(HttpServletRequest request,
			HttpServletResponse response) throws Exception {
		
		
		BufferedOutputStream out = new BufferedOutputStream(response.getOutputStream());
		
		//User user = getUser(request);
		//data.put("user", user);
		
		//권한 체크를 한번더 해야 한다.
		
		
		
		int roomnumber = ServletRequestUtils.getIntParameter(request, "roomnumber", 0);
		int lastIdx = ServletRequestUtils.getIntParameter(request, "lastIdx", 0);
		int amount = ServletRequestUtils.getIntParameter(request, "amount", 10);
		
		
		if(roomnumber<1||lastIdx<0||amount<0){
			out.write(toBytes("{\"status\":\"error\", \"message\":\"Error\"}"));
		}else{
			List<Chat> chats = chatService.getMessages(roomnumber, lastIdx, amount);
			

			/*JSONObject jsonObj = new JSONObject();
			
			jsonObj = JSONObject.fromObject(JSONSerializer.toJSON(chats));*/
			
			JSONArray jsonArray = JSONArray.fromObject(chats);
			
			
			out.write(toBytes("{\"status\":\"ok\", \"message\":"+jsonArray+"}"));

			
		}
		
		
		

		out.flush();
		out.close();

		return null;
		
		
	}
	
	private byte[] toBytes(String txt) {
		try {
			return txt.getBytes("UTF-8");
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
		
		return txt.getBytes();
	}

	// page 갯수 계산 

}
