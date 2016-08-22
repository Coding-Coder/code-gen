package client.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Set;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.HttpStatus;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;

public class HttpUtil {

	private final static int BUFFER = 1024;
	
	/**
	 * 
	 * @param url
	 *            下载连接,如http://www.xx.com/aa/bb.zip
	 * @param destFilePath
	 *            存放目录,如
	 */
	/**
	 * @param url 下载连接,如http://www.xx.com/aa/bb.zip
	 * @param params 请求参数
	 * @param saveFolder 保存路径 如:C:/temp
	 * @param fileName 保存文件名,如aaa.zip
	 * @return
	 */
	public static File download(String url,Map<String,String> params,String saveFolder,String fileName) {
		HttpClient client = new HttpClient();
		GetMethod httpGet = new GetMethod(url);
		try {
			if(params != null) {
				Set<String> keys = params.keySet();
				NameValuePair[] values = new NameValuePair[keys.size()];
				int i = 0;
				for (String key : keys) {
					String val = params.get(key);
					NameValuePair v = new NameValuePair();
					v.setName(key);
					v.setValue(val);
					values[i++] = v;
				}
				
				httpGet.setQueryString(values);
			}
			//执行getMethod  
			int statusCode = client.executeMethod(httpGet);
			
			if (statusCode == HttpStatus.SC_OK) {  
				InputStream in = httpGet.getResponseBodyAsStream();
				
				try {
					mkdir(saveFolder);
					
					File file = new File(saveFolder + "/" + fileName);
					FileOutputStream out = new FileOutputStream(file);

					byte[] b = new byte[BUFFER];
					int len = 0;
					while ((len = in.read(b)) != -1) {
						out.write(b, 0, len);
					}
					in.close();
					out.close();
					
					return file;
				} catch (Exception e) {
					e.printStackTrace();
					return null;
				}
			}
			
			throw new RuntimeException("请求错误,statusCode:" + statusCode);
		} catch (HttpException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			httpGet.releaseConnection();
		}

		return null;
	}
	
	private static void mkdir(String dir) {
		File file = new File(dir);
		if (!file.exists()) {
			file.mkdirs();
		}
	}
	
	public static void main(String[] args) {
		mkdir(System.getProperty("java.io.tmpdir") + "/aa/cc/");
		System.out.println(System.getProperty("java.io.tmpdir"));
	}

}
