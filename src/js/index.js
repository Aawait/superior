

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
