/*
 * Author: Sliverkiss
 * Github: https://github.com/evilbutcher
 * 本脚本使用了@Gideon_Senku的Env.scriptable，感谢！
 */

//commont
const goupdate = true;
//import env by GideonSenku
const $ = importModule("Env");
const title = `Hax`;
//将cookie填入下面''中
const token = '';
//preview size
const preview = "small";
const spacing = 5;
//init
let widget = await createWidget();
//used for debugging if script runs inside the app
if (!config.runsInwidget) {
    widget.presentSmall();
}

//package
Script.setWidget(widget);
Script.complete();

//

//build the content of the widget
async function createWidget() {
    let res = await getInfo();
    //create widget
    const widget = new ListWidget();
    //title stack
    let titleStack = widget.addStack();
    //titleStack.addSpacer(86);
    let number = titleStack.addText(`${res.days}`);
    number.font = Font.boldSystemFont(25);
    number.textColor = new Color("#FF0066")
    //分割线
    let br = titleStack.addText(" | ");
    br.font = Font.systemFont(25);
    //标题
    titleStack.addText(title).font = Font.systemFont(25);
    //添加垂直间距
    widget.addSpacer();
    //开始日期
    widthBody(widget, "开始日期：" + res.currentTime);
    //截止日期
    widthBody(widget, "截止日期：" + res.validUntil)

    return widget;
}
//fetches information of the hax.co.id
function widthBody(widget, text = '') {
    let stack = widget.addStack();
    //分割线
    widthHr(stack);
    //添加垂直间距
    widget.addSpacer();
    //开始日期
    stack.addText(text).font = Font.boldSystemFont(12);
}
//添加水平分割线
function widthHr(stack) {
    let br = stack.addText("▎")
    br.font = Font.boldSystemFont(22)
    br.textColor = new Color("#6666FF")
}

async function getInfo() {
    let authResult = await oauth();
    await login(authResult);
    let result = await userinfo();
    log(result);
    return result;
}
//获取登录验证授权
async function oauth() {
    try {
        const options = {
            //签到任务调用签到接口
            url: `https://oauth.telegram.org/auth/push?bot_id=5938743585&origin=https%3A%2F%2Fhax.co.id&embed=1&request_access=write&return_to=https%3A%2F%2Fhax.co.id%2Flogin`,
            //请求头, 所有接口通用
            headers: {
                'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
                'Accept-Encoding': `gzip, deflate, br`,
                'Cookie': token.split("#")[0],
                'Connection': `keep-alive`,
                'Sec-Fetch-Mode': `navigate`,
                'Host': `oauth.telegram.org`,
                'User-Agent': `Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/111.0.5563.101 Mobile/15E148 Safari/604.1`,
                'Sec-Fetch-Site': `same-origin`,
                'Accept-Language': `zh-CN,zh-Hans;q=0.9`,
                'Referer': `https://oauth.telegram.org/embed/LoginHaxBot?origin=https%3A%2F%2Fhax.co.id&return_to=https%3A%2F%2Fhax.co.id%2Flogin&size=medium&request_access=write`,
                'Sec-Fetch-Dest': `document`
            },
        };
        const res = await $.get(options, false);
        //移除文本多余的换行符号
        let result = res.replace(/\t|\n|\v|\r|\f/g, '');
        const ckItems = result.match(/\{event\:.+?\}/g);
        //去掉多余空格
        let authResult = ckItems[0].replace(/\s*/g, "");
        authResult = authResult.split("result\:")[1];
        //转换成对象格式；
        authResult = JSON.parse(authResult);
        console.log(`✅获取登录验证授权成功！正在尝试进行登录校验...`)
        log(authResult);
        return authResult;
    } catch (e) {
        log(`❌出现错误！原因为:${e}`);
    }
}
//登录
async function login(authResult) {
    try {
        const options = {
            //签到任务调用签到接口
            url: getLoglinUrl(authResult),
            //请求头, 所有接口通用
            headers: {
                'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
                'Accept-Encoding': `gzip, deflate, br`,
                'Cookie': token.split("#")[1],
                'Connection': `keep-alive`,
                'Sec-Fetch-Mode': `navigate`,
                'Host': `hax.co.id`,
                'User-Agent': `Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/111.0.5563.101 Mobile/15E148 Safari/604.1`,
                'Sec-Fetch-Site': `same-origin`,
                'Referer': `https://hax.co.id/login`,
                'Sec-Fetch-Dest': `document`,
                'Accept-Language': `zh-CN,zh-Hans;q=0.9`
            }
        };
        const res = await $.get(options, false);
        const ckItems = res.match(/Logged in..../g);
        //如果正则匹配成功，则登录成功
        if (ckItems) {
            log(`✅登录数据校验成功！正在进行登录...\n`);
            log(`hax登录快捷跳转接口如下，可复制到浏览器打开：\n\n${getLoglinUrl(authResult)}\n`)
        } else {
            log(`❌登录数据校验失败！请检查环境变量配置是否正确！`);
        }
    } catch (e) {
        log(`❌出现错误！原因为:${e}`);
    }
}

