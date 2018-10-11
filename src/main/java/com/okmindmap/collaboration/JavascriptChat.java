package com.okmindmap.collaboration;

import java.sql.Timestamp;
import java.util.Collection;
import java.util.Date;

import org.apache.log4j.Logger;
import org.directwebremoting.Browser;
import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.WebContext;
import org.directwebremoting.WebContextFactory;
import net.sf.json.JSONObject;

import com.okmindmap.model.User;
import com.okmindmap.service.ChatService;
import com.okmindmap.service.QueueService;
import com.okmindmap.service.helper.ChatServiceHelper;
import com.okmindmap.service.helper.QueueServiceHelper;

/**
 * @author Joe Walker [joe at getahead dot ltd dot uk]
 */
public class JavascriptChat {
	
	public JavascriptChat() {
		//System.out.println("javascript chat");
	}
	
	
	

	
	public void enterRoom(String username){
		/*WebContext wctx = WebContextFactory.get();
		final String page = wctx.getCurrentPage();
		final String sender = wctx.getScriptSession().getId();
		
		final ChatRoomUserDB userDb = ChatRoomUserDB.getInstance();
		if(!userDb.isUserLogged(page, sender)){
			userDb.login(page, username, sender);
		}
		final Collection<User> loginedUserList = userDb.getLoggedInUsers(page);
		for(User a  : loginedUserList){
			System.out.println(a.getUsername());
			
		}
		
		final String username2 = username;

		
		Browser.withPage(page,new Runnable(){
            public void run(){
				Collection<ScriptSession> sessions = Browser.getTargetSessions();
				for(ScriptSession scriptSession : sessions){
					ScriptBuffer sb = new ScriptBuffer();
					
					sb.appendCall("updateUserInfo",username2, loginedUserList);
					scriptSession.setAttribute("page", page);
					scriptSession.addScript(sb);
					
				}
            }
        });*/
	}
	
	
	public void logout(String username){
		/*WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String sender = wctx.getScriptSession().getId();
		final ChatRoomUserDB userDb = ChatRoomUserDB.getInstance();
		
		final Collection<User> loginedUserList = userDb.getLoggedInUsers(page);
		final String username2 = username;
		
		
		if(userDb.isUserLogged(page, sender)){
			userDb.logout(page, sender);
		}
		Browser.withPage(page,new Runnable(){
            public void run(){
            	Collection<ScriptSession> sessions = Browser.getTargetSessions();

            	for (ScriptSession scriptSession : sessions) {
            		
            		ScriptBuffer sb = new ScriptBuffer();
					
            		if (!scriptSession.getId().equals(sender)) {
            			if(sender.equals(scriptSession.getId())){
            				scriptSession.invalidate();
            				
            			}else{
            			}
            		}
            		sb.appendCall("updateUserInfo",username2, loginedUserList);
            		
            		scriptSession.addScript(sb);
					
            		
				}
            }
        });*/
}

	
	



	Logger logger = Logger.getLogger(getClass());
	
