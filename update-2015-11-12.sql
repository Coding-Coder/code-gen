USE `auto_code`;

DROP TABLE IF EXISTS `datasource_config`;

CREATE TABLE `datasource_config` (
  `dc_id` int(11) NOT NULL AUTO_INCREMENT,
  `driver_class` varchar(50) DEFAULT NULL COMMENT '数据库驱动',
  `db_name` varchar(50) DEFAULT NULL,
  `ip` varchar(50) DEFAULT NULL,
  `port` int(11) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(50) DEFAULT NULL,
  `back_user` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`dc_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
