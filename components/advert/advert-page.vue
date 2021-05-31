<template>
	<view>
		<view v-show="showAd" class="ad-top" @tap="toAdUrl">
			<image class="advert-img" :src="formatUrl(src)" mode="scaleToFill"></image>
			<image class="ad-close" src="/static/icon/close.png" mode="aspectFill" @tap="closeAd"></image>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			showAd: {
				type: Boolean,
				default: true
			},
			src: {
				type: String,
				default: ""
			},
			adUrl: {
				type: String,
				default: ""
			},
			openType: {
				type: Number,
				default: 2
			}
		},
		methods: {
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
			toAdUrl() {
				console.log("toUrl",this.openType);
				//有广告，判断类型
				if (this.openType == 1) {
					//调用下载
					this.$store.dispatch('downloadAndInstall', this.adUrl);

				} else if (this.openType == 2) {
					plus.runtime.openURL(this.adUrl);
				}
			},
			closeAd(){
				this.$emit("close");
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style>
	.ad-top {
		background-color: #FFFFFF; 
		height: 300upx;
		width: 750upx;
		margin-top: 24upx;
		position: relative;
	}

	.ad-close {
		position: absolute;
		width: 36upx;
		height: 36upx;
		right: 12upx;
		top: 10upx;
	}
 
	.advert-img {
		height: 300upx;
		display:block;
		width: 750upx;
	}
</style>
