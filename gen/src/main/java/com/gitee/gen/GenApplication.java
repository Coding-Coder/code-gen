package com.gitee.gen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.core.io.ClassPathResource;
import org.springframework.util.FileCopyUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

@ServletComponentScan
@SpringBootApplication
public class GenApplication {

    public static void main(String[] args) {
        initDatabase();
        SpringApplication.run(GenApplication.class, args);
    }

    public static void initDatabase() {
        String filename = "gen.db";
        String filepath = System.getProperty("user.dir") + "/" + filename;
        File dbFile = new File(filepath);
        if (!dbFile.exists()) {
            ClassPathResource resource = new ClassPathResource(filename);
            try {
                FileCopyUtils.copy(resource.getInputStream(), new FileOutputStream(dbFile));
            } catch (IOException e) {
                throw new RuntimeException("初始化数据库失败", e);
            }
        }
    }

}
