<?php
require_once 'autoload.php';
// 引入鉴权类
use Qiniu\Auth;

// 引入上传类
use Qiniu\Storage\BucketManager;
    

class LoadQiniu{
    // 需要填写你的 Access Key 和 Secret Key
    public $accessKey = 'e8qjVjHZTMUgNFKV6FevcjIRy8Ld99V-z2Io0trS';
    public $secretKey = 'L6_wdVZEcU_Krf8aF6f9g8hfeFDfliWBhX-AGfLi';
    /*****
    // 要上传文件的本地路径
    //$filePath = './php-logo.png';
    // 上传到七牛后保存的文件名
    //$key = 'my-php-logo.png';
    */
    function upload($filePath,$key){
        // 构建鉴权对象
        $auth = new Auth(self::$accessKey, self::$secretKey);
        echo $auth;
        // 要上传的空间
        $bucket = 'ioliu';

        $bucketMgr = new BucketManager($auth);
        
        // 调用 BucketManager 的 fetch 方法进行文件的上传
        $items = $bucketMgr->fetch($filePath,$bucket, $key);
        
        var_dump($items);
        
    }
    
}





?>