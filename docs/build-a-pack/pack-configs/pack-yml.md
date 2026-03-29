# 整合包元数据

整合包元数据（pack.yml）是一个 YAML 文件，位于 `lpb/pack.yml`。它定义了整合包的基本信息，如名称、版本、作者等，以及整合包支持的 Minecraft 版本、模组加载器，准备导出的平台之类。

### 根节点

pack.yml 的根节点是一个对象，包含以下字段：

- `id`: 字符串。整合包的标识符，通常为小写字母、数字和连字符（或下划线）组成。实际上用作输出文件名的一部分。
- `name`: 字符串。整合包的显示名称。
- `description`: 字符串。整合包的描述信息。
- `author`: 字符串。整合包的作者。
- `version`: 字符串。整合包的版本号，建议遵循语义化版本规范。最好使用引号包裹版本号，以避免 YAML 解析器将其误认为数字。
- `versionStage`：字符串。版本阶段标识，可选 `alpha`、`beta`、`release` 等，用于区分不同开发阶段的版本。
- `mcVersions`: 数组。支持的 Minecraft 版本列表，元素为字符串，每个字符串都是一个 [版本范围](overview.md#version-range)。
- `modLoaders`: 数组。支持的模组加载器列表，元素为字符串，可选 `neoforge`、`forge`、`fabric`、`quilt`。
- `packFormats`: 数组。准备导出的整合包格式，元素为字符串，可选 `modrinth`、`curseforge`、`mcbbs`。

如下是一个完整的 pack.yml 示例：

```yml
id: neofoundation
name: NeoFoundation
description: A basic, essential modpack for Minecraft NeoForge — building your foundation for gameplay.
author: Lyricraft
version: "0.1"
versionStage: alpha
modLoaders:
  - neoforge
mcVersions:
  - "[1.20.1,)"
```

## 其他作用

pack.yml 中定义了 `mcVersions`、`modLoaders` 和 `packFormats`，之后构建时的目标 Minecraft 版本、模组加载器、发布平台必须在这里定义的范围内。但这里的定义并不意味着构建时必定会针对所有目标进行构建，还取决于具体情况。这里只是限制与提示作用。

pack.yml 中还可以写一些上述并没有规定的键值对，只要合乎语法，LPB 便不会报错。在 pack.yml 根对象内定义的字符串值可以在具体构建时的元数据配置中被引用，后面会详细提到。