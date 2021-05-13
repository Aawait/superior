// 首页

// swiper轮播图
class MySwiper{
    constructor(){
       this.init();
    }
    init(){
        this.swiper = document.querySelector('.swiper-container');
        this.btn = this.swiper.querySelectorAll('.swiper-button-white');

        this.swiper.onmouseover = () =>{
            this.btn.forEach(item=>{
                item.classList.add('swiper-button-hide');
            })
        }
        
        this.swiper.onmouseout = () =>{
            this.btn.forEach(item=>{
                item.classList.remove('swiper-button-hide');
            })
        }
        new Swiper('.swiper-container',{
            /**
             * fadeEffect
             * fade效果参数。可选参数：crossFade。
               默认：false。关闭淡出。过渡时，原slide透明度为1（不淡出），过渡中的slide透明度从0->1（淡入），其他slide透明度0。
               可选值：true。开启淡出。过渡时，原slide透明度从1->0（淡出），过渡中的slide透明度从0->1（淡入），其他slide透明度0。
             */

            direction:'horizontal',  // 播放方向水平还是垂直
            loop:true,               // 循环播放选项
        
            autoplay:{              // 自动轮播
                disableOnInteraction: false,  // 操作banner后是否继续轮播，ture为停止，false为继续轮播
                delay:4000,        // 设置自动轮播时间
            },   
        
            speed:500,  // 轮播速度
        
            // 分页器
            pagination:{
                el:'.swiper-pagination',
                clickable :true,
            },
            
            // 前进后退按钮
            navigation:{
                nextEl :'.swiper-button-next',
                prevEl :'.swiper-button-prev',
            },
        
        });
        
    }

}

 new MySwiper();


 // 轮播商品功能
 class WheelGoods{
      constructor(name,url){
          this.box = document.querySelector(name);
          this.url = url;
          this.id = 1;
          this.length = 3;
          this.getData(this.url,this.id,this.length);
          this.time();

      }
      time(){
          // 商品每隔10秒自动轮播
           let seconds = 0.5*60*60*1000;
            setInterval(()=>{
                this.box.innerHTML = '';
                this.id++;
                this.getData(this.url,this.id,this.length);
            },seconds);
      }
      async getData(url,page,length){
          let res = await new MyPromise({
              url,
              type : "POST",
              data:{
                page,
                length
              }
          });
        res = JSON.parse(res);
        this.count = res.total.count;
        if(this.id >= this.count){
            this.id = 1;
        }

        this.render(res.data);

      }

      render(data){
          data.forEach(item=>{
              this.box.innerHTML += `
              <a href="../views/details.html?id=${item.id}" goods_id=${item.id}>
              <i>买一送一</i>
              <span>${item.title}</span>
              </a>
              `
          });

      }
 }

 new WheelGoods('.wheel-list','../api/listData1.php');


 // 渲染列表数据
 class GoodsList{
     constructor(name,url){
          this.box = document.querySelector(name);
          this.url = url;
          this.page = 1;
          this.length = 100;
          this.count = 3500;
          this.init();
     }
     init(){

        // 初始化分页
          new Pagination('#page',{
            pageInfo: {
                pagenum: 1, // 当前页数
                pagesize: this.length, // 每页多少条
                total: this.count, // 数据总数
                totalpage: Math.ceil(this.count / this.length ) // 页码总数
              },
              textInfo: {
                first: '首页',
                prev: '上一页',
                next: '下一页',
                last: '尾页'
              },
              change: index =>{
                  this.getData(this.url,index,this.length);
                  window.scrollTo(0,0);
              }
          })
     }

     async getData(url,page,length){
         let res = await new MyPromise({
              url,
              type:"POST",
              data:{
                page,
                length
              }
         });
         res = JSON.parse(res);
         this.count = res.total.count;  //获取数据总数，这里没有用。异步拿不到这个属性
         this.render(res.data);
     }

     render(data){
         let str = '';
         const reg =new RegExp(/\d+\.?\d{0,2}/);
         data.forEach(item=>{
            
             str += `<a href="../views/details.html?id=${item.id}" class='list-item' goods_id="${item.id}" target="_blank">
             <div class='item-top'><img
                     src="${item.img}"
                     alt=""></div>
             <div class='item-down'>
                 <p class='item-title'>
                     <img src="https://cmsstatic.ffquan.cn/images/tmall.png?v=2021323305356" alt="" class="item-icon">
                     <span class='item-text'>${item.title}</span>
                 </p>
                 <p class='item-sale'>
                     <span>原价<i>${reg.exec(item.old_price)[0]}</i></span>
                     <span>销量<i>${reg.exec(item.sales)[0]}万</i></span>
                 </p>
                 <p class='item-price'>
                     <span>￥<i>${item.now_price}</i></span>
                     <span><i>${reg.exec(item.cheap)[0]}</i>元券</span>
                 </p>
             </div>
         </a>`
         });
        
         this.box.innerHTML = str;
     }
    

 }

 new GoodsList('.list-content','../api/listData1.php');


 // 悬浮搜索框功能
 class FloatNav{
     constructor(ele){
         this.ele = document.querySelector(ele);
         this.init();
     }
     init(){
         this.hedaerTop = document.querySelector('#header').offsetHeight;
         this.navTop = document.querySelector('#nav').offsetHeight;

          // addEventListener 事件监听绑定 解决多个window.onscroll 冲突覆盖问题
         window.addEventListener("scroll",e=>{
            if(window.scrollY >= (this.hedaerTop + this.navTop)){
                this.ele.style.height = '50px';
                this.ele.style.opacity = 1;
            }else{
                 this.ele.style.height = 0;
                 this.ele.style.opacity = 0;
            }
         });
    
     }

 }

 new FloatNav('#hide-nav');


 // ad区商品自动更换功能
 class Adgoods{
        constructor(calssName,url){
            this.box = document.querySelector(calssName);
            this.url = url;
            this.id = 26; // 这里从第101条开始请求，因为后端会-1 再*长度 所以从26开始
            this.length = 4;
            this.init();
            this.getData(this.url,this.id,this.length);
        }

        init(){

            // 点击换一换按钮
            this.btn = document.querySelector('.left-top-btn');
            this.btn.onclick = () =>{
                this.id++;
                this.getData(this.url,this.id,this.length);
            }
            
            // 商品数据一小时自动更新一次
            let time = 1*60*60*1000;
            setInterval(()=>{
                this.id++;
                this.getData(this.url,this.id,this.length);
            },time);
        }
       async getData(url,page,length){
          let res = await new MyPromise({
              type:"POST",
              url,
              data:{
                 page,
                 length
              }
          });

          res = JSON.parse(res);
          this.render(res.data);
        }

        render(data){
           let str = '';
           const reg =new RegExp(/\d+\.?\d{0,2}/);
           data.forEach(item=>{
               str += `
               <a href="../views/details.html?id=${item.id}" class='left-top-item' goods_id="${item.id}">
                    <div class='top-item-left'>
                        <img src="${item.img}"
                            alt="">
                    </div>
                    <div class='top-item-right'>
                        <p class='item-right-title'>${item.title}</p>
                        <p class='item-right-icon'>
                            <span class='half-price'>第二件半价</span>
                        </p>
                        <p class='item-right-price'>
                            <span>￥${reg.exec(item.now_price)[0]}</span>
                            <b>￥${reg.exec(item.old_price)[0]}</b>
                        </p>
                    </div>
                </a>
               `;

               this.box.innerHTML = str;
           })
        }

 }

 new Adgoods('.left-top-goods','../api/listData1.php');
 

 // ad区倒计时功能
 class CountDown{
     constructor(ele){
       this.ele = document.querySelector(ele);
       this.endTime =new Date().getTime()+24*60*60*1000;
       this.init();
       this.getTime();
     }
     init(){
         this.hours = this.ele.querySelector('.title-time-hours');
         this.minutes = this.ele.querySelector('.title-time-minutes');
         this.seconds = this.ele.querySelector('.title-time-seconds');
     }

     getTime(){
             setInterval(()=>{
                 // 获取当前时间毫秒数 === new Date().getTime();
                  let nowTime = Date.now();
     
                  // 计算结束时间到开始时间的差值 把毫秒转为以秒为单位
                  let time = (this.endTime - nowTime) / 1000;
                  
                  let seconds = parseInt(time % 60);  // 获取剩下的秒数
                  
                  let minutes = Math.floor((time / 60) % 60);  // 获取剩下的分钟
     
                  let hours =  Math.floor(time / 60 / 60) ;   // 获取剩下的小时
                  
                  this.seconds.innerText = seconds < 10 ? '0' + seconds : seconds;
                  this.minutes.innerText = minutes < 10 ? '0' + minutes : minutes;
                  this.hours.innerText = hours < 10 ? '0' + hours : hours; 
             },1000);
     }  

 }

 new CountDown('.ad-title-time');


 // 回到顶部按钮功能
 class BackTop{
     constructor(btn){
        this.btn = document.querySelector(btn);
        this.init();
     }
     init(){
         this.bannerTop = document.querySelector('.banner').offsetHeight;
         this.hedaerTop = document.querySelector('#header').offsetHeight;
         this.navTop = document.querySelector('#nav').offsetHeight;

         this.scrollTop = this.bannerTop + this.hedaerTop + this.navTop;
        
         // addEventListener 事件监听绑定 解决多个window.onscroll 冲突覆盖问题
         window.addEventListener("scroll",e=>{

            if(window.scrollY >= this.scrollTop){
                this.btn.style.height = '50px';
            }else{
                this.btn.style.height = 0;
            }
         });
        
         this.btn.onclick = () =>{
             window.scrollTo(0,0);
         }
     }

 }

 new BackTop('.back-top');  



 
