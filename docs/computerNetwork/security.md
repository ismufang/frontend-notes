## 网络安全与防护

## 1. 跨站请求伪造（CSRF）

CSRF（Cross-site request forgery）跨站请求伪造：攻击者盗用受害者的身份，以受害者的名义发送恶意请求。

### 1.1 CSRF 攻击流程

- 受害者登录 a 网站，并保留了登录凭证（Cookie）
- 在没有登出 a 的情况，利用广告图片等方式引诱受害者访问 b 网站
  - 攻击者可以通过图片（src 为请求 b 地址），链接等方式获取受害者 cookie
- b 以受害者身份向 a 发送请求，浏览器默认携带 a 网站 cookie
  - b 网站故意构造请求 a 站的请求，比如删除操作
- a 网站接收请求，并验证，确认为受害者的凭证，误以为是受害者发的请求
- b 网站以受害者不知情的情况下，完成攻击

### 1.2 攻击方式

**GET 方式**

**图片**

```html
<img src="http://xx.com/action" />
```

图片加载方式，图片加载时，自动执行请求。

**链接**

```html
<a href="http://xx.com/action"></a>
```

引诱受害者点击触发请求，一般以图片广告链接出现。

**POST 方式**

**提交隐藏表单**

```html
<form action="http://xx.example" method="POST">
  <input type="hidden" name="account" value="xiaoming" />
  <input type="hidden" name="amount" value="10000" />
  <input type="hidden" name="for" value="hacker" />
</form>
<script>
  document.forms[0].submit()
</script>
```

访问受害者页面，表单自动提交，相当于完成一次 POST 操作；

POST 类型比 GET 更严格，当时依然可能被攻击；所以后端接口不能把安全寄托在 POST 方法上；

### 1.3 CSRF 防御

#### 1.3.1 同源检测

服务器可以根据请求头中`origin` `referer`两个字段确定请求的来源；

如果都不存在，最好直接阻止。

#### 1.3.2 Token

由于 cookie 自动携带，服务器误把攻击者当成受害者，可以要求用户携带攻击者无法获得的 Token。

- 页面请求携带 Token
- 服务器验证 Token 是否正确

#### 1.3.3 Samesite 属性

Chrome 51 开始，浏览器的 Cookie 新增加了一个 SameSite 属性限制第三方 Cookie，用来防止 CSRF 攻击和用户追踪。

SameSite 根据严格程度取值为 Strict, Lax, None，存在兼容性问题。

## 2. 跨站脚本攻击（XSS）

将跨站脚本注入到被攻击的网页上，用户访问网页会执行跨站脚本。

### 2.1 XSS 类型

- 存储型
  - 攻击者将恶意代码提交到目标网站的数据库中
  - 服务器将恶意代码取出，拼接到 HTML 中并返回给客户端
  - 客户端解析 HTML，并执行
- 反射型
  - 攻击者构造特殊 URL，携带恶意代码的参数
  - 服务器将 URL 中代码恶意取出，拼如 HTML 中并返回
  - 客户端解析 HTML，并执行
  - 一般攻击者会诱导受害者打开恶意 URL 才生效
- DOM 型
  - 攻击者构造恶意 URL
  - 用户打开恶意 URL
  - 客户端解析 HTML，执行 URL

**DOM 型与反射型**

DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

### 2.2 XSS 防御

#### 2.2.1 输入过滤（转义）

对用户输入内容进行转义处理

#### 2.2.2 输出过滤（转义）

- 转义 HTML
  - `onerror`, `onload`等事件回调检测
- 慎用`.innerHTML`, `.style`

#### 2.2.3 验证码

有效防止脚本冒充用户提交危险操作

#### 2.2.4 CSP（内容安全策略）

> 内容安全策略（Content Security Policy），其核心思想十分简单：网站通过发送一个 CSP 头部，来告诉浏览器什么是被授权执行的与什么是需要被禁止的。其被誉为专门为解决 XSS 攻击而生的神器。

使用

1. 在 HTTP Header 上使用（首选）

```
"Content-Security-Policy:" 策略
```

2. 在 HTML 上使用

```html
<meta http-equiv="content-security-policy" content="策略" />
```

## 3. CSRF 与 XSS 区别

1. CSRF 需要用户登录，获取认证凭证（cookie）；XSS 不需要
2. CSRF 利用网站本身漏洞去请求网站的 api；XSS 是向网站注入 JS 脚本，执行脚本

## 4. HTTPS 中间人攻击

由于在建立起 HTTPS 连接之前存在一次明文的 HTTP 请求和重定向，使得攻击者可以以中间人的方式劫持这次请求，从而进行后续的攻击，例如窃听数据，篡改请求和响应，跳转到钓鱼网站等。

黑客在电脑上安装伪造的证书，拦截客户端的请求。

## 5. 广告是如何植入网站的

### HTTP 网站

HTTP 是采用明文传输，宽带运营商或者其他人可以在传输过程中插入乱七八糟的东西，比如广告。

就比如快递，到手前会经过很多中间流程，搞不好有的快递员夹带私货（比如贴个广告）。

处理方式：采用 HTTPS。

### HTTPS 中间人劫持

即便采用 HTTPS 也可能遭到攻击，只不过难度会大一些；
黑客在电脑上安装伪造的证书，拦截客户端的请求。
