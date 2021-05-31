<template>
	<view>
		<view class="user-bg"></view>
		<view class="head-wrapper">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#ffffff" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				
			</view>
			<view class="right-wrapper">
				<!-- <image src="/static/img/setting.png" class="setting-img"></image>
				<text class="setting-text">设置</text> -->
			</view>
		</view>
		<view class="content-wrapper">
			<view class="user-info-wrapper card">
				<view class="user-info-head">
					<view class="head-img-wrapper">
						<image class="head-img" :src="user!=null?formatUrl(user.head_img):'/static/logo.png'"></image>
					</view>
					<view class="user-info-content-wrapper" @tap="tapUser">
						<text class="user-name">{{user!=null?user.name:''}}</text>
						<text class="user-id" v-if="user!=null">ID: {{user.custom_id==null?'未设置':user.custom_id}}</text>
						<button size="mini" class="user-follow" :class="{'cache':user.follow}" @tap="tapFollow">{{user.follow?'取消关注':'关注'}}</button>
					</view>
				</view>
				<view class="info-wrapper">
					<view class="info-item">
						<text class="count">{{user!=null?user.fans_count:'0'}}</text>
						<text class="count-title">粉丝</text>
					</view>
					<view class="info-item info-item-center">
						<text class="count">{{user!=null?user.follow_count:'0'}}</text>
						<text class="count-title">关注</text>
					</view>
					<view class="info-item">
						<text class="count">{{user!=null?user.skr_count:'0'}}</text>
						<text class="count-title">获赞</text>
					</view>
				</view>
			</view>
			<view class="video-list-wrapper card">
				<view class="video-title-wrapper">
					<text :class="{active:index==0}" @tap="changeType(0)">作品</text>
					<text :class="{active:index==1}" @tap="changeType(1)">喜欢</text>
				</view>
				<view class="video-data-wrapper">
					<video-page class="video-page" :videoList="videoData.data" :page="videoData.page" :type="videoData.type"></video-page>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import videoPage from '@/components/video/video-page.vue'
	export default {
		components: {
			videoPage,
			uniIcons
		},
		data() {
			return {
				sysheight: 0,
				height: '667px',
				width: '',
				index: 0,
				videoData: {
					type: 'other',
					data: [],
					page: 1,
					isMore: true
				},
				user: null,
				uid: 0
			}
		},
		onLoad(e) {
			this.uid = e.uid;
			console.log("uid", this.uid);
			
			
			this.loadUser();
			this.initData();
		},
		mounted() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
		},
		methods: {
			//格式化链接地址
			formatUrl(url1) {
				return this.$utils.formatUrl(this, url1)
			},
			tabSetting() {
				uni.navigateTo({
					url: '/pages/setting/index'
				})
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			loadUser() {
				this.$api.userOtherInfo({
					uid: this.uid
				}).then((res) => {
					
					if (res.data.code == 1) {
						uni.showToast({
							title: '获取用户信息失败',
							icon: 'none',
							duration: 500,
							success() {
								this.back();
							}
						});

					}
					this.user = res.data.data;
				});
			},
			tapFollow(){
				var type = 'add';
				if(this.user.follow){
					//已关注
					type='cancel';
				}
				this.$api.followChange({uid:this.user.id,type:type}).then((res)=>{
					if(res.data.code==1){
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						});
						return;
					}
					this.user.follow=!this.user.follow;
					uni.showToast({
						title: res.data.msg
					});
				})
			},
			tapUser() {
				if (this.user == null) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}
			},
			changeType(index) {
				this.index = index;
				this.videoData.data = [];
				this.videoData.type = index == 0 ? 'other' : 'otherLike';
				this.videoData.page = 1;
				this.loadData();
			},
			onPullDownRefresh() {
				this.loadUser();
				this.initData();
				uni.stopPullDownRefresh()
			},
			initData() {
				this.index = 0;
				//初始化视频信息
				this.videoData = {
					type: 'other',
					data: [],
					page: 1,
					isMore: true
				};
				//获取视频信息
				this.$api.videoList({
					uid: this.uid,
					type: this.videoData.type,
					page: this.videoData.page
				}).then((res) => {

					if (res.data.code == 1) {
						return;
					}
					this.videoData.data = res.data.data;
					//console.log(this.videoData);
				})
				this.$nextTick(()=>{
					uni.hideLoading()
				})
			},
			loadData() {
				//获取视频信息
				this.$api.videoList({
					uid: this.uid,
					type: this.videoData.type,
					page: this.videoData.page
				}).then((res) => {

					if (res.data.code == 1) {
						return;
					}
					this.videoData.data = res.data.data;
					//console.log(this.videoData);
				})
			},
			onLoadMore() {
				//console.log("loading more");
				if (this.videoData.isMore) {
					// 初始化视频列表
					this.$api.videoList({
						'type': this.videoData.type,
						'page': ++this.videoData.page
					}).then(res => {
						uni.stopPullDownRefresh();
						if (res.data.code == 0) {
							this.videoData.data = this.videoData.data.concat(res.data.data);
						} else {
							this.isMore = false;
						}
						this.videoData.loadmore = false;
						//console.log(this.videoData);
					}).catch(res => {
						this.videoData.isMore = false;
						uni.stopPullDownRefresh();
						// 失败进行的操作
					})
				} else {
					uni.showToast({
						title: '暂无更多数据'
					});
				}

			},
		},

	}
