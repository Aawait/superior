<?php
   
   $user = $_GET['username'];
   $pass = $_GET['password'];

   $con = mysqli_connect("localhost","root","123456","superior");

   $queryUser = mysqli_query($con,"SELECT * FROM `login` WHERE `username` = '$user'");

   $userRes = mysqli_fetch_assoc($queryUser);

   if($userRes){
       die(json_encode(array(
          "code" => 0,
          "state" => "用户名已存在",
          "status" => 400,
       )));

   } 

   // 添加数据会成功返回一个布尔值
   $res = mysqli_query($con,"INSERT INTO `login` VALUES(null,'$user','$pass')");

   if(!$res){
       die(json_encode(array(
       "res" => $res,
       "code" => 0,
       "state" => "注册失败"
   )));

   }
    
   echo json_encode(array(
       "res" => $res,
       "code" => 1,
       "state" => "注册成功",
       "status" => 200,
       "Hello" => $user
   ));





?>