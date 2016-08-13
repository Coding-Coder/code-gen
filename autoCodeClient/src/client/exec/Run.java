package client.exec;

public class Run {
	
	// autoCode服务url,此处省略了contextPath
	// 一般情况下是http://localhost:8088/autoCode/downloadCode.do
	private static String REQ_URL = "http://localhost:8081/downloadCode.do";

	
	// 确保autoCode项目已启动.
	public static void main(String[] args) {
		String propFile = "stu.properties";
		new FileExecutor(REQ_URL, propFile).execute();
	}

}
