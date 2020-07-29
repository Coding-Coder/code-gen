package com.gitee.gen.util;

import org.springframework.util.StringUtils;

public class FieldUtil {

    public static final String UNDER_LINE = "_";

    /**
     * 下划线字段转驼峰 <br/>
     *
     * <pre>
     * user_age -> userAge
     * user_address_detail -> userAddressDetail
     * user__age -> userAge
     * name -> name
     * _name -> _name
     * _name_ -> _name_
     * _user_age -> _userAge
     * _user__age -> _userAge
     * user_age_ -> userAge_
     * _user_age_ -> _userAge_
     * name__ -> name__
     * __name -> __name
     * </pre>
     *
     *
     * @param field 字段
     * @return 返回转换后的字段
     */
    public static String underlineFilter(String field) {
        if (StringUtils.hasText(field)) {
            char underLine = '_';
            int underLineCountLeading = findCharCount(field, underLine, false);
            int underLineCountTailing = findCharCount(field, underLine, true);
            // 去除首尾'_'
            field = StringUtils.trimLeadingCharacter(field, underLine);
            field = StringUtils.trimTrailingCharacter(field, underLine);
            if (field.contains(UNDER_LINE)) {
                field = field.toLowerCase();
            }
            String[] arr = field.split("_+");
            return join(arr, underLineCountLeading, underLineCountTailing);
        }
        return "";
    }

    private static String join(String[] arr, int underLineCountLeading, int underLineCountTailing) {
        if (arr.length > 1) {
            for (int i = 1; i < arr.length; i++) {
                arr[i] = upperFirstLetter(arr[i]);
            }
        }
        StringBuilder ret = new StringBuilder();
        char underLine = '_';
        for (int i = 0; i < underLineCountLeading; i++) {
            ret.append(underLine);
        }
        ret.append(String.join("", arr));
        for (int i = 0; i < underLineCountTailing; i++) {
            ret.append(underLine);
        }
        return ret.toString();
    }

    private static int findCharCount(String str, char searchChar, boolean reverse) {
        if (StringUtils.isEmpty(str)) {
            return 0;
        }
        int count = 0;
        char[] chars = str.toCharArray();

        if (reverse) {
            for (int i = chars.length - 1; i >= 0; i--) {
                if (chars[i] == searchChar) {
                    count++;
                } else {
                    break;
                }
            }
        } else {
            for (int i = 0; i < chars.length; i++) {
                if (chars[i] == searchChar) {
                    count++;
                } else {
                    break;
                }
            }
        }
        return count;
    }

    /**
     * 过滤"."
     *
     * @param field
     * @return
     */
    public static String dotFilter(String field) {
        if (StringUtils.hasText(field)) {
            if (field.contains(".")) {
                String[] words = field.split("\\.");
                String ret = "";
                for (String str : words) {
                    ret += upperFirstLetter(str);
                }
                return ret;
            }
        }
        return field;
    }

    /**
     * 将第一个字母转换成大写
     *
     * @param str
     * @return
     */
    public static String upperFirstLetter(String str) {
        if (StringUtils.hasText(str)) {
            String firstUpper = str.substring(0, 1).toUpperCase();
            str = firstUpper + str.substring(1);
        }
        return str;
    }

    /**
     * 将第一个字母转换成小写
     *
     * @param str
     * @return
     */
    public static String lowerFirstLetter(String str) {
        if (StringUtils.hasText(str)) {
            String firstLower = str.substring(0, 1).toLowerCase();
            str = firstLower + str.substring(1, str.length());
        }
        return str;
    }


    public static void main(String[] args) {
        System.out.println(underlineFilter("table_name"));
        System.out.println(underlineFilter("tableName"));
        System.out.println(underlineFilter("username"));
    }

}
