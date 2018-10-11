package com.okmindmap.collaboration;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Hashtable;

import com.okmindmap.model.User;



public class ChatRoomUserDB {
	private static ChatRoomUserDB userDatabase = new ChatRoomUserDB();
	 
	
	private static Hashtable<String, Hashtable<String, User>> loginUserTable = new Hashtable<String, Hashtable<String, User>>();

	private ChatRoomUserDB() {
	}

	public static ChatRoomUserDB getInstance() {
		return userDatabase;
	}

	public Collection<User> getLoggedInUsers(String roomNumber) {
		if(loginUserTable.get(roomNumber)!=null)
			return loginUserTable.get(roomNumber).values();
		else return new ArrayList<User>();
	}
	
	public ArrayList<String> getLoggedInUsersId(String roomNumber) {
		ArrayList<String> tempArray = new ArrayList<String>();
		
		if(loginUserTable.get(roomNumber)!=null){
			for(User user : loginUserTable.get(roomNumber).values()){
				tempArray.add(user.getScriptSessionId());
			}
				
			
		}
		return tempArray;
			
	}

	public boolean isUserLogged(String roomNumber, String userName) {
		if(loginUserTable.get(roomNumber)!=null){
			User user = new User();
			user.setUsername(userName);
			return loginUserTable.get(roomNumber).contains(user);
		}
		return false;
	}

	public boolean login(String roomNumber, String userName, String scriptSessionId) {
		if(loginUserTable.get(roomNumber)!=null){
			User user = new User();
			user.setUsername(userName);
			user.setScriptSessionId(scriptSessionId);
			if(loginUserTable.get(roomNumber).contains(user))
				return true;
			else{
				loginUserTable.get(roomNumber).put(scriptSessionId, user);
			
				return true;
			}
		}else {
			
			User user = new User();
			user.setUsername(userName);
			user.setScriptSessionId(scriptSessionId);
			Hashtable<String, User> tempHash = new Hashtable<String, User>();
			tempHash.put(scriptSessionId, user);
			
			loginUserTable.put(roomNumber, tempHash);
			return true;
		}
	}

	public boolean logout(String roomNumber, String scriptSessionId) {
		System.out.println("log out::"+scriptSessionId);
		if(loginUserTable.get(roomNumber)!=null){
			loginUserTable.get(roomNumber).remove(scriptSessionId);
			return true;
		}
		return false;
	}
	
}
