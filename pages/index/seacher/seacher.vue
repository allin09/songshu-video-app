<template>
	<view>
		<view class="head" :style="{'height':sysheight,width:width}">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#999999" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				<uni-search-bar ref="search" background="rgba(0,0,0,.05)" borderColor="rgba(0,0,0,.05)" radius="50" class="search"
				 placeholder="搜索用户/视频" @confirm="search" />
			</view>
			<view class="right-wrapper" @tap="search_btn">
				<text>搜索</text>
			</view>
		</view>
		<view class="content">
			<!-- 搜索历史 -->
			<view class="search-history" v-show="input">
				<text class="search-title">搜索</text>
				<view class="history-wrapper">
					<view class="history-item" v-for="(item,index) in history" :key="index">
						<text @click="search({'value':item})">{{item}}</text>
					</view>
				</view>
				<view class="clear" @tap="clear" v-if="history.length">
					<uni-icons type="trash" color="#999999" size="24"></uni-icons> <text>清除历史记录</text>
				</view>
			</view>
			<!-- 搜索详情 -->
			<view class="data-wrapper" v-show="!input">
				<view class="data-type-title-wrapper">
					<text class="data-type-title" :class="{active:index==0}" @tap="changeType(0)">用户</text>
					<text class="data-type-title" :class="{active:index==1}" @tap="changeType(1)">视频</text>
				</view>
				<view class="data-content-wrapper">
					<view class="data-content-user" v-show="index==0">
						<view v-for="(item,idx) in userData.data" :key="idx" class="user-item" >
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
					<view class="data-content-video" v-show="index==1">
							<video-page class="video-page" :videoList="videoData.data" :page="videoData.page" :type="search" :style="{width:width,height:sysheight}"></video-page>
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
				history: [
				],
				input: true,
				value:'',
				index: 0,
				userData: {
					data: [],
					page: 1,
					isMore: true
				},
				videoData: {
					data: [],
					page: 1,
					isMore: true
				}
			};
		},
		mounted() {
			this.$api.searchHistory({}).then((res)=>{
				if(res.data.code==1){
					return;
				}
				this.history = res.data.data;
			});
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
			userInfo(uid){
				uni.navigateTo({
					url:'/pages/index/user/other?uid='+uid
				})
			},
			tapFollow(index){
				var item = this.userData.data[index];
				var type = 'add';
				if(item.follow!='0'){
					//已关注
					type='cancel';
				}
				this.$api.followChange({uid:item.id,type:type}).then((res)=>{
					if(res.data.code==1){
						uni.showToast({
							title: res.data.msg,
							icon:'none'
						});
						return;
					}
					this.userData.data[index].follow=this.userData.data[index].follow!='0'?'0':'1';
					uni.showToast({
						title: res.data.msg
					});
				})
			},
			changeType(index) {
				this.index = index;
				//console.log(index);
				this.search({value:this.value})
			},
			search(e) {
				var value = e.value;
				if (value == "") {
					uni.showToast({
						title: '请输入搜索内容',
						icon: "none"
					});
					return;
				}
				this.input = false;
				
				this.history.remove(value);
				this.history.unshift(value);
				this.value = value;
				if (this.index == 0) {
					this.userData.page=1;
					this.userData.isMore = true;
					this.$api.searchUser({
						key: value,
						page: this.userData.page
					}).then((res) => {
						if (res.data.code == 1) {
							this.userData.isMore = false;
							uni.showToast({
								title: res.data.msg
							});
							return;
						}
						this.userData.data = res.data.data;
					})
				} else {
					this.videoData.page=1;
					this.videoData.isMore = true;
					this.$api.searchVideo({
						key: value,
						page: this.videoData.page
					}).then((res) => {
						if (res.data.code == 1) {
							this.videoData.isMore = false;
							uni.showToast({
								title: res.data.msg
							});
							return;
						}
						this.videoData.data = res.data.data;
					})
				}

			},
			loadMore(){
				if (this.index == 0) {
					if(!this.userData.isMore){
						this.userData.isMore = false;
						uni.showToast({
							title: "暂无更多数据"
						});
						return;
					}
					this.$api.searchUser({
						key: this.value,
						page: ++this.userData.page
					}).then((res) => {
						if (res.data.code == 1) {
							this.userData.isMore = false;
							uni.showToast({
								title: "暂无更多数据"
							});
							return;
						}
						for(let item of res.data.data){
							this.userData.data.push(item);
						}
						
					})
				} else {
					if(!this.userData.isMore){
						this.userData.isMore = false;
						uni.showToast({
							title: "暂无更多数据"
						});
						return;
					}
					this.$api.searchVideo({
						key: this.value,
						page: ++this.page
					}).then((res) => {
						if (res.data.code == 1) {
							this.videoData.isMore = false;
							uni.showToast({
								title: "暂无更多数据"
							});
							return;
						}
						for(let item of res.data.data){
							this.userData.data.push(item);
						}
					})
				}
				
			},
			search_btn() {
				this.$refs.search.confirm();
			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			clear() {
				this.history = [];
				//console.log("清除历史记录");
				this.$api.searchHistoryClear({});
			}
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
					flex:8;
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
						&.cache{
							background-color: rgba($color: #000000, $alpha: .05);
							color: #929292;
							border: none;
						}
						
					}
				}
			}

		}
		.data-content-video{
			
		}
	}
</style>
