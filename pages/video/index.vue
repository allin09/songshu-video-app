<template>
	<view class="page">

		<swiper class="swiper" :vertical="true" @change="changeCurrent" :style="{ height: height }" :current="index">
			<swiper-item v-for="(item, idx) in videoList" :key="idx" class="swiper-item">
				<view class="video-box"  v-if="Math.abs(index-idx)<=1">
					<chunlei-video class="video" @click="clickVideo" :src="item.src" :height="height" :width="width" :play="item.flag"
					 :initialTime="item.initialTime" @pause="pauseVideo" :poster="item.poster">
					</chunlei-video>
					<cover-view class="cover-view-top">
						<image src="../../static/img/back.png" class="top-icon left-close"  @tap="back"></image>
						<image src="../../static/img/search_white.png" class="top-icon right-search" mode="aspectFit" @tap="seach"></image>
						<image src="../../static/img/more.png" class="top-icon right-more" mode="aspectFit" @tap="tapShare"></image>
					</cover-view>
					<cover-view class="cover-view-left">
						<!-- #ifdef APP-PLUS-NVUE-->
						<text class="left-text">{{item.content}}</text>
						<!-- #endif -->
						<!-- #ifndef APP-PLUS-NVUE-->
						{{item.content}}
						<!-- #endif -->
					</cover-view>
					<cover-view class="cover-view-right">
						<cover-image :src="item.avater" class="avater img" @click.stop="tapAvater"></cover-image>
						<text class="right-follow">+</text>

						<cover-image :src="item.check?'../../static/img/skr_active.png':'../../static/img/skr.png'" class="img-left"
						 @click.stop="tapLove"></cover-image>
						<text class="right-text">{{item.skr_count}}</text>
						<cover-image src="../../static/img/comment.png" class="img-left" @click.stop="tapMsg"></cover-image>
						<text class="right-text">{{item.comment_count}}</text>
						<cover-image src="../../static/img/share.png" class="img-left" @click.stop="tapShare"></cover-image>
					</cover-view>
				</view>
				<heart :style="'top:'+heartTop+';left:'+heartLeft+';'" ref="heart" class="heart" :doubleClick="doubleClick" v-show="doubleClick" @setHeight="setHeartHeight" @setWidth="setHeartWidth"></heart>
			</swiper-item>
		</swiper>
	</view>
