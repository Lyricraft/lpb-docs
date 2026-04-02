# 平台资源类型

平台资源类型（platform）指定需要在什么平台上下载什么资源，以及按什么规则选择版本，下载完成后将资源放在何处。

## 对象结构

### 额外字段

平台资源类型具有的额外字段如下：

- content: 字符串，内容类型，可选 `mod`、`resoucepack`、`datapack`、`shader`、`save`。指定该资源的内容类型。前述可选值分别为模组、资源包、数据包、光影包、存档。
- platforms: 对象。平台资源定位，用来指定在特定平台上去哪里寻找资源，以及选择什么文件。键为平台名称（`modrinth` 或 `curseforge`），值为字符串或对象。为字符串时，直接指定资源链接；为对象时，参看后文的平台资源定位对象。
- path: （可选）字符串。[资源应用路径](resources-yml.md#path)。如果未指定，LPB 将自动放在默认目录下或者定义的 `builders:` 文件夹下。如果是数据包，而没有指定此项和定义 `builders:datapacks` 文件夹，则停止构建并抛出错误。
- rename: （可选）字符串。[资源应用名称](resources-yml.md#rename)。

如下是一个简单的平台资源类型资源项目的例子。

```yml
type: platform
content: mod
side: client
platforms:
  modrinth: https://modrinth.com/mod/sodium
  curseforge: https://www.curseforge.com/minecraft/mc-mods/sodium
rename: 【钠】sodium.jar
```

### 平台资源定位对象（platform）

在需要精确控制版本或文件时，才需要使用平台资源定位对象，否则直接使用资源链接字符串即可。对象结构如下：

- link: （可选）字符串，资源链接。
- versions: （可选）对象，[版本选择规则](../version-choice.md) 中的条件版本。
- choice: （可选）字符串，版本选择规则中的自动选择规则。

如下面的例子：

```yml
type: platform
content: mod
side: client
platforms:
  modrinth:
    link: https://modrinth.com/mod/embeddium/
    versions:
      "https://modrinth.com/mod/embeddium/version/0.3.31+mc1.20.1":
        - mcVersion: 1.20.1
      # 在 Minecraft 版本 1.20.1 下选用模组版本 0.3.31+mc1.20.1
    choice: latest
  curseforge:
    link: https://www.curseforge.com/minecraft/mc-mods/embeddium
    versions:
      "https://www.curseforge.com/minecraft/mc-mods/embeddium/files/5681725":
        - mcVersion: 1.20.1
      # 在 Minecraft 版本 1.20.1 下选用文件 5681725
    choice: latest
```

指定具体版本或文件后，在满足条件时，如果本版本或文件可用将直接使用其，不会再检查 Minecraft 版本和加载器是否匹配。

一般情况下，link 是需要填写的。但如果不填写 link，则 versions 必须填写，而且所谓“版本号”的具体内容需要满足一定要求（见下面一节）。而且 choice 必须设为 static。如果 choice 也被省略，则会自动设为 static。这在已手动指定所有版本文件，无需自动选择时可以用到。如果条件版本没有一项满足，则停止构建并抛出错误。

### 版本号

由于各平台对模组版本号的规定和展示方法不一，在填写平台资源定位对象中的条件版本的时，版本号应当根据情况填写相关有代表性的值。

在使用 Modrinth 资源时，版本号实际可以填写这些值：

- 版本 id（id），如 `pXyXLdlT`。（但凡使用此类，则 link 必须填写。）
- 版本号（version_number），如 `mc1.21.11-0.8.7-neoforge`。（但凡使用此类，则 link 必须填写。）
- 版本详情页 URL，如 ` https://modrinth.com/mod/sodium/version/pXyXLdlT ` 和 ` https://modrinth.com/mod/sodium/version/mc1.21.11-0.8.7-neoforge `。（支持不填写 link。）

在使用 CurseForge 资源时，版本号实际可以填写这些值：

- 文件 id（id），如 `7805160`。使用时请用引号包裹，以保证被解析为字符串。（但凡使用此类，则 link 必须填写。）
- 文件详情页 URL，如 ` https://www.curseforge.com/minecraft/mc-mods/sodium/files/7805160 `。（支持不填写 link。）

二者都可以使用文件下载直链。如 Modrinth 的 ` https://cdn.modrinth.com/data/AANobbMI/versions/UddlN6L4/sodium-fabric-0.8.7%2Bmc1.21.11.jar ` 和 CurseForge 的 ` https://mediafilez.forgecdn.net/files/7805/160/sodium-neoforge-0.8.7%2Bmc1.21.11.jar `。（支持不填写 link。）但是，不要将并非来自对应平台的下载直链放在这里。

## 资源链接（link）

上面介绍了资源链接，给出的例子中是模组详情页的 url 链接。事实上，资源链接不止可以填写这一种，还可以填写以下种类。

- 项目 slug，如 `sodium`。
- 项目 id，如 Modrinth 上的 `AANobbMI`，CurseForge 上的 `394468`（使用引号包裹来保证被解析成字符串）。
- 任何含有了项目 slug 或 id 的子页面 URL，如 Modrinth 上的 ` https://modrinth.com/mod/sodium/versions `，CurseForge 上的 ` https://www.curseforge.com/minecraft/mc-mods/sodium/files/all `。