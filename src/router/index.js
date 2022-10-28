import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
        return originalPush.call(this, location).catch(err => err)
    }
    /* Layout */
import Layout from "@/layout";
import ParentView from "@/components/ParentView";

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    noCache: true                // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */
// const isAdmin = true
// 公共路由
export const constantRoutes = [{
        path: "/redirect",
        component: Layout,
        hidden: true,
        children: [{
            path: "/redirect/:path(.*)",
            component: resolve => require(["@/views/redirect"], resolve)
        }]
    },
    {
        path: '/home/lxsq/:projectId/:xmejlb/:type',
        //component: resolve => require(["@@/views/innovation/common/preview"], resolve),
        component: resolve => require(["@/views/home/lxsq"], resolve),
        name: "lxsq",
    },
    {
        path: '/home/results/:id',
        component: resolve => require(["@/views/home/results"], resolve),
        name: "results",
    },
    {
        path: "/login",
        component: resolve => require(["@/views/login"], resolve),
        hidden: true
    },
    {
        path: "/404",
        component: resolve => require(["@/views/error/404"], resolve),
        hidden: true
    },
    {
        path: "/reading",
        component: resolve => require(["@/views/jxStuProject/common/reading"], resolve),
        hidden: true
    },
    {
        path: "/read",
        component: resolve => require(["@/views/jxStuProject/common/reading4"], resolve),
        hidden: true
    },
    {
        path: "/401",
        component: resolve => require(["@/views/error/401"], resolve),
        hidden: true
    },
    {
        path: "",
        component: Layout,
        redirect: "/home",
        children: [{
            path: "index",
            component: resolve => require(["@/views/index"], resolve),
            name: "系统首页",
            meta: {
                title: "系统首页",
                icon: "home",
                noCache: true,
                affix: true
            }
        }]
    },
    {
        path: "/user",
        component: Layout,
        hidden: true,
        redirect: "noredirect",
        children: [{
            path: "profile",
            component: resolve =>
                require(["@/views/system/user/profile/index"], resolve),
            name: "Profile",
            meta: { title: "个人中心", icon: "user" }
        }]
    },
    {
        path: "/dict",
        component: Layout,
        hidden: true,
        children: [{
            path: "type/data/:dictId(\\d+)",
            component: resolve => require(["@/views/system/dict/data"], resolve),
            name: "Data",
            meta: { title: "字典数据", icon: "" }
        }]
    },
    {
        path: "/job",
        component: Layout,
        hidden: true,
        children: [{
            path: "log",
            component: resolve => require(["@/views/monitor/job/log"], resolve),
            name: "JobLog",
            meta: { title: "调度日志" }
        }]
    },
    {
        path: "/gen",
        component: Layout,
        hidden: true,
        children: [{
            path: "edit/:tableId(\\d+)",
            component: resolve => require(["@/views/tool/gen/editTable"], resolve),
            name: "GenEdit",
            meta: { title: "修改生成配置" }
        }]
    },
    //业务模块路由配置
    {
        path: "/basedata",
        component: Layout,
        hidden: true,
        children: [{
            path: 'code/:id',
            name: 'code',
            component: resolve => require(["@/views/basedata/code"], resolve),
            meta: { title: '公共代码管理' }
        }]
    },
    //创新创业路由配置
    {
        path: "/innovation",
        component: Layout,
        hidden: true,
        children: [{
                path: "province/:year",
                name: 'province',
                component: resolve => require(["@/views/innovation/province/index"], resolve),
                meta: { title: '省创', local: true },
                children: [{
                        path: "step1",
                        name: '省创立项',
                        meta: { title: '省创立项', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step1"], resolve),
                    },
                    {
                        path: "step2",
                        name: '省创中期',
                        meta: { title: '省创中期', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step2"], resolve),
                    },
                    {
                        path: "step3",
                        name: '省创成果',
                        meta: { title: '省创成果', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step3"], resolve),
                    },
                    {
                        path: "step4",
                        name: '省创结题',
                        meta: { title: '省创结题', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step4"], resolve),
                    }
                ]
            },
            {
                path: "nation/:year",
                name: 'nation',
                meta: { title: '国创', local: true },
                component: resolve => require(["@/views/innovation/nation/index"], resolve),
                children: [{
                        path: "step1",
                        name: '国创立项',
                        meta: { title: '国创立项', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step1"], resolve),
                    },
                    {
                        path: "step2",
                        name: '国创中期',
                        meta: { title: '国创中期', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step2"], resolve),
                    },
                    {
                        path: "step3",
                        name: '国创成果',
                        meta: { title: '国创成果', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step3"], resolve),
                    },
                    {
                        path: "step4",
                        name: '国创结题',
                        meta: { title: '国创结题', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step4"], resolve),
                    }
                ]
            },
            {
                path: "schoolSrtp/:year",
                name: "schoolSrtp",
                meta: { title: '校级SRTP', local: true },
                component: resolve => require(["@/views/innovation/schoolSRTP/index"], resolve),
                children: [{
                        path: "step1",
                        name: '校级SRTP立项',
                        meta: { title: '校级SRTP立项', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step1"], resolve),
                    },
                    {
                        path: "step2",
                        name: '校级SRTP中期',
                        meta: { title: '校级SRTP中期', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step2"], resolve),
                    },
                    {
                        path: "step3",
                        name: '校级SRTP成果',
                        meta: { title: '校级SRTP成果', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step3"], resolve),
                    },
                    {
                        path: "step4",
                        name: '校级SRTP结题',
                        meta: { title: '校级SRTP结题', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step4"], resolve),
                    }
                ]
            },
            {
                path: 'academySrtp/:year',
                name: 'academySrtp',
                meta: { title: '院级SRTP', local: true },
                component: resolve => require(["@/views/innovation/academySRTP/index"], resolve),
                children: [{
                        path: "step1",
                        name: '院级SRTP立项',
                        meta: { title: '院级SRTP立项', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step1"], resolve),
                    },
                    {
                        path: "step2",
                        name: '院级SRTP中期',
                        meta: { title: '院级SRTP中期', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step2"], resolve),
                    },
                    {
                        path: "step3",
                        name: '院级SRTP成果',
                        meta: { title: '院级SRTP成果', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step3"], resolve),
                    },
                    {
                        path: "step4",
                        name: '院级SRTP结题',
                        meta: { title: '院级SRTP结题', pureComponent: true },
                        component: resolve => require(["@/views/innovation/nation/steps/step4"], resolve),
                    }
                ]
            },
            {
                path: 'noType/:year',
                name: 'noType',
                meta: { title: '待确定项目类型' },
                component: resolve => require(["@/views/innovation/noType/index"], resolve)
            },
            {
                path: 'preView/:projectId',
                name: 'projectReview',
                meta: { title: '查看项目详情', local: true },
                component: resolve => require(["@/views/innovation/common/preview"], resolve)
            },
            {
                path: 'preView/:projectId/:xmejlb/:type',
                name: 'projectReview2',
                meta: { title: '查看项目详情', local: true },
                component: resolve => require(["@/views/innovation/common/preview"], resolve)
            }

            // summary 配置在可视化界面
        ]
    },
    {
        path: '/jxNotice',
        name: 'JxNotice',
        component: Layout,
        children: [{
                path: 'list/:gglx',
                name: 'notice',
                hidden: true,
                meta: { title: '公告管理', local: true },
                component: resolve => require([`@/views/jxNotice/index`], resolve)
            },
            {
                path: 'detail/:id',
                hidden: true,
                name: 'detail',
                meta: { title: '公告详情', local: true },
                component: resolve => require(['@/views/jxNotice/newsDetail'], resolve)
            },
            {
                path: 'edit/:id',
                hidden: true,
                name: 'edit',
                meta: { title: '公告编辑' },
                component: resolve => require(['@/views/jxNotice/newsEdit'], resolve)
            },
            {
                path: 'add',
                hidden: true,
                name: 'add',
                meta: { title: '新增公告' },
                component: resolve => require(['@/views/jxNotice/newsEdit'], resolve)
            }
        ]
    },
    //
    {
        path: "/home",
        hidden: true,
        component: resolve => require(["@/views/home"], resolve),
        children: [{
                path: "",
                component: resolve => require(["@/views/home/mainPage"], resolve),
                name: "home",
            },

            {
                path: 'news',
                component: resolve => require(["@/views/home/news"], resolve),
                name: 'news'
            },
            {
                path: 'download',
                component: resolve => require(["@/views/home/download"], resolve),
                name: 'download'
            },
            {
                path: 'sc',
                component: resolve => require(["@/views/home/sc"], resolve),
                name: 'sc',
            },
            {
                path: 'scsc',
                component: resolve => require(["@/views/home/scsc"], resolve),
                name: 'scsc',
            },
            // {
            //     path: 'scsearch',
            //     component: resolve => require(["@/views/home/sc/scsearch"], resolve),
            //     name: 'scsearch',
            // },
            {
                path: 'cc',
                component: resolve => require(["@/views/home/cc"], resolve),
                name: 'cc'
            },
            {
                path: 'cc/:type',
                component: resolve => require(["@/views/home/cc/ccAllList"], resolve),
                name: 'ccList'
            },
            {
                path: 'ccNews/:id',
                component: resolve => require(["@/views/home/cc/detail"], resolve),
                name: 'ccnewsDetail'
            },
            {
                path: 'news/:id',
                component: resolve => require(["@/views/home/news/detail"], resolve),
                name: 'newsDetail'
            },
            {
                path: 'guide/:id',
                component: resolve => require(["@/views/home/guide/detail"], resolve),
                name: 'guideDetail'
            }, {
                path: 'download/:id',
                component: resolve => require(["@/views/home/download/detail"], resolve),
                name: 'downloadDetail'
            },
            {
                path: 'ques/:id',
                component: resolve => require(["@/views/home/ques/detail"], resolve),
                name: 'quesDetail'
            },
            {
                path: 'guide',
                component: resolve => require(["@/views/home/guide"], resolve),
                name: 'guide'
            },
            {
                path: 'ques',
                component: resolve => require(["@/views/home/ques"], resolve),
                name: 'ques'
            },
            {
                path: 'announcement',
                component: resolve => require(["@/views/home/announcement"], resolve),
                name: 'announcement'
            },
            {
                path: 'aboutlink',
                component: resolve => require(["@/views/home/aboutlink"], resolve),
                name: 'aboutlink'
            }
        ]
    },

];

export default new Router({
    mode: "hash", // 去掉url中的#
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
});