//这是一个用于自动获取变量上传ck到青龙的辅助工具，低调使用，请勿在国内平台宣传

//测试
const moduleName = "🐉 青龙面板上传ck";
const $ = new Env(moduleName);
//获取参数
$.arguments = getArguments();
$.name = $.arguments?.scriptName;//脚本名称
$.ckName = $.arguments?.ckName;//上传变量名
$.ckVal = $.arguments?.ckVal || "";//ck的模版值
$.remarks = parstTample($.arguments?.remarks || "");//备注
$.split = $.arguments?.split || "@";//分隔符
$.bodyRegx = $.arguments?.bodyRegx || ""//是否匹配body，默认留空不匹配

//主程序执行入口
!(async () => {
    try {
        await getCookie();
    } catch (e) {
        throw e;
    }
})()
    .catch((e) => { $.logErr(e), $.msg($.name, `⛔️ script run error!`, e.message || e) })
    .finally(async () => {
        $.done({});
    });
    
async function getCookie() {
    try {
        if (!$.ckVal) return $.msg($.name, "⛔️scirpt run error", "请先在ckVal填写需要获取的内容");
        //不存在body时，不存在匹配body时，匹配body正确时
        if (!$request?.body || !$.bodyRegx || isMatch($request?.body, $.bodyRegx)) {
            $.msg($.name, "", `try upload ${$.ckName}...`);
            const resultList = $.ckVal
                .split($.split)
                .map(e => parstTample(e));
            //获取到数据，开始上传青龙
            if (resultList.length) {
                const ql = QingLong("https://tistzach.free.hr", "-m9ZiWr-CCTf", "faMfRhN00kbyk6T6_X7vS06o");
                $.info("开始进入青龙")
                await ql.checkLogin();
                $.info("开始获取环境变量")
                await ql.getEnvs();
                let ckList = ql.selectEnvByName($.ckName) ?? [];
                let ckVal = resultList.join($.split || "");
                $.info(`获取到的值为:${ckVal}`)
                let ck = ckList.find(e => e.remarks == $.remarks);
                $.info("开始上传变量")
                $.info($.toStr(ck));
                if (ck) await ql.deleteEnv([ck?.id]);
                await ql.addEnv([{ value: `${ckVal}`, name: `${$.ckName}`, remarks: `${$.remarks || "surge"}` }])
                $.msg($.name, "", `✅ success upload ${$.ckName} to qinglong panel`);
            }
        }
    } catch (e) {
        throw e;
    }
}


//模版解析
function parstTample(str) {
    try {
        // 如果字符串以$开头，进行解析
        if (str.startsWith("$")) {
            const headers = ObjectKeys2LowerCase($request.headers);
            const quires = $.toObj($request?.body) || UrlToJson($request?.body);
            const params = getQueries($request?.url);
            const _key = str.slice(1); // 去掉开头的$号
            return headers[_key] || params[_key] || quires[_key];
        }
        return str;// 如果不是$开头，直接返回字符串
    } catch (e) {
        throw e;
    }
}
//解析url
function getQueries(t) {
    const [, e] = t.split("?");
    return e ? e.split("&").reduce((t, e) => {
        var [r, e] = e.split("=");
        return t[r] = e, t
    }, {}) : {}
};

//深层遍历查找需要属性
function findKeyValue(obj, targetKey) {
    try {
        if (typeof obj !== 'object' || obj === null) return null;

        for (let key in obj) {
            if (key === targetKey) return obj[key];

            const result = findKeyValue(obj[key], targetKey);
            if (result !== null) return result;  // 如果在某个属性中找到，则立即返回
        }

        return null;
    } catch (e) {
        throw e;
    }
}

//正则判断body是否匹配
function isMatch(res, regexString) {
    // 确保 res 是字符串，如果不是，则转换为 JSON 字符串
    const stringToMatch = typeof res === 'string' ? res : JSON.stringify(res);

    // 创建正则表达式对象
    const regex = new RegExp(regexString);

    // 判断字符串是否匹配正则表达式
    return regex.test(stringToMatch);
}

