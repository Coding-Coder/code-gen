package client.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Set;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.HttpException;
import org.apache.commons.httpclient.NameValuePair;
import org.apache.commons.httpclient.methods.GetMethod;

public class HttpUtil {

	/**
	 * 
	 * @param url
	 *            下载连接,如http://www.xx.com/aa/bb.zip
	 * @param destFilePath
	 *            存放目录,如
	 */
	public static InputStream download(String url,Map<String,String> params) {
		HttpClient client = new HttpClient();
		GetMethod httpGet = new GetMethod(url);
		try {
			Set<String> keys = params.keySet();
			NameValuePair[] values = new NameValuePair[keys.size()];
			int i = 0;
			for (String key : keys) {
				NameValuePair v = new NameValuePair();
				v.setName(key);
				v.setValue(params.get(key));
				values[i++] = v;
			}
			
			httpGet.setQueryString(values);
			
			client.executeMethod(httpGet);
			InputStream in = httpGet.getResponseBodyAsStream();
			return in;
		} catch (HttpException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			//httpGet.releaseConnection();
		}

		return null;
	}

}
