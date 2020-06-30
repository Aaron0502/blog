<!--
 * @Author: chenwen11
 * @Date: 2020-06-27 17:15:24
 * @LastEditTime: 2020-06-30 17:19:53
 * @Description: 
--> 

> 底层基于postMessage实现通信，未做ie兼容性处理

> 考虑到安全性，使用该sdk与PAGE通信时，请先向`wangyong14`或者`sunyuli`申请通信权限

## 安装
```javascript
mnpm install @sfe/message
```

## 初始化
建立通信的前提是必须在PAGE页面加载完毕后才可以进行，所以初始化逻辑需要包裹在内嵌page的onload方法中
```js
// vue使用示例

import { Message, EVENT_TYPE } from 'message'

this.$refs.page.onload = () => {
  this.message = new Message({
    otherWindow: this.$refs.page.contentWindow,
      targetOrigin: 'https://page.sankuai.com/'
    })
}
```
调用`Message`函数，执行`new`方法生成一个用于通信的实例。用于初始的参数如下：  
- `otherWindow`: 其他窗口的一个引用，比如iframe的contentWindow属性、执行window.open返回的窗口对象、或者是命名过或数值索引的window.frames。
- `targetOrigin`: 通过窗口的origin属性来指定哪些窗口能接收到消息事件，其值可以是字符串"\*"（表示无限制）或者一个URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配targetOrigin提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；例如，当用postMessage传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的origin属性完全一致，来防止密码被恶意的第三方截获。如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的targetOrigin，而不是*。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。  

其中`targetOrigin`为可选参数，不传默认参数如下
```js
export const TARGET_ORIGIN =
  process.env.NODE_ENV === 'production'
    ? 'https://page.sankuai.com/'
    : 'http://page.shangou.dev.sankuai.com/'
```
## 实例方法

- `send`：用于与内嵌PAGE通信的方法，其中第一个参数为对象，其中`type`为事件类型，`msg`为通信的数据；第二个参数为收到PAGE回传信息的回调函数，回调函数的第一个参数为正常通信回传的数据，第二个参数为通信出现问题的错误信息
```js
message.send({ type: 'preview', msg: 'mobile2' }, (msg, err) => {
        if(!err) {
          console.log(msg)  // {timestamp: 1589953851586, type: "preview", data: "success"}
        }
      })
```
> 正常通信成功返回的数据说明：返回信息均为一个对象，其中`timestamp`为发送消息的时间戳，`type`为事件类型，`data`为真正的返回数据  
> `type`事件类型可直接引用`EVENT_TYPE`来获得，具体如下
```js
import { EVENT_TYPE } from 'message'

export const EVENT_TYPE = {
  SWITCH_ENV_PAGE: 'switchEnv', // 切换环境
  SET_TITLE_PAGE: 'setTitle', //  设置页面标题
  SELECT_APPLICATION_PAGE: 'setApp', // 设置所在应用的灵犀appnm
  PUBLISH_PAGE: 'publish', // 发布页面
  EDIT_PAGE: 'edit', // 编辑导入指定url
  CLEAR_PAGE: 'clear', // 清空本地内容
  PREVIEW_PAGE: 'preview', // 全屏预览
  SET_TAB_PAGE: 'setTab' // 设置page的tab
} 
```

- `stop`：结束通信方法，请在结束通信后调用该方法，避免不必要的性能消耗
```js
message.stop()
```

## `send`实例方法语法糖
以下方法均为对`send`方法进行封装并`promise`化的语法糖函数，代码打包过程中未对`promise`进行polyfill，如果你使用的环境不支持`promise`，请使用`send`方法。建议优先使用以下语法糖函数，语法糖函数的方法名均与事件名一致

- `switchEnv`：切换环境，`true`表示线上环境，`false`表示测试环境
```js
message.switchEnv(true).then(msg => {
        console.log(msg)
      }).catch(err => console.log(err))
```

