<template>
	<view>
		<view class="head" :style="{'height':sysheight,width:width}">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#999999" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				发布视频
			</view>
			<view class="right-wrapper" @tap="search_btn">

			</view>
		</view>
		<view class="content">
			<view class="content-wrapper">
				<textarea class="content-textarea" placeholder="说点什么" v-model="content" placeholder-style="color:#999">
				</textarea>
				<image :src="videoInfo.img!=undefined?formatUrl(videoInfo.img):'/static/img/add.png'" class="content-img" @tap="chooseVideo"></image>
			</view>
			<view class="type-wrapper">
				<view class="type-select-wrapper" @tap="showTypeList">
					<view class="type-select-img-wrapper">
						<image class="type-select-img" src="/static/img/type.png" mode="widthFix"></image>
					</view>
					<view class="type-select-type-wrapper">
						<text class="type-select-type">{{typeInfo.name==undefined?'选择分类':typeInfo.name}}</text>
					</view>

					<view class="type-right-icon">
						<uni-icons type="forward" color="#333" size="20"></uni-icons>
					</view>
				</view>
				<view class="type-hot-wrapper">
					<view class="type-hot-list">
						<view class="type-hot-item" v-for="(item,idx) in hotList" :key="idx" @tap="selectType(item)">
							<text class="type-hot-item-text">{{item.name}}</text>
						</view>

					</view>
				</view>
			</view>
			<view class="button-btn-wrapper">
				<button size="mini" plain="true" class="cancel-btn" @tap="back">取消</button>
				<button size="mini" class="publish-btn" @tap="publish">发布</button>
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
				videoInfo: {}, 
				hotList: [],
				typeInfo:{},
				content:''
			};
		},
		mounted() {
			this.$api.typeHot({}).then((res) => {
				if (res.data.code == 1) {
					return;
				}
				this.hotList = res.data.data;
			});
		},
		onLoad() {
			uni.$on('selectType',(data)=>{
				this.typeInfo =data;
			})
		},
		onUnload() {
			uni.$off('selectType');
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
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			selectType(item) {
				this.typeInfo = item;

			},
			showTypeList() {
				var typeList = uni.getSubNVueById('typeList');
				/* this.loadCommentData() */
				/* uni.$emit('drawer_show', {
					vid: this.videoList[this.index].id,
					showInput: input
				}) */
				typeList.show('slide-in-bottom', 200, () => {

				});
			},
			chooseVideo() {
				uni.chooseVideo({
					count: 1,
					compressed:true,
					sourceType: ['album', 'camera'],
					success: (res) => {
						uni.showLoading({
							title: '正在上传中，请稍后',
							mask: false
						});
						const tempFilePath = res.tempFilePath;
						uni.uploadFile({
							url: this.$config + 'api/api/upload', //仅为示例，非真实的接口地址
							filePath: tempFilePath,
							dataType: 'json',
							name: 'file',
							formData: {
								'type': 'video'
							},
							success: (res) => {
								uni.hideLoading()
								if (res.statusCode == 200) {
									var data = JSON.parse(res.data);
									if (data.code == 1) {
										uni.showToast({
											title: '上传失败,' + data.msg,
											icon: 'none'
										});
										return;
									}
									uni.showToast({
										title: '上传成功',
									});
									this.videoInfo = data.data;
									//console.log(this.videoInfo);
								}

							},
							fail(e) {
								//console.log(e);
							}
						});
					},
					fail(res) {
						uni.showToast({
							title: '选择视频出现错误，请重新选择',
							icon:'none'
						});
					}
				});
			},
			publish(){
				//判断是否填写内容
				if(this.content == ''){
					uni.showToast({
						title: '说点什么吧',
						icon: 'none'
					});
					return ;
				}
				//判断视频是否上传
				if(this.videoInfo.url == ''||this.videoInfo.url == undefined){
					uni.showToast({
						title: '请上传视频',
						icon: 'none'
					});
					return ;
				}
				//判断是否选择分类
				if(this.typeInfo.name == ''||this.typeInfo.name==undefined){
					uni.showToast({
						title: '请选择分类',
						icon: 'none'
					});
					return ;
				}
				//开始提交发布请求
				this.$api.videoPublish({title:this.content,url:this.videoInfo.url,type:this.typeInfo.id}).then((res)=>{
					if(res.data.code==1){
						uni.showToast({
							title: '发布失败,'+res.data.msg,
							icon:'none'
						});
						return
					}
					uni.showToast({
						title: '发布成功,等待后台审核通过后方可查看',
						icon:'none',
						duration:2000,
						success:()=>{
							setTimeout(()=>{
								this.back()
							},2000)
							
						}
					});
					
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

		.content-wrapper {
			flex: 2;
			display: flex;
			flex-direction: row;
			margin: 24upx;
			border-bottom: .05upx solid #999;
			padding-bottom: 24upx;
			padding-top: 12upx;

			.content-textarea {
				height: 200upx;
				flex: 9;

				padding-top: 12upx;
			}

			.content-img {
				width: 152upx;
				height: 220upx;
				flex: 3;
				margin-left: 24upx;
			}
		}

		.type-wrapper {
			margin: 24upx;
			flex: 8;
			display: flex;
			flex-direction: column;

			.type-select-wrapper {
				display: flex;
				flex-direction: row;

				.type-select-img-wrapper {
					flex: 1;
					justify-content: center;
					align-content: center;
					align-items: center;
					display: flex;

					.type-select-img {
						width: 36upx;
						height: 36upx;

					}
				}

				.type-select-type-wrapper {
					display: flex;
					flex: 10;
					align-items: center;

					.type-select-type {
						font-size: 26upx;
						margin-left: 24upx;
						margin-right: 24upx;

					}
				}

				.type-right-icon {
					display: flex;
					flex: 1;
					justify-content: center;
					align-content: center;
					align-items: center;
				}
			}

			.type-hot-wrapper {
				margin-top: 24upx;
				margin-left: 24upx;
				display: flex;
				flex-direction: row;
				align-items: center;
				align-content: center;

				.type-hot-list {

					display: flex;
					flex-direction: row;
					flex-wrap: wrap;
					flex: 10;

					.type-hot-item {
						padding: 8upx 16upx;
						margin-right: 12upx;
						margin-top: 12upx;
						background-color: rgba($color: #000000, $alpha: .05);
						border-radius: 8upx;
						font-size: 22upx;
					}
				}
			}
		}

		.button-btn-wrapper {
			margin-top: 420upx;
			flex: 2;
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-content: center;
			align-items: center;

			.cancel-btn {
				margin-left: 64upx;
				flex: 4;
				color: $uni-text-color-active;
				font-size: 32upx;
				border: 1upx solid $uni-text-color-active;
				border-radius: 50upx;

				&.button-hover {
					background-color: rgba($color: #000000, $alpha: .1);
				}
			}

			.publish-btn {
				margin-left: 64upx;
				margin-right: 64upx;
				flex: 8;
				color: #FFFFFF;
				background-color: $uni-text-color-active;
				font-size: 32upx;
				border-radius: 50upx;

				&.button-hover {
					background-color: rgba($color: $uni-text-color-active, $alpha: .8);
				}
			}
		}
	}
</style>
