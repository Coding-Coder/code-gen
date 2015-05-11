package org.durcframework.autocode.velocity;

import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;

import junit.framework.TestCase;

import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.junit.Test;

public class VelocityTest extends TestCase {

	@Test
	public void testVelocity(){
		Velocity.init();

		VelocityContext context = new VelocityContext();
		
		context.put("name", "dreamhead");

		StringWriter writer = new StringWriter();
		StringReader reader = new StringReader("Hello, $name");
		// 不用vm文件
		Velocity.evaluate(context, writer, "mystring", reader);

		System.out.println(writer.toString());
		
		try {
			writer.flush();
			writer.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
	}

	
}
