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
