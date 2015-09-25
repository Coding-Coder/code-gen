package org.durcframework.autocode.common;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PropertiesLoaderUtils;

/**
 * 属性文件管理器,可以获取Properties文件属性
 */
public enum PropertiesManager {
	instance;

	private Map<String, Properties> propMap = new HashMap<String, Properties>();
	private String defProperties = "config.properties"; // 默认的属性文件

	public static PropertiesManager getInstance() {
		return instance;
	}

	PropertiesManager() {
		// 默认读取config.properties
		loadProp(defProperties);
	}

	private Properties loadProp(String fileName) {
		Properties props = propMap.get(fileName);

		if (props == null) {
			Resource resource = new ClassPathResource(fileName);
			try {
				props = PropertiesLoaderUtils.loadProperties(resource);
				propMap.put(fileName, props);
			} catch (IOException e) {
				props = new Properties();
				e.printStackTrace();
			}
		}

		return props;
	}

	private String getValue(String key, String fileName) {
		Properties prop = propMap.get(fileName);
		if (prop == null) {
			prop = loadProp(fileName);
		}
		return prop.getProperty(key);
	}

	/**
	 * 根据key获取属性值
	 * 
	 * @param key
	 * @return
	 */
	public String get(String key) {
		return getValue(key, defProperties);
	}

	/**
	 * 根据key和文件名获取值
	 * @param key
	 * @param fileName 文件名,必须放在classpath根目录下
	 * @return
	 */
	public String get(String key, String fileName) {
		return getValue(key, fileName);
	}

	public static void main(String[] args) {
		System.out.println(PropertiesManager.getInstance().get("debugModel"));
	}

}
