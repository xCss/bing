<?php
require_once 'autoload.php';
// 引入鉴权类
use Qiniu\Auth;

// 引入上传类
use Qiniu\Storage\UploadManager;

class LoadQiniu{
    
    // 需要填写你的 Access Key 和 Secret Key
    var $accessKey = 'IuDKM4c-08H6FTvvxr9UAS3RV6-ILsDowpu0a_r3';
    var $secretKey = 'E6N95oHDlyNbLgmHZCPuBUE28pHwEoSTVVjj0YH7';

    function upload($filePath,$key){
        // 构建鉴权对象
        $auth = new Auth($accessKey, $secretKey);

        // 要上传的空间
        $bucket = 'ioliu';

        // 生成上传 Token
        $token = $auth->uploadToken($bucket);

        // 要上传文件的本地路径
        //$filePath = './php-logo.png';

        // 上传到七牛后保存的文件名
        //$key = 'my-php-logo.png';

        // 初始化 UploadManager 对象并进行文件的上传
        $uploadMgr = new UploadManager();

        // 调用 UploadManager 的 putFile 方法进行文件的上传
        list($ret, $err) = $uploadMgr->putFile($token, $key, $filePath);
        echo "\n====> putFile result: \n";
        if ($err !== null) {
            var_dump($err);
        } else {
            var_dump($ret);
        }
    }
    
}





?>