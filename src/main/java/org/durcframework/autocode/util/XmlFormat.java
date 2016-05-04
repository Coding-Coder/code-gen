package org.durcframework.autocode.util;

import java.io.StringReader;
import java.io.StringWriter;

import org.dom4j.Document;
import org.dom4j.io.OutputFormat;
import org.dom4j.io.SAXReader;
import org.dom4j.io.XMLWriter;

public class XmlFormat {

	public static String format(String str) {
		try{
			SAXReader reader = new SAXReader();
			// System.out.println(reader);
			// 注释：创建一个串的字符输入流
			StringReader in = new StringReader(str);
			Document doc = reader.read(in);
			// System.out.println(doc.getRootElement());
			// 注释：创建输出格式
			OutputFormat formater = OutputFormat.createPrettyPrint();
			// formater=OutputFormat.createCompactFormat();
			// 注释：设置xml的输出编码
			formater.setEncoding("utf-8");
			// TAB缩进
			formater.setIndent("	");
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
			return str;
		}
	}

	public static void main(String[] args) throws Exception {
		String head = "<?xml version=\"1.0\" encoding=\"GBK\"?>";
		String str = head + "<RequestData><HeadData><UserCode>sh1_adminsssssssssssssssssssssssssssssssssssssssssssss</UserCode>"
				+ "<UserName>sh1_admin</UserName><UserCompanyCode>3107</UserCompanyCode><UserCompanyName>上海分公司一部</UserCompanyName><RequestType>03</RequestType></HeadData><BodyData><ReportId>113100000033</ReportId><Insurant>a5rfg87</Insurant><NumberPlate>沪E78612</NumberPlate><EngineModel></EngineModel><CarVin></CarVin><AccidentDate>2011-02-25 15:07:00</AccidentDate><ReportDate>2011-02-25 15:07:00</ReportDate><Province>310000</Province><City>310100</City><District></District><AccidentPlace>1</AccidentPlace><AccidentLongitude></AccidentLongitude><AccidentLatitude></AccidentLatitude><SurveyLongitude></SurveyLongitude><SurveyLatitude></SurveyLatitude><SceneReportFlag></SceneReportFlag><Reporter></Reporter><ReporterTel></ReporterTel><SurveyPlace></SurveyPlace><OperatorId>3525</OperatorId><OperatorName>sh_admin</OperatorName><ReportDealId>30000800</ReportDealId><ReportDealName>江苏分公司</ReportDealName><CompanyName></CompanyName><CustomerTypeCode></CustomerTypeCode><ForcePolicyId>a5rfg87a5rfg87a5rfg87</ForcePolicyId><BizPolicyId></BizPolicyId><Index>0</Index><FieldName>5</FieldName></BodyData></RequestData>";
		// System.out.println(str);
		String f = format(str);
		System.out.println(f);
	}

}