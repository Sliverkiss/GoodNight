/*
#!name=机场面板配置
#!desc=与机场面板配套使用，自动生成相应面板配置
#!system=ios
#!category=fizz

[Script]
生成模块配置 = type=http-response,pattern=^https:\/\/ys\.shajixueyuan\.com\/api\/user\/info,script-path=,requires-body=0,max-size=0

[Mitm]
hostname= %APPEND% pannel.airport.rewrite
*/

(async () => {
    //如果满足匹配
    if ($request.url.match(/pannel\.airport\.rewrite/)) {
        let quires = getQueries($request.url);
        let result = getPanel(quires.count);
        $done(result);
    } else {
        let args = getArgs();
        //增加编码处理
        let info = await getDataInfo(encodeURIComponent(args.url));
        if (!info) $done();
        let resetDayLeft = getRmainingDays(parseInt(args["reset_day"]));

        let used = info.download + info.upload;
        let total = info.total;
        let expire = args.expire || info.expire;
        let content = [`用量：${bytesToSize(used)} | ${bytesToSize(total)}`];

        if (resetDayLeft) {
            content.push(`重置：剩余${resetDayLeft}天`);
        }
        if (expire && expire !== "false") {
            if (/^[\d.]+$/.test(expire)) expire *= 1000;
            content.push(`到期：${formatTime(expire)}`);
        }

        let now = new Date();
        let hour = now.getHours();
        let minutes = now.getMinutes();
        hour = hour > 9 ? hour : "0" + hour;
        minutes = minutes > 9 ? minutes : "0" + minutes;

        $done({
            title: `${args.title} | ${hour}:${minutes}`,
            content: content.join("\n"),
            icon: args.icon || "airplane.circle",
            "icon-color": args.color || "#007aff",
        });
    }
})();
//分割参数
function getQueries(t) {
    const [, e] = t.split("?");
    return e ? e.split("&").reduce((t, e) => {
        var [r, e] = e.split("=");
        return t[r] = e, t
    }, {}) : {}
};
//from sliverkiss's genarate panel 
function getPanel() { let n = function (n) { let t = ""; for (let e = 1; e <= n; e++)t += `NAME_${e},update-interval_${e},URL_${e},RESET-Day_${e},ICON_${e},COLOR_${e}`, e < n && (t += ","); return t }(3), t = function (n) { let t = "[Panel]\n", e = "[Script]\n"; for (let r = 1; r <= n; r++)t += `{{{NAME_${r}}}}=script-name={{{NAME_${r}}}},update-interval={{{update-interval_${r}}}}\n`, e += `{{{NAME_${r}}}}=type=generic,timeout=10,script-path=https://raw.githubusercontent.com/Irrucky/Tool/main/Surge/Script/sub_info.js,script-update-interval=0,argument=url={{{URL_${r}}}}&reset_day={{{RESET-Day_${r}}}}&title={{{NAME_${r}}}}&icon={{{ICON_${r}}}}&color={{{COLOR_${r}}}}\n`; return { panel: t, script: e } }(3); return `#!name=机场面板\n#!desc=显示机场剩余流量信息以及套餐到期日期\n#!system=ios#!category=fizz\n#!arguments=${n}\n#!arguments-desc=[参数设置]\n\n⓵ NAME: 写你机场的名字,默认开启单订阅。\n\n⓶ URL: 编码后的机场订阅。\n\n⓷ RESET_DAY: 流量每月重置的日期,如26号就写26,不设置则不显示流量重置日,仅显示到期日期。\n\n⓸ ICON: 自定义面板图标,需为有效的SFSymbolName,如不设置则默认。\n\n⓹ COLOR: 自定义图标颜色,需为颜色的HEX编码。\n\nupdate-interval:面板更新时间\n\n常见颜色编码:\n石榴红#C0392B  孔雀绿#16A085  紫水晶#9B59B6  \n橙玫瑰#F39C12  墨绿色#1F618D  琥珀色#FFBF00  \n靛青色#2980B9  银蓝色#5DADE2  赤金色#E74C3C   \n橄榄青#556B2F  玫瑰金#B76E79  深宝蓝#0E4D92  \n铜黄色#B87333  孔雀蓝#005E7D  绯红色#A61C3C   \n橄榄木#808000  藏青色#4A4E4D  紫罗兰#C21E56   \n琥珀褐#6C2E1F   珍珠灰#EAEAEA  蔚蓝色#1E90FF \n青柠色#7FFF00  浅粉色#FFB6C1  淡青色#00CED1 \n淡黄色#FFFFE0  水鸭色#00CED1  淡蓝色#ADD8E6  \n苹果绿#8DB600  金菊色#DAA520  甜豆色#DAA520 \n\n${t.panel}\n\n${t.script}` }
//from mieq's https://raw.githubusercontent.com/mieqq/mieqq/master/sub_info_panel.js
function getArgs() { return Object.fromEntries($argument.split("&").map((t => t.split("="))).map((([t, e]) => [t, decodeURIComponent(e)]))) } function getUserInfo(t) { let e = args.method || "head", n = { headers: { "User-Agent": "Quantumult%20X" }, url: t }; return new Promise(((t, r) => $httpClient[e](n, ((e, n) => { if (null != e) return void r(e); if (200 !== n.status) return void r(n.status); let a = Object.keys(n.headers).find((t => "subscription-userinfo" === t.toLowerCase())); a ? t(n.headers[a]) : r("链接响应头不带有流量信息") })))) } async function getDataInfo(t) { const [e, n] = await getUserInfo(t).then((t => [null, t])).catch((t => [t, null])); if (!e) return Object.fromEntries(n.match(/\w+=[\d.eE+-]+/g).map((t => t.split("="))).map((([t, e]) => [t, Number(e)]))); console.log(e) } function getRmainingDays(t) { if (!t) return; let e, n = new Date, r = n.getDate(), a = n.getMonth(), o = n.getFullYear(); return e = t > r ? 0 : new Date(o, a + 1, 0).getDate(), e - r + t } function bytesToSize(t) { if (0 === t) return "0B"; sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]; let e = Math.floor(Math.log(t) / Math.log(1024)); return (t / Math.pow(1024, e)).toFixed(2) + " " + sizes[e] } function formatTime(t) { let e = new Date(t); return e.getFullYear() + "年" + (e.getMonth() + 1) + "月" + e.getDate() + "日" }
