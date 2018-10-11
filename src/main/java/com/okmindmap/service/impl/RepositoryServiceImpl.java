package com.okmindmap.service.impl;


import java.io.File;
import java.io.IOException;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.okmindmap.dao.RepositoryDAO;
import com.okmindmap.model.Repository;
import com.okmindmap.service.RepositoryService;



public class RepositoryServiceImpl implements RepositoryService {
	private RepositoryDAO repositoryDAO;
	private String path;
	
	public RepositoryDAO getRepositoryDAO() {
		return repositoryDAO;
	}

	public void setRepositoryDAO(RepositoryDAO repositoryDAO) {
		this.repositoryDAO = repositoryDAO;
	}
	
	public RepositoryServiceImpl(String path) {
        this.path = path;
        File saveFolder = new File(path);
        if(!saveFolder.exists() || saveFolder.isFile()){
            saveFolder.mkdirs();
        }       
    }
	
	public String saveMMFile(MultipartFile sourcefile) throws IOException {
        if ((sourcefile==null)||(sourcefile.isEmpty())) return null;
        
        String key = UUID.randomUUID().toString();
        String targetFilePath = path + "/Freemind/" + key;
        File file = new File(targetFilePath);
        file.mkdirs();
        sourcefile.transferTo(file);
        
        return targetFilePath;
    }
	
	public String saveBookmarkFile(MultipartFile sourcefile) throws IOException {
        if ((sourcefile==null)||(sourcefile.isEmpty())) return null;
        
        String key = UUID.randomUUID().toString();
        String targetFilePath = path + "/Bookmark/" + key;
        File file = new File(targetFilePath);
        file.mkdirs();
        sourcefile.transferTo(file);
        
        return targetFilePath;
    }
	
	public String saveTextFile(MultipartFile sourcefile) throws IOException {
		if ((sourcefile==null)||(sourcefile.isEmpty())) return null;
        
        String key = UUID.randomUUID().toString();
        String targetFilePath = path + "/Text/" + key;
        File file = new File(targetFilePath);
        file.mkdirs();
        sourcefile.transferTo(file);
        
        return targetFilePath;
	}
	
	public int saveFile(MultipartFile sourcefile, String subPath, int mapid, int userid) throws IOException {
		if ((sourcefile==null)||(sourcefile.isEmpty())) return -1;
        
        String key = UUID.randomUUID().toString();
        if(!subPath.startsWith("/")) subPath = "/" + subPath;
        if(!subPath.endsWith("/")) subPath = subPath + "/";
        String targetFilePath = path + subPath + key;
        File file = new File(targetFilePath);
        file.mkdirs();
        sourcefile.transferTo(file);
        
        if(file != null && file.exists()) {
        	String fileName = sourcefile.getOriginalFilename();
            String path = file.getAbsolutePath();
            String contentType = sourcefile.getContentType();
            long fileSize = sourcefile.getSize();
            
            return this.repositoryDAO.insertRepository(mapid, userid, fileName, path, contentType, fileSize);
        } else {
        	return -1;
        }
	}
	
	public String saveTempFile(MultipartFile sourcefile, String subPath) throws IOException {
		if ((sourcefile==null)||(sourcefile.isEmpty())) return "";
        
        String key = UUID.randomUUID().toString();
        if(!subPath.startsWith("/")) subPath = "/" + subPath;
        if(!subPath.endsWith("/")) subPath = subPath + "/";
        String targetFilePath = path + subPath + key;
        File file = new File(targetFilePath);
        file.mkdirs();
        sourcefile.transferTo(file);
        
        if(file != null && file.exists()) {
            return file.getAbsolutePath();
        } else {
        	return "";
        }
	}
	
	public Repository loadFile(int repoid) throws IOException {
		Repository repo = this.repositoryDAO.withdrawRepository(repoid);
		return repo;
	}
}
