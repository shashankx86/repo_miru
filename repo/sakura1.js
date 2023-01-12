// ==MiruUserScript==
// @name         Sakura(樱花动漫)1
// @version      v0.0.2
// @author       MiaoMint
// @lang         zh-cn
// @license      MIT
// @icon         https://www.xmfans.me/yxsf/yh_css/yh_logo.png
// @package      dev.0n0.miru.sakura1
// ==/MiruUserScript==


let miru = new Miru("https://www.yhdmp.cc");
const options = {
    headers: {
        'miru-ua': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36 Edg/108.0.1462.76",
        'miru-referer': "https://www.yhdmp.cc",
    }
}
// 搜索
miru.search = async (kw, page) => {
    const bangumi = []
    const res = await miru.request(`/s_all?kw=${kw}&pagesize=24&pageindex=${page - 1}`, options);
    let pattern = /<div class="lpic">([\s\S]+?)<div class="pages">/g;
    const bangumisStr = pattern.exec(res)[0]
    pattern = /<li>([\s\S]+?)<\/li>/g
    bangumisStr.match(pattern).forEach(e => {
        const cover = /src="(.+?)"/
        const title = /<a([\s\S]+?)>(.+?)<\/a>/
        const url = /href="(.+?)"/
        bangumi.push({
            cover: e.match(cover)[1],
            title: e.match(title)[2],
            url: e.match(url)[1],
        })
    })
    return bangumi
};

// 详情
miru.info = async (url) => {
    const res = await miru.request(url);
    const desc = res.match(/ <div class="info">([\s\S]+?)<\/div>/)[1]
    const cover = res.match(/referrerpolicy="no-referrer" src="(.+?)"/)[1]
    const title = res.match(/<h1>(.+?)<\/h1>/)[1]
    const watchUrlGroupsStr = res.match(/class="movurl"([\s\S]+?)>([\s\S]+?)<\/div>/g)
    const watchurl = new Map()
    let i = 0
    watchUrlGroupsStr.forEach(e => {
        let group = []
        let lis = e.match(/<li>([\s\S]+?)<\/li>/g)
        if (!lis) {
            return
        }
        lis.forEach(e => {
            const name = e.match(/">(.+?)<\/a>/)[1]
            const url = e.match(/href="(.+?)"/)[1]
            group.push({
                name: name + '(跳转)',
                url
            })
        })
        watchurl.set(`线路${++i}`, group)
    })
    return {
        watchurl,
        desc,
        cover,
        title
    }
};

// 最近更新
miru.new = async () => {
    const bangumi = []
    const res = await miru.request('/list/?order=%E6%9B%B4%E6%96%B0%E6%97%B6%E9%97%B4')
    let pattern = /<div class="lpic">([\s\S]+?)<div class="pages">/g;
    const bangumisStr = pattern.exec(res)[0]
    pattern = /<li>([\s\S]+?)<\/li>/g
    bangumisStr.match(pattern).forEach(e => {
        const cover = /src="(.+?)"/
        const title = /<a([\s\S]+?)>(.+?)<\/a>/
        const url = /href="(.+?)"/
        bangumi.push({
            cover: e.match(cover)[1],
            title: e.match(title)[2],
            url: e.match(url)[1],
        })
    })
    return bangumi
}

// 观看
miru.watch = async (url) => {
    return {
        type: "jump",
        src: `https://www.yhdmp.cc${url}`
    }
}

return miru;




