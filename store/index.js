import Vue from 'vue'
import Vuex from 'vuex'
import footer_store from "./modules/footer_store.js"
var url_config = "";
import config_url from "@/common/config.js"
import api from "@/api/index.js"
Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		videoList: [],
		baseUrl: config_url,
		user: null,
		advert:{},
		subType: []
	},
	mutations: {
		setVideoList(state, list) {
			state.videoList = list;
		},

		setUser(state, user) {

			uni.setStorageSync('user', user)
			state.user = user;
		},
		setSubType(state, subType) {
			state.subType = subType;
		},
		setAdvert(state,advert){
			state.advert = advert;
		}
	},
	actions: {
		downloadAndInstall(context,url){
			uni.showToast({
				title: '已开始下载，下载完成后将自动弹出安装程序。',
				duration: 3000,
				icon: "none"
			});
			var dtask = plus.downloader.createDownload(url, {}, function(d, status) {
				// 下载完成  
				if (status == 200) {
					plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(error) {
						uni.showToast({
							title: '安装失败',
							mask: false,
							duration: 1500
						});
					})
				} else {
					uni.showToast({
						title: '下载失败',
						mask: false,
						duration: 1500
					});
				}
			});
			dtask.start();
		},
		update(context, isShow) {
			var name = plus.os.name;
			var params = { //升级检测数据  
				"appid": plus.runtime.appid,
				"version": plus.runtime.version,
				"os": name
			}
			api.update(params).then((res) => {
				console.log(res);
				if (res.statusCode == 200 && res.data.code === 0) {
					uni.showModal({ //提醒用户更新  
						title: "更新提示",
						content: res.data.data.note,
						success: (res1) => {
							if (res1.confirm) {
								//打开方式 1 直接下载 2 外部打开
								if (res.data.data.open_type == 1) {
									uni.showToast({
										title: '已开始下载，下载完成后将自动弹出安装程序。',
										duration: 3000,
										icon: "none"
									});
									var dtask = plus.downloader.createDownload(res.data.data.url, {}, function(d, status) {
										// 下载完成  
										if (status == 200) {
											plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, {}, function(error) {
												uni.showToast({
													title: '安装失败',
													mask: false,
													duration: 1500
												});
											})
										} else {
											uni.showToast({
												title: '更新失败',
												mask: false,
												duration: 1500
											});
										}
									});
									dtask.start();
								} else {
									plus.runtime.openURL(res.data.data.url);
								}

							}
						}
					})
				} else {
					if (isShow) {
						uni.showToast({
							title: '您已是最新版本，无需更新',
							icon: 'none'
						});
					}

				}
			})
		},
		getUserInfo(context) {
			var user = uni.getStorageSync("user");
			if (user) {
				console.log("请求地址：" + context.state.baseUrl + "user/auth");
				console.log("请求参数：", {
					token: user.token
				});
				var params = {
					token: user.token
				};
				api.userAuth(params).then((res)=>{
					
					if (res == undefined) {
						throw "返回数据为 undefinded";
					}
					if (res.statusCode == 200) {
						console.log("验证用户信息结果", res.data);
						//成功
						if (res.data.code == 1) {
							context.commit('setUser', null)
						} else {
							context.commit('setUser', res.data.data)
						}
					} else {
						throw res.data
					}
				})
				
			} else {
				api.userInfo({}).then((res)=>{
					
					if (res == undefined) {
						throw "返回数据为 undefinded";
					}
					if (res.statusCode == 200) {
						console.log("获取的用户信息", res.data);
						//成功
						if (res.data.code == 1) {
							context.commit('setUser', null)
						} else {
							context.commit('setUser', res.data.data)
						}
					} else {
						throw res.data
					}
				})
			}

		},
		addVideoList(context, list) {
			console.log(context.state.videoList, list.length)
			for (let item of list) {
				context.state.videoList.push(item);
			}

			console.log(context.state.videoList, list.length)
		},
		getAdvert(context){
			api.advertData({type:1}).then((res)=>{
				if(res.data.code==1){
					context.commit("setAdvert",{});
				}else{
					context.commit('setAdvert',res.data.data)
				}
			})
		}
	},
	modules: {
		footer_store
	}
})

export default store
