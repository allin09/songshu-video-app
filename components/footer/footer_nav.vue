<template>
	<view>
		<view class="footer">
			<view :class="'footer_item ' + (item.size=='big'?'big_item':'')  " :style="'width:'+item_width(index)" @click="change_nav(index)" v-for="(item,index) in footer_nav" :key="index">
				<image :src="index==now_index?item.select_icon:item.icon" mode=""></image>
				<view :class="{'active':index==now_index}">{{item.name}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		methods:{
			change_nav(index){
				this.$emit('change_nav',index)
			},
			item_width(index){
				let length = this.$store.state.footer_store.footer_nav.length;
				if(index==Math.floor(length/2)){
					return "25%";
				}
				switch (length){
					case 1:
						return '100%'
						break;
					case 2:
						return '50%'
						break;
					case 3:
						return '33.3%'
						break;
					case 4:
						return '25%'
						break;
					case 5:
						return '18.75%'
						break;
					default:
						break;
				}
			},
		},
		computed:{
			
			footer_nav(){
				//console.log(this.$store.state.footer_store.footer_nav)
				return this.$store.state.footer_store.footer_nav
			},
			now_index(){
				return this.$store.state.footer_store.now_page_index;
			}
		}
	}
</script>

<style lang="scss">
.footer{
	height: 120upx;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
	background-color: $uni-bg-color-footer;
	color: $uni-text-color;
	.active{
		color:$uni-text-color-active;
	}
}
.footer_item{
	float: left;
	width: 33.3%;
	text-align: center;
	font-size: 28upx;
	height: 120upx;
}
.footer_item image{
	width: 40upx;
	height: 40upx;
	margin-top: 16upx;
}
.footer_item.big_item{
	
	
	position: relative;
	top: -60upx;
	
}
.footer_item.big_item image{
	padding:5upx 10upx;
	background: $uni-bg-color-footer;
	border-radius: 50%;
	width: 150upx;
	height: 150upx;
}
</style>
