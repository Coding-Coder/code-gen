package com.gitee.generator;

import com.gitee.gen.util.FieldUtil;
import org.junit.jupiter.api.Test;
import org.springframework.util.Assert;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * @author tanghc
 */
public class UtilTest {

    @Test
    public void testField() {
        Map<String, String> map = new LinkedHashMap<>();
        map.put("user_age", "userAge");
        map.put("user_address_detail", "userAddressDetail");
        map.put("user__age", "userAge");
        map.put("userName", "userName");
        map.put("UserName", "UserName");
        map.put("name", "name");
        map.put("NAME", "name");
        map.put("USER_NAME", "userName");
        map.put("_name", "_name");
        map.put("_name_", "_name_");
        map.put("_user_age", "_userAge");
        map.put("_user__age", "_userAge");
        map.put("user_age_", "userAge_");
        map.put("_user_age_", "_userAge_");
        map.put("name__", "name__");
        map.put("__name", "__name");

        map.forEach((key, value) -> {
            String val = FieldUtil.underlineFilter(key);
            System.out.println(key + " -> " + val);
            Assert.isTrue(value.equals(val), "error:[" + key + " -> " + val + "]");
        });
    }

}
