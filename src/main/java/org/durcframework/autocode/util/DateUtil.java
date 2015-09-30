package org.durcframework.autocode.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class DateUtil {
	private static DateFormat YMDHMS_FORMAT = new SimpleDateFormat(
			"yyyy-MM-dd HH:mm:ss.sss");
	private static DateFormat YMD_FORMAT = new SimpleDateFormat(
			"yyyy-MM-dd");

	public static String ymdhmsFormat(Date date) {
		return YMDHMS_FORMAT.format(date);
	}
	public static String ymdFormat(Date date) {
		return YMD_FORMAT.format(date);
	}

}