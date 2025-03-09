/*
#!name=utag教程解锁
#!desc=网址：https://utgd.net/

[Script]
untag = type=http-response, pattern=https:\/\/api\.utgd\.net\/api\/v2\/(lesson|article)\/\d+\/, script-path=https://raw.githubusercontent.com/Sliverkiss/GoodNight/refs/heads/master/Surge/module/untag.js, requires-body=true, max-size=-1, timeout=1200

[MITM]
hostname = %APPEND% api.utgd.net
*/

let matchUrl = $request.url;
var defaultData = JSON.parse($response.body);

if (matchUrl.match(/article/)) {
    defaultData["article_is_free_read"] = true;
    defaultData["article_for_membership"] = false;
    defaultData["article_required_membership"]=0;
    defaultData["article_free_read_end_time"]="2030-11-08 18:00:00";
    $done({ body: JSON.stringify(defaultData) });
} else if (matchUrl.match(/lesson/)) {
    let id = defaultData["id"];
    let course = defaultData["lesson_father_course"];

    const myRequest = {
        url: `https://api.utgd.net/api/v2/course/${course}/lesson/`,
        method: "GET", // Optional, default GET.
        headers: $request.headers, // Optional.
    };

    if (typeof $task !== "undefined") {
        $task.fetch(myRequest).then(response => {
            // response.statusCode, response.headers, response.body
            console.log(response.body);
            let res = JSON.parse(response.body);
            let resultData = res.find(e => e.id == id)
            $done({ body: JSON.stringify(resultData) });
        }, reason => {
            // reason.error
            $done();
        });
    } else {
        $httpClient.get(myRequest, (error, response, data) => {
            if (error) {
                console.log("Request failed: ", error);
                $done();
                return;
            }

            let res = JSON.parse(data);
            let resultData = res.find(e => e.id == id);
            $done({ body: JSON.stringify(resultData) });
        });
    }


}



