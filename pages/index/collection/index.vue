<template >
	<view  style="height: 100vh;" >
		<!-- 顶部开始 -->
		<view class="head shadow">
			<view class="title_wrap">
				<text class="uni-title">我的收藏</text>
				<!-- <view v-for="(item,index) in tabList" :key="index" class="title" :class="{'active':active==index}" @click="changeTab(index)">
					<text>{{item.title}}</text>
					<view class="head-line pink"></view>
				</view> -->
				
			</view>
			<view class="seach" @click="seach">
				<image src="/static/home/seach.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 顶部结束 -->
 
		<scroll-view style="height: 84%;" scroll-y="true" class="content"  @scrolltolower="onLoadMore" @touchstart="refreshStart" @touchmove="refreshMove"
		 @touchend="refreshEnd">
			<refresh ref="refresh" @isRefresh="isRefresh"></refresh>
			
			<view>
				<video-page class="video-page" :videoList="videoList" :page="page" type="collection"></video-page>
			</view>
			<view :style="{'textAlign':'center'}" class="loading" >
				<text v-if="!isMore">暂无更多数据</text>
				<text v-if="isMore">正在加载...</text>
			</view>
			<advert-page :src="advert[2].img" :showAd="showAd" :adUrl="advert[2].ad_url"  :openType="advert[2].open_type*2" @close="closeAd"></advert-page>
		</scroll-view>

	</view>
</template>

<script>
	// 引入下拉刷新
	import refresh from '@/components/refresh/refresh.vue';
	import videoPage from "@/components/video/video-page.vue"
	import advertPage from "@/components/advert/advert-page.vue"
	export default {
		components: {
			videoPage,
			refresh,
			advertPage
		},
		data() {
			return {
				showAd:true,
				sysheight: 0,
				swiperHeight: 0,
				active: 0,
				page: 1,
				videoList:[],
				isMore:true,
				loadmore:false
			}
		},
		created() {
			this.sysheight = uni.getSystemInfoSync().windowHeight
		},
		onShow() {

		},
		methods: {
			refreshStart(e) {
				this.$refs.refresh.refreshStart(e);
			},
			refreshMove(e) {
				this.$refs.refresh.refreshMove(e);
			},
			refreshEnd(e) {
				this.$refs.refresh.refreshEnd(e);
			},
			//刷新名需写为isRefresh,刷新组件中会回调此事件
			isRefresh() {
				this.refresh();
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
				/* uni.showModal({
					content: '我是搜索',
					showCancel: false
				});
				 */
				uni.navigateTo({
					url: '/pages/index/seacher/seacher',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},

			onLoadMore() {
				console.log("loading more");
				if (this.isMore) {
					this.loadmore=true;
					// 初始化视频列表
					this.$api.videoList({
						'type': 'collection',
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
				this.showAd = true;
				//console.log("collection refresh");
				this.page = 1;
				// 初始化视频列表
				this.$api.videoList({
					'type': 'collection',
					'page': this.page
				}).then(res => {
					this.$refs.refresh.endAfter() //刷新结束调用
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
					this.$refs.refresh.endAfter() //刷新结束调用
					uni.showToast({
						title: res.msg
					});
					// 失败进行的操作
				})
				//this.$store.commit("setVideoList", this.tabList[this.active].videoList);
			},
			closeAd(){
				this.showAd=false;
			}
		},
		created(){
			// 最热视频列表初始化获取
			this.$api.videoList({
				'type': 'collection',
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
		computed:{
			advert(){
				return this.$store.state.advert.page
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	page {
		background-color: rgba($color: #000000, $alpha: .05);
	}
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
	.uni-title{
		margin-left: 70upx;
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
</style>