//查询用户信息
async function userinfo(authResult) {
    try {
        const options = {
            //签到任务调用签到接口
            url: `https://hax.co.id/vps-info/`,
            //请求头, 所有接口通用
            headers: {
                'Accept': `text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8`,
                'Accept-Encoding': `gzip, deflate, br`,
                'Cookie': token.split("#")[1],
                'Connection': `keep-alive`,
                'Sec-Fetch-Mode': `navigate`,
                'Host': `hax.co.id`,
                'User-Agent': `Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/111.0.5563.101 Mobile/15E148 Safari/604.1`,
                'Sec-Fetch-Site': `same-origin`,
                'Sec-Fetch-Dest': `document`,
                'Accept-Language': `zh-CN,zh-Hans;q=0.9`
            },
        };
        const res = await $.get(options, false);
        //移除文本多余的换行符号
        let abc = res.replace(/\t|\n|\v|\r|\f/g, '');
        console.log(`✅登录成功！查询到的vps数据情况如下：\n`)
        //vps详细数据
        const result = [
            { "title": "Current time", "name": "currentTime", "reg": /Current time\<\/label\>\<div class=\"col-sm-7\"\>(.+?)\<\/div>/, },
            { "title": "Valid until", "name": "validUntil", "reg": /Valid until\<\/label\>\<div class=\"col-sm-7\"\>(.+?)\<\/div>/, },]
        //打印数据
        console.log(`--------------- Dashboard ---------------`);
        let obj = {};
        result.map(item => {
            let _value = item.reg.exec(abc)[1];
            log(`${item.title}：${_value}`);
            obj[item.name] = _value;
        });
        console.log(`-------------- Dashboard ---------------`);
        obj.currentTime = obj.currentTime.split('- ')[1];
        obj.currentTime = convertDate(obj.currentTime);
        obj.validUntil = convertDate(obj.validUntil);
        obj.days = dateDiff(obj.currentTime, obj.validUntil);
        log(obj)
        return obj;
    } catch (e) {
        log(`❌出现错误！原因为:${e}`);
    }
}

//对登录数据进行处理
function getLoglinUrl(authResult) {
    //数据脱敏
    let queryUrl = `https://hax.co.id/authentication/?id=${authResult.id}`;
    if (authResult["first_name"]) queryUrl += `&first_name=${encodeURIComponent(authResult["first_name"])}`;
    if (authResult["last_name"]) queryUrl += `&last_name=${encodeURIComponent(authResult["last_name"])}`;
    if (authResult.username) queryUrl += `&username=${authResult.username}`;
    if (authResult["photo_url"]) queryUrl += `&photo_url=${encodeURIComponent(authResult["photo_url"])}`;
    if (authResult["auth_date"]) queryUrl += `&auth_date=${authResult["auth_date"]}`;
    if (authResult.hash) queryUrl += `&hash=${authResult.hash}`;
    return queryUrl;
}
//日期格式转化
function convertDate(src) {
    const obj = { January: '1', February: '2', March: '3', April: '4', May: '5', June: '6', July: '7', August: '8', September: '9', October: '10', November: '11', December: '12', }
    let tempArr = src.replace(',', '').split(' ')
    let year = tempArr[2]
    let month = obj[tempArr[0]]
    let day = tempArr[1]
    return year + '-' + month + '-' + day
}
//计算相隔天数
function dateDiff(startDateString, endDateString) {
    var separator = "-"; //日期分隔符
    var startDates = startDateString.split(separator);
    var endDates = endDateString.split(separator);
    var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2]);
    var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
    return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24);//把相差的毫秒数转换为天数
};
