<template>
	<view>
		<!-- 顶部开始 -->
		<view class="head-wrapper shadow">
			<view class="left-wrapper" @click="back">
				<uni-icons color="#000000" class="back" size="30" type="arrowleft" />
			</view>
			<view class="search-wrapper">
				<text class="uni-title">{{title}}</text>
			</view>
			<view class="seach" @click="seach">
				<image src="/static/home/seach.png" mode="widthFix"></image>
			</view>
		</view>
		<!-- 顶部结束 -->

		<view class="content-wrapper" >
			<view class="typp-list-wrapper" v-if="typeList">
				<view class="type-item" v-for="(item,idx) in typeList" :key="idx" @tap="tapItem(item)">
					<image :src="formatUrl(item.icon)"></image>
					<text>{{item.name}}</text>
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
				isMore:true,
				loadmore:false,
			}
		},
		created() {
			

		},
		onShow() {

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
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			tapItem(item){
				uni.navigateTo({
					url:'/pages/index/channel/subTypeList/videoList?type='+item.id+'&title='+item.name
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
		},
		created(){
		},
		computed:{
			typeList(){
				return this.$store.state.subType.sub_type;
			},
			title(){
				return this.$store.state.subType.name;
			}
		},
		mounted() {
			
		}
	}
</script>

<style lang="scss">
	.head-wrapper {
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
	
	
	.seach {
		flex:1;
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
	.typp-list-wrapper{
		margin-top: 24upx;
		flex: 1;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		.type-item{
			height: 200upx;
			justify-content: center;
			align-items: center;
			align-content: center;
			width: 25%;
			display: flex;
			flex-direction: column;
			image{
				width: 80upx;
				height: 80upx;
			}
			text{
				margin-top: 12upx;
				letter-spacing: 4upx;
			}
		}
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
	.search-wrapper {
		text-align: center;
		line-height: 76upx;
		height: 76upx;
		//background: #09BB07;
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
</style>
