# 资源定义

资源定义（resources）可以以内联形式直接存在于资源列表 list.yml 中，也可以以文件形式独立存在。文件形式的资源定义是一类 YAML 文件，位于 `lpb/resources` 目录及其子目录下，且以 `.yml` 为扩展名。资源定义具有唯一的 id，也称为资源定义路径。内联资源定义的 id 由对象内的 id 字段定义，也可以不定义。独立在文件中的资源定义之 id 为其相对于 `lpb/resources` 目录的路径，且去掉 `.yml` 后缀。如位于 `lpb/resources/mods/sodium.yml` 的资源定义文件，其 id 为 `mods/sodium`。

## 对象结构

资源定义具有如下的基本对象结构：

- `id`: （可选）字符串。资源定义的 id。不能包含特殊字符。且只对于内联资源定义有效。
- `secondary`: （可选）数组，成员为资源项目。附属资源。

## 资源项目

一个资源定义包含一个或多个具体的资源项目，其中一个作为主资源，其余作为附属资源。主资源有且仅有一个，附属资源可以是零个至多个。主资源的各字段直接填写在资源定义的根对象内。附属资源以数组形式填写在 `secondary` 字段下。

附属资源可用条件约束是否应用。不同于资源列表 list.yml 中 group 下的 option，附属资源之间不互斥，可以同时应用多个。但主资源必须被应用。

资源项目具有如下的基本对象结构：

- `type`：字符串。资源项目类型。
- `conditions`：（可选）条件数组。附属资源应用的条件，只对附属资源有效，主资源固定应用。
- `side`：（可选）字符串，端要求，值可选 `client`、`server`、`both` 和 `auto`。指定该资源在哪个端被应用。从前到后依次为客户端、服务端、双端和自动。选为自动时，LPB 会综合资源类型以及资源平台上获取的信息推断资源在哪个端被应用，如果无法推断，则会在双端都应用。如果主资源在某端不会被应用，其所有附属资源也都不会被应用。

比如下面这个例子：

```yml
type: platform
side: both
content: mod
platforms:
  modrinth: https://modrinth.com/mod/create
  curseforge: https://www.curseforge.com/minecraft/mc-mods/create
# 主资源项目为模组机械动力，在双端都应用
secondary:
  - type: files
    conditions:
      - mcVersion: 1.21.1
    side: both
    files:
      "builtin:config/create-common.toml": "/configs/create/create-common.toml"
    # 一个附属资源，公共配置，只在 Minecraft 版本为 1.21.1 时应用，在双端都应用
  - type: files
    side: client
    files:
      "builtin:config/create-client.toml": "/configs/create/create-client.toml"
    # 有一个附属资源，客户端配置，只在客户端应用
```

## 资源项目类型

资源项目有多种类型，不同的类型决定了资源不同的来源与处理机制，也意味着填写不同结构的配置。这些配置同样直接填写在资源项目的根对象内即可。如下是可用的资源项目类型：

- [platform](./platform-resource.md): 平台资源。指定项目的链接，从 Modrinth 和 Curseforge 上自动获取合适版本的资源。模组、资源包等都适合此类。
- [files](./files-resource)：本地文件资源。从本地复制静态文件，放到整合包的指定位置。也可以对指定文件进行压缩后再放入。游戏、模组的配置，自制的资源包、数据包等都适合此类。
- [datagen](./datagen-resource)：数据生成资源。按照给定的数据生成模板，根据构建实时条件动态生成文本文件。适合需精细控制且自动化生成的配置文件。不需要用到时无需了解。

点击链接进入对应页面了解详细信息，知晓如何具体定义。

## 常用值

### 资源应用路径

资源应用路径指定资源文件在应用时会放到整合包哪个位置，即文件相对于游戏实例目录的相对路径。比如，`mods/` 表示在整合包安装后，这个文件会被放到 `.minecraft/versions/实例名称/mods/`目录下（或者 `.minecraft/mods/`，因具体启动器而异）。路径以 `/`、`./`，还是直接以文件或目录名开头是等价的。路径结尾带不带 `/` 可能有影响，在本地文件资源类型和数据生成资源类型下，有 `/` 表示放在这个目录下，无 `/` 表示覆盖这个文件或覆盖、合并这个目录。

资源应用路径可以以下面的字符串开头，这些字符串表示特定的子目录，从而简化路径。

- `builtin:mods/`: 表示模组文件夹，目前指向 `mods/`。
- `builtin:resourcepacks/`: 资源包文件夹，目前指向 `resourcepacks/`。
- `builtin:config/`: 配置文件夹，目前指向 `config/`。
- `builtin:saves/`: 存档文件夹，目前指向 `saves/`。
- `builder:平台资源类型的资源内容类型/`: 指向其默认位置，或者在资源列表 list.yml 中重新定义的值，参见 [平台资源类型](platform-resource.md)。
- `list:定义的文件夹 id`: 指向资源列表 list.yml 中定义的位置。