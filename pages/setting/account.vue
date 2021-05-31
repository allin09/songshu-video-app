<template>
	<view>
		<view class="head">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#000000" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				<view>账号管理</view>
			</view>
			<view class="right-wrapper">

			</view>
		</view>
		<view class="content">
			<view class="setting-group">
				<view class="setting-item" hover-class="view-hover" hover-stay-time="100">
					<view class="setting-item-icon">
						<image src="/static/icon/safe.png" mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">绑定手机</text>
					<view class="setting-right">
						<text>{{user.phone}}</text>
						<uni-icons color="#999" size="30" type="arrowright" />
					</view>
				</view>
				<view class="setting-item" hover-class="view-hover" hover-stay-time="100" @tap="change('name')">
					<view class="setting-item-icon">
						<image src="/static/footer_icon/e1.png" mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">用户名</text>
					<view class="setting-right">
						<text>{{user.name}}</text>
						<uni-icons color="#999" size="30" type="arrowright" />
					</view>
				</view>
				<view class="setting-item" hover-class="view-hover" hover-stay-time="100" @tap="change('custom_id')">
					<view class="setting-item-icon">
						<image src="/static/icon/idcard.png" mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">用户ID</text>
					<view class="setting-right">
						<text>{{user.custom_id==null?"未设置":user.custom_id}}</text>
						<uni-icons color="#999" size="30" type="arrowright" />
					</view>
				</view>
			</view>
			<view class="setting-group">
				<view class="setting-item" hover-class="view-hover" hover-stay-time="100" @tap="change('qq')">
					<view class="setting-item-icon">
						<image src="/static/footer_icon/e1.png" mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">QQ</text>
					<view class="setting-right">
						<text>{{user.qq==null?"未设置":user.qq}}</text>
						<uni-icons color="#999" size="30" type="arrowright" />
					</view>
				</view>
				<view class="setting-item" hover-class="view-hover" hover-stay-time="100" @tap="change('mail')">
					<view class="setting-item-icon">
						<image src="/static/footer_icon/e1.png" mode="aspectFit"></image>
					</view>
					<text class="setting-item-title">邮箱</text>
					<view class="setting-right">
						<text>{{user.mail==null?"未设置":user.mail}}</text>
						<uni-icons color="#999" size="30" type="arrowright" />
					</view>
				</view>

			</view>
			<view class="setting-group">
			</view>
			<uni-popup :show="show" type="center" :custom="true" :mask-click="true" @change="changepop">
				<view class="uni-tip">
					<view class="uni-tip-title">{{popTitle}}</view>
					<view class="uni-tip-content">
						<view class="input-wrapper">
							<input v-model="content" class="popinput" type="text" value="" :placeholder="popPlaceholder" />
						</view>
					</view>
					<view class="uni-tip-group-button">
						<view class="uni-tip-button" @tap="cancel()">取消</view>
						<view class="uni-tip-button" @tap="confirm()">确定</view>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
	import uniIcons from "@/components/uni-icons/uni-icons.vue";
	import uniPopup from '@/components/uni-popup/uni-popup.vue'
	export default {
		components: {
			uniIcons,
			uniPopup
		},
		data() {
			return {
				show:false,
				popTitle:'',
				popPlaceholder:'',
				type:'',
				content:""
			}
		},
		computed: {
			user() {
				return this.$store.state.user;
			}
		},
		methods: {
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			cancel(){
				this.content = '';
				this.show=false;
			},
			confirm(){
				if(this.type==''){
					return;
				}
				//调用更新用户信息接口
				this.$api.userUpdate({[this.type]: this.content}).then((res) => {
					if (res.data.code == 1) {
						uni.showToast({
							title: res.data.msg,
							icon: 'none'
						});
						return;
					}
					uni.showToast({
						title: '修改成功'
					});
					this.$store.dispatch('getUserInfo');
				});
				this.show=false;
			},
			changepop(){
				this.content = '';
			},
			change(type) {
				this.content = '';
				this.type = type;
				switch(type){
					case 'name':
						this.popTitle= "修改用户名";
						this.popPlaceholder = "请输入新用户名";
					break;
					case 'custom_id':
						this.popTitle= "设置用户ID";
						this.popPlaceholder = "设置后不可更改";
					break;
					case 'qq':
						this.popTitle= "修改QQ";
						this.popPlaceholder = "请输入QQ号码";
					break;
					case 'mail':
						this.popTitle= "修改邮箱";
						this.popPlaceholder = "请输入邮箱号";
					break;
				}
				this.show=true;
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

			&:last-child {
				&:after {
					background: rgba(0, 0, 0, 0.0);
				}
			}

			position: relative;
			padding:36upx 24upx;
			background: #FFFFFF;
			display: flex;
			flex-direction: row;
			align-content: center;
			align-items: center;

			&:after {
				content: "";
				position: absolute;
				height: 1upx;
				background: rgba(0, 0, 0, 0.1);
				width: 78%;
				right: 48upx;
				bottom: 0;
			}

			.setting-item-icon {
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

				text {
					color: #999;
				}

			}
		}
	}

	.exit-login {
		border-radius: 50upx;
		border: none;
		background-color: rgba($color: #000000, $alpha: .05);
		padding: 0 20upx;
		width: 600upx;
		margin-top: 220upx;
	}
	/* 提示窗口 */
	.uni-tip {
		padding: 15px;
		width: 300px;
		background: #fff;
		box-sizing: border-box;
		border-radius: 10px;
	}
	
	.uni-tip-title {
		text-align: center;
		font-weight: bold;
		font-size: 16px;
		color: #333;
	}
	
	.uni-tip-content {
		padding: 15px;
		font-size: 14px;
		color: #666;
		.input-wrapper{
			border-radius: 8upx;
			border: 1upx solid rgba($color: #000000, $alpha: .1);
		}
	}
	
	.uni-tip-group-button {
		margin-top: 10px;
		display: flex;
	}
	
	.uni-tip-button {
		width: 100%;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
	
</style>
