package client.exec;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import client.util.FileUtil;
import client.util.HttpUtil;

public class FileExecutor {

	private final static int BUFFER = 1024;

	private static final String FILE_TEMP = System.getProperty("java.io.tmpdir") + "autoCode/";

	private String downloadUrl;
	private Properties properties;

	public FileExecutor(String url, String propFile) {
		this.downloadUrl = url;
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
		params.put(paramName, properties.getProperty(paramName));
	}

	private File downloadFile() {
		InputStream inputStream = HttpUtil.download(downloadUrl, this.buildParmas());

		mkdir(FILE_TEMP);

		String destFilePath = FILE_TEMP + System.currentTimeMillis() + ".zip";
		try {
			File file = new File(destFilePath);
			FileOutputStream out = new FileOutputStream(file);

			byte[] b = new byte[BUFFER];
			int len = 0;
			while ((len = inputStream.read(b)) != -1) {
				out.write(b, 0, len);
			}
			inputStream.close();
			out.close();
			
			return file;
		} catch (Exception e) {
			e.printStackTrace();
		}

		return null;
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

		String classPackage = properties.getProperty("classPath");
		String resourcesPackage = properties.getProperty("resourcesPath");
		String packageName = properties.getProperty("packageName").replaceAll("\\.", "\\/") + "/";
		String mybatisPackage = properties.getProperty("mybatisPackage").replaceAll("\\.", "\\/") + "/";
		// 包路径
		String classDestPath = classPackage + packageName;
		// mybatis路径
		String mybatisDestPath = resourcesPackage + mybatisPackage;

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

	private static void mkdir(String dir) {
		File file = new File(dir);
		if (!file.exists()) {
			file.mkdir();
		}
	}

}
