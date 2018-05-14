//计算发布的时间到当前时间的显示
/**
 * 
 * pub  是发布时间
 * pubDif 是发布时间 到现在的 时间差
 */
 export  function pubItem(pub,pubDif){
    //  console.log(pub)
    //获取发布文章的年月日时分秒
    let pubY = pub.slice(0,4)
    let pubM = pub.slice(5,7)
    let pubD = pub.slice(8,10)
    //北京时间BST=格林尼治平均时GMT+8
    let pubH = Number(pub.slice(11,13)) + 5
    let pubMinutes = pub.slice(14,16)
        // console.log(pubY,pubM,pubD,pubH,pubMinutes)
    //获取当前时间
    let now = new Date();
    // console.log(now)
    //获取当前的年 月  日 时 分 秒
    let Y = now.getFullYear();
    let M = now.getMonth()+1;
    let D = now.getDate();
    let H = now.getHours();
    let minutes = now.getMinutes();
    //   console.log(Y,M,D,H,minutes)
    if(Y > pubY){
        pubDif = Y -pubY + '年'
    }else if(M > pubM){
        pubDif = M - pubM + '月'
    }else if(D > pubD){
        pubDif = D - pubD + '天'
    }else if(H > pubH){
        pubDif = H - pubH + '小时'
    }else if(minutes > pubMinutes){
        pubDif = minutes - pubMinutes + '分钟'
    }
    return pubDif
}
           //通过good和top的值去判断是否显示标识
export  function IsTopOrGoodMark(item,a){
    if(item.good){
        a.$set(item,'typeMark',"置顶")
        a.$set(item,'typeMarkIsShow',true)
    }else if(item.top){
        a.$set(item,'typeMark',"精华")
        a.$set(item,'typeMarkIsShow',true)
    }else{
        a.$set(item,'typeMark',"")
        a.$set(item,'typeMarkIsShow',false)
    }
}

/**
 * 通过判断是 新建的帖子 还是 参与的话题  还是 收藏的话题
 * keyWord 传入的关键字
 * requestfunc 请求数据的函数
 * t代表this
 */
export  function getWhichTopic(keyWord,requestfunc,t){
    // let dif = ''
    // this.http.requestfunc({id}).then(({data})=>{
    //     let obj = data.data;
    //     t.tools.IsTopOrGoodMark(obj,this)
    //     dif = t.tools.pubItem(obj.last_reply_at,t.difT1)
    //     t.$set(obj,'difT',t.difT1);
    //     t.lastestTopicsData.push(obj);
    // })
}


export default {
    install(Vue){
        Vue.prototype.tools = {
            //之前的时间到当前的时间差
            pubItem,
            //判断是否加置顶或者精品的标识
            IsTopOrGoodMark,
        }
    }
}