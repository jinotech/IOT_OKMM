package com.okmindmap.web.spring;

import java.util.Enumeration;
import java.util.Hashtable;
import java.util.TimerTask;

import com.okmindmap.sync.LockObject;
import com.okmindmap.sync.LockObjectManager;

public class FlushLock extends TimerTask{
	// 기본 시간은 24시
	private int flushTimeout = 86400000;
	
	public void setFlushTimeout(int time) {
		this.flushTimeout = time;
	}
	
	@Override
	public void run() {
		Hashtable<String, LockObject> lockObjs = LockObjectManager.getInstance().getLockObjects();		
		long currentTime = System.currentTimeMillis();
		
		Enumeration<String> keys = lockObjs.keys();
		while(keys.hasMoreElements()) {
			String key = keys.nextElement();
			LockObject lock = lockObjs.get(key);
			
			long diffTime = currentTime - lock.getTime();			
			// flushTimeout 시간이 넘어간것은 삭제
			if(diffTime > flushTimeout) {				
				LockObjectManager.getInstance().removeLockObject(key);
			}
			
		}
	}

}
