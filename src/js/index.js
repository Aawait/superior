// 首页

// 搜索框模糊查询功能
class Search{
    constructor(name,url,input){
        this.box = document.querySelector(name);
        this.url = url;
        this.input = document.querySelector(input);
        this.init();
    }

    init(){
        this.input.oninput = () =>{
            const reg = new RegExp(/'/);
            if(reg.test(this.input.value)) return;

            if(this.input.value){
                this.box.style.display = "block";
            }else{
                this.box.style.display = "none";
            }

            let p = new MyPromise({
                url:this.url,
                type:"POST",
                data:{
                    key:this.input.value
                }
            });
            
            p.then(value=>{
                
                value = JSON.parse(value);
                if(value.status == 400) return;
                this.render(value.data);
            })
        }
    }

    render(data){
        let str = '';

        if(data.length>=10){
             data = data.filter((item,index)=>{
                return index <10;
            })
        }
        data.forEach(item=>{
            str += `
            <li>
            <a href="./views/details.html?id=${item.id}" goods_id="${item.id}">${item.title}</a>
            </li>
            `
        });

        this.box.innerHTML = str;

    
    }
}

// 主搜索框
new Search('.search-ul','./api/search.php','.search-inp');

// 悬浮的小搜索框
new Search('.float-ul','./api/search.php','.float-search');

// swiper轮播图
class MySwiper {
    constructor() {
        this.init();
    }
    init() {
        this.swiper = document.querySelector('.swiper-container');
        this.btn = this.swiper.querySelectorAll('.swiper-button-white');

        this.swiper.onmouseover = () => {
            this.btn.forEach(item => {
                item.classList.add('swiper-button-hide');
            })
        }

        this.swiper.onmouseout = () => {
            this.btn.forEach(item => {
                item.classList.remove('swiper-button-hide');
            })
        }
        new Swiper('.swiper-container', {
            /**
             * fadeEffect
             * fade效果参数。可选参数：crossFade。
               默认：false。关闭淡出。过渡时，原slide透明度为1（不淡出），过渡中的slide透明度从0->1（淡入），其他slide透明度0。
               可选值：true。开启淡出。过渡时，原slide透明度从1->0（淡出），过渡中的slide透明度从0->1（淡入），其他slide透明度0。
             */

            direction: 'horizontal', // 播放方向水平还是垂直
            loop: true, // 循环播放选项

            autoplay: { // 自动轮播
                disableOnInteraction: false, // 操作banner后是否继续轮播，ture为停止，false为继续轮播
                delay: 4000, // 设置自动轮播时间
            },

            speed: 500, // 轮播速度

            // 分页器
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },

            // 前进后退按钮
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },

        });

    }

}

new MySwiper();


// 轮播商品功能
class WheelGoods {
    constructor(name, url) {
        this.box = document.querySelector(name);
        this.url = url;
        this.id = 1.1;  // 从第100条开始获取数据
        this.length = 1000;  // 获取1000条先
        this.index = 0; //定义一个索引标识，用来过滤本地数据

        this.getData(this.url, this.id, this.length);
        this.render();
        this.time();

    }

    time() {
        // 商品每隔5秒自动轮播
        setInterval(() => {
        
            this.box.innerHTML = ''; // 每次先清空数据，再来渲染新数据
            this.index += 3;    // 每次进来索引自增，保证从本地取数据不会重复
            this.render();  // 调用渲染

        }, 5000);
    }

    async getData(url, page, length) {
        let res = await new MyPromise({
            url,
            type: "POST",
            data: {
                page,
                length
            }
        });
         // 获取数据存入本地，这样定时器直接从本地拿数据，不会发送多次请求渲染了,优化了性能
          localStorage.setItem('list',res);
    }

    render() {
        
        // 获取本地存储的数据
        let list =JSON.parse(localStorage.getItem('list'));

        if(!list) return; // 异步存储有时候刷新网页获取不到本地数据会报错

        // this.index大于了数据的长度,代表数据取完了，重置this.index
        if(this.index >= list.data.length){
            this.index = 0;
        }

        // 从本地过滤3条数据出来，每次调用都会让 this.index += 3 ,数据不会重复,通过定时器不断调用达到页面自动刷新
        let newData = list.data.filter((item,index)=>{
            return index >= this.index && index < this.index +3;
        })
        
        // 拿到过滤出来的三条数据渲染页面
        newData.forEach(item => {
            this.box.innerHTML += `
              <a href="./views/details.html?id=${item.id}" goods_id=${item.id}>
              <i>买一送一</i>
              <span>${item.title}</span>
              </a>
              `
        });

    }
}

new WheelGoods('.wheel-list', './api/listData1.php');


