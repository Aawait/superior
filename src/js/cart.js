
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
           window.alert("你还没有登录,请先登录");
           localStorage.setItem('url',location.href);
           location.href = "../views/login.html";
           return;
       }

       this.user.innerText = `欢迎您，${this.cookie}`;
       this.user.setAttribute('href','#');
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
    }

    init(){
        this.username = this.getCookie('user');
        this.content = this.box.querySelector('.content');
        this.species = this.box.querySelector('.species');
        this.selectNum  = this.box.querySelector('.selectNum');
        this.selectPrice = this.box.querySelector('.selectPrice');
        this.totalPrice = this.box.querySelector('.total');
        this.allCheck = this.box.querySelector('.allCheck');


        this.box.onclick = e =>{
            e = e || window.event;

            // 全选框  数据中的isSelect是一个标识，1代表该数据被选中，0代表未选种
            if(e.target.classList.contains('allCheck')){

                 this.data.map(item=>{
                    item.isSelect = e.target.checked ? 1 : 0;
                    return item;
                 });
                 // 改变是否被选中后重新存入本地
                 localStorage.setItem('cartData',JSON.stringify(this.data));
                 this.render();

            }
          
              // 单选框
            if(e.target.classList.contains('checks')){
                let goodsId = e.target.getAttribute('goods-id');
                this.data.forEach(item=>{
                    if(item.id == goodsId){
                        // 点击这个商品的时候，更改它的是否被选中状态
                       item.isSelect = e.target.checked ? 1 : 0;
                    }                
                });

                // 判断是否所有的单选框都为选中，如果都选中就把全选框也选中
                this.allCheck.checked = this.data.every(item=>{
                    return item.isSelect == 1;
                });

                // 改变数据后重新存入本地
                localStorage.setItem('cartData',JSON.stringify(this.data));
                 
                // 调用渲染，只会计算被选中的商品,点击后重新渲染一下
                this.render();

            }


            // 结算按钮
            if(e.target.classList.contains('btn-info')){
                e.preventDefault();
                
                // 过滤掉被选中的商品进行删除 isSelect ==1
                if(!confirm("hello ,"+this.username+" 确认买单吗")) return;

                this.data.forEach(item=>{
                    // 先把数据库中的数据先删除，再把本地的数据删除
                    if(item.isSelect == 1){
                        this.removeData(item.id);
                    }
                });

                // 操作完的数据重新存入本地,再改变全选框状态,调用渲染
                localStorage.setItem('cartData',JSON.stringify(this.data));
                this.allCheck.checked = false;
                this.render();
                return;
            }
            
            // 清空购物车
            if(e.target.classList.contains('btn-warning')){
                confirm('确认清空购物车?') && this.clearData();
                this.allCheck.checked =false;
            }

            // 删除按钮
            if(e.target.classList.contains('btn-danger')){
                e.preventDefault();
                let goodsId = e.target.getAttribute('goods-id');

                // 短路运算，前面为false就不会往后执行
                confirm("确认删除这条商品吗？") && this.removeData(goodsId);
            }

            // 商品数量 - 按钮
            if(e.target.classList.contains('reduce')){
               e.preventDefault();
                let goodsId = e.target.getAttribute('goods-id');
                let goodsNum = e.target.parentNode.nextElementSibling.firstElementChild;
                let num = goodsNum.innerText*1;
                if(num == 1){  // 如果商品数量为1，无法递减
                    return;
                }
                num--;
                this.changeData(this.username,goodsId,num);
                return;
            }

            // 商品数量 + 按钮
            if(e.target.classList.contains('add')){
                e.preventDefault();
                let goodsId = e.target.getAttribute('goods-id');
                let goodsNum = e.target.parentNode.previousElementSibling.firstElementChild;
                let num = goodsNum.innerText*1;
                num++;  //点击时候让num++
                this.changeData(this.username,goodsId,num);
                return;
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
        this.count();
        // 如果本地没有数据就显示巨幕
        if (!this.data.length) {
            this.content.innerHTML = `<div class="container">  
            <h1 style='text-align:center;'>Hello, ${this.username}</h1>
            <p style='text-align:center;font-size:20px;font-weight:600;color:#5BC0DE;'>购物车还没有商品,快去逛逛吧</p>
            <p style='text-align:center'><a class="btn btn-primary btn-default" href="../index.html" role="button">Go index！</a></p>
             </div>`;
            return;
        }
        
        let str = '';
        this.data.forEach(item=>{
            str += `
            <div class="panel-body">
                 <div class="media" goodsid=${item.id}>
                     <div class='checkbox'><input type="checkbox" class='checks' goods-id=${item.id} ${item.isSelect==1?'checked':''}></div>
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
                             <a href="#" class="btn btn-danger btn-sm" role="button" goods-id=${item.id}>删除商品</a>
                         </div>
                     </div>
                     <div class='media-right'>
                         <nav aria-label="Page navigation">
                             <ul class="pagination">
                                 <li><a href="#" class='reduce' goods-id=${item.id}>-</a></li>
                                 <li><a href="#">${item.goods_num}</a></li>
                                 <li><a href="#" class='add' goods-id=${item.id}>+</a></li>
                             </ul>
                         </nav>
                     </div>
                 </div>
             </div>
            `
        });

        this.content.innerHTML = str;
    }
   
    // 计算所选商品的数量和价格
    count(){
        // 先获取本地存储的数据,过滤出被选中的商品
        let selectData = this.data.filter(item=>{
            return item.isSelect == 1;
        });

        //所选商品数量
        let selectNum = selectData.reduce((pre,item)=>{
            return pre + item.goods_num * 1;
        },0);
        this.selectNum.innerText = selectNum;

        
        // 所选商品价格 和 总价格
        let selectPrice = selectData.reduce((pre,item)=>{
             return pre += item.goods_num * item.now_price
        },0);
       this.totalPrice.innerText = this.selectPrice.innerText = selectPrice.toFixed(2);
        
    }

    // 结算按钮 || 删除按钮  删除数据
    async removeData(goods_id){
        let res = await new MyPromise({
            url : this.removeDataUrl,
            data : {
               username : this.username,
               goods_id
            }
        });

        res = JSON.parse(res);
        if(res.code){
            // 过滤出id不相等的数据，id相等的都删除了
            this.data = this.data.filter(item=>{
                return item.id != goods_id
            });
            
        }

        // 操作完数据后，重新存入本地然后渲染
        localStorage.setItem('cartData',JSON.stringify(this.data));
        this.render();
    }

    // 清空数据
    async clearData(){
        let res = await new MyPromise({
            url : this.clearDataUrl,
            data : {
               username : this.username
            }
        });

        res = JSON.parse(res);
        if(!res.code) return;

        // 清空购物车数据后给个空数组覆盖本地数据，以免报错。再重新渲染
        localStorage.setItem('cartData',JSON.stringify([]));
        this.render();

    }

    // 商品数量 + - 功能
    async changeData(username,goods_id,goods_num){
        let res = await new MyPromise({
            url : this.changeDataUrl,
            type : "POST",
            data :{
                username,
                goods_id,
                goods_num
            }
        });

        res = JSON.parse(res);
        if(!res.code) return;

        // 如果点击的商品id和本地存储的数据id一致，把传递过来的商品数量赋值给goods_num
        this.data.forEach(item=>{
            item.goods_num = goods_id == item.id ? goods_num : item.goods_num;
        });

        // 修改完最新数据再次存入本地，重新渲染
        localStorage.setItem('cartData',JSON.stringify(this.data));
        this.render();
    }
    
 
}

new Cart({
    name: '#main',
    getDataUrl: '../api/getCarData.php',
    removeDataUrl:'../api/removeCarData.php',
    clearDataUrl:'../api/clearCarData.php',
    changeDataUrl:'../api/updataCar.php'
})