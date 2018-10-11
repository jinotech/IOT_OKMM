package com.okmindmap.model;

import java.io.Serializable;


@SuppressWarnings("serial")
public class Repository  implements Serializable {
	private int id;
	private int mapID;
	private int userID;
	private String fileName;
	private String path;
	private String contentType;
	private long fileSize;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public int getMapID() {
		return mapID;
	}
	public void setMapID(int mapID) {
		this.mapID = mapID;
	}
	public int getUserID() {
		return userID;
	}
	public void setUserID(int userID) {
		this.userID = userID;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public String getContentType() {
		return contentType;
	}
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	public long getFileSize() {
		return fileSize;
	}
	public void setFileSize(long fileSize) {
		this.fileSize = fileSize;
	}
		
}