</template>
<script>
	// import chunleiVideo from '../../components/chunlei-video/chunlei-video.vue'
		import heart from '@/components/heart.vue'
	export default {
		components: {
			// chunleiVideo,
			heart
		},
		data() {
			return {
				sysheight: 0,
				videoList: [

				],
				height: '667px',
				index: 0,
				width: '',
				oldIndex: 0,
				doubleClick: false,
				heartLeft: 0,
				heartTop: 0,
				heartHeight: 0,
				heartWidth: 0,
				animationData: ""
			}
		},
		created() {
			//#ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary")
			//#endif
			this.sysheight = uni.getSystemInfoSync().windowHeight
			this.height = `${this.sysheight}px`
			let width = uni.getSystemInfoSync().windowWidth
			this.width = `${width}px`
		},
		onLoad(e){
			console.log(e.index);
			this.animation = uni.createAnimation()
			this.index = e.index;
		},
		async mounted() {
			await this.pushVideoList()
			this.videoPlay(this.index)
		},
		onShow(){
			setTimeout(()=>{
				this.videoList[this.index].flag = true;
			},800);
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
			setHeartHeight(height) {
				this.heartHeight = height;
			},
			setHeartWidth(width) {
				this.heartWidth = width;
			},
			changeCurrent(e) {
				
				this.index = e.detail.current;
				for (let item of this.videoList) {
					item.flag = false
				}
				this.videoPlay(this.index)
				if (this.index == this.videoList.length - 1) {
					uni.showToast({
						title: '下面没有更多视频了哦',
						icon: 'none'
					});
				}
				if (this.index == 0) {
					uni.showToast({
						title: '上面没有更多视频了哦',
						icon: 'none'
					});
				}
			},
			formatUrl(url) {
				if(url==undefined){
					return;
				}
				var index = url.indexOf("http");
				if (index == 0) {
					console.log(url);
					return url;

				}
				return this.$store.state.baseUrl + url;
			},
			pushVideoList() {
				let promise = new Promise((resolve, reject) => {
					var tempList = this.$store.state.videoList;
					let videoGroup = []
					var index = 0;
					for (let item of tempList) {
						videoGroup.push({
							id:item.id,
							src: this.formatUrl(item.url),
							content: item.title,
							flag: this.index==index,
							check: false,
							avater: this.formatUrl(item.head_img),
							initialTime: 0,
							skr_count: item.skr_count,
							comment_count: item.comment_count
						})
						index++;
					}
					this.videoList = [...this.videoList, ...videoGroup]
					resolve()
					/* uni.request({
						url: 'https://api.apiopen.top/videoRecommend?id=127397',
						success: (res) => {
							let videoGroup = []
							for (let item of res.data.result) {
								if(item.type == 'videoSmallCard'){
									videoGroup.push({
										src:item.data.playUrl,
										content:item.data.description,
										flag:false,
										check:false,
										avater:item.data.author.icon,
										initialTime:0
									})
								}
							}
							this.videoList = [...this.videoList,...videoGroup]
							resolve()
						}
					}) */
				})
				return promise
			},
			tapLove() {
				this.videoList[this.index].check = !this.videoList[this.index].check
				this.videoList = [...this.videoList]
			},
			pauseVideo(val) {
				if (typeof this.videoList[this.index].initialTime != 'undefined') this.videoList[this.index].initialTime = val
			},
			tapAvater() {
				uni.showToast({
					icon: 'none',
					title: `点击索引为${this.index}的头像`
				})
			},
			tapMsg() {
				uni.showToast({
					icon: 'none',
					title: `查看索引为${this.index}的评论`
				})
			},
			tapShare() {
				uni.showToast({
					icon: 'none',
					title: `分享索引为${this.index}的视频`
				})
			},
			videoPlay(index) {
				
				let promise = new Promise((resolve, reject) => {
					resolve()
				})
				promise.then(res => {
					console.log("play:"+index);
					this.videoList[index].flag = !this.videoList[index].flag
				})
				console.log("浏览视频:"+this.videoList[this.index].id);
				//浏览视频
				this.$api.videoView({
					id:this.videoList[this.index].id,
					}).then(res => {				
						console.log(res);
				}).catch(res => {
					uni.stopPullDownRefresh();
					// 失败进行的操作
				})
			},
			clickVideo(e) {
				//判断是否是双击
				if (!this.click) {
					this.click = true;
					this.time = setTimeout(() => {
						this.click = false;
						this.videoList[this.index].flag = !this.videoList[this.index].flag
					}, 300)
					return;
				}
				clearTimeout(this.time)
				this.doubleClick_(e);


			},
			//双击
			doubleClick_(e) {
				console.log("doubleClick");
				this.doubleClick = true;
				this.animation.rotate(Math.random() * 720 - 360).step()
					.scale(Math.random() * 2).step()
					.translate(Math.random() * 100 - 50, Math.random() * 100 - 50).step()
					.skew(Math.random() * 90, Math.random() * 90).step()
				this.animationData = this.animation.export()
				// console.log(e.detail.x, e.detail.y);
				// this.heartLeft = e.detail.x - this.heartWidth/2;
				// this.heartTop = e.detail.y;
				// console.log(this.heartLeft+"  "+this.heartTop);
				this.time = setTimeout(() => {
					this.click = false;
					this.doubleClick = false;
				}, 300)
				//点赞视频
				this.$api.videoLike({
					id:this.videoList[this.index].id,
					}).then(res => {				
						 
				}).catch(res => {
					uni.stopPullDownRefresh();
					// 失败进行的操作
				})
			}

		},
		watch: {
			index(newVal, oldVal) {
				this.oldIndex = oldVal
			}
		}
	}
