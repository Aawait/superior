<?php
    // 获取传递过来的用名 和 商品id
    $username = $_GET['username'];
    $goods_id = $_GET['goods_id'];

    // $username = '婧婧';
    // $goods_id = 6;

    $con = mysqli_connect('localhost','root','123456','superior');

    $sql = "DELETE FROM `cart` WHERE `cart`.`goods_id` = '$goods_id' AND `username` = '$username'";

    $res = mysqli_query($con,$sql);

    if(!$res){
        // die('error for mysqli' . mysqli_error());
        echo json_encode(array("code"=>false,"msg"=>"删除数据失败"),JSON_UNESCAPED_UNICODE);
    }else{
        echo json_encode(array("code"=>$res,"msg"=>"删除数据成功"),JSON_UNESCAPED_UNICODE);
    }
?>