// 渲染列表数据
class GoodsList {
    constructor(name, url) {
        this.box = document.querySelector(name);
        this.url = url;
        this.page = 1;
        this.length = 100;
        this.count = 3500;
        this.init();
    }
    init() {

        // 初始化分页
        new Pagination('#page', {
            pageInfo: {
                pagenum: 1, // 当前页数
                pagesize: this.length, // 每页多少条
                total: this.count, // 数据总数
                totalpage: Math.ceil(this.count / this.length) // 页码总数
            },
            textInfo: {
                first: '首页',
                prev: '上一页',
                next: '下一页',
                last: '尾页'
            },
            change: index => {
                this.getData(this.url, index, this.length);
                // window.scrollTo(0, 0);
            }
        })
    }

    async getData(url, page, length) {
        let res = await new MyPromise({
            url,
            type: "POST",
            data: {
                page,
                length
            }
        });
        res = JSON.parse(res);
        this.count = res.total.count; //获取数据总数，这里没有用。异步拿不到这个属性
        this.render(res.data);
    }

    render(data) {
        let str = '';
        const reg = new RegExp(/\d+\.?\d{0,2}/);
        data.forEach(item => {

            str += `<a href="./views/details.html?id=${item.id}" class='list-item' goods_id="${item.id}" target="_blank">
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

new GoodsList('.list-content', './api/listData1.php');


// 悬浮搜索框功能
class FloatNav {
    constructor(ele) {
        this.ele = document.querySelector(ele);
        this.init();
    }
    init() {
        this.hedaerTop = document.querySelector('#header').offsetHeight;
        this.navTop = document.querySelector('#nav').offsetHeight;
        this.search = document.querySelector('.float-search');
        this.floatUl = document.querySelector('.float-ul');

        // addEventListener 事件监听绑定 解决多个window.onscroll 冲突覆盖问题
        window.addEventListener("scroll", e => {
            if (window.scrollY >= (this.hedaerTop + this.navTop)) {
                this.ele.style.height = '50px';
                this.ele.style.opacity = 1;
            } else {
                this.ele.style.height = 0;
                this.ele.style.opacity = 0;
                this.search.value = '';
                this.floatUl.style.display = 'none';
            }
        });

    }

}

new FloatNav('#hide-nav');


// ad商品区自动更换功能
class Adgoods {
    constructor(calssName, url) {
        this.box = document.querySelector(calssName);
        this.url = url;
        this.id = 1.1; // 这里从第100条数据开始请求
        this.length = 1000; // 先请求1000条

        // 这里定义一个索引标识初始值。用来过滤数据
        this.index = 0;
        this.getData(this.url, this.id, this.length);
        this.init();
        this.render();
    }

    init() {

        // 点击换一换按钮
        this.btn = document.querySelector('.left-top-btn');
        this.btn.onclick = () => {
            // 每次点击让索引+4,用来过滤数据,再调用渲染
            // 这样就不用发起多次请求，一次请求就够了，点击时直接从本地过滤数据
            this.index += 4;
            this.render();
        }

        // 点击查看更多按钮
        this.seeMore = document.querySelector('.left-see-more');
        this.seeMore.onclick = () =>{
            window.scrollTo(0,7700);
            
        }

        // 商品数据10秒自动更新一次
        // let time = 0.5 * 60 * 60 * 1000;
        setInterval(() => {
            this.index += 4;
            this.render();
        }, 10000);
    }
    async getData(url, page, length) {
        let res = await new MyPromise({
            type: "POST",
            url,
            data: {
                page,
                length
            }
        });

        // 获取后端返回的数据，存入本地
        // 这样就不用发起多次请求，一次请求就够了
        localStorage.setItem('list', res);
    }

    render() {

        // 渲染这里获取本地上存储的数据
        let list = JSON.parse(localStorage.getItem('list'));
          
        if(!list) return;

        // 如果数据取完了,就重置索引开始拿数据
        if (this.index >= list.data.length) {
            this.index = 0;
        }
        // 过滤出本地中4条数据，用来渲染页面。每次调用都会让this.index += 4,所以数据不会重复
        let newData = list.data.filter((item, index) => {
            return index >= this.index && index < this.index + 4;
        });

        let str = '';
        const reg = new RegExp(/\d+\.?\d{0,2}/);
        newData.forEach(item => {
            str += `
           <a href="./views/details.html?id=${item.id}" class='left-top-item' goods_id="${item.id}">
                <div class='top-item-left'>
                    <img src="${item.img}"
                        alt="">
                </div>
                <div class='top-item-right'>
                    <p class='item-right-title'>${item.title}</p>
                    <p class='item-right-icon'>
                        <span class='half-price'>第二件半价</span>
                        <span class='hot-buy'>火热爆款</span>
                        <span class='rob-buy'>品牌抢购</span>
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

new Adgoods('.left-top-goods', './api/listData1.php');


// ad商品区倒计时功能
class CountDown {
    constructor(ele) {
        this.ele = document.querySelector(ele);
        this.endTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        this.init();
        this.getTime();
    }
    init() {
        this.hours = this.ele.querySelector('.title-time-hours');
        this.minutes = this.ele.querySelector('.title-time-minutes');
        this.seconds = this.ele.querySelector('.title-time-seconds');
    }

    getTime() {
        setInterval(() => {
            // 获取当前时间毫秒数 === new Date().getTime();
            let nowTime = Date.now();

            // 计算结束时间到开始时间的差值 把毫秒转为以秒为单位
            let time = (this.endTime - nowTime) / 1000;

            let seconds = parseInt(time % 60); // 获取剩下的秒数

            let minutes = Math.floor((time / 60) % 60); // 获取剩下的分钟

            let hours = Math.floor(time / 60 / 60); // 获取剩下的小时

            this.seconds.innerText = seconds < 10 ? '0' + seconds : seconds;
            this.minutes.innerText = minutes < 10 ? '0' + minutes : minutes;
            this.hours.innerText = hours < 10 ? '0' + hours : hours;
        }, 1000);
    }

}

new CountDown('.ad-title-time');


// ad列表区
class AdList{
    constructor(name,url){
         this.box = document.querySelector(name);
         this.url = url;
         this.id = 1.1;
         this.length = 1000;
         this.index = 200; // 定义一个索引，用于获取数据，从第200条数据开始
         this.getData(this.url,this.id,this.length);
         this.init();
    }

    init(){

       let date = new Date();
       let time = date.getHours();
        // 24点自动更换商品
       if(time == 0){
           this.index += 5;
           this.render();
       }
    }

     async getData(url,id,length){

        let res = await new MyPromise({
            url,
            type : "POST",
            data : {
                page:id,
                length
            }
        });

        localStorage.setItem('list',res);
        this.render();
    }
    
    render(){
        
        let list = JSON.parse(localStorage.getItem('list'));
        // 直接获取本地数据渲染
        
        if(!list) return;
        
        if(this.index >= list.data.length){
            this.index = 200;
        }
        
        let newData = list.data.filter((item,index)=>{
            return index >= this.index && index < this.index +5;
        });
         
        let str = '';
        const reg = new RegExp(/\d+\.?\d{0,2}/);
        let i = 2;
        newData.forEach(item=>{
           i++;
            str += `
            <a href="./views/details.html?id=${item.id}" class='downUp-item' goods_id="${item.id}">
                 <div class='downUp-item-img'>
                     <img src="${item.img}"
                         alt="">
                 </div>
                 <div class='ad-item-content'>
                     <p>${item.title}</p>
                     <span>近两小时疯抢<b>${reg.exec(item.sales)[0]}万</b>件</span>
                     <div class='item-content-price'>
                         <span>￥${item.now_price}</span>
                         <span>${item.cheap}</span>
                     </div>
                 </div>
                 <span class='downUp-item-icon'><i>${i}</i></span>
             </a>
            `
        });

        this.box.innerHTML = str;

    }
}

new AdList('.ad-left-downUp','./api/listData1.php');

// 回到顶部按钮功能
class BackTop {
    constructor(btn) {
        this.btn = document.querySelector(btn);
        this.init();
    }
    init() {
        this.bannerTop = document.querySelector('.banner').offsetHeight;
        this.hedaerTop = document.querySelector('#header').offsetHeight;
        this.navTop = document.querySelector('#nav').offsetHeight;

        this.scrollTop = this.bannerTop + this.hedaerTop + this.navTop;

        // addEventListener 事件监听绑定 解决多个window.onscroll 冲突覆盖问题
        window.addEventListener("scroll", e => {

            if (window.scrollY >= this.scrollTop) {
                this.btn.style.height = '50px';
            } else {
                this.btn.style.height = 0;
            }
        });

        this.btn.onclick = () => {
            window.scrollTo(0, 0);
        }
    }

}

new BackTop('.back-top');

// 登录按钮功能
class LoginBtn{
   constructor(name){
       this.btn = document.querySelector(name);
       this.init();
   }
   init(){
       let cookie = document.cookie;
       if(!cookie){
           this.btn.innerText = "你好请登录";
           return;
       }
       
       let user = cookie.split('=')[1];
       this.btn.innerText = `欢迎您，${user}`;
       this.btn.setAttribute('href','#');
       
   }
}

new LoginBtn('.login-btn');


// 分页点击功能
class Page{
    constructor(name){
        this.box = document.querySelector(name);
        this.init(this.box);

    }
    init(box){
       box.onclick = e =>{
           e = e || window.event;
           if(e.target.classList.contains('first') || e.target.classList.contains('prev')){
               window.scrollTo(0,1400);
           }

           if(e.target.classList.contains('next') || e.target.classList.contains('last')){
               window.scrollTo(0,1400);
           }

           if(e.target.nodeName == "P" || e.target.nodeName == "BUTTON"){
               window.scrollTo(0,1400);
           }

       }
    }
}

new Page('#page');