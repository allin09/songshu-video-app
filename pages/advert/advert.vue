<template>
	<view class="content">
		<image @tap="download" async class="advert-img" :src="advert.home!=undefined?formatUrl(advert.home.img):''" mode="scaleToFill"></image>
		<text v-show="!timeOk" class="goto-time-text">{{time}}s</text>
		<text v-show="timeOk" @tap="toHome" class="goto-text">进入</text>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				interval:null,
				sysheight: 0,
				timeOk:false,
				time:5,
				isJump:false
			}
		},
		created() {
			this.sysheight = uni.getSystemInfoSync().windowHeight
			this.startTime()
		},
		methods: { 
			//格式化链接地址
			formatUrl(url) {
				if (url == undefined) {
					return "";
				}
				var index = url.indexOf("http");
				if (index == 0) {
					return url;
				}
				return this.$store.state.baseUrl + url;
			},
			download(){
				//当前并无广告，直接返回
				if(this.advert.home==undefined){
					return;
				}
				//有广告，判断类型
				if(this.advert.home.open_type==1){
					//调用下载
					this.$store.dispatch('downloadAndInstall',this.advert.home.ad_url);
					
				}else if(this.advert.home.open_type==2){
					// #ifdef APP-PLUS
						plus.runtime.openURL(this.advert.home.ad_url);
					// #endif
				}
			},
			toHome(){
				if(!this.isJump){
					this.isJump=!this.isJump
					uni.redirectTo({
						url:'../index/index',
					})
				}
			},
			startTime(){
				this.interval = setInterval(()=>{
					if(this.time<1){
						clearInterval(this.interval);
						this.timeOk = true;
						return;
					}
					this.time--;
				},1000)
			}
		},
		computed:{
			advert(){
				return this.$store.state.advert;
			}
		}
	}
</script>

<style>
	page{
		width: 100%;
		height: 100%;
		padding: 0;
	}
	.content{
		position: relative;
		width: 100%;
		height: 100%;
	}
	.advert-img{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
	}
	.goto-time-text{
		font-size: 22upx;
		position: absolute;
		right: 32upx;
		top: 84upx;
		width: 25upx;
		height: 25upx;
		color:#eeeeee;
		line-height: 25upx;
		padding: 13upx;
		border-radius: 50%;
		
		background-color: rgba(0,0,0,.5);
	}
	.goto-text{
		font-size: 22upx;
		position: absolute;
		right: 24upx;
		top: 84upx;
		width: 50upx;
		height: 25upx;
		color:#eeeeee;
		line-height: 25upx;
		padding:13upx;
		border-radius: 32upx;
		background-color: rgba(0,0,0,.5);
		white-space: nowrap;
	}
</style>
