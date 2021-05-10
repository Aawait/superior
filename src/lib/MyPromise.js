
/**
  *  参数：
  *    1.url必填
  *    2.type选填  不填就默认为GET
  *    3.async选填  不填默认为true
  *    4.data选填  不填默认为''
  *    5.success必填
  *    6.error选填 不填默认给个匿名函数
  *   
  */

  // 返回promise对象的ajax
 function PAJAX(obj){
     return new Promise(function(resolve,reject){

        if (!obj) throw Error('参数不能为空');
        if (!obj.url) throw Error('url必须填写');
        
        function test(ele) {
            return Object.prototype.toString.call(ele);
        }
    
        obj.type = obj.type || 'GET';
        obj.async = obj.async == undefined ? true : obj.async;
        obj.data = obj.data || '';
    
        if (obj.type != 'GET' && obj.type != 'POST') throw Error('请求方式只支持GET或POST');
        if (test(obj.async) != '[object Boolean]') throw Error('async值必须为布尔值');
    
        if (test(obj.data) != '[object String]' && test(obj.data) != '[object Object]')  throw Error('data传递的参数为对象或字符串');
    
        if(test(obj.data) == '[object String]' && obj.data){
    
            if(!obj.data.includes('='))  throw Error('参数为字符串必须为key=value格式');
        }
    
        if(test(obj.data) == '[object Object]'){
            let str = '';
            for(let key in obj.data){
                str += `${key}=${obj.data[key]}&`;
            }
            obj.data = str.slice(0,-1);
        }
        
        const xhr = new XMLHttpRequest();
    
        if(obj.type == 'GET'){
            xhr.open(obj.type,`${obj.url}?${obj.data}`,obj.async);
            xhr.send();
        }
    
        if(obj.type == 'POST'){
            xhr.open(obj.type,obj.url,obj.async);
            xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            xhr.send(obj.data);
        }
    
        if(obj.async == false){
            if (/^2\d{2}$/.test(xhr.status)){
                resolve(xhr.responseText);
            }  
            if(/^[345]\d{2}$/.test(xhr.status)){
                reject(xhr.responseText);
            }
            return;
        }
    
        xhr.onload = function(){
            if (/^2\d{2}$/.test(xhr.status)){
                resolve(xhr.responseText);
            }  
            if(/^[345]\d{2}$/.test(xhr.status)){
                reject(xhr.responseText);
            }
        }
     })

    

 }

  /**
  *  参数：
  *    1.url必填
  *    2.type选填  不填就默认为GET
  *    3.async选填  不填默认为true
  *    4.data选填  不填默认为''
  *    5.success必填
  *    6.error选填 不填默认给个匿名函数
  *   
  */

  // 面向对象封装ajax
   class AJAX {
    constructor(obj) {
        if (!obj) throw Error('必须填写参数');
        if (!obj.url) throw Error('url不能为空');

        if (!obj.success || this.test(obj.success) != '[object Function]') throw Error('success不能为空而且格式为函数');

        this.url = obj.url;
        this.type = obj.type || "GET";
        this.async = obj.async == undefined ? true : obj.async;
        this.data = obj.data || '';
        this.success = obj.success;
        this.error = obj.error || function (error) {
            console.log(error);
        };
        this.init();
        this.send();
    }

    init() {
        if (this.type != "GET" && this.type != "POST") throw Error('只能支持GET或POST请求');
        if (this.test(this.async) != '[object Boolean]') throw Error('async必须填写布尔值');

        // data的类型只能为字符串或者对象
        if (!(this.test(this.data) == '[object String]' || this.test(this.data) == '[object Object]')) throw Error('data的类型只能为字符串或者对象');

        // 如果为字符串必须要有等号
        if (this.test(this.data) == '[object String]' && this.data) {
            if (!this.data.includes('=')) throw Error('参数为字符串必须为key=value格式');

        }
        // 如果为对象,要把它转为key=value形式
        if (this.test(this.data) == '[object Object]' && this.data) {
            let str = '';
            for (let key in this.data) {
                str += `${key}=${this.data[key]}&`;
            }
            this.data = str.slice(0, -1);
        }
    }
    test(ele) {
        return Object.prototype.toString.call(ele);
    }
    send() {

            this.xhr = new XMLHttpRequest();
            if (this.type == 'GET') {
                this.xhr.open(this.type, `${this.url}?${this.data}`, this.async);
                this.xhr.send();
            }
            if (this.type == 'POST') {
                this.xhr.open(this.type, this.url, this.async);
                this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                this.xhr.send(this.data);
            }

            // 判断异步同步拿到结果
            if (this.async == false) {
                if (/^2\d{2}$/.test(this.xhr.status)) {
                    this.success(this.xhr.responseText);
                   
                }
                if (/^[345]\d{2}$/.test(this.xhr.status)) {
                    this.error(this.xhr.responseText);
                   
                }
                return;
            }

            this.xhr.onload = () => {
                if (/^2\d{2}$/.test(this.xhr.status)) {
                    this.success(this.xhr.responseText);
                   
                }
                if (/^[345]\d{2}$/.test(this.xhr.status)) {
                    this.error(this.xhr.responseText);
                    
                }
            }
        
    }
}


// 返回promise对象的ajax请求
class MyPromise {
   constructor(obj) {
       if (!obj) throw Error('必须填写参数');
       if (!obj.url) throw Error('url不能为空');

       this.url = obj.url;
       this.type = obj.type || "GET";
       this.async = obj.async == undefined ? true : obj.async;
       this.data = obj.data || '';
       this.init();

       return new Promise((resolve, reject) => {
           this.xhr = new XMLHttpRequest();
           if (this.type == 'GET') {
               this.xhr.open(this.type, `${this.url}?${this.data}`, this.async);
               this.xhr.send();
           }
           if (this.type == 'POST') {
               this.xhr.open(this.type, this.url, this.async);
               this.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
               this.xhr.send(this.data);
           }

           // 判断异步同步拿到结果
           if (this.async == false) {
               if (/^2\d{2}$/.test(this.xhr.status)) {

                   resolve(this.xhr.responseText);
               }
               if (/^[345]\d{2}$/.test(this.xhr.status)) {

                   reject(this.xhr.responseText)

               }
               return;
           }

           this.xhr.onload = () => {
               if (/^2\d{2}$/.test(this.xhr.status)) {
                   
                   resolve(this.xhr.responseText);

               }
               if (/^[345]\d{2}$/.test(this.xhr.status)) {
                   
                   reject(this.xhr.responseText)

               }
           }

       })
   }

   init() {
       if (this.type != "GET" && this.type != "POST") throw Error('只能支持GET或POST请求');
       if (this.test(this.async) != '[object Boolean]') throw Error('async必须填写布尔值');

       // data的类型只能为字符串或者对象
       if (!(this.test(this.data) == '[object String]' || this.test(this.data) ==
               '[object Object]'))
           throw Error('data的类型只能为字符串或者对象');

       // 如果为字符串必须要有等号
       if (this.test(this.data) == '[object String]' && this.data) {
           if (!this.data.includes('=')) throw Error('参数为字符串必须为key=value格式');

       }
       // 如果为对象,要把它转为key=value形式
       if (this.test(this.data) == '[object Object]' && this.data) {
           let str = '';
           for (let key in this.data) {
               str += `${key}=${this.data[key]}&`;
           }
           this.data = str.slice(0, -1);
       }
   }

   test(ele) {
       return Object.prototype.toString.call(ele);
   }

}