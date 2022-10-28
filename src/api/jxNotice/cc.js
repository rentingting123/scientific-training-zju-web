import request from '@/utils/request'
const {post,get} =request

export default {
    ///schoolmanager/CompetitionListNotice/competitionNoticeList        通知列表
    getCCNewsList:data=>get('/cc/schoolmanager/expertReview/competitionPageNewsList',data),
    //获取竞赛通知列表
    
    getCCNoticeList:data=>get('/cc/schoolmanager/expertReview/competitionNoticeList',data),
    //通知详情
    getCCNoticeDetail:id=>get('/cc/schoolmanager/expertReview/selCompetitionNoticeOne?competitionNoticeId='+id),
    //竞赛新闻详情
    getCCNewsDetail:data=>get('/cc/schoolmanager/expertReview/selCompetitionNewsOne',data),
    //竞赛报名情况
    getSignupNumber:data=>get('/cc/schoolmanager/expertReview/selCompetitionGroup',data),

    //竞赛申报
    ccTopic:data=>post('/cc/schoolmanager/competitionNews/saveProjectReview',data),

    getMhyggList:data=>get('/cc/schoolmanager/expertReview/homeList',data),
    // 资讯搜索
    searchNews:data=>get('/cc/schoolmanager/expertReview/selKeyWords',data)
}