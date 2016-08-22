package client.exec;

public class Run {
	
	// autoCode服务url
	private static String REQ_URL = "http://localhost:8080/autoCodeServer/downloadCode.do";

	
	// 确保autoCode项目已启动.
	public static void main(String[] args) {
		String[] propFiles = {
			"config/act/act.activity.properties"
			//,"config/act/act.back_user.properties"	
			//,"config/act/act.join_activity.properties"	
		};
		
		for (String propFile : propFiles) {
			new FileExecutor(REQ_URL, propFile).execute();
		}
		
		System.out.println("生成完毕!");
	}

}
