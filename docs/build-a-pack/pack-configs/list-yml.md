# 资源列表

资源列表是一个 YAML 文件，位于 `lpb/list.yml`，定义整合包中包含的模组、资源包、数据包、附加文件等内容，以及应用它们的条件。同时也定义可能使用的特定文件夹，如数据包文件夹。

### 根节点

list.yml 的根节点是一个对象，包含 `groups` 和 `folders` 两个子节点，它们都是数组。其中， `groups` 定义资源组，必须填写，成员为 group 对象；`folders` 定义文件夹，可以不填写，成员为 folder 对象。

### 资源组（group）对象

资源组用于定义整合包中实现某一特定功能或引入某一特定内容的资源。标准的资源组对象包含以下字段：

- `id`：（可选）字符串。资源组的标识符，通常为小写字母、数字和连字符（或下划线）组成，不能与其他 group 重复。用于定位资源组。
- `options`: 数组。资源选项列表。成员为 option 对象。作为资源选项，它定义资源组的具体实现，指定到底以什么资源来实现这个资源组代表的功能。资源组可以有多个资源选项，LPB 会从前向后校验条件来选出该资源组应用哪一个资源选项。每个资源组只会应用一个资源选项，即第一个满足条件的资源选项。
- `required`: 布尔值。是否必选。如果这个值设为 `true`，则该资源组至少要有一个资源选项满足条件并被应用，否则构建失败并抛出错误。默认为 `false`。

### 资源选项（option）对象

资源选项用于定义资源组的一个具体实现方案，及应用本选项的条件。资源选项对象包含以下字段：

- `id`：（可选）字符串。资源选项的标识符。用于定位资源选项。
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

如果我们的资源组中只有一个资源选项，不需要在不同版本中寻找其他替代品，那么我们可以简写这个资源组及资源选项。这时，我们不用写资源组的 `id`、`options`和`required`，以及资源选项的`id`，我们写一个键 `option`，其值为资源选项的 id。（如果你还是不想定义 id，在 option 后写一个空字符串即可，用一对紧邻的引号 `""` 表示。）然后，直接在这一层对象下定义资源选项的 `conditions` 和 `resources` 字段即可。

这时如果定义了条件，它仍会生效，决定这个资源选项是否应用。条件不满足不会报错。（此时定义 `required` 无效，因为没有意义。）

如果你在 `option` 后定义了 id，此处简写的资源组和资源选项的 id 将都会是这个值。

如下是一个简写资源组的示例：

```yml
groups:
  - option: jei
    resources:
      - mods/just-enough-items
```

数个资源组组合即可成为一份完整的资源清单。这已经是一个完整的 list.yml 了，毕竟 folders 不是必须的，也不一定需要用到。如下：

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
  - option: etfAndEmf
    # 实体纹理和模型特性
    resources:
      - mods/entity-texture-features
      - mods/entity-model-features
```

### 文件夹（folder）对象

文件夹定义资源定义中描述资源存放位置的可能用到的路径。比如在安装不同数据包加载模组时，数据包要放在不同的文件夹里。通过定义文件夹，我们可以通过条件来决定数据包资源的存放位置，而在写数据包存放位置的时候，只需要用文件夹的 id 开头就行了。

文件夹对象包含以下字段：

- `id`：字符串。文件夹标识符。通常为大小写字母、数字和连字符（或下划线）组成，不得含有非法字符。但是，可以以 `list:` 开头。实际上，任何没有以 `list:` 开头的 id 在引用时仍然要用 `list:` 开头。
- `paths`: 字符串或对象。文件夹路径及触发条件。如果是字符串，则直接表示文件夹路径。如果是对象，则以键为路径，值为 condition 对象数组。当条件满足时，LPB 会使用该路径作为文件夹路径。LPB 从上至下验证条件，取到满足条件的第一个路径作为文件夹路径。如果没有满足条件的路径，则构建失败并抛出错误。

此外，可以专门定义特殊的文件夹 id `builder:datapacks` 来表示数据包文件夹。LPB 在应用平台数据包资源时，若没有在资源定义中专门定义存放位置，会把资源放在此目录下。如果此处也没有定义，则构建失败并抛出错误。

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
  - id: "weSchem"
    # 创世神结构文件夹
    paths: config/worldedit/schematics
```

如下是一个同时包含 group 和 folder 定义的完整 list.yml 示例：

```yml
groups:
  - option: worldEdit
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
  - option: creatableElytra
    #数据包：可合成鞘翅
    resources:
      - datapacks/creatableElytra
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