<template>
	<view class="content">
		
		<swiper :indicator-dots="false" :duration="300" style="min-height: 100vh;"  @change="change" :current="current">
			<swiper-item >
				<home ref="home"></home>
			</swiper-item>
			<swiper-item>
				<collection ref="collection"></collection>
			</swiper-item>
			<swiper-item>
				<channel ref="channel"></channel>
			</swiper-item> 
			<swiper-item>
				<user ref="user"></user>
			</swiper-item>
		</swiper>




		<footerNav @change_nav="change_nav"></footerNav>
	</view>
</template>

<script>
	import footerNav from "../../components/footer/footer_nav.vue";
	import home from "./home/index.vue";
	import collection from "./collection/index.vue";
	import channel from "./channel/index.vue";
	import user from "./user/index.vue";
	export default {
		data() {
			return {
				sysheight: 0
			}
		},
		components: {
			footerNav,
			home,
			collection,
			channel,
			user
		},
		created() {
			this.sysheight = uni.getSystemInfoSync().windowHeight
		},
		onShow() {

		},
		onLoad() {
			
			uni.$on('loadMore', (data) => {
				this.$refs.home.onLoadMore();
			})
			let user = uni.getStorageSync('user');
			if (user) {
				this.$store.commit('setUser', user);
			}
		},
		onReachBottom() {
			var $page = this.$store.state.footer_store.now_page_index;
			var $page = this.page_code;
			switch ($page) {
				case "home":
					this.$refs.home.onLoadMore();
					break;
				case "collection":
					this.$refs.collection.onLoadMore();
					break;
				case "user":
					this.$refs.user.onLoadMore();
					break;
			}
		},
		computed: {
			current(){
				var index = this.$store.state.footer_store.now_page_index;
				let length = this.$store.state.footer_store.footer_nav.length;
				if (index == Math.floor(length / 2)||index > Math.floor(length / 2)) {
					//中心按钮点击
					
					return index-1;
				}
				return index;
			},
			page_code() {
				return this.$store.state.footer_store.footer_nav[this.$store.state.footer_store.now_page_index].name_code;
			},
			user() {
				return this.$store.state.user;
			}
		},
		methods: {
			change(e){
				var index = e.detail.current;
				let length = this.$store.state.footer_store.footer_nav.length;
				if (index == Math.floor(length / 2)||index > Math.floor(length / 2)) {
					//中心按钮点击
					this.$store.commit("change_page", index+1)
					return;
				}
				//console.log(index);
				this.$store.commit("change_page", index)
			},
			change_nav(index) {
				let length = this.$store.state.footer_store.footer_nav.length;
				if (index == Math.floor(length / 2)) {
					//中心按钮点击
	
					this.centerClick();
					return;
				}
				
				this.$store.commit("change_page", index)
			},
			centerClick() {
				if (this.user == null) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
					return;
				}
				uni.navigateTo({
					url: 'publish/publish'
				})
			}
		},
		onPullDownRefresh() {
			//console.log('index refresh');
			var $page = this.page_code;
			switch ($page) {
				case "home":
					this.$refs.home.refresh();
					break;
				case "collection":
					this.$refs.collection.refresh();
				case "user":
					this.$refs.user.refresh();
					break;
			}
		}
	}
</script>

<style>
	.content {
		/* background: rgba(0, 0, 0, 0.05); */
	}
</style>
