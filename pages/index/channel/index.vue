<template>
	<view class="page" style="height: 100vh;">

		<!-- 顶部开始 -->
		<view class="head-wrapper shadow">
			<view class="title-wrap">
				<text class="uni-title">频道</text>
			</view>
			<view class="seach" @click="seach">
				<image src="/static/home/seach.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 顶部结束 -->

		<view class="content-wrapper">

			<view class="typp-list-wrapper">
				<view class="type-item" v-for="(item,idx) in typeList" :key="idx" @tap="tapItem(item)">
					<image :src="formatUrl(item.icon)"></image>
					<text>{{item.name}}</text>
				</view>
			</view>
			<advert-page :src="advert[3].img" :showAd="showAd" :adUrl="advert[3].ad_url" :openType="advert[3].open_type*2" @close="closeAd"></advert-page>
		</view>

	</view>
</template>

<script>
	import advertPage from "@/components/advert/advert-page.vue"
	export default {
		components: {
			advertPage
		},
		data() {
			return {
				showAd: true,
				isMore: true,
				loadmore: false,
				typeList: []
			}
		},
		created() {},
		onShow() {
			this.showAd = true;
		},
		methods: {
			seach() {

				uni.navigateTo({
					url: '/pages/index/seacher/seacher',
					success: res => {},
					fail: () => {},
					complete: () => {}
				});
			},
			initData() {
				uni.showLoading({
					title: '正在加载...',
					mask: false
				});
				this.$api.typeList({}).then((res) => {
					uni.hideLoading();
					//console.log(res.data);
					this.typeList = res.data.data;
					//console.log(this.typeList);
				});
			},
			tapItem(item) {
				this.$store.commit('setSubType', item);
				uni.navigateTo({
					url: '/pages/index/channel/subTypeList/index'
				})
			},
			//格式化链接地址
			formatUrl(url) {
				if (url == undefined) {
					return;
				}
				var index = url.indexOf("http");
				if (index == 0) {
					return url;
				}
				return this.$store.state.baseUrl + url;
			},
			closeAd() {
				this.showAd = false;
			}
		},
		created() {
			this.initData();
		},
		computed: {
			advert() {
				return this.$store.state.advert.page
			}
		},
		mounted() {

		}
	}
</script>

<style lang="scss">
	.page {
		background-color: $uni-bg-color !important;
	}

	.head-wrapper {
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

	.shadow {
		box-shadow: 0 1px 6px #ccc;
	}

	.title-wrap {
		flex: 11;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.uni-title {
		margin-left: 70upx;
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

	.typp-list-wrapper {
		margin-top: 24upx;
		flex: 1;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;

		.type-item {
			height: 200upx;
			justify-content: center;
			align-items: center;
			align-content: center;
			width: 25%;
			display: flex;
			flex-direction: column;

			image {
				width: 80upx;
				height: 80upx;
			}

			text {
				margin-top: 12upx;
				letter-spacing: 4upx;
			}
		}
	}
</style>
