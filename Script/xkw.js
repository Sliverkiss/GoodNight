/*
#!name=学科网 Crack
#!desc=预览全部无次数限制，解锁部分会员权限 by @Sliverkiss

[Script]
xkw = type=http-response, pattern=^https:\/\/mapi\.xkw\.com\/api\/v3\/user\/info-with-vip-status, script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/master/Script/xkw.js, requires-body=true, max-size=-1, timeout=60

xkw = type=http-response, pattern=^https:\/\/mapi\.xkw\.com\/api\/v3\/document\/preview-times\?documentId=, script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/master/Script/xkw.js, requires-body=true, max-size=-1, timeout=60

xkw = type=http-response, pattern=^https:\/\/mapi\.xkw\.com\/api\/v4\/document\/info\/.+\?withIdentity=1&withInTimePrice=1&withPayInfo=1, script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/master/Script/xkw.js, requires-body=true, max-size=-1, timeout=60

[MITM]
hostname = %APPEND% mapi.xkw.com
*/
let Body = JSON.parse($response.body);
let url = $request.url;
if (url.match(/info-with-vip-status/)) {
    Object.assign(Body.identity, {
        isPlus: true,
        isLight: true,
        isWxt: true,
        isMonthly: true,
        isVip: true
    });
} else if (url.match(/document\/preview-times/)) {
    Body =
        Object.assign(Body, {
            "previewTimes": 99,
            "isPreviewed": true
        });
} else if (url.match(/v4\/document\/info/)) {
    Object.assign(Body, {
        isFree: true,
        memberFree: true,
        "price" : 0,
    });
    Object.assign(Body.userIdentity, {
        "isLight": true,
        "isMonthly": true,
        "isWxt": true,
        "isPlus": true,
        "isVip": true
    });
}   

$done({ body: JSON.stringify(Body) })
