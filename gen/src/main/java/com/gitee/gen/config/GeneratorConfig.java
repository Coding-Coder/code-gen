package com.gitee.gen.config;

import com.gitee.gen.util.SystemUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author tanghc
 */
@Configuration
public class GeneratorConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(GeneratorConfig.class);

    @Value("${gen.front-location:}")
    private String frontLocation;

    // 支持跨域
    @Bean
    @ConditionalOnMissingBean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(source);
    }


    /**
     * 配置静态资源
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String frontRoot;
        if (StringUtils.hasText(frontLocation)) {
            frontRoot = StringUtils.trimTrailingCharacter(frontLocation, '/');
        } else {
            String homeDir = SystemUtil.getBinPath();
            if ("/".equals(homeDir)) {
                homeDir = "";
            }
            frontRoot = homeDir + "/view";
        }
        log.info("前端资源目录：{}", frontRoot);
        String frontLocation = "file:" + frontRoot;
        registry.addResourceHandler("/index.html").addResourceLocations(frontLocation + "/index.html");
        registry.addResourceHandler("/favicon.ico").addResourceLocations(frontLocation + "/favicon.ico");
        registry.addResourceHandler("/static/**").addResourceLocations(frontLocation + "/static/");
        registry.addResourceHandler("/velocity/**").addResourceLocations(frontLocation + "/velocity/");
    }

}
