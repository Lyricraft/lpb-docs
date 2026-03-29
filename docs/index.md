# Lyric Pack Builder

欢迎来到 Lyric Pack Builder 的文档！

[Lyric Pack Builder](https://github.com/lyricraft/lyric-pack-builder)（简称 LPB）是一个用于构建 Minecraft 整合包的开源工具，由 [Lyricraft](https://github.com/Lyricraft) 制作。本工具旨在简化多版本整合包的制作流程，使用配置文件定义整合包内容，运行脚本完成构建打包。

## 教程

要开始制作你的整合包，可以前往 [开始](build-a-pack/getting-started.md) 章节，了解制作整合包的全流程。

## 特性

LPB 支持制作面向几乎所有 Minecraft 正式版本，NeoForge、Forge、Fabric、Quilt 加载器的整合包。能够从 Modrinth、CurseForge 资源平台自动获取所需资源信息。LPB 能够导出的整合包格式包含 CurseForge、Modrinth、MCBBS 等，标准格式的整合包能够在 CurseForge、Modrinth 平台上发布。

条件系统的使用使 LPB 能够根据目标 Minecraft 版本、模组加载器、导出平台的不同，自动调整整合包内容，真正实现“一处定义、多版构建”。数据生成系统能根据定义的规则自动生成整合包的配置等文件，减小工作量的同时维持了对整合包内容和细节的精准把控。