</script>

<style lang="scss">
	page {
		background: $uni-bg-color;
	}

	.user-bg {
		position: absolute;
		top: 0;
		width: 750upx;
		height: 328px;
		background: linear-gradient(0deg, rgba(255, 255, 255, .5), rgba(254, 44, 141, .5), rgba(255, 58, 77, .8), rgba(255, 58, 77, 1));
	}

	.head-wrapper {

		align-items: center;
		position: fixed;
		//#ifdef APP-PLUS
		padding-top: 44upx;
		//#endif
		z-index: 1;
		left: 0;
		right: 0;
		background: rgba($color: #000000, $alpha: 0);
		width: 100%;
		display: flex;
		flex-direction: row;
		height: 88upx;
		// background-color: red;
	}

	.left-wrapper {

		margin-left: 12upx;
		flex-direction: row;
		// background: #007AFF;
		justify-content: center;
		flex: 1;
	}

	.right-wrapper {
		display: flex;
		height: 88upx;
		line-height: 88upx;
		flex-direction: row;
		// background: #007AFF;
		justify-content: center;
		align-items: center;
		align-content: center;
		flex: 3;
		margin-right: 24upx;
		flex-wrap: nowrap;
	}

	.setting-img {
		width: 36upx;
		height: 36upx;
		margin-right: 12upx;

	}

	.setting-text {
		font-size: 30upx;
		color: #FFFFFF;
	}

	.search-wrapper {
		margin-right: 24upx;

		// background: #09BB07;
		flex: 8;
		flex-direction: row;
		align-items: center;
		align-content: center;
		justify-content: center;

	}

	.search {
		flex: 1;
	}

	.content-wrapper {
		position: relative;
		padding-top: 88upx;
		padding-bottom: 123upx;
		//#ifdef APP-PLUS
		padding-top: 128upx;
		//#endif

		height: 100%;
		width: 100%;
	}

	.user-info-wrapper {

		margin: 24upx;

	}

	.user-info-head {
		padding-left: 48upx;
		padding-right: 48upx;
		padding-top: 48upx;
		padding-bottom: 24upx;
		display: flex;
		flex-direction: row;
		justify-content: center;
		margin-bottom: 24upx;

		.head-img-wrapper {
			flex: 3;
			display: flex;
			align-items: center;
			align-content: center;
			justify-content: center;

			.head-img {
				width: 160upx;
				height: 160upx;
				border-radius: 50%;
			}

		}

		.user-info-content-wrapper {
			position: relative;
			flex: 9;
			display: flex;
			flex-direction: column;
			margin-left: 24upx;
			justify-content: flex-start;
			.user-name {
				font-size: 36upx;
			}

			.user-id {
				margin-top: 12upx;
				font-size: 24upx;
			}
			.user-follow{
				&.cache{
					background-color: rgba($color: #000000, $alpha: .05);
					color: #929292;
					border: none;
				}
				width: 200upx;
				position: absolute;
				left: 0upx;
				bottom: 0upx;
				margin-top: 12upx;
				background-color: $uni-text-color-active;
				color: $uni-text-color-inverse;
				font-size: 24upx;
			}
		}
	}



	.info-wrapper {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-bottom: 48upx;

		.info-item {
			position: relative;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			align-content: center;
		}

		.info-item-center:before {
			content: '';
			position: absolute;
			left: 0;
			top: 25%;
			bottom: auto;
			right: auto;
			height: 52%;
			width: 1px;
			background: rgba(0, 0, 0, 0.6);
		}

		.info-item-center:after {
			content: '';
			position: absolute;
			right: 0;
			top: 25%;
			bottom: auto;
			height: 52%;
			width: 1px;
			background: rgba(0, 0, 0, 0.6);
		}

		.count {
			font-size: 36upx;
		}

		.count-title {
			font-size: 24upx;
			margin-top: 12upx;
			color: rgba(0, 0, 0, 0.6);
		}
	}

	.video-list-wrapper {
		margin: 24upx;
		display: flex;
		flex-direction: column;
	}

	.video-title-wrapper {
		text {
			display: inline-block;
			margin-left: 24upx;
			margin-right: 24upx;
			padding: 24upx;
		}


	}

	.video-data-wrapper {
		flex: 10;
	}
</style>
