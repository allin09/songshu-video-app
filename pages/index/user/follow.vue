<template>
	<view>
		<view class="head" :style="{'height':sysheight,width:width}">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#999999" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				<view class="data-type-title-wrapper">
					<text class="data-type-title" :class="{active:index==0}" @tap="changeType(0)">关注</text>
					<text class="data-type-title" :class="{active:index==1}" @tap="changeType(1)">粉丝</text>
				</view>
			</view>
			<view class="right-wrapper">

			</view>
		</view>
		<view class="content">
			<!-- 搜索详情 -->
			<view class="data-wrapper">

				<view class="data-content-wrapper">
					<view class="data-content-user" v-show="index==0">
						<view v-for="(item,idx) in followData.data" :key="idx" class="user-item">
							<view class="user-head-wrapper" @tap="userInfo(item.id)">
								<image class="user-head" :src="formatUrl(item.head_img)" mode="widthFix"></image>
							</view>
							<view class="user-content" @tap="userInfo(item.id)">
								<text class="user-name">{{item.name}}</text>
								<text class="follow_count">粉丝 {{item.follow_count}}</text>
							</view>
							<view class="user-follow" @tap="tapFollow(idx)">
								<text :class="{'cache':item.follow!='0'}">{{item.follow!='0'?'取消关注':'关注'}}</text>
							</view>

						</view>
					</view>
					<view class="data-content-user" v-show="index==1">
						<view v-for="(item,idx) in fansData.data" :key="idx" class="user-item">
							<view class="user-head-wrapper" @tap="userInfo(item.id)">
								<image class="user-head" :src="formatUrl(item.head_img)" mode="widthFix"></image>
							</view>
							<view class="user-content" @tap="userInfo(item.id)">
								<text class="user-name">{{item.name}}</text>
								<text class="follow_count">粉丝 {{item.follow_count}}</text>
							</view>
							<view class="user-follow" @tap="tapFollow(idx)">
								<text :class="{'cache':item.follow!='0'}">{{item.follow!='0'?'取消关注':'关注'}}</text>
							</view>

						</view>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import uniSearchBar from "@/components/uni-search-bar/uni-search-bar.vue"
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import videoPage from "../../../components/video/video-page.vue"
	export default {
		components: {
			uniSearchBar,
			uniIcons,
			videoPage
		},
		data() {
			return {
				sysheight: 0,
				height: '667px',
				width: '',
				input: true,
				value: '',
				index: 0,
				followData: {
					data: [],
					page: 1,
					isMore: true
				},
				fansData: {
					data: [],
					page: 1,
					isMore: true
				}
			};
		},
		mounted() {

		},
		onLoad(e) {
			if (e.type == 'follow') {
				this.index = 0;
			} else {
				this.index = 1;
			}
			this.loadData();
		},
		created() {
			//#ifdef APP-PLUS
			plus.screen.lockOrientation("portrait-primary")
			//#endif
			this.sysheight = uni.getSystemInfoSync().windowHeight
			this.height = `${this.sysheight}px`
			let width = uni.getSystemInfoSync().windowWidth
			this.width = `${width}px`
			uni.$on('searchClick', () => {
				this.input = true;
			});
			
		},
		onReachBottom() {
			this.loadMore();
		},
		methods: {
			//格式化链接地址
			formatUrl(url1) {
				if (url1 == undefined) {
					return;
				}
				var index = url1.indexOf("http");
				if (index == 0) {

					return url1;

				}
				return this.$store.state.baseUrl + url1;
			},
			userInfo(uid) {
				uni.navigateTo({
					url: '/pages/index/user/other?uid=' + uid
				})
			},
			tapFollow(index) {
				var item = {}
				if (this.index == 0) {
					item = this.followData.data[index];
				} else {
					item = this.fansData.data[index];
				}

				var type = 'add';
				if (item.follow != '0') {
					//已关注
					type = 'cancel';
				}
				this.$api.followChange({
					uid: item.id,
					type: type
				}).then((res) => {
					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						return;
					}
					//console.log(item);
					if(this.index==0){
						this.followData.data[index].follow = this.followData.data[index].follow != '0' ? '0' : '1';
						//console.log(this.followData.data[index]);
					}else{
						this.fansData.data[index].follow = this.fansData.data[index].follow != '0' ? '0' : '1';
						//console.log(this.fansData.data[index]);
					}
					
					uni.showToast({
						title: res.data.msg
					});
				})
			},
			changeType(index) {
				this.index = index;
				this.loadData()
			},
			loadData() {
				//console.log(this.index);
				if (this.index == 0) {
					//关注
					this.$api.userFollowList({}).then((res) => {
						if (res.data.code == 1) {
							this.userData.isMore = false;
							uni.showToast({
								title: "暂无更多数据"
							});
							return;
						}
						this.followData.data = res.data.data;
					})
				} else {
					//粉丝
					this.$api.userFansList({}).then((res) => {
						if (res.data.code == 1) {
							this.userData.isMore = false;
							uni.showToast({
								title: "暂无更多数据"
							});
							return;
						}
						this.fansData.data = res.data.data;
					})
				}
			},
			loadMore() {
				if (this.index == 0) {
					if (!this.followData.isMore) {
						this.followData.isMore = false;
						uni.showToast({
							title: "暂无更多数据"
						});
						return;
					}
					this.$api.userFollowList({
						key: this.value,
						page: ++this.followData.page
					}).then((res) => {
						if (res.data.code == 1) {
							this.followData.isMore = false;
							uni.showToast({
								title: "暂无更多数据"
							});
							return;
						}
						for (let item of res.data.data) {
							this.followData.data.push(item);
						}

					})
				} else {
					if (!this.fansData.isMore) {
						this.fansData.isMore = false;
						uni.showToast({
							title: "暂无更多数据"
						});
						return;
					}
					this.$api.userFansList({
						key: this.value,
						page: ++this.fansData.page
					}).then((res) => {
						if (res.data.code == 1) {
							this.fansData.isMore = false;
							uni.showToast({
								title: "暂无更多数据"
							});
							return;
						}
						for (let item of res.data.data) {
							this.fansData.data.push(item);
						}
					})
				}

			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},

		}
	}