</script>
<style scoped>
	/* #ifndef APP-PLUS */
	page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	.page {
		width: 100%;
		min-height: 100%;
		display: flex;
	}
	/* #endif */
	.hide {
		display: none !important;
	}

	.heart {
		position: absolute;
		width: 750rpx;
		text-align: center;
		align-items: center;
	}

	.skr-img {
		
		width: 150upx;
		height: 100%;
	}

	.right-follow {
		position: absolute;
		z-index: 100;
		top: 70upx;
		left: 30upx;
		color: #FFFFFF;
		font-size: 16px;
		width: 34upx;
		height: 34upx;
		background-color: #F12F5B;
		text-align: center;
		line-height: 34upx;
		border-radius: 17upx;
	}

	.right-text {
		color: #FFFFFF;
		font-size: 11px;
		text-align: center;
		margin-bottom: 40upx;
		margin-top: 5upx;
	}

	.right-iconfont {
		color: #eee;
		font-size: 32px;
		text-align: center;
	}

	.swiper {
		flex: 1;
		background-color: #000;
	}

	.swiper-item {
		position: relative;
	}

	.video {}

	.video-box {
		flex: 1;
	}

	.cover-view-center {
		position: absolute;
		justify-content: center;
		align-items: center;
		opacity: 0.1;
		z-index: 999;
	}

	.cover-view-top {
		justify-content: center;
		height: 100upx;
		position: absolute;
		width: 750upx;
		top: 48upx;
		z-index: 9999;
	}
	.top-icon {
		width: 40upx;
		height: 40upx;
		position: absolute;
	}
	
	.left-close {
		left: 24upx;
		top: 24upx;
	}
	
	.right-search {
		right: 128upx;
		top: 24upx;
	}
	
	.right-more {
		height: 30upx !important;
		right: 24upx;
		top: 32upx;
	}
	
	.cover-view-left {
		position: absolute;
		margin-left: 10upx;
		width: 400upx;
		bottom: 100upx;
		z-index: 9999;
		font-size: 14px;
		color: #FFFFFF;
		//#ifndef APP-PLUS-NVUE
		white-space: pre-wrap;
		text-overflow: ellipsis;
		overflow: hidden;
		//#endif
	}

	.left-text {
		font-size: 14px;
		color: #FFFFFF;
	}

	.avater {
		border-radius: 50%;
		border-width: 2px;
		border-style: solid;
		border-color: #FFFFFF;
	}

	.cover-view-right {
		position: absolute;
		bottom: 60upx;
		margin-right: 20upx;
		right: 10upx;
		display: flex;
		flex-direction: column;
		z-index: 9999;
		text-align: center;
		padding: 0 4upx;
		align-items: center;
	}

	.img-left {
		width: 80upx;
		height: 70upx;
	}

	.img {
		height: 90upx;
		width: 90upx;
		margin-bottom: 60upx;
	}

	.page {
		flex: 1;
	}
	/* 可以设置不同的进入和离开动画 */
	/* 设置持续时间和动画函数 */
	/* // 进入的动画 opacity: 0=>1, translateX: 10=>0 */
	.slide-fade-enter-active {
		transition: opacity .3s ease;
	}

	/* // 离开的动画 opacity: 1=>0, translateX: 0=>10 */
	.slide-fade-leave-active {
		transition: opacity .8s ease
	}

	/* // 进入第一帧和离开最后一帧的状态 */
	.slide-fade-enter {
		transform: scale(0.5);
		opacity: 0;
	}

	.slide-fade-leave-to {
		transform: scale(1);
		opacity: 0;
	}
</style>
