# 资源列表

资源列表（list.yml）是一个 YAML 文件，位于 `lpb/list.yml`，定义整合包中包含的模组、资源包、数据包、附加文件等内容，以及应用它们的条件。同时也可以定义模组加载器版本、要使用到的特定文件夹（如数据包文件夹）。

## 对象结构

### 根节点

list.yml 的根节点是一个对象，包含 `groups` 、`loaders` 和 `folders` 三个子节点。其中， `groups` 定义资源组，为数组，必须填写，成员为 group 对象；`loaders` 定义模组加载器和版本，为对象，可以不填写；`folders` 定义文件夹，为数组，可以不填写，成员为 folder 对象。

### 资源组（group）对象

资源组用于定义整合包中实现某一特定功能或引入某一特定内容的资源。标准的资源组对象包含以下字段：

- `id`：（可选）字符串。资源组的标识符，通常为小写字母、数字和连字符（或下划线）组成，不能与其他 group 重复。用于定位资源组。
- `options`: 数组。资源选项列表。成员为 option 对象。作为资源选项，它定义资源组的具体实现，指定到底以什么资源来实现这个资源组代表的功能。资源组可以有多个资源选项，LPB 会从前向后校验条件来选出该资源组应用哪一个资源选项。每个资源组只会应用一个资源选项，即第一个满足条件的资源选项。
- `required`: 布尔值。是否必选。如果这个值设为 `true`，则该资源组至少要有一个资源选项满足条件并被应用，否则构建失败并抛出错误。默认为 `false`。

### 资源选项（option）对象

资源选项用于定义资源组的一个具体实现方案，及应用本选项的条件。资源选项对象包含以下字段：

