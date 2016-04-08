<?php 
/**
* CopyRight Bitmoe · eary
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require_once 'autoload.php';
require_once 'db.php';

// 引入鉴权类
use Qiniu\Auth;

// 引入上传类
use Qiniu\Storage\BucketManager;
    

class Base{
    
    public $accessKey = 'e8qjVjHZTMUgNFKV6FevcjIRy8Ld99V-z2Io0trS';
    public $secretKey = 'L6_wdVZEcU_Krf8aF6f9g8hfeFDfliWBhX-AGfLi';
    
    /**
     * 上传到七牛
     * @param [[Type]] $imgurl  远程图片路径
     * @param [[Type]] $imgname 图片名字
     */
    function fetchToQiniu($imgurl,$imgname){
        // 构建鉴权对象
        $auth = new Auth($this->accessKey, $this->secretKey);
        //echo $auth;
        // 要上传的空间
        $bucket = 'ioliu';

        $bucketMgr = new BucketManager($auth);
        
        // 调用 BucketManager 的 fetch 方法进行文件的上传
        $items = $bucketMgr->fetch($imgurl,$bucket, $imgname);
        
        return $items;
        
    }
    
    /**
    * 随机获取图片
    */
    function getRandPic(){
        
        
        $max = round((time() - strtotime('20160305')) / 3600 /24);
        
        $rand = mt_rand(1,$max);
        
        $sql = "select * from bing where id=".$rand;
        
        //echo $sql;exit;
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
            
        }
        if(count($data) == 0){
            echo '<center style="color:#928E8E;font-family: Courier, monospace;margin-top:100px;"><h1>Sorry, No more Pictures of</h1></center>';exit;
        }
        
        return $data[0];
        
    }
    
    /**
    * 获取最新张照片
    */
    function getLastPic(){
        
        $start = date("Ymd",strtotime("-1 day"));
        $end = date("Ymd");
        
        self::checkNewOnBing();
        
        $sql = "select * from bing where startdate='".$start."' and enddate='".$end."' order by enddate desc";
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        
        //echo $sql;exit;
        $i=0;
        while($row = mysqli_fetch_assoc($rs)){
            $data[$i] = $row;
            $data[$i]['date'] = date('Y-m-d',strtotime($row['enddate']));
            
            $i++;
            
        }
        
        if(count($data) == 0){
            echo '<center style="color:#928E8E;font-family: Courier, monospace;margin-top:100px;"><h1>Sorry, No more Pictures of</h1></center>';exit;
        }
        
        return $data[0];
        
    }
    
    /**根据id查询**/
    function getPicById($id){
        
        $sum = self::getCount();
        
        if($id<=0) $id = 1;
        
        if($id>=$sum) $id = $sum;
        
        self::checkNewOnBing();
        
        $sql = "select * from bing where id=".$id."";
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        
        //echo $sql;exit;
        $i=0;
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[$i] = $row;
            $data[$i]['date'] = date('Y-m-d',strtotime($row['enddate']));
            
            $i++;
            
        }
        
        if(count($data) == 0){
            echo '<center style="color:#928E8E;font-family: Courier, monospace;margin-top:100px;"><h1>Sorry, No more Pictures of</h1></center>';exit;
        }
        
        return $data[0];
    }
    
    /**
    * 分页查询
    */
    function getPicsByPagin($pageNo=1,$pageSize=9){
        
        self::checkNewOnBing();
        
        $sum = self::getCount();
        
        if($pageNo <= 0) $pageNo = 1;
        
        $lastNo = ceil($sum/$pageSize);
        
        if($pageNo >= $lastNo) $pageNo = $lastNo;
        
        //$page['sum'] = $sum;
        
        $page = array();
        $page['lastNo'] = $lastNo;
        $page['nextNo'] = $pageNo + 1 >= $lastNo ? $lastNo : $pageNo + 1;
        $page['prevNo'] = $pageNo - 1 <= 1 ? 1 : $pageNo - 1;
        $page['pageNo'] = $pageNo;
                
        $sql = "select * from bing order by enddate desc limit ".($pageNo-1)*$pageSize.",".$pageSize;
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        $i = 0;
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[$i] = $row;
            $data[$i]['date'] = date('Y-m-d',strtotime($row['enddate']));
            $data[$i]['img_url'] = str_replace('1920x1080','1280x768',$row['url']);
            
            $i++;
            
        }
        
        $result = array();
        
        $result['page'] = $page;
        $result['images'] = $data;
        
        return $result;
        
    }
    
    /**
    * 根据日期查询
    */
    function getPicOnDay($day=0){
        
        
        $start = date("Ymd",strtotime("-$day day"));
        
        $sql = 'select * from bing where startdate='.$start.' order by startdate desc';
        
        $rs = DBHelper::opearting($sql);
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
            
        }
        if(count($data) == 0){
            echo '<center style="color:#928E8E;font-family: Courier, monospace;margin-top:100px;"><h1>Sorry, No more Pictures.</h1></center>';exit;
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
        
        $url = 'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=100';
        
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
        self::getMoreInfo();
        //return $url;
        self::putQiniu();
    }
    
    
    /**
     * 得到更多信息
     */
    function getMoreInfo(){
        
        //$param = '?d='.date('Ymd',strtotime("-$d day"));
                
        $url = 'http://cn.bing.com/cnhp/coverstory/';
        
        $end = date('Ymd');
        
        $html = file_get_contents($url);
        //字符串转码
        $html = mb_convert_encoding( $html, 'UTF-8', 'UTF-8,GBK,GB2312,BIG5' );

        $obj = json_decode($html,true);
        
        $exists_sql = 'select count(id) as num from bing where title="'.$obj['title'].'"';
        $data = array();
        
        $rs = DBHelper::opearting($exists_sql);
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data = $row;
            
        }
        //echo $data['num']>0;exit;
        if($data['num']>0) {
        }else {
            
            $sql = 'update bing set title="'.$obj['title'].'",attribute="'.$obj['attribute'].'",description="'.$obj['para1'].'" where enddate='.$end;
            
            //print_r($sql);
            DBHelper::opearting($sql);
        
        }
        
    }
    
    /**
     * 上传到七牛
     */
    function putQiniu(){
        
        $resolution = array(
            '1920x1200',
            '1920x1080',
            '1366x768',
            '1280x768',
            '1024x768',
            '800x600',
            '800x480',
            '768x1280',
            '720x1280',
            '640x480',
            '480x800',
            '400x240',
            '320x240',
            '240x320'
        );
        
        $sql = 'select id,url,urlbase from bing where ISNULL(qiniu_url) || qiniu_url=""';
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
        
        }
        
        var_dump($data);exit;
        $i=0;
        $somes = array();
        if(count($data)>0){
            
            foreach($data as $key=>$value){
                $qiniu_prefix = substr(strrchr($value['urlbase'], "/"),1);
                foreach($resolution as $res){
                    //substr(strrchr($str, "|"), 1);
                    $img_name = 'bing/'.$qiniu_prefix.'_'.$res.'.jpg';
                    $items = $this->fetchToQiniu($value['url'],$img_name);
                    array_push($somes,$items);
                }
                $update_sql = 'update bing set qiniu_url="'.$$qiniu_prefix.'" where id='.$value['id'];
                DBHelper::opearting($update_sql);
                $i++;
            }
            
        }
        var_dump($somes);
        
    }
    
    
    
    /**
    * 插入数据库
    */
    function putLocalPic($obj){
        
        $sql = "insert into bing(startdate,enddate,fullstartdate,hsh,url,urlbase,copyright,copyrightlink) values('".$obj['startdate']."','".$obj['enddate']."','".$obj['fullstartdate']."','".$obj['hsh']."','".$obj['url']."','".$obj['urlbase']."','".$obj['copyright']."','".$obj['copyrightlink']."')";
        
        return DBHelper::opearting($sql);
        
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
    
    /*
    * 直接输出图片到页面
    */
    function outputPic($url,$w,$h){
    
        if($w&&$h){
            $url = str_replace('1920x1080',$w.'x'.$h,$url);
        }
        header('Content-Type:image/jpeg');
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'User-Agent: Mozilla/5.0 (Windows NT 6.2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36'
        ));
        curl_setopt($ch, CURLOPT_TIMEOUT,0);//忽略超时
        curl_setopt($ch, CURLOPT_NOBODY, false);
        $str = curl_exec($ch);
        curl_close($ch);
        
    }
    
}
?>