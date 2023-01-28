# Shmily-Get-Call_SMS-S60v3_SMS

# 说明

请先阅读 https://github.com/lqzhgood/Shmily

此工具是将 `Symbian S60v3 短信` 导出的通讯录转换为 `Shmily-Msg` 格式的工具

# 使用

0. 安装 node 环境 [http://lqzhgood.github.io/Shmily/guide/setup-runtime/nodejs.html]
1. 修改终端编码为 `utf-8`
    - windows 用户百度搜索 `cmd utf-8`

### 手动方式 解码 body

`manual.js` 通过读取 `inputM` 下的文件，并根据 `inputM\config.js` 中手动方式解码。
大致就是通过人为判断分别通过 `ASCII` 和 `utf16-be` 出来的文字是否有意义，通过手动编写解码方式与长度的方式解码。

##### /inputM/config.js

```
{
 "00100021": {
        want: false, // 是否想要这一条，不想要在 toMsg 的时候会被过滤
        decode: [
            [3, 'a'], // ['长度' , '编码标记']
            [1, '|'],
            [2, 'u'],
            [0, 'end'],
        ],
    },
}
以上代表 3位ascii 1位分割 2位utf-16  结束。
body 一共4个字（3个数字英文，1个汉字（2个字符））

```

### 自动方式 解码 body

body 部分感觉是通过中英文符号编码混编的,英文部分是 `ASCII` ,中文部分是 `utf8-be`,符号未知.<br/>
不同编码通过特定编码区分，大部分是是用的 utf-16 的私有区域 `E000 / F8FF`
理论上通过足够的样本可以穷举出 分隔编码 和 符号编码。但是样本量太少了。 放弃~~

粗略一点可以限定 0~9 a-Z 的编码强制 `ASCII` 解码， 汉字部分 `4E00-9FA5` 强制 `utf16-be` 解码,这样也能得到大概信息

// 不知道为啥 `index.js` 是空的, 不晓得是损坏了还是压根没写

## 注意

时间的解析说明在 `lib\decodeDate\` 下

## 参考文献

Information and Communications Security: 14th International Conference, ICICS 2012, Hong Kong, China, October 29-31, 2012, Proceedings <br/>
https://play.google.com/store/books/details?id=7PO5BQAAQBAJ&rdid=book-7PO5BQAAQBAJ&rdot=1&source=gbs_vpt_read <br/><br/>

nokia doc archive<br/>
http://devlib.symbian.slions.net/ <br/> <br/>

```
可在 Google 图片中搜索 1000484B\Mail2 encoded 关键词查看试读
https://books.google.com/books?id=7PO5BQAAQBAJ&pg=PA245&lpg=PA245&dq=1000484B%5CMail2+encoded&source=bl&ots=tZTcJej9Gt&sig=ACfU3U2XuBvQcfCncxEFynrPWfKP3A3ozw&hl=zh-CN&sa=X&ved=2ahUKEwiR7ZzHiZDtAhURc3AKHVT5AIkQ6AEwCXoECAEQAg#v=onepage&q=1000484B%5CMail2%20encoded&f=false
```
