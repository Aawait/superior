// 详情页

class Details {
    constructor(url,addUrl) {
        this.url = url;
        this.addUrl = addUrl;
        // 获取地址栏传过来的id,用这个id发送后端请求对应id的数据
        this.id = location.search.substr(4) * 1;
        this.length = 1; // 请求一条
        this.init();
        this.getData(this.url, this.id, this.length);
        
    }
    
    init() {
        this.username = this.getCookie('user');
        this.box = document.querySelector('.details-top');
        this.shop = document.querySelector('.details-msg');

        this.box.onclick = e =>{
            e = e || window.event;
            if(e.target.classList.contains('join-cart')){
                // 点击加入购物车判断是否登录,没有登录跳转登录页
                e.preventDefault();
                if(!this.username){
                    localStorage.setItem('url',location.href);
                    window.alert("请先登录才能添加购物车");
                    location.href = "../views/login.html";
                    return;
                }
                this.addData(this.id,this.username);
                
            }

            if(e.target.classList.contains('view-cart')){
                e.preventDefault();
                if(!this.username){
                    localStorage.setItem('url',location.href);
                    window.alert("请先登录才能查看购物车");
                    location.href = "../views/login.html";
                    return;
                }

                location.href = "../views/cart.html";
            }
        }
    }

    getCookie(key){
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

    async getData(url, page, length) {
        let res = await new MyPromise({
            type: "POST",
            url,
            data: {
                page,
                length
            }
        });

        res = JSON.parse(res);
        this.render(res.data[0]);
    }

    async addData(goods_id,username){
       let res = await new MyPromise({
           url : this.addUrl,
           type : "POST",
           data : {
               goods_id,
               username,
           }
       });
        
       res = JSON.parse(res);
       if(res.code){
           window.alert("添加购物车成功!");
       }else{
           window.alert("哦噢添加失败了,看看你有没有登录!");
       }
    }

    render(obj) {
        
        let date = new Date();
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() * 1 + 1) : (date.getMonth() * 1 + 1);
        let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
        let minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

        const reg = new RegExp(/\d+\.?\d{0,2}/);

        this.box.innerHTML = `
        <div class='details-content'>
         <div class='details-img'>
             <img src="${obj.img}"
                 alt="">
         </div>
         <div class='details-describe'>
             <p class='describe-title'>
                 <img src="https://cmsstatic.ffquan.cn/images/tmall.png?v=2021323305356" alt="">
                 <span>${obj.title}</span>
             </p>
             <p class='describe-num'>
                 <span>上新时间：${month}-${day} ${hours}:${minutes}</span>
                 <span>累计销量：<b>${reg.exec(obj.sales)[0]}</b> 万件</span>
             </p>
             <p class='describe-cheap'>
                 <span>独家优享：</span>
                 <span>${obj.cheap}</span>
             </p>
             <p class='goods-label'>
                 <span>商品标签：</span>
                 <span class='labei-item'>天猫</span>
                 <span class='labei-item'>包邮</span>
             </p>
             <p class='goods-price'>
                 <span>￥${obj.now_price}</span>
                 <span>￥${reg.exec(obj.old_price)[0]}</span>
             </p>
             <p class='goods-btn'>
                 <a href="#" class='join-cart'>加入购物车</a>
                 <a href="#" class='view-cart'>查看购物车</a>
                 <button class='share'><img src="https://cmsstatic.ffquan.cn//images/home/share.png?v=202104231430"
                         alt=""> 分享</button>
             </p>
         </div>
     </div>
     <div class='details-text'>
                <h5>推荐理由</h5>
                <p>${obj.title}，匠心工艺制作，还原自然好风味，宝宝超爱吃。餐前开胃，餐后助消化，0食品添加，妈妈更放心！</p>
                <p>此款商品正在进行限时活动，原来天猫售价${reg.exec(obj.old_price)[0]}元，现有${reg.exec(obj.cheap)[0]}元优惠券，到手仅需${obj.now_price}元，绝对超值，有需要可速度下单哦！</p>
                <p class='feedback'>
                    <span>我要举报：</span>
                    <a href="">价格错误</a>
                    <a href="">优惠券失效</a>
                    <a href="">其他</a>
                </p>
            </div>`;

            this.shop.innerHTML = `
            <div class='details-title'>
            <h5>店铺信息</h5>
             </div>
        <div class='details-shop'>
            <div class='shop-left'>
                <img src="${obj.img}"
                    alt="">
                <div class='shop-content'>
                    <p class='shop-title'>${obj.title.replace(/【\S+】/,'')}旗舰店</p>
                    <p class='shop-img'><img src="../icon/tim.png" alt=""></p>
                </div>
            </div>
            <div class='shop-right'>
                <div>
                    <span>宝贝描述</span>
                    <p><span>4.8</span> <b>高</b></p>
                </div>
                <div>
                    <span>卖家服务</span>
                    <p><span>4.8</span> <b>高</b></p>
                </div>
                <div>
                    <span>物流服务</span>
                    <p> <span>4.8</span> <b>高</b></p>
                </div>
            </div>
        </div>
            `
    }

}

new Details('../api/listData1.php','../api/addCar.php');


// 回到顶部按钮功能
class BackTop {
    constructor(btn) {
        this.btn = document.querySelector(btn);
        this.init();
    }
    init() {

        this.scrollTop = 1500;

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