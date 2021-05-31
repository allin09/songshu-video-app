<script>
	import Vue from 'vue';
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// #ifdef APP-PLUS
			// 锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary'); //锁定
			var domModule = weex.requireModule('dom');
			domModule.addRule('fontFace', {
				'fontFamily': "uniicons",
				'src': "url('./static/uni.ttf')"
			});
			this.$store.dispatch("update");

			// #endif
			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.statusBar = e.statusBarHeight
					// #ifndef MP
					if (e.platform == 'android') {
						Vue.prototype.customBar = e.statusBarHeight + 50
					} else {
						Vue.prototype.customBar = e.statusBarHeight + 45
					}
					// #endif

					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect()
					Vue.prototype.customBar = custom.bottom + custom.top - e.statusBarHeight
					// #endif

					// #ifdef MP-ALIPAY
					Vue.prototype.customBar = e.statusBarHeight + e.titleBarHeight
					// #endif
				}
			})
			this.$store.dispatch('getUserInfo');
			this.$store.dispatch("getAdvert");
			
		},
		
		onShow: function() {
			console.log('App Show')
			
		}, 
		onError: function(e) {
			console.log("App Error", e);
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/* #ifndef APP-PLUS-NVUE */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';

	/* 以下样式用于 hello uni-app 演示所需 */
	page {
		background: rgba(0, 0, 0, 0.05);
		height: 100%;
		font-size: 28upx;
	}

	/* #endif*/
	.card {
		border-radius: 8upx;
		background-color: #FFFFFF;
		box-shadow: 0 8upx 12upx rgba($color: #000000, $alpha: .25);
	}
	.card-1 {
		border-radius: 8upx;
		background-color: #FFFFFF;
		box-shadow: 0 4upx 8upx rgba($color: #000000, $alpha: .25);
	}

	.active {
		color: $uni-text-color-active;
	}

	.view-hover {
		background-color: rgba($color: #000000, $alpha: .05) !important;
	}
	
</style>
