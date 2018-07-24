import axios from 'axios'

axios.defaults.baseURL = 'https://cnodejs.org/api/v1/'

/* 
  get 主题首页
  data:
    page Number 页数
    tab String 主题分类。目前有 ask share job good
    limit Number 每一页的主题数量
  params
    Object
*/
export function getTopics(params = { page: 1, tab: '', limit: 10 }){
    return axios.get('/topics',{
        params
    })
}

/**
 * 通过传id拿到发的文章的详细信息
 */
export function getOneArticleById(params){
    return axios.get('/topic/'+params.id)
}
/**
 * 通过传loginname拿到用户详情
 */
export function getOneUserInfor(params){
    return axios.get('/user/'+params.loginname)
}


/**
 * 通过传loginname拿到用户详情
 */
export function getUserCollectTopics(params){
    console.log('9999999',params)
    return axios.get('/topic_collect/'+params.loginname)
}

/**
 * 新建主题params对象有两个参数  {title:XXX,content:XXX}
 */
export function newADevTopic(params){
    return axios.post('/topics',{
        accesstoken:'d859f520-43bb-452b-8036-53f380713636',
        title:params.title,
        tab:'dev',
        content:params.content
    })
}

/**
 * 新建评论 params对象有一个参数content {content:XXX,topicId:XXX}
 */
export function newAComment(params){
    return axios.post(`/topic/${params.topicId}/replies`,{
        accesstoken:'d859f520-43bb-452b-8036-53f380713636',
        content :params.content,
        reply_id:'5433d5e4e737cbe96dcef312'
    })
}


/**
 * 点赞 params->{replyId:XXX} 点赞的那条回复的id
 */
export function isLike(params){
    return axios.post(`/reply/${params.replyId}/ups`,{
        accesstoken:'d859f520-43bb-452b-8036-53f380713636'
    })
}

//把发送请求的函数挂载Vue上面，这样所有组件中都可以访问到
export default {
    install(Vue){
        Vue.prototype.http = {
            getTopics,
            getOneArticleById,
            getOneUserInfor,
            getUserCollectTopics,
            newADevTopic,
            newAComment,
            isLike,
        }
    }
}