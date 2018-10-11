package com.okmindmap.model;


public class MapTimeline {
	private long id;
	private int mapId;
	private String xml;
	private long saved;
	
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public int getMapId() {
		return mapId;
	}
	public void setMapId(int mapId) {
		this.mapId = mapId;
	}
	public String getXml() {
		return xml;
	}
	public void setXml(String xml) {
		this.xml = xml;
	}
	public long getSaved() {
		return saved;
	}
	public void setSaved(long saved) {
		this.saved = saved;
	}
	
	
}
