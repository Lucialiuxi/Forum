<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 600px;
    }
    .menu{
        height: 600px;
    }
    .layout-header-bar{
        background: #495060 url(../../assets/img/cnodejs_light.svg) no-repeat 10px 0;
        background-size: 180px 50px;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
    .layout a{
        color: gray;
    }
</style>
<template>
    <div class="layout">
        <Layout>
            <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
                 <!-- 
                    on-select 选择菜单（MenuItem）时触发 返回值name
                    active-name 激活菜单的 name 值  被点击的那项高亮
                 -->
                <Menu 
                    @on-select="selectMenu"
                    class="menu" 
                    :active-name="activeClass" 
                    theme="dark" 
                    width="auto" 
                >
                    <MenuItem 
                        :name="item.name"
                        v-for="item in menusData"
                        :key="item.name"
                    >
                        <Icon type="aperture"></Icon>
                        <span>{{item.title}}</span>
                    </MenuItem>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{padding: 0}" class="layout-header-bar"></Header>
                <Content class="content" :style="{margin: '20px', background: '#fff', minHeight: '260px'}">
                    <!-- 加载图 -->
                    <Spin size="large" fix v-if="spinShow"></Spin>
                     <ul class="postPage">
                        <li
                           v-for="item in list"
                           :key="item.id"
                        >
                            <img :src="item.author.avatar_url"  :title="item.author.loginname">
                            <span title="回复数">{{item.reply_count}}</span>
                            <span>/</span>
                            <span title="点击数">{{item.visit_count}}</span>
                            <span class="put_top" v-if="item.top">置顶</span>
                            <router-link 
                                tag="a"
                                :to="{ name: 'Detail', params: { abc: item.id }}"
                                :title="item.title"
                            >{{item.title}}</router-link>
                        </li>
                    </ul>  
                    <!--on-change 页码改变的回调，返回改变后的页码 -->
                    <Page 
                        :current="page"
                        :total="100" 
                        style="margin-top:-40px;"
                        @on-change="changePage"
                    ></Page>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import {menusData} from './menusData.js'
    import Detail from '@/views/detail/detail.vue'
    export default {
        name:'home',
        components:{
            Detail
        },
        data () {
            return {
                isCollapsed: false,
                //渲染菜单的数据
                menusData,
                //点击高亮的类别
                activeClass:'all',
                //正在加载的图标
                spinShow:false,
                page:1,
                //渲染选择的相应栏目的数据
                list:[]
            }
        },
        methods: {
            /*在 Vue 实例内部，你可以通过 $router 访问路由实例。
             可以调用 this.$router.push。
            */
            selectMenu(name){
                 // 编程式的导航:带查询参数，变成 ?tab=name
                this.$router.push({
                    path: '/', 
                    query: { tab: name }
                })
            },
                
            //调用函数之后，把查询参数最新的page值传入路由
            changePage(page){
                this.$router.push({
                   query:{
                       ...this.$route.query,
                       page
                   }
                })
                this.fetchTopicData({page:page})
            }
            ,
            //根据分类  页码  数据条数 去请求数据
             async fetchTopicData(params={page:1}){
                //从路由对象里面拿tab的值，拿到是哪个分类的数据，没有的话就默认请求all
                let tab = this.$route.query.tab || 'all';
                let page = params.page || this.$route.query.page || 1;
                //把高亮加到点击到的哪一个类别
                this.activeClass = tab;
                //数据回来之前显示正在加载
                this.spinShow = true;
                this.page = parseInt(page);
                //发送请求
                let {data} = await this.http.getTopics({
                    tab,
                    page,
                    limit: 10
                })
                //把请求到的数据给list
                this.list = data.data;
                //数据回来之后取消加载显示
                this.spinShow = false;
            }
        },
        watch:{
            //只要路由信息对象发生变化，函数fetchTopic就会立即执行
            $route:{
                handler:'fetchTopicData',
                immediate:true
            }
        }
    }
</script>

<style>
    ul{
        padding: 0;
        margin: 0;
        list-style: none;
        
    }
    .postPage{
        height: 500px;
    }
    .content img{
        height: 30px;
        width: 30px;
        border:none;
    }
    .content li{
        height: 30px;
        margin: 10px 0px;
        border-bottom: 1px solid lightgrey;
        box-sizing: content-box;
        padding-bottom: 5px;
    }
    .content li span,.content li img, li a{
        float: left;
        height: 30px;
        line-height: 30px;
        text-align: top;
    }
    .content li a{
        margin-left: 10px;
        width: 60%;
        overflow: hidden;
    }
    .content li a:hover{
        color: red;
        text-decoration:underline;
    }
    .content li img{
        margin-right: 10px;
        border: none;
    }
    .content .put_top{
        background: #80bd01;
        padding: 2px 4px;
        border-radius: 3px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        -o-border-radius: 3px;
        color: #fff;
        font-size: 12px;
        margin-right:10px;
    }
</style>