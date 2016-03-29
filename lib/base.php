<?php 
/**
* CopyRight Bitmoe · Hero
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('db.php');

class Base{
    
    var $result = array();
    /**
    * 获取最新张照片
    */
    function getLastPic(){
        
        $start = date("Ymd")-1;
        $end = date("Ymd");
        
        self::checkNewOnBing();
        
        $sql = "select * from bing where startdate='".$start."' and enddate='".$end."' order by enddate desc";
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
            
        }
        
        return $data[0];
        
    }
    
    /**
    * 分页查询
    */
    function getPicsByPagin($pageNo=1,$pageSize=12){
        
        self::checkNewOnBing();
        
        if($pageNo == 0) $pageNo = 1;
                
        $sql = "select * from bing order by enddate desc limit ".($pageNo-1)*$pageSize.",".$pageSize;
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
            
        }
        
        $sum = self::getCount();
        
        $page = array();
        
        //$page['sum'] = $sum;
        $page['pageNo'] = $pageNo;
        $page['lastNo'] = ceil($sum/$pageSize);
        $page['nextNo'] = $pageNo + 1 >= $page['lastNo'] ? $page['lastNo'] : $pageNo + 1;
        $page['prevNo'] = $pageNo - 1 <= 1 ? 1 : $pageNo - 1;
        
        $result = array();
        
        $result['page'] = $page;
        $result['images'] = $data;
        
        return $result;
        
    }
    
    /**
    * 根据日期查询
    */
    function getPicOnDay($day=0){
        
        $sql = 'select * from bing where id='.$day;
        
        $rs = DBHelper::opearting($sql);
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
            
        }
        
        return $data[0];
        
    }
    
    
    function getPicOnBing($day=0){
        
        self::checkNewOnBing();
        
        $url = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx='.$day.'&n=1';
        
        $html = file_get_contents($url);
        //字符串转码
        $html = mb_convert_encoding( $html, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5' );

        $obj = json_decode($html,true);
        
        $img = $obj['images'][0];
        
        if(!self::existsLocalOnUrlBase($img['urlbase'])){
            
            self::putLocalPic($img);
            
        }
        
        return $img;
        
    }
    
    
    /**
    * 从Bing获取所有图片
    */
    function getPicAtAll(){
        
        $url = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=16&n=100';
        
        $html = file_get_contents($url);
        //字符串转码
        $html = mb_convert_encoding( $html, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5' );

        $obj = json_decode($html,true);
        
        //print_r($obj);exit;
        
        $imgs = $obj['images'];
        //$url = '';
        
        foreach($imgs as $key=>$value){
            
            if(!self::existsLocalOnUrlBase($value['urlbase'])){
                
                self::putLocalPic($value);
                //$url .= $value['url'].'<br>';
                
            }
            
        }
        //return $url;
        
    }
    
    
    /**
    * 插入数据库
    */
    function putLocalPic($obj){
        
        $sql = "insert into bing(startdate,enddate,fullstartdate,hsh,url,urlbase,copyright,copyrightlink) values('".$obj['startdate']."','".$obj['enddate']."','".$obj['fullstartdate']."','".$obj['hsh']."','".$obj['url']."','".$obj['urlbase']."','".$obj['copyright']."','".$obj['copyrightlink']."')";
        
        return DBHelper::opearting($sql) > 0;
        
    }
    
    /**
    * 查询总条数
    */
    function getCount(){
        
        $sql = 'select count(id) as num from bing';
        
        $data = array();
        
        $rs = DBHelper::opearting($sql);
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data = $row;
            
        }
        
        return $data['num'];
    }
    
    /**
    * 根据UrlBase值判断是否存在
    */
    function existsLocalOnUrlBase($urlbase){
        
        $sql = 'select count(id) as num from bing where urlbase="'.$urlbase.'"';
        //print_r($sql);
        $data = array();
        
        $rs = DBHelper::opearting($sql);
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data = $row;
            
        }
        
        return $data['num'];
        
    }
    /**
    * 根据enddate值判断是否存在
    */
    function existsLocalOnDate($date){
        
        $sql = 'select count(id) as num from bing where enddate="'.$date.'"';
        //print_r($sql);
        $data = array();
        
        $rs = DBHelper::opearting($sql);
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data = $row;
            
        }
        
        return $data['num'];
        
    }
    
    /**
    * 检查Bing是否有新图片
    */
    function checkNewOnBing(){
        
        $end = date("Ymd");
        
        if(!self::existsLocalOnDate($end)) self::getPicAtAll();
        
    }
    
}
?>