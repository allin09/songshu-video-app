<template>
	<view>
		<view class="head">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#000000" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				<view>设置</view>
			</view>
			<view class="right-wrapper">

			</view>
		</view>
		<view class="content">
			<view class="setting-group">
				<view class="setting-item" hover-class="view-hover" hover-stay-time="100" @tap="accountManagement">
					<view class="setting-item-icon">
						<image src="/static/icon/safe.png" mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">账号管理</text>
					<view class="setting-right">
						<uni-icons color="#999" size="30" type="arrowright" />
					</view>
				</view>
			</view>
			<view class="setting-group">
				<!-- <view class="setting-item" hover-class="view-hover" hover-stay-time="100">
					<view class="setting-item-icon">
						<image src="/static/icon/clear.png"  mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">清理缓存</text>
					<view class="setting-right">
						<text>{{cacheSize}}</text>
					</view>
				</view> -->
				<view class="setting-item" hover-class="view-hover" hover-stay-time="100" @tap="checkUpdate">
					<view class="setting-item-icon">
						<image src="/static/icon/update.png"  mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">检查更新</text>
					<view class="setting-right">
						<text>{{version}}</text>
					</view>
				</view>
				<view class="setting-item" hover-class="view-hover" hover-stay-time="100" @tap="aboutMe">
					<view class="setting-item-icon">
						<image src="/static/icon/about.png"  mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">关于我们</text>
					<view class="setting-right">
						<uni-icons color="#999" size="30" type="arrowright" />
					</view>
				</view>
			</view>
			<button v-if="user!=null" plain  class="exit-login" hover-class="view-hover" @tap="logout">退出登录</button>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	export default {
		components: {
			uniIcons,
		},
		data() {
			return {
				cacheSize:0,
				version:1
			}
		},
		mounted() {
			this.cacheSize = this.$utils.formatSize(this);
		},
		created(){
			this.version = plus.runtime.version;
		},
		computed:{
			user(){
				return this.$store.state.user;
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			accountManagement(){
				if(this.user==null){
					uni.navigateTo({
						url:'/pages/login/login'
					}) 
					return;
				}
				uni.navigateTo({
					url:'/pages/setting/account'
				})
			},
			checkUpdate(){
				this.$store.dispatch("update",true);
			},
			aboutMe(){
				plus.runtime.openURL('https://www.youyacao.com/');
			},
			logout(){
				uni.showModal({ //提醒用户更新
					title: "退出登录",
					content: "确认退出登录？", 
					success: (res) => {
						if (res.confirm) {
							this.$api.userLogout({}).then((res)=>{
								if(res.data.code==0){
									this.$store.commit('setUser',null);
									uni.removeStorageSync('user')
									uni.showToast({
										title: '退出登录成功',
										duration:500,
										success() {
											uni.navigateBack({
											    delta: 1
											});
										}
									});
									
									
								}
							});
						}
					} 
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		height: 100%;
		width: 100%;
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
		height: 88upx;
		line-height: 88upx;
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

	.search {
		height: 88upx;
		line-height: 88upx;
		flex: 1;
	}

	.content {
		height: 800upx;
		display: flex;
		flex-direction: column;
		position: relative;
		padding-top: 88upx;
		padding-bottom: 123upx;
		//#ifdef APP-PLUS
		padding-top: 128upx;
		//#endif
		height: 100%;
		width: 100%;
	}

	.setting-group {
		background: rgba(0, 0, 0, 0.05);
		padding-top: 24upx;
		.setting-item {
			height: 60upx;
			&:last-child{
				&:after{
					background:rgba(0, 0, 0, 0.0);
				}
			}
			position: relative;
			padding:36upx 24upx;
			background: #FFFFFF;
			display: flex;
			flex-direction: row;
			align-content: center;
			align-items: center;
			&:after{
				content:"";
				position: absolute;
				height: 1upx;
				background:rgba(0, 0, 0, 0.1);
				width: 78%;
				right: 48upx;
				bottom: 0;
			}
			.setting-item-icon{
				display: flex;
				flex-direction: row;
				justify-content: center;
				image {
					flex: 1;
					margin-left: 24upx;
					width: 40upx;
					height: 40upx;
				} 
			}
			

			.setting-item-title {
				flex: 7;
				font-size: 30upx;
				margin-left: 24upx;
			}

			.setting-right {
				margin-right: 24upx;
				display: flex;
				flex-direction: row;
				justify-content: flex-end;
				align-items: center;
				flex-wrap: nowrap;
				flex: 3;
				text{
					color:#999;
				}
				
			}
		}
	}
	.exit-login{
		border-radius: 50upx;
		border: none;
		background-color: rgba($color: #000000, $alpha: .05);
		padding: 0 20upx;
		width: 600upx;
		margin-top: 220upx;
	}
</style>