- `setTitle`：设置页面标题，函数参数即为页面标题
```js
message.setTitle('trddfdfdfdf').then(msg => {
        console.log( msg)
      }).catch(err => console.log(err))
```

- `setApp`：设置所在应用，目前有三个应用可选（"waimai_e_center"，"waimai_e"， "shanggou_gxt"）
```js
message.setApp('waimai_e').then(msg => {
        console.log(msg)
      }).catch(err => console.log(err))
```

- `publish`：发布页面，入参支持String或Object, 返回值为发布链接
```js
 // 方式1： 入参为String，会做校验，必须为`pc|mobile`
 message.publish('mobile').then(msg => {
        console.log(msg)
      }).catch(err => console.log(err))
 // 方式2(推荐)： 入参为Object，必须包含`deviceType`, 其值为`pc|mobile`，同时支持其他参数`appnm|env|title`，都会做值的校验，校验不通过会在err信息中指明原因
 // 其中env的值 true代表资源存线上，外网可访问 false代表存test, 仅支持内网访问
 // 其中appnm的值 为嵌入项目的灵犀appnm 设置此值便于分类查找文档 且分类统计访问数据 若你要设置的值不在白名单内，请联系管理员
 message.publish({ deviceType: 'pc', env: true, title: '你真棒', appnm: 'waimai_e_center' }).then(msg => {
        console.log(msg)
      }).catch(err => console.log(err))
```

- `edit`：导入已创建的html页面，参数为一个url链接
```js
message.edit('https://shangou.meituan.net/v1/mss_24c1e05b968a4937bf34e2f4ff68639e/shangou-fe-maker-html/sg/html/2019-12-10/eb03537f58beb9deeea46e64cdcc021b1575958209146/index.html').then(msg => {
        console.log(msg)
      }).catch(err => console.log(err))
```

- `clear`：清空本地内容
```js
message.clear().then(msg => {
        console.log(msg)
      }).catch(err => console.log(err))
```

- `preview`：全屏预览，"pc"或者"mobile"
```js
message.preview('mobile').then(msg => {
        console.log(msg)
      }).catch(err => console.log(err))
```

- `setTab`：设置PAGE的tab，参数为"content"、"history"、"template"、"search"、"list"、"help"、"info"其中之一
```js
message.setTab('search').then(msg => {
        console.log(msg)
      }).catch(err => console.log(err))
```

## more
结合PAGE路由信息，再使用以上通信桥接函数，也许你可以做的更多。如：你可以通过路由信息隐藏掉上侧的tab页和右侧的功能菜单，再使用这些通信函数定制功能菜单。

`http://page.shangou.dev.sankuai.com/?hidden=["top", "right"]`，路由中的query参数`hidden`为一个数组，“top”、“left”分别表示要隐藏的元素(注意必须是双引号)。

## demo
```js
<template>
  <div>
    <button @click="publish">发布</button>
    <iframe
      id="page"
      ref="page"
      title="消息设置"
      width="100%"
      height="850"
      src='https://page.sankuai.com/?hidden=["right", "top"]'
    >
    </iframe>
  </div>
</template>

<script>
import { Message } from '@sfe/message'
export default {
  mounted() {
    this.$refs.page.onload = () => {
      this.message = new Message({
        otherWindow: this.$refs.page.contentWindow,
        targetOrigin: 'https://page.sankuai.com/'
      })
      this.message.clear()
    }
  },
  beforeDestroy(){
    this.message.stop()
  },
  methods: {
    async publish() {
       try {
         // 方式一 参数String类型 代表deviceType
         // const resMsg = await this.message.publish('pc')
         // 方式二 参数Object类型 支持设置「deviceType\appnm\env\title」 ！！推荐
         const resMsg = await this.message.publish({ deviceType: 'pc', env: true, title: '你真棒' })
         console.log(resMsg)   
       } catch (e) {
          console.error(e)
       }
    }
  }
}
</script>
```

## other
发布的页面可以在 page平台-我的发布 中查看
- dev: http://page.shangou.dev.sankuai.com
- prod: https://page.sankuai.com
