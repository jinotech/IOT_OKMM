package com.okmindmap.service;


import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

import com.okmindmap.model.Repository;

public interface RepositoryService {
	public String saveMMFile(MultipartFile sourcefile) throws IOException;
	public String saveBookmarkFile(MultipartFile sourcefile) throws IOException;
	public String saveTextFile(MultipartFile sourcefile) throws IOException;
	
	public int saveFile(MultipartFile sourcefile, String subPath, int mapid, int userid) throws IOException;	
	public String saveTempFile(MultipartFile sourcefile, String subPath) throws IOException;
	public Repository loadFile(int repoid) throws IOException;
}
