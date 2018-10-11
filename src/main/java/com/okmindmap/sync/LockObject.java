package com.okmindmap.sync;

public class LockObject {
	private long time;
	private boolean locked;
	
	public LockObject(long time, boolean locked) {
		this.time = time;
		this.locked = locked;
	}

	public long getTime() {
		return time;
	}

	public void setTime(long time) {
		this.time = time;
	}

	public boolean isLocked() {
		return locked;
	}

	public void setLocked(boolean locked) {
		this.locked = locked;
	}
}
