# Hydrogen for Linux

[English](https://github.com/Xmader/hydrogen_linux) | [中文](https://coding.net/u/xmader/p/hydrogen_linux/git/blob/master/README_zh.md)

> 基于 Git 的 笔记、任务、待办 管理工具 (Linux移植版)

## 简介

### 灵感来源 

![](http://origingroup.tech/imgs/sec1-branding.png)

我们最熟悉的软件莫过于操作系统自带的文件管理，这种经典的树形列表存储结构几乎适用于任何场景，但当管理的对象是一条任务、待办、小记录的时候就显得有些牛刀杀鸡，因此，在处理这些特定内容时会选用第三方软件工具，这些工具也做的很棒。

但我个人更喜欢文件夹的树形列表结构，那为什么不结合这些软件的优点，同时利用经典的树形列表结构更好的管理任务、待办、笔记呢？

这正是 **氢** 项目的出发点，用极致交互体验的树形列表来管理任务、笔记、待办！

### Git 让一切变得更美好 

![](http://origingroup.tech/imgs/history.png)

氢的数据存储基于 git 实现，所有任务都存储在一个 git 仓库中，并且深度整合 git 的功能，为什么选择 git？

* **自己掌控数据**：无需依赖第三方不可控的存储，可以将任务数据 push 到任何自己可以掌控的地方

* **完美的时光机**：git 将任务进行增量的版本化，在氢中，只要将任务提交到了版本库，那么无论多久都能一键回到之前的状态

* **分布式的任务管理**：git 让任务的数据可以实现分布式管理，无论在什么地方，只要将数据仓库 pull 下来，在氢中打开就可以工作，甚至可以做到多人合作

### 任务的三部曲 

<img src="http://origingroup.tech/imgs/task-step-1.png" style="width: 50px;"> 任何事情都可以用放在列表中，简洁高效的列表交互使得在输入和编辑上极其高效

![](http://origingroup.tech/imgs/flowy.png)

<img src="http://origingroup.tech/imgs/task-step-2.png" style="width: 30px;"> 根据需求随时将列表中的项目转化为一个待办任务，可以记录任务的开始时间，结束时间，并打标签

![](http://origingroup.tech/imgs/detail.png)

<img src="http://origingroup.tech/imgs/task-step-3.png" style="width: 50px;"> 结合 scrum 任务模型中的看板，将任务分为计划，冲刺，完成分别对应 scrum 模型中的 backlog，sprint，product

![](http://origingroup.tech/imgs/kanban.png)

### 最恰当的组合 

基于 git 将树形列表和 Scrum 任务模型恰当的衔接起来，这就是 **氢** 想做的事儿 

![](http://origingroup.tech/imgs/main.png)

## 下载

[点击下载](https://xmader.oss-cn-shanghai.aliyuncs.com/hydrogen_linux-master.zip)

## 使用

```bash
$ ./hydrogen
```

## 备注

* 仅支持Linux 64位系统

* 已在`Ubuntu Budgie 18.04 LTS (64位)`上运行成功，其它Linux系统未测试。

## 特别感谢

* [Hydrogen原版](http://origingroup.tech)

* [Electron](https://electronjs.org/)

---

© [Xmader.com](https://www.xmader.com/) & 超猫