//分割参数
function UrlToJson(data) { if (!data) return {}; let tempArr = data.split(`&`); let obj = {}; for (let item of tempArr) { let itemInfo = item.split(`=`); let _key = itemInfo[0]; let _value = decodeURIComponent(itemInfo[1]); obj[`${_key}`] = _value }; return obj };

//封装一个获取Surge参数的方法
function getArguments() {
    let arg;
    if (typeof $argument != 'undefined') {
        arg = Object.fromEntries($argument.split('&').map(item => item.split('=')));
    } else {
        arg = {};
    }
    $.info(`传入的 $argument: ${$.toStr(arg)} `);

    arg = { ...arg, opts: { ...$.getjson(`@sliverkiss.record.${arg.ckName}.opts`) } };

    $.info(`从持久化存储读取参数后: ${$.toStr(arg)} `);

    return arg;
}

// prettier-ignore
//From yuheng's QingLong
function QingLong(e, t, n) { const o = (e, t = "GET") => new Promise(((n, o) => { $.http[t.toLowerCase()](e).then((e => { var t = e.body; try { t = $.toObj(t) || t } catch (e) { } n(t) })).catch((e => o(e))) })); return new class { constructor(e, t, n) { this.host = e, this.clientId = t, this.clientSecret = n, this.token = "", this.envs = [] } async checkLogin() { let e; try { e = $.getjson("yuheng_ql_token") || {} } catch (e) { return console.log("❌The token is invalid, please re-enter the token"), await this.getAuthToken(), !1 } if (Object.keys(e).length > 0) { const { token: t, expiration: n } = e; (new Date).getTime() > n ? ($.log("❌The token has expired"), await this.getAuthToken()) : (this.token = t, $.log(`✅The token is successfully obtained (${this.token}) from cache and is valid until ${$.time("yyyy-MM-dd HH:mm:ss", n)}`)) } else await this.getAuthToken() } async getAuthToken() { const e = { url: `${this.host}/open/auth/token`, params: { client_id: this.clientId, client_secret: this.clientSecret } }; try { $.log(`传入参数: ${JSON.stringify(e)}`); const { code: t, data: n, message: s } = await o(e); if (200 !== t) throw s || "Failed to obtain user token."; { const { token: e, token_type: t, expiration: o } = n; $.log(`✅The token is successfully obtained: ${e} and is valid until ${$.time("yyyy-MM-dd HH:mm:ss", 1e3 * o)}`), this.token = `${t} ${e}`, $.setjson({ token: this.token, expiration: 1e3 * o }, "yuheng_ql_token") } } catch (e) { throw e ? "object" == typeof e ? JSON.stringify(e) : e : "Network Error." } } async getEnvs() { const e = { url: `${this.host}/open/envs`, headers: { Authorization: this.token } }; try { const { code: t, data: n, message: s } = await o(e); if (200 !== t) throw s || "Failed to obtain the environment variable."; this.envs = n, $.log("✅Obtaining environment variables succeeded.") } catch (e) { throw e ? "object" == typeof e ? JSON.stringify(e) : e : "Network Error." } } checkEnvByName(e) { return this.envs.findIndex((t => t.name === e)) } checkEnvByRemarks(e) { return this.envs.findIndex((t => t.remarks === e)) } checkEnvByValue(e, t) { const n = e.match(t); if (n) { const t = this.envs.findIndex((e => e.value.includes(n[0]))); return t > -1 ? ($.log(`🆗${e} Matched: ${n[0]}`), t) : ($.log(`⭕${e} No Matched`), -1) } return $.log(`⭕${e} No Matched`), -1 } selectEnvByName(e) { return this.envs.filter((t => t.name === e)) } selectEnvByRemarks(e) { return this.envs.filter((t => t.remarks === e)) } async addEnv(e) { const t = { url: `${this.host}/open/envs`, headers: { Authorization: this.token, "Content-Type": "application/json;charset=UTF-8" }, body: JSON.stringify(e) }; try { const { code: e, message: n } = await o(t, "post"); if (200 !== e) throw n || "Failed to add the environment variable."; $.log("✅The environment variable was added successfully.") } catch (e) { throw e ? "object" == typeof e ? JSON.stringify(e) : e : "Network Error." } } async updateEnv(e) { const t = { url: `${this.host}/open/envs`, method: "put", headers: { Authorization: this.token, "Content-Type": "application/json;charset=UTF-8" }, body: JSON.stringify(e) }; try { const { code: n, message: s } = await o(t, "post"); if (200 !== n) throw s || "Failed to update the environment variable."; $.log("✅The environment variable was updated successfully."), await this.enableEnv([e._id]) } catch (e) { throw e ? "object" == typeof e ? JSON.stringify(e) : e : "Network Error." } } async deleteEnv(e) { const t = { url: `${this.host}/open/envs`, method: "delete", headers: { Authorization: `${this.token}`, "Content-Type": "application/json;charset=UTF-8" }, body: JSON.stringify(e) }; try { const { code: e, message: n } = await o(t, "post"); if (200 !== e) throw n || "Failed to delete the environment variable."; $.log("✅The environment variable was deleted successfully.") } catch (e) { throw e ? "object" == typeof e ? JSON.stringify(e) : e : "Network Error." } } async enableEnv(e) { const t = { url: `${this.host}open/envs/enable`, method: "put", headers: { Authorization: `${this.token}`, "Content-Type": "application/json;charset=UTF-8" }, body: JSON.stringify(e) }; try { const { code: e, message: n } = await o(t, "post"); if (200 !== e) throw n || "Failed to enable the environment variable."; $.log("✅The environment variable was enabled successfully.") } catch (e) { throw e ? "object" == typeof e ? JSON.stringify(e) : e : "Network Error." } } async getEnvById(e) { const t = { url: `${this.host}open/envs/${e}`, headers: { Authorization: `${this.token}` } }; try { const { code: e, data: n, message: s } = await o(t); if (200 === e) return n; throw s || "Failed to get the environment variable." } catch (e) { throw e ? "object" == typeof e ? JSON.stringify(e) : e : "Network Error." } } }(e, t, n) }
//From xream's ObjectKeys2LowerCase
function ObjectKeys2LowerCase(obj) { return !obj ? {} : Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v])) };
//From chavyleung's Env.js
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; "POST" === e && (s = this.post); const i = new Promise(((e, i) => { s.call(this, t, ((t, s, o) => { t ? i(t) : e(s) })) })); return t.timeout ? ((t, e = 1e3) => Promise.race([t, new Promise(((t, s) => { setTimeout((() => { s(new Error("请求超时")) }), e) }))]))(i, t.timeout) : i } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.logLevels = { debug: 0, info: 1, warn: 2, error: 3 }, this.logLevelPrefixs = { debug: "[DEBUG] ", info: "[INFO] ", warn: "[WARN] ", error: "[ERROR] " }, this.logLevel = "info", this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.encoding = "utf-8", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } getEnv() { return "undefined" != typeof $environment && $environment["surge-version"] ? "Surge" : "undefined" != typeof $environment && $environment["stash-version"] ? "Stash" : "undefined" != typeof module && module.exports ? "Node.js" : "undefined" != typeof $task ? "Quantumult X" : "undefined" != typeof $loon ? "Loon" : "undefined" != typeof $rocket ? "Shadowrocket" : void 0 } isNode() { return "Node.js" === this.getEnv() } isQuanX() { return "Quantumult X" === this.getEnv() } isSurge() { return "Surge" === this.getEnv() } isLoon() { return "Loon" === this.getEnv() } isShadowrocket() { return "Shadowrocket" === this.getEnv() } isStash() { return "Stash" === this.getEnv() } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null, ...s) { try { return JSON.stringify(t, ...s) } catch { return e } } getjson(t, e) { let s = e; if (this.getdata(t)) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise((e => { this.get({ url: t }, ((t, s, i) => e(i))) })) } runScript(t, e) { return new Promise((s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let o = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); o = o ? 1 * o : 20, o = e && e.timeout ? e.timeout : o; const [r, a] = i.split("@"), n = { url: `http://${a}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: o }, headers: { "X-Key": r, Accept: "*/*" }, policy: "DIRECT", timeout: o }; this.post(n, ((t, e, i) => s(i))) })).catch((t => this.logErr(t))) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), o = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, o) : i ? this.fs.writeFileSync(e, o) : this.fs.writeFileSync(t, o) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let o = t; for (const t of i) if (o = Object(o)[t], void 0 === o) return s; return o } lodash_set(t, e, s) { return Object(t) !== t || (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce(((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}), t)[e[e.length - 1]] = s), t } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), o = s ? this.getval(s) : ""; if (o) try { const t = JSON.parse(o); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, o] = /^@(.*?)\.(.*?)$/.exec(e), r = this.getval(i), a = i ? "null" === r ? null : r || "{}" : "{}"; try { const e = JSON.parse(a); this.lodash_set(e, o, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const r = {}; this.lodash_set(r, o, t), s = this.setval(JSON.stringify(r), i) } } else s = this.setval(t, e); return s } getval(t) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.read(t); case "Quantumult X": return $prefs.valueForKey(t); case "Node.js": return this.data = this.loaddata(), this.data[t]; default: return this.data && this.data[t] || null } } setval(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": return $persistentStore.write(t, e); case "Quantumult X": return $prefs.setValueForKey(t, e); case "Node.js": return this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0; default: return this.data && this.data[e] || null } } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.cookie && void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar))) } get(t, e = (() => { })) { switch (t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"], delete t.headers["content-type"], delete t.headers["content-length"]), t.params && (t.url += "?" + this.queryStr(t.params)), void 0 === t.followRedirect || t.followRedirect || ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = !1), this.isQuanX() && (t.opts ? t.opts.redirection = !1 : t.opts = { redirection: !1 })), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, ((t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, i) })); break; case "Quantumult X": this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then((t => { const { statusCode: s, statusCode: i, headers: o, body: r, bodyBytes: a } = t; e(null, { status: s, statusCode: i, headers: o, body: r, bodyBytes: a }, r, a) }), (t => e(t && t.error || "UndefinedError"))); break; case "Node.js": let s = require("iconv-lite"); this.initGotEnv(t), this.got(t).on("redirect", ((t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } })).then((t => { const { statusCode: i, statusCode: o, headers: r, rawBody: a } = t, n = s.decode(a, this.encoding); e(null, { status: i, statusCode: o, headers: r, rawBody: a, body: n }, n) }), (t => { const { message: i, response: o } = t; e(i, o, o && s.decode(o.rawBody, this.encoding)) })); break } } post(t, e = (() => { })) { const s = t.method ? t.method.toLocaleLowerCase() : "post"; switch (t.body && t.headers && !t.headers["Content-Type"] && !t.headers["content-type"] && (t.headers["content-type"] = "application/x-www-form-urlencoded"), t.headers && (delete t.headers["Content-Length"], delete t.headers["content-length"]), void 0 === t.followRedirect || t.followRedirect || ((this.isSurge() || this.isLoon()) && (t["auto-redirect"] = !1), this.isQuanX() && (t.opts ? t.opts.redirection = !1 : t.opts = { redirection: !1 })), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient[s](t, ((t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status ? s.status : s.statusCode, s.status = s.statusCode), e(t, s, i) })); break; case "Quantumult X": t.method = s, this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then((t => { const { statusCode: s, statusCode: i, headers: o, body: r, bodyBytes: a } = t; e(null, { status: s, statusCode: i, headers: o, body: r, bodyBytes: a }, r, a) }), (t => e(t && t.error || "UndefinedError"))); break; case "Node.js": let i = require("iconv-lite"); this.initGotEnv(t); const { url: o, ...r } = t; this.got[s](o, r).then((t => { const { statusCode: s, statusCode: o, headers: r, rawBody: a } = t, n = i.decode(a, this.encoding); e(null, { status: s, statusCode: o, headers: r, rawBody: a, body: n }, n) }), (t => { const { message: s, response: o } = t; e(s, o, o && i.decode(o.rawBody, this.encoding)) })); break } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } queryStr(t) { let e = ""; for (const s in t) { let i = t[s]; null != i && "" !== i && ("object" == typeof i && (i = JSON.stringify(i)), e += `${s}=${i}&`) } return e = e.substring(0, e.length - 1), e } msg(e = t, s = "", i = "", o = {}) { const r = t => { const { $open: e, $copy: s, $media: i, $mediaMime: o } = t; switch (typeof t) { case void 0: return t; case "string": switch (this.getEnv()) { case "Surge": case "Stash": default: return { url: t }; case "Loon": case "Shadowrocket": return t; case "Quantumult X": return { "open-url": t }; case "Node.js": return }case "object": switch (this.getEnv()) { case "Surge": case "Stash": case "Shadowrocket": default: { const r = {}; let a = t.openUrl || t.url || t["open-url"] || e; a && Object.assign(r, { action: "open-url", url: a }); let n = t["update-pasteboard"] || t.updatePasteboard || s; if (n && Object.assign(r, { action: "clipboard", text: n }), i) { let t, e, s; if (i.startsWith("http")) t = i; else if (i.startsWith("data:")) { const [t] = i.split(";"), [, o] = i.split(","); e = o, s = t.replace("data:", "") } else { e = i, s = (t => { const e = { JVBERi0: "application/pdf", R0lGODdh: "image/gif", R0lGODlh: "image/gif", iVBORw0KGgo: "image/png", "/9j/": "image/jpg" }; for (var s in e) if (0 === t.indexOf(s)) return e[s]; return null })(i) } Object.assign(r, { "media-url": t, "media-base64": e, "media-base64-mime": o ?? s }) } return Object.assign(r, { "auto-dismiss": t["auto-dismiss"], sound: t.sound }), r } case "Loon": { const s = {}; let o = t.openUrl || t.url || t["open-url"] || e; o && Object.assign(s, { openUrl: o }); let r = t.mediaUrl || t["media-url"]; return i?.startsWith("http") && (r = i), r && Object.assign(s, { mediaUrl: r }), console.log(JSON.stringify(s)), s } case "Quantumult X": { const o = {}; let r = t["open-url"] || t.url || t.openUrl || e; r && Object.assign(o, { "open-url": r }); let a = t["media-url"] || t.mediaUrl; i?.startsWith("http") && (a = i), a && Object.assign(o, { "media-url": a }); let n = t["update-pasteboard"] || t.updatePasteboard || s; return n && Object.assign(o, { "update-pasteboard": n }), console.log(JSON.stringify(o)), o } case "Node.js": return }default: return } }; if (!this.isMute) switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": default: $notification.post(e, s, i, r(o)); break; case "Quantumult X": $notify(e, s, i, r(o)); break; case "Node.js": break }if (!this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } debug(...t) { this.logLevels[this.logLevel] <= this.logLevels.debug && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.debug}${t.map((t => t ?? String(t))).join(this.logSeparator)}`)) } info(...t) { this.logLevels[this.logLevel] <= this.logLevels.info && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.info}${t.map((t => t ?? String(t))).join(this.logSeparator)}`)) } warn(...t) { this.logLevels[this.logLevel] <= this.logLevels.warn && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.warn}${t.map((t => t ?? String(t))).join(this.logSeparator)}`)) } error(...t) { this.logLevels[this.logLevel] <= this.logLevels.error && (t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(`${this.logLevelPrefixs.error}${t.map((t => t ?? String(t))).join(this.logSeparator)}`)) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.map((t => t ?? String(t))).join(this.logSeparator)) } logErr(t, e) { switch (this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: this.log("", `❗️${this.name}, 错误!`, e, t); break; case "Node.js": this.log("", `❗️${this.name}, 错误!`, e, void 0 !== t.message ? t.message : t, t.stack); break } } wait(t) { return new Promise((e => setTimeout(e, t))) } done(t = {}) { const e = ((new Date).getTime() - this.startTime) / 1e3; switch (this.log("", `🔔${this.name}, 结束! 🕛 ${e} 秒`), this.log(), this.getEnv()) { case "Surge": case "Loon": case "Stash": case "Shadowrocket": case "Quantumult X": default: $done(t); break; case "Node.js": process.exit(1) } } }(t, e) }



