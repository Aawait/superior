
// swiper轮播图
class MySwiper{
    constructor(){
       this.init();
       this.content();
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

    content(){
        new Swiper('.swiper-content',{
            direction:'horizontal',  // 播放方向水平还是垂直
            loop:true,               // 循环播放选项
            effect : 'fade',
            /**
             * fadeEffect
             * fade效果参数。可选参数：crossFade。
               默认：false。关闭淡出。过渡时，原slide透明度为1（不淡出），过渡中的slide透明度从0->1（淡入），其他slide透明度0。
               可选值：true。开启淡出。过渡时，原slide透明度从1->0（淡出），过渡中的slide透明度从0->1（淡入），其他slide透明度0。
             */
            fadeEffect:{
                crossFade:true,
            },
            autoplay:{              // 自动轮播
                disableOnInteraction: false,  // 操作banner后是否继续轮播，ture为停止，false为继续轮播
                delay:4000,        // 设置自动轮播时间
            },   
            
            speed:300,  // 轮播速度
        });
    }

}

 new MySwiper();


 // 渲染列表数据
 class GoodsList{
     constructor(name,url){
          this.box = document.querySelector(name);
          this.url = url;
          this.page = 1;
          this.length = 100;
          this.getData(this.url,this.page,this.length);
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
         this.count = res.total.count;
         this.render(res.data);
     }

     render(data){
         let str = '';
         const reg =new RegExp(/\d+\.?\d{0,2}/);
         data.forEach(item=>{
            
             str += `<div class='list-item' goods_id="${item.id}">
             <div class='item-top'><img
                     src="${item.img}"
                     alt=""></div>
             <div class='item-down'>
                 <p class='item-title'>
                     <i class='item-icon'></i>
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
         </div>`
         });
        
         this.box.innerHTML = str;
     }


 }

 new GoodsList('.list-content','../api/listData1.php');
