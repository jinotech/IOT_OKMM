package com.okmindmap.export;

import java.io.IOException;
import java.io.OutputStream;
import java.util.Properties;

import com.okmindmap.model.Map;

public interface Export {
	public void transform(Map map, Properties prop, OutputStream out) throws IOException;
}
