package client.exec;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import client.util.FileUtil;
import client.util.HttpUtil;

public class FileExecutor {
	
	private static final String FILE_TEMP = System.getProperty("java.io.tmpdir") + "autoCode/";
	private static final String OUT_FOLDER = System.getProperty("user.dir") + "/out/";

	private String downloadUrl;
	private Properties properties;
	private String propFile;

	public FileExecutor(String url, String propFile) {
		this.downloadUrl = url;
		this.propFile = propFile;
		this.parsePropFile(propFile);
	}

	public void execute() {
		File file = this.downloadFile(); 
		this.unZip(file);
	}
	
	private Map<String, String> buildParmas() {
		Map<String, String> params = new HashMap<String, String>();
		this.setParam(params, "tableName");
		this.setParam(params, "packageName");
		this.setParam(params, "charset");
		this.setParam(params, "dbName");
		this.setParam(params, "driverClass");
		this.setParam(params, "ip");
		this.setParam(params, "port");
		this.setParam(params, "username");
		this.setParam(params, "password");
		
		this.setParam(params, "tcIdController");
		this.setParam(params, "tcIdDao");
		this.setParam(params, "tcIdService");
		this.setParam(params, "tcIdEntity");
		this.setParam(params, "tcIdEntitySch");
		this.setParam(params, "tcIdMyBatis");
		
		return params;
	}
	
	private void setParam(Map<String, String> params,String paramName) {
		String value = properties.getProperty(paramName);
		if(value != null) {
			params.put(paramName, value);
		}
	}

	private File downloadFile() {
		String fileName =System.currentTimeMillis() + ".zip";
		File file  = HttpUtil.download(downloadUrl, this.buildParmas(),FILE_TEMP,fileName);

		if(file == null) {
			throw new RuntimeException("下载文件失败,url:" + downloadUrl);
		}
		
		return file;
		
	}

	private Properties parsePropFile(String propFile) {
		// 加载全局配置
		Properties globleConfig = new Properties();
		try {
			globleConfig.load(Thread.currentThread().getContextClassLoader().getResourceAsStream("config.properties"));
		} catch (IOException e1) {
			e1.printStackTrace();
		}
		
		properties = new Properties(globleConfig);
		
		try {
			properties.load(Thread.currentThread().getContextClassLoader().getResourceAsStream(propFile));
		} catch (IOException e) {
			e.printStackTrace();
		}
		return properties;
	}

	private void unZip(File file) {
//		String classPath = properties.getProperty("classPath");
//		String resourcesPackage = properties.getProperty("resourcesPath");
		String packageName = properties.getProperty("packageName").replaceAll("\\.", "\\/") + "/";
		String mybatisPackage = properties.getProperty("mybatisPackage").replaceAll("\\.", "\\/") + "/";
		// 包路径
		String classDestPath = OUT_FOLDER + propFile + "/" + packageName;
		// mybatis路径
		String mybatisDestPath = OUT_FOLDER + propFile + "/" + mybatisPackage;

		try {
			String unzipDestFolder = file.getAbsolutePath().replace(".zip", "/");
			FileUtil.unZipFiles(file, unzipDestFolder);
			
			String classZip = unzipDestFolder + "class.zip";
			String resourcesZip = unzipDestFolder + "resources.zip";
			
			
			FileUtil.unZipFiles(classZip, classDestPath);
			FileUtil.unZipFiles(resourcesZip, mybatisDestPath);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
