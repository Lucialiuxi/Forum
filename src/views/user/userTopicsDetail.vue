<template>
  <div id="userTopicDetail">
      <h2 class="userTopicDetail_title">
          <a @click="goToHome" class="goToHome">主页</a>/
          <a @click="goToUserPage" class="goToUserPage">{{userdis}}的主页</a>
      </h2>
      <div>
          <h2 class="topicTitle">{{userdis}}创建的话题</h2>
          <ul class="lastestTopicsList">
                <li 
                    class="lastestTopicsItem"
                    v-for="item in TopicsData"
                    :key="item.id"
                >
                        <img 
                            :src="item.author.avatar_url" 
                            :title="item.author.loginname"
                            class="userAvatar"
                        >
                        <span class="replyCount">{{item.reply_count}}/</span>
                        <span class="visitCount">{{item.visit_count}}</span>
                       
                        <span class="typeMark"  v-if="item.typeMarkIsShow">{{item.typeMark}}</span>
                        <a class="postTitle">{{item.title}}</a>
                        <img 
                            class="replyUserAvatar"
                            :src="item.author.avatar_url" 
                        />
                        <a class="replyDif">{{item.difT}}前</a>
                </li>
            </ul>
      </div>
  </div>
</template>
<script>
    export default {
        name:'userTopicsDetail',
        props:{
            user:{
                type: String,
                default: ''
            },
            p:{
                type: String,
                default: true
            }
        },
        data(){
            return{
                typeTitle:'',
                TopicsData:[],
                difT:'',
                userdis:''//用户loginName
            }
        },
        created(){
            //如果刷新的时候没有从用户页跳转传过来的用户名，就在路由信息对象里面取
            this.userdis = this.$route.params.userLoginName
            let mayjor = this.p;
            if(this.p==='topics'){
                this.typeTitle = '创建';
            }else if(this.p==='replies'){
                this.typeTitle = '参与'
            }else if(this.p==='collections'){
                this.typeTitle = '收藏'
            }
            let loginname = this.userdis;
            this.http.getOneUserInfor({loginname}).then((data)=>{
                //用户主页的信息
                this.userInfo = data.data.data;
                //注册用户名的时间
                let pub = this.userInfo.create_at;
                this.userRegisterTime = this.tools.pubItem(pub,this.userRegisterTime);

                if(this.p === 'replies'){
                    //拿到最近参与的帖子的id
                    let recent_replies_id = []
                    this.userInfo.recent_replies.forEach(item => {
                        recent_replies_id.push(item.id)
                    });
                    recent_replies_id.forEach(item=>{
                        this.getLastestRepliesData(item)
                    })
                }else if(this.p === 'topics'){
                    //拿到最近创建的帖子的id
                    let recent_topics_id = []
                    this.userInfo.recent_topics.forEach(item => {
                        recent_topics_id.push(item.id)
                    });
                    recent_topics_id.forEach(item=>{
                        this.getRecentTopicsData(item)
                    })
                }else if(this.p === 'collections'){
                    this.getUserCollectTopicsData(loginname)
                }
            });
        },
        methods:{
            /*传入发布的帖子的id，拿到参与的帖子的相关信息，
                把回复数、访问数、帖子最新跟帖人的头像、最新跟帖距离现在的时间
                放到对象userInfo中
            */
           //新建的帖子
            getRecentTopicsData(id){
                this.TopicsData = [];
                this.difT = '';
                this.http.getOneArticleById({id}).then(({data})=>{
                    let obj = data.data;
                    this.tools.IsTopOrGoodMark(obj,this)
                    this.difT = this.tools.pubItem(obj.last_reply_at,this.difT)
                    this.$set(obj,'difT',this.difT)
                    this.TopicsData.push(obj);
                })
            },
            //参与的话题
            getLastestRepliesData(id){
                this.TopicsData = [];
                this.difT = '';
                this.http.getOneArticleById({id}).then(({data})=>{
                    let obj = data.data;
                    this.tools.IsTopOrGoodMark(obj,this)
                    this.difT = this.tools.pubItem(obj.last_reply_at,this.difT)
                    this.$set(obj,'difT',this.difT);
                    this.TopicsData.push(obj);
                })
            },
            //收藏的话题
            getUserCollectTopicsData(loginname){
                this.TopicsData = [];
                this.difT = '';
                this.http.getUserCollectTopics({loginname}).then(({data})=>{
                    let obj = data.data;
                    obj.forEach(item=>{
                        this.tools.IsTopOrGoodMark(item,this)
                        this.difT = this.tools.pubItem(item.last_reply_at,this.difT)
                        this.$set(item,'difT',this.difT);
                    })
                    this.TopicsData = data.data;
                })
            },
            goToHome(){
                console.log('goToHome')
                this.$router.push({
                    path: '/'
                })
            },
            goToUserPage(){
                this.$router.push({ 
                    path: `/user/${this.userdis}`
                })
            }
        }
    }
</script>
