### Launcher

#### 目录结构
- external: 外部依赖应用(7z)
- main: 客户端Electron主进程，负责与外部应用通信以及本地操作，并负责向渲染进程提供服务.
- render: 客户端Electron渲染进程，负责向main请求服务，并渲染UI.
- script: 一些脚本文件，用于服务器自动生成patch，元数据等等.
- services: Python编写外部应用，有些用于客户端，有些用于服务器，比如比对diff，patch以及一些下载功能

#### 通信方式
- 外部应用与main之间通过管道通信
- main和render之间通过消息队列通信

#### 错误处理
- 外部应用无法处理的错误，通过退出码被main捕获
- main无法处理，throw异常被main/service捕获，并通过消息队列传递给render
- render直接响应并输出错误消息