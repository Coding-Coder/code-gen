package com.gitee.gen.util;

import org.dom4j.Document;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

import java.io.StringReader;
import java.io.StringWriter;

/**
 * 代码格式化
 * @author tanghc
 */
public class FormatUtil {
    
    public static String formatXml(String input) {
        try{
            SAXReader reader = new SAXReader();
            // System.out.println(reader);
            // 注释：创建一个串的字符输入流
            StringReader in = new StringReader(input);
            Document doc = reader.read(in);
            // System.out.println(doc.getRootElement());
            // 注释：创建输出格式
            OutputFormat formater = OutputFormat.createPrettyPrint();
            // formater=OutputFormat.createCompactFormat();
            // 注释：设置xml的输出编码
            formater.setEncoding("utf-8");
            // TAB缩进
            formater.setIndent("    ");
            // 注释：创建输出(目标)
            StringWriter out = new StringWriter();
            // 注释：创建输出流
            XMLWriter writer = new XMLWriter(out, formater);
            // 注释：输出格式化的串到目标中，执行后。格式化后的串保存在out中。
            writer.write(doc);
    
            writer.close();
            // 注释：返回我们格式化后的结果
            return out.toString();
        }catch (Exception e) {
            e.printStackTrace();
            return input;
        }
    }
    
    
    
}