	public void emptyQueue(final String pageId){
		WebContext wctx = WebContextFactory.get();
		QueueServiceHelper.getQueueService(wctx.getServletContext()).remove(pageId);
	}
	
	
	public void sendMessage(final String userName, final String message, final int roomNumber, final int userId){
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String sender = wctx.getScriptSession().getId();
		
		
		ChatService chatService = ChatServiceHelper.getChatService(wctx.getServletContext());
		if(chatService.isSaving(roomNumber)){	
			chatService.insert(roomNumber, userId, userName, message);
		}
		
		
		
		if (message != null && message.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						//if (!scriptSession.getId().equals(sender)) {
						int isMe = 0;
						if(sender.equals(scriptSession.getId())){
							isMe =1;
						}
				
								
						
							
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("OKMChat.receiveMessages", userName, message, isMe, new Timestamp(new Date().getTime()));
							scriptSession.addScript(sb);
						//}
					}
				}
			});
		}
	}
	
	
	
	/**
	 * 사용자의 이름을 세션에서 부터 가져온다.
	 * @param wctx
	 * @return
	 */
	public String getUserName(WebContext wctx){
		String tempName = "";
		try{
		  tempName = ((User)wctx.getSession().getAttribute("user")).getUsername();
		}catch(Exception e){
			tempName = "guest";
		}
		
		if(tempName==null || tempName.length()<1){
			tempName = "guest";
		}
		
		return tempName;
	}
	
	

	public void sendNodeCoordMove(final String nodeId, final String dx, final String dy) {
		WebContext wctx = WebContextFactory.get();
		
		String page = wctx.getCurrentPage();
		
		final String sender = wctx.getScriptSession().getId();
		
		final String userName = getUserName(wctx);

		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){	
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "NodeCoordMove");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("dx", dx);
			jsonObject.put("dy", dy);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			queueService.insert(page, jsonObject.toString());
		}
			
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendNodeCoordMove", nodeId, dx, dy);
							scriptSession.addScript(sb);
						} else {
						}
					}
				}
			});
		}
	}

	public void deleteNode(final String nodeId) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String sender = wctx.getScriptSession().getId();
		final String userName = getUserName(wctx);
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "delete");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendNodeRemove", nodeId);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}
	
	
	
	
	public void sendNodeForeignObject(final String nodeId,final String html, final String width, final String height) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String userName = getUserName(wctx);
		final String sender = wctx.getScriptSession().getId();
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "foreign");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("data", html);
			jsonObject.put("width", width);
			jsonObject.put("height", height);
			queueService.insert(page, jsonObject.toString());
		}
		
		
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendNodeForeignObject", nodeId, html, width, height);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}
	

	public void insertNode(final String nodeId, final String data,final String index2, final String isLeft) {
		
		
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String userName = getUserName(wctx);
		final String sender = wctx.getScriptSession().getId();
	
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){	
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "insert");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("data", data);
			jsonObject.put("index", index2);
			jsonObject.put("isLeft", isLeft);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendNodeInsert", nodeId,
									data, index2, isLeft);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}

	public void sendNodePaste(final String nodeId, final String data,	final String index) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String userName = getUserName(wctx);
		final String sender = wctx.getScriptSession().getId();
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){	
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "paste");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("data", data);
			jsonObject.put("index", index);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendNodePaste", nodeId, data, index);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}

	public void sendNodeMove(final String parentNodeID, final String [] pasteNodeIDs, final String position, final String targNodeID) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String userName = getUserName(wctx);
		final String sender = wctx.getScriptSession().getId();
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){	
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "Node Move");
			jsonObject.put("parentNodeID", parentNodeID);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("position", position);
			jsonObject.put("targNodeID", targNodeID);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (parentNodeID != null && parentNodeID.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendNodeMoved", parentNodeID,
									pasteNodeIDs, position, targNodeID);
							scriptSession.addScript(sb);
						}
					}
				}
			});

		}
		
	}
	
	public void sendNodeEdit(final String nodeId, final String data) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String userName = getUserName(wctx);
		final String sender = wctx.getScriptSession().getId();
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		
		if(queueService.isQueueing(page)){	
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "edit");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("data", data);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("receiveDWR_sendNodeEdit", nodeId,
									data);
							scriptSession.addScript(sb);
						}
					}
				}
			});

		}
	}

	public void sendNodeFolding(final String nodeId, final boolean folded) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String sender = wctx.getScriptSession().getId();
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("DWR_afterNodeFolding", nodeId,
									folded);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}

	public void sendNodeImage(final String nodeId, final String imageURL, final String width, final String height) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String sender = wctx.getScriptSession().getId();
		final String userName = getUserName(wctx);
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){	
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "image");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("data", imageURL);
			queueService.insert(page, jsonObject.toString());
		}
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("DWR_afterNodeImage", nodeId,
									imageURL, width, height);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}
	public void sendRecoveryNode(final String nodeId, final String historyUndo) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String userName = getUserName(wctx);
		final String sender = wctx.getScriptSession().getId();
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){	
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "recovery");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("data", historyUndo);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("DWR_afterRecoveryNode", nodeId, historyUndo);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}

	public void sendNodeHyper(final String nodeId, final String hyperURL) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String userName = getUserName(wctx);
		final String sender = wctx.getScriptSession().getId();

		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){	
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "hyper");
			jsonObject.put("nodeId", nodeId);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("data", hyperURL);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (nodeId != null && nodeId.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("DWR_afterNodeHyper", nodeId,
									hyperURL);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}

	public void sendNodeAttrs(final String xml) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String sender = wctx.getScriptSession().getId();
		final String userName = getUserName(wctx);
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "attrs");
			jsonObject.put("xml", xml);
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (xml != null ) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendNodeAttrs", xml);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}
	
	public void sendForceRefresh(final String userid) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		final String sender = wctx.getScriptSession().getId();
		final String userName = getUserName(wctx);
		
		QueueService queueService = QueueServiceHelper.getQueueService(wctx.getServletContext());
		if(queueService.isQueueing(page)){
			JSONObject jsonObject = new JSONObject();
			jsonObject.put("action", "refresh");
			jsonObject.put("sender", sender);
			jsonObject.put("username", userName);
			jsonObject.put("data", userid);
			queueService.insert(page, jsonObject.toString());
		}
		
		if (userid != null && userid.trim().length() > 0) {
			Browser.withPage(page, new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendForceRefresh", userid);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}
	
	public void sendAdminNotice(final String notice) {
		WebContext wctx = WebContextFactory.get();
		final String sender = wctx.getScriptSession().getId();
		
		if (notice != null && notice.trim().length() > 0) {
			Browser.withAllSessions(new Runnable() {
				public void run() {
					Collection<ScriptSession> sessions = Browser
							.getTargetSessions();
					for (ScriptSession scriptSession : sessions) {
						if (!scriptSession.getId().equals(sender)) {
							ScriptBuffer sb = new ScriptBuffer();
							sb.appendCall("afterDWR_sendAdminNotice", notice);
							scriptSession.addScript(sb);
						}
					}
				}
			});
		}
	}
	
	public void setRestrictEditing(final boolean restricting) {
		WebContext wctx = WebContextFactory.get();
		String page = wctx.getCurrentPage();
		
		final String sender = wctx.getScriptSession().getId();
		
		Browser.withPage(page, new Runnable() {
			public void run() {
				Collection<ScriptSession> sessions = Browser.getTargetSessions();
				for (ScriptSession scriptSession : sessions) {
					if (!scriptSession.getId().equals(sender)) {
						ScriptBuffer sb = new ScriptBuffer();
						sb.appendCall("afterDWR_setRestrictEditing", restricting);
						scriptSession.addScript(sb);
					}
				}
			}
		});
	}

}