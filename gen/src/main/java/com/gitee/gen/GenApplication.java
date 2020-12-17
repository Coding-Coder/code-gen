package com.gitee.gen;

import com.gitee.gen.service.UpgradeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.ServletComponentScan;

@ServletComponentScan
@SpringBootApplication
public class GenApplication implements ApplicationRunner {

    @Autowired
    private UpgradeService upgradeService;

    public static void main(String[] args) {
        UpgradeService.initDatabase();
        SpringApplication.run(GenApplication.class, args);
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        upgradeService.upgrade();
    }

}
