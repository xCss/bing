SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for bing
-- ----------------------------
DROP TABLE IF EXISTS `bing`;
CREATE TABLE `bing` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) DEFAULT NULL,
  `attribute` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `copyright` varchar(500) NOT NULL DEFAULT '0',
  `copyrightlink` varchar(500) NOT NULL DEFAULT '0',
  `startdate` varchar(50) NOT NULL DEFAULT '0',
  `enddate` varchar(50) NOT NULL DEFAULT '0',
  `fullstartdate` varchar(50) NOT NULL DEFAULT '0',
  `url` varchar(500) NOT NULL DEFAULT '0',
  `urlbase` varchar(500) NOT NULL DEFAULT '0',
  `hsh` varchar(500) NOT NULL DEFAULT '0',
  `qiniu_url` varchar(100) DEFAULT NULL,
  `longitude` varchar(500) DEFAULT NULL COMMENT '经度',
  `latitude` varchar(500) DEFAULT NULL COMMENT '纬度',
  `city` varchar(500) DEFAULT NULL COMMENT '城市',
  `country` varchar(255) DEFAULT NULL COMMENT '国家',
  `continent` varchar(255) DEFAULT NULL COMMENT '洲/大陆',
  `thumbnail_pic` varchar(255) DEFAULT NULL COMMENT '缩略图',
  `bmiddle_pic` varchar(255) DEFAULT NULL COMMENT '中等大小图',
  `original_pic` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '原图',
  `weibo` int(1) unsigned zerofill NOT NULL DEFAULT '0' COMMENT '是否发送微博，默认0',
  `likes` int(11) unsigned DEFAULT '0' COMMENT '喜欢量',
  `views` int(11) unsigned DEFAULT '0' COMMENT '展现量',
  `downloads` int(11) unsigned DEFAULT '0' COMMENT '下载量',
  PRIMARY KEY (`id`),
  KEY `id-title-attribute-qiniu_url` (`id`,`title`,`attribute`,`qiniu_url`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;
