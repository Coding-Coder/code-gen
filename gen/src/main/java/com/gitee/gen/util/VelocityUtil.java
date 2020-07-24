package com.gitee.gen.util;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.apache.velocity.runtime.log.NullLogChute;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

/**
 * Velocity工具类,根据模板内容生成文件
 */
public class VelocityUtil {
	static {
		// 禁止输出日志
		Velocity.setProperty(Velocity.RUNTIME_LOG_LOGSYSTEM, new NullLogChute());
		Velocity.init();
	}

	public static String generate(VelocityContext context, String template) {
		StringReader reader = new StringReader(template);
		StringWriter writer = new StringWriter();
		// 不用vm文件
		Velocity.evaluate(context, writer, "mystring", reader);

		try {
			writer.close();
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return writer.toString();
	}
}
