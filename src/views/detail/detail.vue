<template>
  <div>
      <Spin size="large" fix v-if="spinShow"></Spin>
      <header>
          <h1 class="title">
              <span class="put_top" v-if="AacticleInfo.top">置顶</span>
              <span class="title">{{AacticleInfo.title}}</span>
          </h1>
          <h2 class="subtitle">
              .<span>发布于 {{pubDif}}前</span>
              . <router-link
                     :to="{name:'User',params:{loginname:AacticleInfo.author.loginname}}"               
                >作者{{AacticleInfo.author.loginname}}</router-link>
              .<span>{{AacticleInfo.visit_count}}次浏览</span>
              .<span>来自 分享</span>
          </h2>
      </header>
      <div>
          <!-- 帖子内容 -->
          <div class="article" v-html="AacticleInfo.content"></div>
          <!-- 回复内容 -->
          <div class="replies">
              <header class="replyHead">{{AacticleInfo.replies.length}}回复</header>
              <ul class="replyContent">
                  <li 
                    v-for="item in AacticleInfo.replies"
                    :key="item.id"
                    class="replyItem"
                  >
                      <div class="replyUserInfo">
                        <img :src="item.author.avatar_url" :title="item.author.loginname" class="userAvatar">
                        <a class="userName">{{item.author.loginname}}</a>
                        <span class="floor">1楼.</span>
                        <span class="itemDif">14天前</span>
                        <!-- <span class="author">作者</span> -->
                        <Icon class="like" type="thumbsup" color="grey" size="15"></Icon>
                      </div>
                      <div class="replyText" v-html="item.content"></div>
                  </li>
              </ul>
              <div class="myReply">
                  <mavon-editor v-model="value" style="height: 100%"/>
                  <Button 
                    type="primary"
                    @click="ConfirmComment"
                  >回复</Button>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
    import './detail.css'
    import User from '@/views/user/user.vue'
    import { Button} from 'iview';
    export default {
        name:'detail',
        props:['abc'],
        components:{
            User
        },
        data(){
            return{
                AacticleInfo:{
                    //页面加载还没有请求数据的时候没有找到author会报错，所以要先放一个空对象
                    author: {},
                    replies:[]
                },
                pubDif:'',//帖子发布到现在时间相差的值
                spinShow:false,
                replyDif:'',//帖子跟帖评论发布的时间到现在的时间差值
                value:'',
            }
        },
        async created(){
            console.log(this.abc)
            this.spinShow = true;
            let id = this.abc
            let data = await this.http.getOneArticleById({id})
            this.AacticleInfo = data.data.data;
            this.spinShow = false;
            console.log(this.AacticleInfo)
            let pub = this.AacticleInfo.create_at;
            this.pubDif = this.tools.pubItem(pub)

        },
        methods:{
            ConfirmComment(){//点击回复
                let obj = {content:this.value,topicId:this.abc}
                this.http.newAComment(obj).then((data)=>{
                    console.log(data)
                })
                this.value = '';
            }
        }
    }
</script>
