import request from '@/common/request.js'

const api = {}
/**
 * 视频相关
 */
const VIDEO = 'video';
// 获取视频列表
api.videoList = params => request.globalRequest(`${VIDEO}/data`, 'GET', params)
//浏览视频
api.videoView = params => request.globalRequest(`${VIDEO}/view`, 'GET', params)
//发布视频
api.videoPublish = params => request.globalRequest(`${VIDEO}/data`, 'POST', params)
/**
 * 点赞相关
 */
const SKR = 'skr';
//点赞视频
api.videoLike = params => request.globalRequest(`${SKR}/like`, 'GET', params)

/**
 * 用户相关
 */
const USER = 'user';
//用户登录
api.userLogin = params => request.globalRequest(`${USER}/login`, 'GET', params)
//获取用户信息
api.userInfo = params => request.globalRequest(`${USER}/userInfo`, 'GET', params)
//验证用户Token信息
api.userAuth = params => request.globalRequest(`${USER}/auth`, 'GET', params)
//用户退出登录
api.userLogout = params => request.globalRequest(`${USER}/logout`, 'GET', params)
//获取其他用户信息
api.userOtherInfo = params=>request.globalRequest(`${USER}/otheruserinfo`,'GET',params)
//获取用户关注列表
api.userFollowList = params => request.globalRequest(`${USER}/follow`, 'GET', params)
//获取用户粉丝列表
api.userFansList = params=>request.globalRequest(`${USER}/fans`,'GET',params)
//更新用户资料
api.userUpdate = params=>request.globalRequest(`${USER}/update`,'POST',params)

/**
 * 广告接口
 */
const ADVERT = 'advert';
//发送验证码
api.advertData = params => request.globalRequest(`${ADVERT}/data`, 'GET', params)



/**
 * 评论相关
 */
const COMMENT = 'comment';
//评论列表获取
api.commentList = params => request.globalRequest(`${COMMENT}/list`, 'GET', params)
//发送评论
api.commentSend = params => request.globalRequest(`${COMMENT}/data`, 'POST', params)

/**
 * 搜索相关
 */
const SEARCH = 'search';
//搜索用户
api.searchUser = params => request.globalRequest(`${SEARCH}/user`, 'POST', params)
//搜索视频
api.searchVideo = params => request.globalRequest(`${SEARCH}/video`, 'POST', params)
//获取搜索历史
api.searchHistory = params => request.globalRequest(`${SEARCH}/history`, 'GET', params)
//清除搜索历史
api.searchHistoryClear = params => request.globalRequest(`${SEARCH}/clear`, 'GET', params)

/**
 * 分类相关
 */
const TYPE = 'type';
//获取分类列表
api.typeList = params => request.globalRequest(`${TYPE}/type`, 'GET', params)
//获取热门搜索
api.typeHot = params => request.globalRequest(`${TYPE}/hot`,'GET',params)

/**
 * 关注相关
 */
const FOLLOW = 'follow';
//获取分类列表
api.followChange = params => request.globalRequest(`${FOLLOW}/change`, 'POST', params)

/**
 * 关注相关
 */
const COLLECTION = 'collection';
//获取分类列表
api.collectionAdd = params => request.globalRequest(`${COLLECTION}/change`, 'POST', params)

/**
 * API接口
 */
const API = 'api/api';
//发送验证码
api.sendSms = params => request.globalRequest(`${API}/sms`, 'GET', params)
//检测更新
api.update = params => request.globalRequest(`${API}/update`, 'POST', params)


export default api