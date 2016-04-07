<?php
require_once 'autoload.php';
// 引入鉴权类
use Qiniu\Auth as AUTH;

// 引入上传类
use Qiniu\Storage\BucketManager as BKM;
    

class LoadQiniu{
    // 需要填写你的 Access Key 和 Secret Key
    var $accessKey = 'IuDKM4c-08H6FTvvxr9UAS3RV6-ILsDowpu0a_r3';
    var $secretKey = 'E6N95oHDlyNbLgmHZCPuBUE28pHwEoSTVVjj0YH7';
    /*****
    // 要上传文件的本地路径
    //$filePath = './php-logo.png';
    // 上传到七牛后保存的文件名
    //$key = 'my-php-logo.png';
    */
    function upload($filePath,$key){
        // 构建鉴权对象
        $auth = new AUTH\Auth($accessKey, $secretKey);

        // 要上传的空间
        $bucket = 'ioliu';

        $bucketMgr = new BKM\BucketManager($auth);
        
        // 调用 BucketManager 的 fetch 方法进行文件的上传
        $items = $bucketMgr->fetch($filePath,$bucket, $key);
        
        print_r(var_dump($err));
    }
    
}





?>