addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  try {
    
      const url = new URL(request.url);
      
      if (url.pathname === "/query/hello"&&request.method=="GET") {
        return jsonResponse({result:"Hello World"}, 200);
      }

      if (url.pathname === "/api/getBody"&&request.method=="POST") {
        const requestBody = await request.json();
        return jsonResponse({result:requestBody}, 200);
      }

      throw new Error("404 not found");
  } catch (error) {
      // 如果请求目标地址时出现错误，返回带有错误消息的响应和状态码 500（服务器错误）
      return jsonResponse({
          error: error.message
      }, 500);
  }
}

// 返回 JSON 格式的响应
function jsonResponse(data, status) {
  return new Response(JSON.stringify(data), {
      status: status,
      headers: {
          'Content-Type': 'application/json; charset=utf-8'
      }
  });
}
