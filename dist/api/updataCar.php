<?php
    $id = $_POST['goods_id'];
    $num = $_POST['goods_num'];
    $username = $_POST['username'];

    $con = mysqli_connect('localhost','root','123456','superior');

    $sql = "UPDATE `cart` SET `goods_num` = '$num' WHERE `userName`= '$username' AND `goods_id` = '$id'";

    $res = mysqli_query($con,$sql);

    if(!$res){
        die('数据库链接失败'  . mysqli_error($con));
    }

    print_r(json_encode(array('code'=>$res,'msg'=>'修改成功'),JSON_UNESCAPED_UNICODE));

?>