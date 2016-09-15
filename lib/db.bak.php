<?php

/**
* CopyRight Bitmoe · xCss
* Link https://api.ioliu.cn 
* Follow https://github.com/xCss/bing
*/
class DBHelper{
    
    public function DBHelper(){}
    
    private static function getConn(){
        $conn = mysqli_connect("******.my3w.com","******","******","******_db");
        mysqli_query($conn,"SET NAMES utf8");
        return $conn;
    }
    
    public static function opearting($sql){
        return mysqli_query(self::getConn(),$sql);
        
    }
}

?>