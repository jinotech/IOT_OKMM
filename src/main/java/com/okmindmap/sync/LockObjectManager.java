package com.okmindmap.sync;

import java.util.Hashtable;

public class LockObjectManager {
	private static LockObjectManager instance = new LockObjectManager();;
	
	private Hashtable<String, LockObject> lockObjects = new Hashtable<String, LockObject>();
	
	private LockObjectManager() {}
	
	public static LockObjectManager getInstance() {
		return instance;
	}
	
	public synchronized LockObject lock(String key) {
		LockObject lockObj =  lockObjects.get(key);
		if(lockObj == null) {
			lockObj = new LockObject(getCurrentTime(), true);
			lockObjects.put(key, lockObj);
		} else {
			 lockObj.setTime(getCurrentTime());
			 lockObj.setLocked(true);
		}
		
		return lockObj;
	}
	
	public synchronized void unlock(String key) {
		if(lockObjects.containsKey(key)) {
			LockObject lockObj = (LockObject) lockObjects.get(key);
			lockObj.setLocked(false);
			lockObj.setTime(getCurrentTime());
		}
	}
	
	public synchronized void removeLockObject(String key) {
		lockObjects.remove(key);
	}
	
	public Hashtable<String, LockObject> getLockObjects() {
		return this.lockObjects;
	}
	
	private long getCurrentTime() {
		long time = System.currentTimeMillis();
		
		return time;
	}

}
