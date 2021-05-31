let url_config = ""

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    // url_config ="https://video.youyacao.com/"
    url_config = 'http://videofree.youyacao.com/'
}else{
    // 生产环境
    url_config ="https://video.youyacao.com/"
	
}
console.error(process.env)

export default url_config