- `id`：（可选）字符串。资源选项的标识符，不能与同 group 下的其他 option 重复。用于定位资源选项。
- `conditions`：（可选）数组。条件列表。成员为 [condition 对象](condition.md)（点击链接前往了解如何定义条件）。当所有条件都满足时，该资源选项被选中并应用对应资源。如果该字段不存在或为空，则该资源选项必定被选中。
- `resources`: 数组。资源列表。成员为字符串或对象。当该资源选项被选中时，数组中的所有资源都会被应用。成员为字符串时，视为资源属性文件路径，LPB 会在 `lpb/resources` 目录下找到对应 yml 文件并解析。成员为对象时，视为内联资源属性（即 [resource 对象](list-yml.md#resource-对象)）。

比如以下资源组。它定义了提供基础渲染优化功能的资源集合，并通过两个资源选项来实现此功能，同时定义了应用这两个选项的条件。

```yml
groups:
  - id: basicRendering
  # 基础渲染优化模组
    options:
      - id: sodium
        # 从 MC 版本 1.21.1 开始，钠支持了 Neoforge
        conditions:
           - mcVersion: "[1.21.1,)"
        resources:
           - mods/sodium
      - id: embeddium
        # 在钠尚未支持 Neoforge 前，使用其非官方移植 Embeddium
        conditions:
          - mcVersion: "[1.20.1,1.21]"
        resources:
          - mods/embeddium
    required: true
```

如果我们的资源组中只有一个资源选项，不需要在不同版本中寻找其他替代品，那么我们可以简写这个资源组及资源选项。这时，我们不用写资源组的 `options`和`required`，以及资源选项的`id`，直接将 `resources` 字段写在资源组对象内即可。如果要使用条件，直接在资源组对象下定义 `conditions` 字段即可。

这时如果定义了条件，它仍会生效，决定这个资源选项是否应用。条件不满足不会报错。（此时定义 `required` 无效，因为没有意义。）

如果定义了 id，此处简写的资源组和资源选项的 id 将都会是这个值。

如下是一个简写资源组的示例：

```yml
groups:
  - id: jei
    resources:
      - mods/just-enough-items
    conditions:
      - mcVersion: "[1.20,)"
```

这相当于：

```yml
groups:
  - id: jei
    options:
      - id: jei
        resources:
          - mods/just-enough-items
        conditions:
          - mcVersion: "[1.20,)"
```

数个资源组组合，即可成为一份完整的资源清单。这已经是一个完整的 list.yml 了，毕竟 loaders 和 folders 不是必须的，后者也不一定需要用到。如下：

```yml
groups:
  - id: basicRendering
    # 基础渲染优化模组
    options:
      - id: sodium
        # 钠
        conditions:
          - mcVersion: "[1.21.1,)"
        resources:
          - mods/sodium
      - id: embeddium
        conditions:
          - mcVersion: "[1.20.1,1.21]"
        resources:
          - mods/embeddium
    required: true
  - id: shaders
    # 光影模组
    options:
      - id: iris
        resources:
          - mods/iris
  - id: etfAndEmf
    # 实体纹理和模型特性
    resources:
      - mods/entity-texture-features
      - mods/entity-model-features
```

### 模组加载器对象（loaders）

模组加载器对象定义整合包使用加载器的什么版本。加载器其实已经在整合包元数据 pack.yml 以及具体构建时指定，只是在指定版本规则时需要填写进此对象。在模组加载器对象中，键为加载器名称，值为一个对象，该对象内填写的是 [版本选择规则](version-choice.md)。如：

```yml
loaders:
  neoforge:
    versions:
      21.1.222:
        - mcVersion: 1.21.1
        # 在 Minecraft 版本为 1.21.1 时，选择 Neoforge 版本 21.1.222
      21.0.167:
        - mcVersion: "1.21"
        # 在 Minecraft 版本为 1.21 时，选择 Neoforge 版本 21.0.167
    choice: stable
      # 在其他情况下，尽量选择 Neoforge 的稳定版本
```

如果想指定其条件版本，只想指定自动选择规则，则可以直接在加载器名称的键后面填写自动选择规则字符串作为值，如：

```yml
loaders:
  forge: latest
  # 自动选择加载器的最新版本
```

如果也不想指定任何版本选择规则，就无需填写了。

模组加载器对象不是必须的，如果不定义，而输出目标含有某加载器，LPB 会自动使用此加载器，并按照策略中定义的自动选择规则或默认的来选择此加载器的版本。

### 文件夹（folders）对象{#folders}

文件夹定义资源定义中描述资源存放位置的可能用到的路径。比如在安装不同数据包加载模组时，数据包要放在不同的文件夹里。通过定义文件夹，我们可以通过条件来决定数据包资源的存放位置，而在写数据包存放位置的时候，只需要用文件夹的 id 开头就行了。

文件夹对象包含以下字段：

- `id`：字符串。文件夹标识符。通常为大小写字母、数字和连字符（或下划线）组成，不得含有非法字符。但是，可以以 `list:` 开头。实际上，任何没有以 `list:` 开头的 id 在引用时仍然要用 `list:` 开头。
- `paths`: 字符串或对象。文件夹路径及触发条件。如果是字符串，则直接表示文件夹路径。如果是对象，则以键为路径，值为 condition 对象数组。当条件满足时，LPB 会使用该路径作为文件夹路径。LPB 从上至下验证条件，取到满足条件的第一个路径作为文件夹路径。如果没有满足条件的路径，则构建失败并抛出错误。

此外，可以专门定义特殊的文件夹 id，它们以 `builder:` 开头，可能存在默认值。对它们进行定义可能影响构建器的行为。可前往资源定义的 [资源应用路径](./resources/resources-yml.md#path) 了解详情。

如下是一组 folder 定义：

```yml
folders:
  - id: "builder:datapacks"
    # 数据包文件夹
    paths:
      config/openloader/datapacks:
        - option: datapackLoader.openLoader
      global_packs/required_data:
        - option: datapackLoader.globalPacks
      config/paxi:
        - option: datapackLoader.paxi
      # 在使用不同全局数据包加载模组时将数据包放到该模组要求的文件夹
  - id: "weSchem"
    # 创世神结构文件夹
    paths: config/worldedit/schematics
```

如下是一个同时包含 group、loaders 和 folder 定义的完整 list.yml 示例：

```yml
groups:
  - id: worldEdit
    # 创世神
    resources:
      - mods/worldedit
  - id: datapackLoader
    # 全局数据包加载器
    options:
      - id: openLoader
        conditions:
          - mcVersion: "[1.20,1.1.20.4]"
        resources:
          - mods/openLoader
      - id: globalPacks
          - conditions:
          - mcVersion: "[1.21,1.21.1]"
        resources:
          - mods/globalPacks
  - id: creatableElytra
    #数据包：可合成鞘翅
    resources:
      - datapacks/creatableElytra
loaders:
  neoforge:
    versions:
      21.1.222:
        - mcVersion: 1.21.1
      21.0.167:
        - mcVersion: "1.21"
    choice: stable
  forge: latest
folders:
  - id: builder:datapacks
    # 数据包文件夹
    paths:
      config/openloader/datapacks:
        - option: datapackLoader.openLoader
      global_packs/required_data:
        - option: datapackLoader.globalPacks
  - id: weSchem
    # 创世神结构文件夹
    paths: config/worldedit/schematics
```