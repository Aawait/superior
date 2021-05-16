<?php

  $user = $_GET['username'];
  $pass = $_GET['password'];

  $con = mysqli_connect("localhost","root","123456","superior");

  $query = mysqli_query($con,"SELECT * FROM `login` WHERE `username` = '$user' AND `password` = '$pass'");

  $res = mysqli_fetch_assoc($query);

  if(!$res){
      die(json_encode(array(
          "code" => 0,
          "state" => "登陆失败",
          "status" => 400
      )));
  }

  echo json_encode(array(
      "code" => 1,
      "state" => "登陆成功",
      "status" => 200,
      "Hello" => $user
  ));
  

?>