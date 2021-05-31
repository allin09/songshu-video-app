<template>
	<view style="height: 100vh;">
		<!-- 顶部开始 -->
		<view class="head shadow">
			<view class="title_wrap">
				<view v-for="(item,index) in tabList" :key="index" class="title" :class="{'active':active==index}" @click="changeTab(index)">
					<text>{{item.title}}</text>
					<view class="head-line pink"></view>
				</view>
			</view>
			<view class="seach" @click="seach">
				<image src="/static/home/seach.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 顶部结束 -->


		<refresh ref="refresh" @isRefresh="isRefresh"></refresh>
		<swiper :style="{height:sysheight+'px'}" :indicator-dots="false" :current="active" :autoplay="false" :duration="300"
		 @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd" @change="changeCurrent">
			<swiper-item v-for="(item,index) in tabList" :key="index" :item-id="'item_'+index">
				<scroll-view style="height: 85%;" scroll-y="true" class="content" @scrolltolower="onLoadMore">
					<advert-page :src="advert[index]&&advert[index].img" :showAd="tabList[active].showAd" :adUrl="advert[index]&&advert[index].ad_url" :openType="advert[index]&&advert[index].open_type*1" @close="closeAd" ></advert-page>
					<video-page class="video-page" :videoList="tabList[index].videoList" :page="item.page" :type="item.id"></video-page>
					<view :style="{'textAlign':'center'}" class="loading">
						<text v-if="!tabList[active].isMore">暂无更多数据</text> 
						<text v-if="tabList[active].isMore">正在加载...</text>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
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
				index:0,
				sysheight: 0,
				swiperHeight: 0,
				active: 0,
				
				page: 1,
				tabList: [{
					id: "hot",
					title: "热门",
					videoList: [],
					page: 1,
					isMore: true,
					showAd:true,
					loadmore: false
				}, {
					id: "new",
					title: "最新",
					videoList: [],
					page: 1,
					isMore: true,
					showAd:true,
					loadmore: false
				}, ]
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
			loadmore() {
				//console.log("loadmore")
				this.onLoadMore();
			},
			scroll(e) {
				//console.log("loadmore", e)
			},
			scrolltop() {
				uni.startPullDownRefresh()
			},
			changeCurrent(e) {
				this.active = e.detail.current;

			},
			
			seach() {
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
				//console.log("loading more");
				if (this.tabList[this.active].isMore) {
					this.tabList[this.active].loadmore = true;
					// 初始化视频列表
					this.$api.videoList({
						'type': this.tabList[this.active].id,
						'page': ++this.tabList[this.active].page
					}).then(res => {
						uni.stopPullDownRefresh();
						if (res.data.code == 0) {
							this.tabList[this.active].videoList = this.tabList[this.active].videoList.concat(res.data.data);

						} else {
							this.tabList[this.active].isMore = false;
						}
						this.tabList[this.active].loadmore = false;
					}).catch(res => {
						this.tabList[this.active].isMore = false;
						this.tabList[this.active].loadmore = false;
						uni.stopPullDownRefresh();
						// 失败进行的操作
					})
				} else {
					this.tabList[this.active].loadmore = true;
					uni.showToast({
						title: '暂无更多数据'
					});
				}

			},
			refresh() {
				this.$store.dispatch('getAdvert')
				this.tabList[this.active].showAd=true;
				//console.log("home refresh");
				this.tabList[this.active].page = 1;
				this.tabList[this.active].isMore=true;
					this.tabList[this.active].loadmore = true;
				// 初始化视频列表
				this.$api.videoList({
					'type': this.tabList[this.active].id,
					'page': this.tabList[this.active].page
				}).then(res => {
					this.$refs.refresh.endAfter() //刷新结束调用
					if (res.data.code == 1) {
						uni.showToast({
							title: '暂无数据',
							icon: "none"
						});
					}
					this.tabList[this.active].videoList = res.data.data;
					if (res.data.data.length < 20) {
						this.tabList[this.active].loadmore = false;
						this.tabList[this.active].isMore = false;
					}
				}).catch(res => {
					this.$refs.refresh.endAfter() //刷新结束调用
					uni.showToast({
						title: res.msg
					});
					// 失败进行的操作
				})
				//this.$store.commit("setVideoList", this.tabList[this.active].videoList);
			},
			closeAd(){
				this.tabList[this.active].showAd=false;
			}
		},
		computed:{
			advert(){
				return this.$store.state.advert.page || []
			}
		},
		mounted() {
			// 最热视频列表初始化获取
			this.tabList.forEach((item, key) => {
				this.$api.videoList({
					'type': item.id,
					'page': item.page
				}).then(res => {
					if (res.data.code == 1) {
						uni.showToast({
							title: '暂无数据',
							icon: "none"
						});
					}
					// 获得数据 
					this.tabList[key].videoList = res.data.data;

					if (res.data.data.length < 20) {
						this.tabList[key].loadmore = false;
						this.tabList[key].isMore = false;
					}
					//this.onLoadMore();
				}).catch(res => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					});
					// 失败进行的操作
				})
			})



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
		width: 100%;
		bottom: 0;
	}

	.shadow {
		box-shadow: 0 1px 6px #ccc;
	}

	.title_wrap {
		flex: 9;
		display: flex;
		flex-direction: row;

		.title {
			width: 100upx;
			align-items: center;
			justify-content: center;
			display: flex;
			flex-direction: column;
			margin: 10upx 10upx;

			text {
				font-size: $uni-font-size-base;
			}
		}

		.active {
			text {
				font-size: $uni-font-size-lg;
				font-weight: bold;
			}

			.pink {
				border-bottom: 5upx solid $uni-text-color-active;
				box-shadow: 0upx 4upx 5upx 0upx $uni-text-color-active;
			}
		}

		.head-line {
			overflow: hidden;
			margin-top: 5upx;
			width: 30upx;

		}

	}

	.seach {
		flex: 1;
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
