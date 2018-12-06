# Hydrogen

> A Git Based Task, Note, Todo Management Tool<br>
基于 Git 的 笔记、任务、待办 管理工具

## Download<br>下载

[Download MacOS version <br>下载MacOS版](https://xmader.oss-cn-shanghai.aliyuncs.com/hydrogen-darwin.zip)

[View Windows & Linux version <br>查看Windows和Linux版](https://github.com/Xmader/hydrogen)

## 使用

* 解压后在`hydrogen-darwin`文件夹中找到`Hydrogen.app`,拖到应用里面运行即可

## 更新历史

### v1.2.10 变更

* 增加不能删除根任务的提示  
感谢 @lizhimingmu 的[反馈](https://github.com/Xmader/hydrogen/issues/5)

### v1.2.9 变更

* 解决https://github.com/Xmader/hydrogen/issues/3 每次重新启动Hydrogen都出现使用说明界面的问题, 改成首次启动Hydrogen时才出现使用说明界面

### v1.2.8 变更

* 支持 https://github.com/origingroup/hydrogen/issues/3 中提到的 使用CTRL-S快捷键快速提交更改

<!-- bug遗留: 在用CTRL-S快捷键弹出的提交框中无法显示这次修改的详细信息 -->

### v1.2.7 变更

* 解决 在任务列表末尾增加任务时，滚动条不自动滚动 的问题 

### v1.2.6 变更

* 解决https://github.com/Xmader/hydrogen/issues/2 文档输入末尾增加行，滚动条不自动滚动 的问题 

### v1.2.5 变更

* 修复 https://github.com/origingroup/hydrogen/issues/13 与 https://github.com/origingroup/hydrogen/issues/42 提到的 "/" 工具面板超出编辑区域时部分面板UI无法看到的问题

### v1.2.3.1 变更 (仅针对MacOS)

* 修复菜单栏中的issues页面链接

### v1.2.3 变更

* 修复https://github.com/Xmader/hydrogen/issues/1 下载更新时未对应操作系统的问题

* 修复https://github.com/Xmader/hydrogen/issues/1 版本号仍显示1.1.10的问题

<!-- 每次更改版本号需要在Hydrogen.app\Contents\Info.plist中同步更改 -->

### v1.2.2 变更

* 优化版本号比较的逻辑

### v1.2.1 变更

* 修改push时SSH公钥和私钥未设置的错误提示，更加人性化

### v1.2.0 变更

* 增加本地图标字体缓存，解决如果在没有网络时打开Hydrogen会出现图标无法显示的问题
* 优化检查新版本的方式
