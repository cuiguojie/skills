---
name: xread
description: 读取单条 X/Twitter status 链接或数字 id，并用内置脚本转换成尽量保真的 Markdown。用于需要总结、归档、引用或二次处理推文/长文内容，而不想直接阅读镜像 API 原始 JSON 的场景。
---

# xread

直接调用内置脚本，不要手工解析镜像 JSON。

运行：

```bash
node scripts/xread.mjs <url-or-id>
```

需要保存文件时：

```bash
node scripts/xread.mjs <url-or-id> -o /tmp/post.md
```
