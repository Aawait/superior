
// 登录页面

 class Login{
    constructor(loginUrl,registerUrl){
         this.loginUrl = loginUrl;
         this.registerUrl = registerUrl;
         this.userReg = new RegExp(/^[a-zA-Z0-9_-]{4,10}$/);
         this.passReg = new RegExp(/[a-zA-Z]{1}\w{5,17}/);

         this.init(this.loginUrl);
         this.register(this.registerUrl);
    }
    init(url){
        this.user = document.getElementById('username');
        this.pass = document.getElementById('password');
        this.btn = document.querySelector('.btn');

        this.registerBtn = document.querySelector('.register');
        this.userTest = document.querySelector('.userTest');
        this.passTest = document.querySelector('.passTest');

        this.btn.onclick = () =>{

            if(!this.userReg.test(this.user.value)){
                this.userTest.style.opacity = 1;
                this.user.style.borderColor = "#f00";
                return;
            }

            if(!this.passReg.test(this.pass.value)){
                this.passTest.style.opacity = 1;
                this.pass.style.borderColor = "#f00";
                return;
            }

           let p = new MyPromise({
                url,
                data:{
                    username:this.user.value,
                    password:this.pass.value
                }
            });
           p.then(res=>{
               res = JSON.parse(res);
               if(!res.code){
                   alert("用户名或密码错误,登录失败");
                   return;
               } 
               window.alert("登录成功!即将跳转首页");
               let expires = 0.5*60*60;
               document.cookie = `user=${res.Hello};path=/`;
               location.href = `../index.html?user=${res.Hello}`;
           })

        }
    }

    register(url){

        this.registerBtn.onclick = () =>{

            if(!this.userReg.test(this.user.value)){
                this.userTest.style.opacity = 1;
                this.user.style.borderColor = "#f00";
                return;
            }

            if(!this.passReg.test(this.pass.value)){
                this.passTest.style.opacity = 1;
                this.pass.style.borderColor = "#f00";
                return;
            }
            
            let p = new MyPromise({
                url,
                data:{
                    username:this.user.value,
                    password:this.pass.value,
                }
            });

            p.then(res=>{
                res = JSON.parse(res);

                if(!res.code){
                   window.alert(res.state);
                }

                window.alert(res.state);
                document.cookie = `user=${res.Hello}`;
                location.href = `../index.html?user=${res.Hello}`;
            })

        }
    }
 }
 new Login('../api/login.php','../api/register.php');