<template>
	<view>
		<!-- 顶部开始 -->
		<view class="head shadow">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#000000" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				<text class="uni-title">{{title}}</text>
			</view>
			<view class="seach" @click="seach">
				<image src="/static/home/seach.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 顶部结束 -->

		<scroll-view class="content" @scroll="scroll">
			
			<view>
				<video-page class="video-page" :videoList="videoList" :page="page" type="collection"></video-page>
			</view>
			<view :style="{'textAlign':'center'}" class="loading" >
				<text v-if="!isMore">暂无更多数据</text>
				<text v-if="isMore">正在加载...</text>
			</view>

		</scroll-view>

	</view>
</template>

<script>
	import videoPage from "@/components/video/video-page.vue"
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	export default {
		components: {
			videoPage,
			uniIcons
		},
		data() {
			return {
				sysheight: 0,
				swiperHeight: 0,
				active: 0,
				page: 1,
				videoList:[],
				isMore:true,
				loadmore:false,
				type:'',
				title:''
			}
		},
		onLoad(e){
			//console.log('onLoad',e);
			this.title = e.title;
			this.type = e.type;
			// 最热视频列表初始化获取
			this.$api.videoList({
				'type':'custom',
				'typeid': this.type,
				'page': this.page
			}).then(res => {
				if(res.data.code==1){
					uni.showToast({
						title: '暂无数据',
						icon:"none"
					});
					this.isMore=false;
					this.loadmore=false;
				}
				// 获得数据 
				this.videoList = res.data.data;
					
				if(res.data.data.length<20||(res.data.data)[0]==undefined){
					this.loadmore = false;
					this.isMore = false;
				}
				//this.onLoadMore();
			}).catch(res => {
				this.isMore=false;
				this.loadmore=false;
				uni.showToast({
					title: res.msg,
					icon:"none"
				});
				// 失败进行的操作
			})
		},
		created() {
			//console.log('created',this.title,this.type);
			this.sysheight = uni.getSystemInfoSync().windowHeight
		},
		onShow() {

		},
		onReachBottom() {
			this.onLoadMore();
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			seach() {
			
				uni.navigateTo({
					url: '/pages/index/seacher/seacher',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			/**
			 * @param {Object} type 切换的选项卡ID
			 */
			changeTab: function(type) {
				this.active = type;
			},
			scroll(e) {
				//console.log("loadmore", e)
			},
			scrolltop() {
				uni.startPullDownRefresh()
			},
			changeCurrent(e) {
				//console.log("changeCurrent");
				this.active = e.detail.current;

			},
			seach: function() {
				uni.navigateTo({
					url: '/pages/index/seacher/seacher',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			onLoadMore() {
				//console.log("loading more");
				if (this.isMore) {
					this.loadmore=true;
					// 初始化视频列表
					this.$api.videoList({
						'type':'custom',
						'typeid': this.type,
						'page': ++this.page
					}).then(res => {
						uni.stopPullDownRefresh();
						if (res.data.code == 0) {
							this.videoList = this.videoList.concat(res.data.data);
							this.$store.commit("setVideoList", this.videoList);
						}else{
							this.isMore=false;
						}
						this.loadmore=false;
					}).catch(res => {
						this.isMore=false;
						this.loadmore=false;
						uni.stopPullDownRefresh();
						// 失败进行的操作
					})
				} else {
					this.loadmore=true;
					uni.showToast({
						title: '暂无更多数据'
					});
				}

			},
			refresh() {
				console.log("collection refresh");
				this.page = 1;
				// 初始化视频列表
				this.$api.videoList({
					'type':'custom',
					'typeid': this.type, 
					'page': this.page
				}).then(res => {
					uni.stopPullDownRefresh();
					if(res.data.code==1){
						uni.showToast({
							title: '暂无数据',
							icon:"none"
						});
						this.isMore=false;
						this.loadmore=false;
					}
					this.videoList = res.data.data;
					if(res.data.data.length<20||(res.data.data)[0]==undefined){
						this.loadmore = false;
						this.isMore = false;
					}
				}).catch(res => {
					this.isMore=false;
					this.loadmore=false;
					uni.stopPullDownRefresh();
					uni.showToast({
						title: res.msg
					});
					// 失败进行的操作
				})
				//this.$store.commit("setVideoList", this.tabList[this.active].videoList);
			},
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	swiper {
		min-height: 100%;
	}

	.loading {
		width: 750upx;
		justify-content: center;
		align-items: center;
		align-content: center;
	}

	.head {
		position: fixed;
		//#ifdef APP-PLUS
		padding-top: 40upx;
		//#endif
		z-index: 1;
		left: 0;
		right: 0;
		background: $uni-bg-color;
		width: 100%;
		display: flex;
		flex-direction: row;
		height: 88upx;
	}

	.content {
		position: relative;
		padding-top: 88upx;
		padding-bottom: 123upx;
		//#ifdef APP-PLUS
		padding-top: 128upx;
		//#endif

		height: 100%;
		width: 100%;
	}

	.shadow {
		box-shadow: 0 1px 6px #ccc;
	}

	.title_wrap {
		flex: 11;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}
	.seach {
		flex:1;
		display: flex;
		flex-direction: row;
		position: relative;
		right: 0upx;
		justify-content: flex-end;
		align-items: center;
		image {
			display: inline-block;
			width: 35upx;
			height: 25upx;
			margin-right: 25upx;

		}
	}
	.left-wrapper {
		margin-left: 12upx;
		height: 88upx;
		line-height: 88upx;
		flex-direction: row;
		// background: #007AFF;
		justify-content: center;
		flex: 1;
	}
	.search-wrapper {
		text-align: center;
		line-height: 76upx;
		height: 76upx;
		// background: #09BB07;
		flex: 10;
		flex-direction: row;
		align-items: center;
		align-content: center;
		justify-content: center;
	
		text {
			line-height: 76upx;
			height: 76upx;
		}
	}
</style>
