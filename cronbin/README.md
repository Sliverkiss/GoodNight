# **接口文档**

## **通用请求头**

所有接口均需携带以下请求头：

| Header 名称            | 必填 | 示例值                                | 描述                                  |
|------------------------|------|---------------------------------------|---------------------------------------|
| Content-Type           | 是   | `application/x-www-form-urlencoded`  | 表示请求体的编码格式。                |
| Cookie                 | 是   | `key=abc; _clientOffset=480`         | 包含用户会话信息，例如任务的授权凭据。 |

---

## **1. 创建任务**

### **接口地址**
`POST /tasks`

### **请求参数**

| 参数名     | 类型     | 是否必填 | 示例值         | 描述                                   |
|------------|----------|----------|----------------|----------------------------------------|
| enabled    | `string` | 是       | `false`         | 任务状态，固定值为 `on`，表示启用任务。 |
| interval   | `string` | 是       | `"*/5 * * *"`  | 任务执行间隔，支持 Cron 表达式。          |
| url        | `string` | 是       | `"http://..."` | 任务的目标 URL 或 curl 命令。            |
| note       | `string` | 否       | `"My Task"`    | 任务的备注信息，用于描述任务。            |

## **2. 编辑任务**

### **接口地址**
`POST /tasks/<key>/edit`

### **请求参数**

| 参数名     | 类型     | 是否必填 | 示例值         | 描述                                   |
|------------|----------|----------|----------------|----------------------------------------|
| enabled    | `string` | 否       | `false`         | 任务状态，`on` 表示启用，省略表示禁用。  |
| interval   | `string` | 否       | `"*/10 * * *"` | 修改后的任务执行间隔，支持 Cron 表达式。   |
| url        | `string` | 否       | `"http://..."` | 修改后的目标 URL 或 curl 命令。           |
| note       | `string` | 否       | `"Updated"`    | 修改后的任务备注信息。                   |

## **3. 删除任务**

### **接口地址**
`POST /tasks/<key>/delete`

### **请求参数**

| 参数名     | 类型     | 是否必填 | 示例值         | 描述                                   |
|------------|----------|----------|----------------|----------------------------------------|
| 无         | 无       | 无       | 无             | 直接删除任务。                           |

## **4. 运行任务**

### **接口地址**
`POST /tasks/<key>/run`

### **请求参数**

| 参数名     | 类型     | 是否必填 | 示例值         | 描述                                   |
|------------|----------|----------|----------------|----------------------------------------|
| 无         | 无       | 无       | 无             | 直接运行指定任务。                       |

## **5. 配置失败通知**

### **接口地址**
`POST /notification`

### **请求参数**

| 参数名               | 类型     | 是否必填 | 示例值                                                      | 描述                                   |
|----------------------|----------|----------|-----------------------------------------------------------|----------------------------------------|
| notification_curl    | `string` | 是       | `"curl -X POST -d '{{message}}' http://example.com/error"` | 失败通知的 curl 命令模板，`{{message}}` 为占位符。 |

---

### **备注**
- `POST /tasks` 接口用于添加新任务。
- `POST /tasks/<key>/edit` 接口覆盖了任务的启用、禁用及修改内容的功能。
- `POST /tasks/<key>/delete` 和 `POST /tasks/<key>/run` 分别用于删除和运行任务。