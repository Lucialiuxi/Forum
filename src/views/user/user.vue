<template>
  <div>
      <div class="userPage">
        <div class="mainInfor">
                <h2>
                <a @click="goToHome">主页</a>/
                </h2>
                <div>
                    <p>
                        <img :src="userInfo.avatar_url" alt="">
                        <span>{{userInfo.loginname}}</span>
                    </p>
                    <div>
                        <p>{{userInfo.score}}积分</p>
                        <!-- 话题收藏 -->
                        <router-link 
                            v-if="saveTopicsLen"
                            :to="{ name: 'UserTopicsDetail',params:{u:'user',userLoginName:userInfo.loginname,p:'collections',user:userInfo.loginname}}"
                        >
                            {{saveTopicsLen}}个话题收藏
                        </router-link>
                        <p class="gitInfo">
                            <i class="gitIcon"></i>
                            <em class="gitUser">{{userInfo.githubUsername}}</em>
                        </p>
                        <p>注册时间{{userRegisterTime}}前</p>
                    </div>
                </div>
        </div>
        <div class="lastestTopics">
            <h2>最近创建的话题</h2>
            <ul class="lastestTopicsList">
                <li 
                    class="lastestTopicsItem"
                    v-for="item in lastestTopicsFiler"
                    :key="item.id"
                >
                        <img 
                            :src="item.author.avatar_url" 
                            :alt="item.author.loginname" 
                            :title="item.author.loginname"
                            class="userAvatar"
                        >
                        <span class="replyCount">{{item.reply_count}}/</span>
                        <span class="visitCount">{{item.visit_count}}</span>
                        <!-- 显示精品或者指定 -->
                        <span class="typeMark"  v-if="item.typeMarkIsShow">{{item.typeMark}}</span>
                        <a class="postTitle">{{item.title}}</a>
                        <img 
                            class="replyUserAvatar"
                            :src="item.author.avatar_url" 
                        />
                        <a class="replyDif">{{item.difT}}前</a>
                </li>
            </ul>
            <router-link 
                :to="{ name: 'UserTopicsDetail',params:{u:'user',userLoginName:userInfo.loginname,p:'topics',user:userInfo.loginname}}"
            >查看更多»</router-link>
        </div>
        <div class="recent_replies">
            <h2>最近参与的话题</h2>
            <ul class="recent_repliesList">
                <li 
                    class="recent_repliesItem"
                    v-for="item in recentRepliesFiler"
                    :key="item.id"
                >
                        <img
                            :src="item.author.avatar_url" 
                            :alt="item.author.loginname" 
                            :title="item.author.loginname"
                            class="userAvatar"
                        >
                        <span class="replyCount">{{item.reply_count}}/</span>
                        <span class="visitCount">{{item.visit_count}}</span>
                        <!-- 显示精品或者指定 -->
                        <span class="typeMark"  v-if="item.typeMarkIsShow">{{item.typeMark}}</span>
                        <a class="postTitle">{{item.title}}</a>
                        <img 
                            class="replyUserAvatar"
                            :src="item.author.avatar_url" 
                        />
                        <a class="replyDif">{{item.difT}}前</a>
                </li>
            </ul>
            <router-link :to="{ name: 'UserTopicsDetail',params:{u:'user',userLoginName:userInfo.loginname,p:'replies',user:userInfo.loginname}}">查看更多»</router-link>
        </div>
    </div>

  </div>
  <!-- <router-view></router-view> -->
</template>

<script>
    import UserTopicsDetail from './userTopicsDetail.vue'
    import './user.css';
    export default {
        name:'user',
        props:['loginname'],
        components:{
            UserTopicsDetail
        },
        data(){
            return{
                userInfo:{},//用户主页的信息
                userRegisterTime:'',//注册用户名的时间
                lastestTopicsData:[],//最新创建的帖子
                recentRepliesData:[],//最近参与的帖子
                difT:'',
                difT1:'',
                difT2:'',
                lastestTopicsFiler:[],//最新创建的帖子 显示5个以内
                recentRepliesFiler:[],//最近参与的帖子 显示5个以内
                userCollectTopicsData:[],
                saveTopicsLen:0
            }
        },
        created(){
            // console.log(this.loginname)
            let loginname = this.loginname;
            this.http.getOneUserInfor({loginname}).then((data)=>{
                //用户主页的信息
                this.userInfo = data.data.data;
                //注册用户名的时间
                let pub = this.userInfo.create_at;
                this.userRegisterTime = this.tools.pubItem(pub,this.userRegisterTime);
                //拿到最近参与的帖子的id
                let recent_replies_id = []
                this.userInfo.recent_replies.forEach(item => {
                    recent_replies_id.push(item.id)
                });
                recent_replies_id.forEach(item=>{
                    this.getLastestRepliesData(item)
                })

                //拿到最近创建的帖子的id
                let recent_topics_id = []
                this.userInfo.recent_topics.forEach(item => {
                    recent_topics_id.push(item.id)
                });
                recent_topics_id.forEach(item=>{
                    this.getRecentTopicsData(item)
                })
                //请求数据都是异步的，要放在异步的队列里面才能够拿到数据，并且进行筛选
               setTimeout(()=>{
                    this.lastestTopicsFiler = this.lastestTopicsData.slice(0,5)
                    this.recentRepliesFiler = this.recentRepliesData.slice(0,5);
               },1000)
            });
            console.log('created')
            this.getUserCollectTopicsData(loginname)
        },
        methods:{
            /*传入发布的帖子的id，拿到参与的帖子的相关信息，
                把回复数、访问数、帖子最新跟帖人的头像、最新跟帖距离现在的时间
                放到对象userInfo中
            */
           //新建的帖子
            getRecentTopicsData(id){
                this.http.getOneArticleById({id}).then(({data})=>{
                    let obj = data.data;
                    this.tools.IsTopOrGoodMark(obj,this)
                    this.difT = this.tools.pubItem(obj.last_reply_at,this.difT)
                    this.$set(obj,'difT',this.difT)
                    this.recentRepliesData.push(obj);
                })
            },
            //参与的话题
            getLastestRepliesData(id){
                this.http.getOneArticleById({id}).then(({data})=>{
                    let obj = data.data;
                    this.tools.IsTopOrGoodMark(obj,this)
                    this.difT1 = this.tools.pubItem(obj.last_reply_at,this.difT1)
                    this.$set(obj,'difT',this.difT1);
                    this.lastestTopicsData.push(obj);
                })
            },
            //收藏的话题
            getUserCollectTopicsData(loginname){
                this.http.getUserCollectTopics({loginname}).then(({data})=>{
                    this.saveTopicsLen = data.data.length
                    this.userCollectTopicsData = data.data;
                })
            },
            goToHome(){
                console.log('goToHome')
                this.$router.push({
                    path: '/'
                })
            }
        }
    }
</script>


