/*
#!name=机场面板配置
#!desc=与机场面板配套使用，自动生成相应面板配置
#!system=ios
#!category=fizz

[Script]
生成模块配置 = type=http-request, pattern=^https:\/\/airport\.rewrite, script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/master/Script/airport_panel.js, requires-body=true, max-size=-1, timeout=60

[Mitm]
hostname= %APPEND% airport.rewrite
*/
// env.js 全局
const $ = new Env("机场面板配置");//
$.host = "airport.rewrite";//重写rewrite的主机名
//-------------------- 一般不动变量区域-------------------------------------
// 发出的请求需要需要 Surge、QuanX 的 rewrite
$.isNeedRewrite = true
// 请求响应体 (返回至页面的结果)
$.json = $.name // `接口`类请求的响应体
$.html = $.name // `页面`类请求的响应体
//请求类型 page、api、query
$.type = 'page';
//页面源码地址
$.web = ``
//---------------------- 处理前端请求 -----------------------------------
//处理`预检`请求
async function handleOptions() { }
//处理`页面`请求
async function handlePage() {
    $.html = getPanel($.queries.count);
}
//处理`查询`请求
async function handleQuery() {
}
//处理API请求
async function handleApi() {

}
/** ---------------------------------接口类函数----------------------------------------- */


/** ---------------------------------脚本执行入口----------------------------------------- */
!(async () => {
    // 请求路径
    $.path = getPath($request.url);
    // 请求参数 /api/save?id=xx&name=xx => {id: 'xx', name: 'xx'}
    const [, query] = $.path.split('?');
    $.queries = query
        ? query.split('&').reduce((obj, cur) => {
            const [key, val] = cur.split('=')
            obj[key] = val
            return obj
        }, {})
        : {};
    // 请求类型: GET
    $.isGet = $request.method === 'GET';
    // 请求类型: POST
    $.isPost = $request.method === 'POST';
    // 请求类型: OPTIONS
    $.isOptions = $request.method === 'OPTIONS';
    // 请求类型: page、api、query
    $.type = 'page';
    // 查询请求: /query/xxx
    $.isQuery = $.isGet && /^\/query\/.*?/.test($.path);
    // 接口请求: /api/xxx
    $.isApi = $.isPost && /^\/api\/.*?/.test($.path);
    // 页面请求: /xxx
    $.isPage = $.isGet && !$.isQuery && !$.isApi;
    // 处理`预检`请求
    if ($.isOptions) {
        $.type = 'options';
        await handleOptions();
    }
    // 处理`页面`请求
    else if ($.isPage) {
        $.type = 'page';
        await handlePage();
    }
    // 处理`查询`请求
    else if ($.isQuery) {
        $.type = 'query';
        await handleQuery();
    }
    // 处理`接口`请求
    else if ($.isApi) {
        $.type = 'api';
        await handleApi();
    }
})()
    .catch((e) => $.logErr(e))
    .finally(() => doneBox())
