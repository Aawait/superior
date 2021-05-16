

// 封装一个设置cookie的方法

 function setCookie(key,value,expires){
 
     if(!(key||value)) throw Error('key和value不能为空');
     
     if(!expires){
        document.cookie = `${key}=${value};path=/` ;
        return;
     } 
     // 假设默认过期时间为分钟

     const date = new Date();

     //0时区时间戳+传进来的过期时间
     const zero = date.getTime() - 8*60*60*1000 + expires*60*1000 ;  
      date.setTime(zero);
     
     document.cookie = `${key}=${value};expires=${date};path=/`;
     
 }
 
 // 封装一个获取cookie的方法
 function getCookie(key){

     let str = document.cookie;
     let arr = str.split('; ');
     let obj = {};
     arr.forEach(item=>{
        let newArr =  item.split('=');
        obj[newArr[0]] = newArr[1];
     })

    if(!key){
        return obj;
    }
    
    for(let item in obj){
        if(key == item){
            return obj[item];
        }
    }

 }
