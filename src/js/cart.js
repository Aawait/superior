
// 购物车

// 获取cookie判断是否登录,没有登录跳转到登录页

class Cookie{
    constructor(key){
       this.cookie = this.getCookie(key);
       this.user = document.querySelector('.user');
       this.init();
    }
   
    init(){
        
       if(!this.cookie){
           window.alert("你还没有登录,请登录");
           location.href = "../views/login.html";
       }

       this.user.innerText = `欢迎您，${this.cookie}`;
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
}

new Cookie('user');



class Cart{
    constructor(obj){
        this.box = document.querySelector(obj.name);
        this.getDataUrl = obj.getDataUrl;
        this.removeDataUrl = obj.removeDataUrl;
        this.clearDataUrl = obj.clearDataUrl;
        this.changeDataUrl = obj.changeDataUrl;

        this.init();
        this.getData(this.getDataUrl,'GET');
        this.total();
    }

    init(){
        this.username = this.getCookie('user');
        this.content = this.box.querySelector('.content');
        this.species = this.box.querySelector('.species');
        this.selectNum  = this.box.querySelector('.selectNum');
        this.selectPrice = this.box.querySelector('.selectPrice');


        this.box.onclick = e =>{
            
            // 单选框
            if(e.target.classList.contains('checks')){
                let id = e.target.getAttribute('data-id');
                let selectData =  this.data.filter(item=>{
                     return item.id == id;
                });

                if(!e.target.checked){
                    this.selectNum.innerText = 0;
                    this.selectPrice.innerText = 0;
                    return;
                }
               
                this.selectNum.innerText = selectData[0].goods_num*1;
                this.selectPrice.innerText = (selectData[0].goods_num * selectData[0].now_price).toFixed(2);

            }
            
            // 全选框
            if(e.target.classList.contains('allCheck')){
                let checks = this.box.querySelectorAll('.checks');
                let num = 0;
                let price = 0;
                checks.forEach(item=>{
                    item.checked = e.target.checked; 
                });
                
                if(!e.target.checked){
                    this.selectNum.innerText = num;
                    this.selectPrice.innerText = price.toFixed(2);
                    return;
                }

                let data =JSON.parse(localStorage.getItem('cartData'));
                data.forEach(item=>{
                     num += item.goods_num*1;
                     price += item.goods_num * item.now_price;
                },0)
                
                this.selectNum.innerText = num;
                this.selectPrice.innerText = price.toFixed(2);

            }
              
            // 结算和清空购物车
            if(e.target.classList.contains('btn-info') || e.target.classList.contains('btn-warning')){
                e.preventDefault();
                if(!confirm("确认结算？")) return;
                this.content.innerHTML = `<div class="container">  
                <h1>Hello, ${this.username}</h1>
                <p style='text-align:center;font-size:20px;font-weight:600;color:#5BC0DE;'>购物车还没有商品,快去逛逛吧</p>
                <p style='text-align:center'><a class="btn btn-primary btn-default" href="../views/index.html" role="button">Go index！</a></p>
                 </div>`;

                 localStorage.setItem('cartData','');
                 return;
            }

            // 删除商品
            if(e.target.classList.contains('btn-danger')){

                if(!confirm('确认删除这条商品吗')) return;
                let data = JSON.parse(localStorage.getItem('cartData'));
                
                let id = e.target.getAttribute('data-id');
                let newData = data.filter(item=>{
                    return item.id == id;
                });
                localStorage.setItem('cartData',JSON.stringify(newData));
                this.render();
            }

            // + -
            if(e.target.classList.contains('reduce')){
                 e.preventDefault();
                let goodsNum = e.target.parentNode.nextElementSibling.firstElementChild;
                let num = goodsNum.innerText*1;
                num--;
                if(num<=1){
                    num = 1;
                }
                goodsNum.innerText = num;
            }

            if(e.target.classList.contains('add')){
                e.preventDefault();
                let goodsNum = e.target.parentNode.previousElementSibling.firstElementChild;
                let num = goodsNum.innerText*1;
                num++;
                goodsNum.innerText = num;
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

    // 获取购物车数据库数据
    async getData(url,type){
       let res = await new MyPromise({
           url,
           type,
           data:{
               username:this.username
           }
       });
        
       localStorage.setItem('cartData',res);
       this.data = JSON.parse(localStorage.getItem('cartData'));
       this.render();
    }

    render(){
       
        this.data  = JSON.parse(localStorage.getItem('cartData'));
        this.species.innerText = this.data.length;  //数据的长度就是商品种类
        let str = '';

        this.data.forEach(item=>{

            str += `
            <div class="panel-body">
                 <div class="media">
                     <div class='checkbox'><input type="checkbox" class='checks' data-id=${item.id}></div>
                     <div class="media-left">
                         <a href="#">
                             <img class="media-object"
                                 src="${item.img}"
                                 alt="">
                         </a>
                     </div>
                     <div class="media-body">
                         <p class="media-heading">${item.title}</p>
                         <p class='goods-sales'><span>${item.old_price}</span> <span>${item.sales}</span></p>
                         <p class='goods-price'><span>￥${item.now_price}</span><span>${item.cheap}</span></p>
                         <div class='panel-btns'>
                             <a href="#" class="btn btn-danger btn-sm" role="button" data-id=${item.id}>删除商品</a>
                         </div>
                     </div>
                     <div class='media-right'>
                         <nav aria-label="Page navigation">
                             <ul class="pagination">
                                 <li><a href="#" class='reduce' data-id=${item.id}>-</a></li>
                                 <li><a href="#">${item.goods_num}</a></li>
                                 <li><a href="#" class='add' data-id=${item.id}>+</a></li>
                             </ul>
                         </nav>
                     </div>
                 </div>
             </div>
            `
        });

        this.content.innerHTML = str;
    }

    total(){
        let totalNum = this.box.querySelector('.total');
        let data = JSON.parse(localStorage.getItem('cartData'));
        let sum =  data.reduce((pre,item)=>{
            return pre += item.goods_num * item.now_price;
        },0);


        totalNum.innerText = sum;
    }
    
 
}

new Cart({
    name: '#main',
    getDataUrl: '../api/getCarData.php',
    removeDataUrl:'../api/removeCarData.php',
    clearDataUrl:'../api/clearCarData.php',
    changeDataUrl:'../api/updCarData.php'
})