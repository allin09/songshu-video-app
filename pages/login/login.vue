<template>
	<view>
		<view class="head">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#000000" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				<view></view>
			</view>
			<view class="right-wrapper">

			</view>
		</view>
		<view class="content">
			<view class="login-wrapper">
				<view class="login-title">
					<text>使用手机号登录</text>
				</view>
				<input class="login-input" type="number" placeholder="请输入手机号" placeholder-class="input-placeholder" v-model="phone" />
				<view class="code-wrapper">
					<input class="login-input code-input" maxlength="6" type="number" placeholder="请输入验证码" placeholder-class="input-placeholder"
					 v-model="code" />
					<text class="send-btn" @tap="sendSms">{{isSend?time:'发送验证码'}}</text>
				</view>
				<button class="login-btn" @tap="login">同意规则并登陆</button>
				<view class="login-tips">
					<text>登陆表示同意"</text><text class="active" @tap="userAgreement">用户协议</text><text>"和"</text><text class="active" @tap="privacyProtocol">隐私政策</text>"
				</view>
			</view>
			<view class="other-login">
				<view class="other-title">
					<text>更多登陆方式</text>
				</view>
				<view class="other-login-type-wrapper">
					<view class="item-other-login" @tap="loginType(0)">
						<image src="../../static/icon/weixin.png"></image>
						<text>微信</text>
					</view>
					<view class="item-other-login" @tap="loginType(1)">
						<image src="../../static/icon/weibo.png"></image>
						<text>微博</text>
					</view>
					<view class="item-other-login" @tap="loginType(2)">
						<image src="../../static/icon/qq.png"></image>
						<text>QQ</text>
					</view>
				</view>
			</view>
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
				phone: '',
				code: '',
				time: 60,
				smsInterval: null,
				isSend: false
			}
		},
		onUnload() {
			if (this.smsInterval != null) {
				clearInterval(this.smsInterval);
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			loginType(typeid) {
				switch (typeid) {
					case 0:
						uni.login({
							provider: 'weixin',
							success: function(loginRes) {
								//console.log(loginRes.authResult);
							},
							fail: (res) => {
								//console.log(res);
							}
						});

						break;
					case 1:
						uni.login({
							provider: 'sinaweibo',
							success: function(loginRes) {
								//console.log(loginRes.authResult);
							},
							fail: (res) => {
								console.log(res);
							}
						});

						break;
					case 2:
						uni.login({
							provider: 'qq',
							success: function(loginRes) {
								//console.log(loginRes.authResult);
							},
							fail: (res) => {
								//console.log(res);
							}
						});
						break;
				}
			},
			userAgreement() {
				uni.showToast({
					title: '用户协议',
					icon: 'none'
				});
			},
			privacyProtocol() {
				uni.showToast({
					title: '隐私政策',
					icon: 'none'
				});
			},
			login() {
				if (this.phone == '' || this.phone.length != 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				if (this.code == '' || this.code.length != 6) {
					uni.showToast({
						title: '请输入正确的验证码',
						icon: 'none'
					});
					return;
				}
				this.$api.userLogin({
					phone: this.phone,
					code: this.code,
					type: 'phone'
				}).then((res) => {
					if (res.data.code == 1) {
						uni.showToast({
							title: '登陆失败,' + res.data.msg
						});
						return;
					}
					uni.showToast({
						title: '登录成功',
						icon: 'none',
						duration:1000,
						complete:()=> {
							uni.navigateBack({
							    delta: 1
							});
						}
					});
					//登陆成功
					this.$store.dispatch('getUserInfo');
					

				});
			},
			sendSms() {
				if (this.isSend) {
					return;
				}
				if (this.phone == '' || this.phone.length != 11) {
					uni.showToast({
						title: '请输入正确的手机号',
						icon: 'none'
					});
					return;
				}
				this.$api.sendSms({
					phone: this.phone
				}).then((res) => {
					if (res.data.code == 1) {
						uni.showToast({
							title: '发送失败',
							icon: 'none'
						});
						return;
					}
					uni.showToast({
						title: '发送成功'
					});
					this.isSend = true;
					this.smsInterval = setInterval(() => {
						if (this.time > 0) {
							this.time--;
						} else {
							clearInterval(this.smsInterval);
							this.isSend = false;
							this.time = 60;
						}
					}, 1000);
				}).catch(e=>{
					uni.showToast({
						title: '发送失败',
						icon: 'none'
					});
				});
			},
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

	.login-wrapper {
		flex: 9;
		padding: 76upx;
		padding-bottom: 120upx;

		.login-title {
			font-size: 48upx;
			font-family: PingFang SC;
			font-weight: 400;

		}

		.login-input {

			margin-top: 64upx;
			border-bottom: 1upx solid rgba($color: #000000, $alpha: .2);
			padding-top: 12upx;
			padding-bottom: 18upx;
		}

		.code-input {
			padding-right: 160upx;
		}

		.input-placeholder {
			color: rgba($color: #000000, $alpha: .3);
		}

		.code-wrapper {
			position: relative;

			.send-btn {

				display: inline-block;
				height: 64upx;
				position: absolute;
				right: 8upx;
				top: 18upx;
			}
		}

		.login-btn {
			margin-top: 48upx;
			font-size: 36upx;
			background-color: $uni-text-color-active;
			color: $uni-text-color-inverse;
			border-radius: 50upx;
		}

		.login-tips {
			height: 50upx;
			width: 100%;
			text-align: center;
			margin-top: 48upx;
			margin-bottom: 48upx;
			font-size: 24upx;
			color: #666;
		}
	}

	.other-login {
		padding: 76upx;
		flex: 3;

		.other-title {
			text-align: center;
			position: relative;

			text {
				z-index: 1;
				padding: 24upx;
				font-size: 26upx;
				color: rgba($color: #000000, $alpha: .5);

				&:before {
					content: '';
					position: absolute;
					top: 48%;
					height: 1upx;
					background: rgba($color: #000000, $alpha: .1);
					left: 0;
					width: 30%;
				}

				&:after {
					content: '';
					position: absolute;
					top: 48%;
					height: 1upx;
					background: rgba($color: #000000, $alpha: .1);
					right: 0;
					width: 30%;
				}
			}
		}

		.other-login-type-wrapper {
			margin: 64upx;
			display: flex;
			flex-direction: row;
			justify-content: center;

			.item-other-login {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				align-items: center;
				flex: 1;

				image {
					width: 100upx;
					height: 100upx;
				}

				text {
					font-family: PingFang SC;
					margin-top: 12upx;
					color: rgba($color: #000000, $alpha: .4);
				}
			}
		}
	}
</style>
