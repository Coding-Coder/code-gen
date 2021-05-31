package com.gitee.gen.util;

import com.gitee.gen.entity.TemplateConfig;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import org.springframework.util.StringUtils;

/**
 * 模板元信息工具类
 */
public final class TemplateMetaUtils {

    private TemplateMetaUtils() {
    }

    /**
     * 解析模板内容中的元信息
     */
    public static Map<String, String> parseMetaContent(String content) {
        content = StringUtils.trimLeadingWhitespace(content);
        if (content != null && content.startsWith("##")) {
            int rowIdx = content.indexOf('\n');
            String metaInfo = content.substring(2, rowIdx);
            return parseMetaRow(metaInfo);
        }
        return Collections.emptyMap();
    }

    /**
     * 解析元数据信息
     */
    public static Map<String, String> parseMetaRow(String row) {
        Map<String, String> data = new HashMap<>();
        String[] paris = row.split("\\s*,\\s*");
        for (String item : paris) {
            String[] kv = item.split("=");
            data.put(kv[0].trim(), kv.length == 1 ? null : kv[1].trim());
        }
        return data;
    }

    /**
     * 生成元数据的模板内容
     */
    public static String generateMetaContent(TemplateConfig template) {
        String content = StringUtils.trimLeadingWhitespace(template.getContent());
        String metaRow = generateMetaRow(template);
        if (content.startsWith("##")) {
            int rowIdx = content.indexOf('\n');
            if(rowIdx == -1) {
                content = metaRow;
            } else {
                content = metaRow + content.substring(rowIdx);
            }
        } else {
            content = metaRow + "\n" + content;
        }
        return content;
    }

    /**
     * 解析元数据信息
     */
    public static String generateMetaRow(TemplateConfig template) {
        String format = "## filename=%s, folder=%s";
        String filename = template.getFileName() != null ? template.getFileName() : "";
        String folder = template.getFolder() != null ? template.getFolder() : "";
        return String.format(format, filename, folder);
    }
}