</script>

<style lang="scss">
	page {
		background: $uni-bg-color;
	}

	.head {

		align-items: center;
		position: fixed;
		//#ifdef APP-PLUS
		padding-top: 44upx;
		//#endif
		z-index: 1;
		left: 0;
		right: 0;
		background: $uni-bg-color;
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
		height: 88upx;
		line-height: 88upx;
		flex-direction: row;
		// background: #007AFF;
		justify-content: center;
		flex: 1;
		margin-right: 24upx;
	}

	.search-wrapper {
		margin-right: 24upx;

		// background: #09BB07;
		flex: 10;
		flex-direction: row;
		align-items: center;
		align-content: center;
		justify-content: center;

	}

	.search {
		flex: 1;
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

	.search-history {
		margin-top: 24upx;
		flex-direction: column;
	}

	.search-title {
		font-weight: 800;
		font-size: 30upx;
		margin-left: 24upx;

	}

	.history-wrapper {
		margin-top: 24upx;
		margin-left: 24upx;
		flex-direction: row;
		flex-wrap: wrap;
	}

	.history-item {
		display: inline-block;
		padding: 4upx 16upx;
		background-color: rgba($color: #000000, $alpha: .05);
		margin-right: 24upx;
		margin-bottom: 24upx;
		border-radius: 8upx;
	}

	.clear {
		text-align: center;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		align-content: center;
		color: #999999;
	}

	.data-wrapper {
		flex-direction: column;

	}

	.data-type-title-wrapper {
		flex-direction: row;
		justify-content: center;
		align-items: center;
		align-content: center;
		text-align: center;
	}

	.data-type-title {

		padding: 24upx 30upx;
		font-size: 30upx;

		&.active {
			color: $uni-text-color-active
		}
	}

	.data-content-wrapper {
		margin-top: 24upx;

		.data-content-user {
			height: 100%;
			flex-direction: column;

			.user-item {
				padding-top: 24upx;
				display: flex;
				// background-color: red;
				width: 750upx;
				flex: 1;
				flex-direction: row;
				flex-wrap: nowrap;

				.user-head-wrapper {
					display: flex;
					// background-color: #8A6DE9;
					flex: 1;

					.user-head {
						width: 90upx;
						margin-left: 24upx;
						border-radius: 50%;
					}
				}

				.user-content {
					display: flex;
					// background-color: #007AFF;
					justify-content: center;
					margin-left: 24upx;
					flex: 8;
					flex-direction: column;

					.user-name {
						font-size: 30upx;
					}

					.follow_count {
						font-size: 22upx;
						color: rgba($color: #000000, $alpha: .2);
					}
				}

				.user-follow {
					display: flex;
					// background-color: #09BB07;
					justify-content: center;
					align-content: center;
					align-items: center;
					margin-right: 24upx;
					flex: 3;
					flex-wrap: nowrap;

					text {
						lines: 1;
						padding: 4upx 12upx;
						font-size: 24upx;
						border: 1upx solid $uni-text-color-active;
						color: $uni-text-color-active;
						border-radius: 8upx;

						&.cache {
							background-color: rgba($color: #000000, $alpha: .05);
							color: #929292;
							border: none;
						}

					}
				}
			}

		}

		.data-content-video {}
	}
</style>
