<?php

  $key = $_POST['key'];

  $con = mysqli_connect("localhost","root","123456","superior");

  $sql = "SELECT * FROM `goods_list` WHERE `title` LIKE '%$key%'";

  $query = mysqli_query($con,$sql);

  
  $res = mysqli_fetch_assoc($query);
  
  if(!$res){
      die(json_encode(array(
          "code" => 0,
          "state" => "数据获取错误",
          "status" => 400
      ),JSON_UNESCAPED_UNICODE));
  }

  $arr = array();
  while($res){
      array_push($arr,$res);
      $res = mysqli_fetch_assoc($query);
  }

   echo json_encode(array(
       "code" => 1,
       "data" => $arr,
       "state" => "获取数据成功",
       "status" => 200
   ),JSON_UNESCAPED_UNICODE);




?>