/** ---------------------------------工具类函数----------------------------------------- */
//请求二次封装
async function Request(t, n) { return void 0 === n && (n = "body" in t ? "post" : "get"), new Promise((o, e) => { $.http[n.toLowerCase()](t).then(t => { let e = t.body; e = $.toObj(e) || e, o(e) }).catch(t => e(t)) }) }
//获取路径
function getPath(t) { var e = t.lastIndexOf("/") === t.length - 1 ? -1 : void 0; return t.slice(t.indexOf("/", $.host.length), e) }
/** ---------------------------------固定不动区域---------------------------------------- */
// prettier-ignore
//from sliverkiss's genarate panel 
function getPanel() { let n = function (n) { let t = ""; for (let e = 1; e <= n; e++)t += `NAME_${e},update-interval_${e},URL_${e},RESET-Day_${e},ICON_${e},COLOR_${e}`, e < n && (t += ","); return t }(3), t = function (n) { let t = "[Panel]<br>", e = "[Script]<br>"; for (let r = 1; r <= n; r++)t += `{{{NAME_${r}}}}=script-name={{{NAME_${r}}}},update-interval={{{update-interval_${r}}}}<br>`, e += `{{{NAME_${r}}}}=type=generic,timeout=10,script-path=https://raw.githubusercontent.com/Irrucky/Tool/main/Surge/Script/sub_info.js,script-update-interval=0,argument=url={{{URL_${r}}}}&reset_day={{{RESET-Day_${r}}}}&title={{{NAME_${r}}}}&icon={{{ICON_${r}}}}&color={{{COLOR_${r}}}}<br>`; return { panel: t, script: e } }(3); return `#!name=机场面板<br>#!desc=显示机场剩余流量信息以及套餐到期日期<br>#!system=ios#!category=fizz<br>#!arguments=${n}<br>#!arguments-desc=[参数设置]<br><br>⓵ NAME: 写你机场的名字,默认开启单订阅。<br><br>⓶ URL: 编码后的机场订阅。<br><br>⓷ RESET_DAY: 流量每月重置的日期,如26号就写26,不设置则不显示流量重置日,仅显示到期日期。<br><br>⓸ ICON: 自定义面板图标,需为有效的SFSymbolName,如不设置则默认。<br><br>⓹ COLOR: 自定义图标颜色,需为颜色的HEX编码。<br><br>update-interval:面板更新时间<br><br>常见颜色编码:<br>石榴红#C0392B  孔雀绿#16A085  紫水晶#9B59B6  <br>橙玫瑰#F39C12  墨绿色#1F618D  琥珀色#FFBF00  <br>靛青色#2980B9  银蓝色#5DADE2  赤金色#E74C3C   <br>橄榄青#556B2F  玫瑰金#B76E79  深宝蓝#0E4D92  <br>铜黄色#B87333  孔雀蓝#005E7D  绯红色#A61C3C   <br>橄榄木#808000  藏青色#4A4E4D  紫罗兰#C21E56   <br>琥珀褐#6C2E1F   珍珠灰#EAEAEA  蔚蓝色#1E90FF <br>青柠色#7FFF00  浅粉色#FFB6C1  淡青色#00CED1 <br>淡黄色#FFFFE0  水鸭色#00CED1  淡蓝色#ADD8E6  <br>苹果绿#8DB600  金菊色#DAA520  甜豆色#DAA520 <br><br>${t.panel}<br><br>${t.script}` }
//From chavyleung's Boxjs
function doneBox() { $.isOptions ? doneOptions() : $.isPage ? donePage() : $.isQuery ? doneQuery() : $.isApi ? doneApi() : $.done() } function getBaseDoneHeaders(e = {}) { return Object.assign({ "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST,GET,OPTIONS,PUT,DELETE", "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept" }, e) } function getHtmlDoneHeaders() { return getBaseDoneHeaders({ "Content-Type": "text/html;charset=UTF-8" }) } function getJsonDoneHeaders() { return getBaseDoneHeaders({ "Content-Type": "application/json; charset=utf-8" }) } function doneOptions() { var e = getBaseDoneHeaders(); $.isQuanX() ? $.done({ headers: e }) : $.done({ response: { headers: e } }) } function donePage() { var e = getHtmlDoneHeaders(); $.isQuanX() ? $.done({ status: "HTTP/1.1 200", headers: e, body: $.html }) : $.done({ response: { status: 200, headers: e, body: $.html } }) } function doneQuery() { $.json = $.toStr($.json); var e = getJsonDoneHeaders(); $.isQuanX() ? $.done({ status: "HTTP/1.1 200", headers: e, body: $.json }) : $.done({ response: { status: 200, headers: e, body: $.json } }) } function doneApi() { $.json = $.toStr($.json); var e = getJsonDoneHeaders(); $.isQuanX() ? $.done({ status: "HTTP/1.1 200", headers: e, body: $.json }) : $.done({ response: { status: 200, headers: e, body: $.json } }) }
//From chavyleung's Env.js
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, a) => { s.call(this, t, (t, s, r) => { t ? a(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const a = this.getdata(t); if (a) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, a) => e(a)) }) } runScript(t, e) { return new Promise(s => { let a = this.getdata("@chavy_boxjs_userCfgs.httpapi"); a = a ? a.replace(/<br>/g, "").trim() : a; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [i, o] = a.split("@"), n = { url: `http://${o}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": i, Accept: "*/*" }, timeout: r }; this.post(n, (t, e, a) => s(a)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e); if (!s && !a) return {}; { const a = s ? t : e; try { return JSON.parse(this.fs.readFileSync(a)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), a = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : a ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const a = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of a) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, a) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[a + 1]) >> 0 == +e[a + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, a] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, a, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, a, r] = /^@(.*?)\.(.*?)$/.exec(e), i = this.getval(a), o = a ? "null" === i ? null : i || "{}" : "{}"; try { const e = JSON.parse(o); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), a) } catch (e) { const i = {}; this.lodash_set(i, r, t), s = this.setval(JSON.stringify(i), a) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return this.data = this.loaddata(), this.data[t]; default: return this.data && this.data[t] || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0; default: return this.data && this.data[e] || null } } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: a, statusCode: r, headers: i, rawBody: o } = t, n = s.decode(o, this.encoding); e(null, { status: a, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: a, response: r } = t; e(a, r, r && s.decode(r.rawBody, this.encoding)) }) } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, (t, s, a) => { !t && s && (s.body = a, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, a) }); break; case "Quantumult X": t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: a, headers: r, body: i, bodyBytes: o } = t; e(null, { status: s, statusCode: a, headers: r, body: i, bodyBytes: o }, i, o) }, t => e(t && t.error || "UndefinedError")); break; case "Node.js": let a = require("iconv-lite"); this.initGotEnv(t); const { url: r, ...i } = t; this.got[s](r, i).then(t => { const { statusCode: s, statusCode: r, headers: i, rawBody: o } = t, n = a.decode(o, this.encoding); e(null, { status: s, statusCode: r, headers: i, rawBody: o, body: n }, n) }, t => { const { message: s, response: r } = t; e(s, r, r && a.decode(r.rawBody, this.encoding)) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let a = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in a) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? a[e] : ("00" + a[e]).substr(("" + a[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let a = t[s]; null != a && "" !== a && ("object" == typeof a && (a = JSON.stringify(a)), e += `${s}=${a}&`) } return e = e.substring(0, e.length - 1), e } msg(e = t, s = "", a = "", r) { const i = t => { switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } case "Loon": { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } case "Quantumult X": { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl, a = t["update-pasteboard"] || t.updatePasteboard; return { "open-url": e, "media-url": s, "update-pasteboard": a } } case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, a, i(r)); break; case "Quantumult X": $notify(e, s, a, i(r)); break; case "Node.js": }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), a && t.push(a), console.log(t.join("<br>")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name}, 错误!`, t); break; case "Node.js": this.log("", `❗️${this.name}, 错误!`, t.stack) } } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; switch (this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } }(t, e) }


