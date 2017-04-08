
SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bing_session
-- ----------------------------
DROP TABLE IF EXISTS `bing_session`;
CREATE TABLE `bing_session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` varchar(255) NOT NULL,
  `expires_in` int(200) NOT NULL COMMENT '过期时间',
  `insertdate` int(200) NOT NULL COMMENT '插入时间',
  `uid` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
