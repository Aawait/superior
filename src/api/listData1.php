<?php
  
  $page = $_POST['page'];
  $length = $_POST['length'];
  $start = ($page-1)*$length;

 // 连接数据库
  $con = mysqli_connect("localhost","root","123456","superior");
  
  // 设置sql语句
  $sql = "SELECT * FROM `goods_list` LIMIT $start,$length";
 
  // 查询数据
  $query = mysqli_query($con,$sql);

  if(!$query){
      die('error' .mysqli_error($con));
  }
  
  // 处理查询数据
  $res = mysqli_fetch_assoc($query);

  $arr = array();
  
  // 循环如果有数据。就把它添加到数组，并继续处理
  while($res){
      array_push($arr,$res);
      $res = mysqli_fetch_assoc($query);
  }
 

  // 查询并获取数据总数量
  $count = "SELECT COUNT(*) `count` FROM `goods_list`";

  $dispose = mysqli_query($con,$count);

  $total = mysqli_fetch_assoc($dispose);

  // 输出数据返回给前端
  echo json_encode(array(
      "total" => $total,
      "data" => $arr,
      "code" => 1,
      "hello" => "Hello cici",
      "message" => "获取list数据成功了",
  ),JSON_UNESCAPED_UNICODE);

?>