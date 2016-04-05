<?php 

session_start();
/**
* 每日一言
* CopyRight Bitmoe · eary
* Link https://api.ioliu.cn 
* Follow https://github.com/eary/bing
*/
require('../lib/db.php');

class Daily{
    
    /**
    * 获取每日一言
    */
    function getDailyOnDay(){
        
        $d = date('Y-m-d');
        
        $sql = 'select * from daily_one where showdate='.$d;
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
            
        }
        
        
        return $data;
        
    }
    
    function getDailyOnRand(){
       
       $max = self::getCount();
       
       $rand = mt_rand(1,$max);
        
        $sql = 'select * from daily_one where id='.$rand;
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
            
        }
        
        return $data;
    }
    
    function getAllDaily($pageNo=1,$pageSize=20){
        
        if($pageNo == 0) $pageNo = 1;
        
        if($pageNo == 0) $pageNo = 1;
                
        $sql = "select a.id,a.uid,a.text,a.createtime,a.showdate,a.imgurl,b.uname from daily_one as a,daily_user as b where a.uid=b.id order by a.createtime desc limit ".($pageNo-1)*$pageSize.",".$pageSize;
        
        $rs = DBHelper::opearting($sql);
        
        $data = array();
        
        $i = 0;
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data[] = $row;
            
        }
        
        $sum = self::getCount();
        
        $page = array();
        
        $page['sum'] = $sum;
        $page['pageNo'] = $pageNo;
        $page['pageSize'] = $pageSize;
        $page['lastNo'] = ceil($sum/$pageSize);
        $page['nextNo'] = $pageNo + 1 >= $page['lastNo'] ? $page['lastNo'] : $pageNo + 1;
        $page['prevNo'] = $pageNo - 1 <= 1 ? 1 : $pageNo - 1;
        
        $result = array();
        
        $result['page'] = $page;
        $result['txts'] = $data;
        
        return $result;
        
    }
    
    /**
    * 查询总条数
    */
    function getCount(){
        
        $sql = 'select count(id) as num from daily_one';
        
        $data = array();
        
        $rs = DBHelper::opearting($sql);
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data = $row;
            
        }
        
        return $data['num'];
    }
    
    function addText($text){
        
        $sql = 'insert into daily_one(text,uid) values("'.htmlspecialchars($text).'",'.$_SESSION['user']['id'].')';
        
        return DBHelper::opearting($sql);
    }
    
    function delById($id){
        
        $sql = 'delete from daily_one where id='.$id.' and uid='.$_SESSION['user']['id'];
        
        return DBHelper::opearting($sql);
    }
    
    function updateTextById($id,$text){
        
        $sql = 'update daily_one set text="'.$text.'" where id='.$id.' and uid='.$_SESSION['user']['id'];
        
        return DBHelper::opearting($sql);
        
    }
    
    function updateShowdateById($id,$date){
        
        $sql = 'update daily_one set showdate="'.$date.'" where id='.$id.' and uid='.$_SESSION['user']['id'];
        
        return DBHelper::opearting($sql);
        
    }
    
    
    
    function login($name,$pwd){
        
        $sql = 'select * from daily_user where uname="'.$name.'" and upwd=md5("'.$pwd.'")';
        
        $data = array();
        
        $rs = DBHelper::opearting($sql);
        
        while($row = mysqli_fetch_assoc($rs)){
            
            $data = $row;
            
        }
        
        return $data;
        
    }
}

?>

