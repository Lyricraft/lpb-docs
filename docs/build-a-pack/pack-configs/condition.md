# 条件

条件（Condition）用于指定应用某资源、选择某版本等的前提。一个条件对象一定包含一个条件键值对，其中条件类型为键，条件参数为值。一个条件对象中只能包含一个条件键值对，如果有同级的多个条件，应当写在该条件对象所在的数组中，而非在同一对象中添加键值对。（也就是说，条件类型前需要加上 `-` 以表明它是独立的数组成员。）LPB 在一个条件对象中找到第一个合法的键值对后，不会再将其作为其他条件进行解析。

比如：

```yml
conditions:
  - mcVersion: 1.21.1
    modLoader: neoforge
    # modLoader 实际不会被解析，因为这个条件对象已用于 mcVersion
  - packFormat: modrinth
  - resource: mod/create
  # 这两个条件都会被正常解析，因为它们在独立的条件对象中
```

## 条件类型

这里列出了全局都可以使用的条件类型以及其参数说明。

- `not`: 嵌套条件，非。 值可为一个 condition 对象，或 condition 对象数组。当值为数组时，数组内部按 and 逻辑处理。
- `and`: 嵌套条件，与。值为 condition 对象数组。 
- `or`: 嵌套条件，或。值为 condition 对象数组。
- `bool`: 值为 `true` 或 `false`。布尔常量条件，直接决定条件结果为 true 还是 false。
- `mcVersion`: 值为字符串或字符串数组，字符串内容为 [版本范围](overview.md#version-range)。Minecraft 版本条件，当构建目标 Minecraft 版本落在区间内时为 true，否则为 false。若为数组，任一区间满足即为 true。
- `modLoader`: 字符串或字符串数组，字符串内容为模组加载器名称（可选 `neoforge`、`forge`、`fabric` 和 `quilt`）。模组加载器条件，构建目标加载器匹配时为 true，否则为 false。若为数组，任一匹配即为 true。
- `packFormat`: 字符串或字符串数组，字符串内容为整合包格式（可选 `modrinth`、`curseforge`、`mcbbs` 等支持的整合包格式）。整合包格式条件，构建目标整合包格式匹配时为 true，否则为 false。若为数组，任一匹配即为 true。
- `group`: 字符串或字符串数组，字符串内容为资源组 id。不能指向自身所在的 group。资源组生效条件，若该资源组已生效（即命中过至少一个资源选项），则为 true，否则为 false。若为数组，默认任一命中即为 `true`。
- `option`: 字符串或字符串数组，字符串内容为资源选项路径，即为资源组 id 和资源选项 id 的拼接，中间用点 `.` 连接（如 `basicRendering.sodium`）。不能指向自己或同一 group 下的其他 option。资源选项触发条件。若该资源选项已命中，则为 true，否则为 false。若为数组，默认任一命中即为 `true`。
- `resource`: 字符串或字符串数组，字符串内容为资源路径。指向的 resource 不能被自身所在 group 中的包括自己在内的任何 option 调用。资源引用条件，若该资源已被引用，则为 true，否则为 false。若为数组，默认任一命中即为 `true`。

条件整体本身在作为一个值出现时，它往往出现在数组中。这个顶级数组相当于被 and 条件括起，也就是说，这个数组中的所有条件都要满足，整个 conditions 数组的条件才算满足。

看下面这个例子：

```yml
conditions:
  - mcVersion: 1.21.1
  - modLoader: neoforge
  # Minecraft 为 1.21.1，而且加载器平台为 NeoForge
  - not:
      packFormat: curseforge
  # 加之整合包格式不能为 curseforge
  - or:
      - resource:
        - mod/ftbUltimine
        - mod/repurposedStructures
      # mod/ftbUltimine 或 mod/repurposedStructures 资源被引用
      - group: dynamicCrosshair
      # 或 dynamicCrosshair 资源组生效
  # 以及这个或条件中的任一项满足
```

### allFit

对于 group、option 和 resource 这三类条件，可在同一个 condition 对象中额外定义 allFit 字段其值为布尔型。 当 allFit 为 true 时，条件不再是要求数组中任一项满足，而是要求数组中所有项都满足；当 allFit 为 false 或未定义时，条件为默认的任一项满足即可，如上所述。

如下是一个例子。

```yml
conditions:
  - option:
    - trinkets.curiosApi
    - trinkets.baubles
  # 因为未指定 allFit，所以只要 ttrinkets.curiosApi 和 trinkets.baubles 资源选项之一生效即可满足条件
  - group:
    - extraBotany
    - patchouli
    allFit: true
  # 因为设置了 allFit 为 true，所以 extraBotany 和 patchouli 资源组都必须生效才能满足条件
```

## 依赖链

条件中的 mcVersion、modLoader 和 packFormat 类型的参考值在开始构建流程前就已产生，但 groups、options 和 resources 类型条件的参考值是 LPB 在对照资源列表时参照其他条件来动态产生的。因此，存在条件之间的依赖关系：一个条件的结果可能依赖于另一个条件的结果。LPB 在解析资源列表时会根据依赖关系动态调整资源组的对照顺序（不会拆分成资源选项调整），保证在判断某条件时，它的依赖项都已完成判断。（因此，我们无须在编写资源列表时保证依赖的项目一定在被依赖的项目之后。）但是，我们需要注意避免循环依赖的情况。LPB 在解析资源列表时如果发现了这种情况，会抛出错误并停止构建。比如下面的例子就是个反面教材。

```yml
groups:
  - id: itemA
    conditions:
      - group: itemB
  # 资源选项 itemA 的条件判断依赖于资源选项 itemB 的结果
  - id: itemB
    conditions:
      - group: itemA
  # 资源选项 itemB 的条件判断又依赖于 itemA 的结果
  # 这就形成了循环依赖，无法决定应该先判断谁
  - id: groupX
    options:
      - id: optionM
        conditions:
          - option: groupY.optionQ
        # 资源选项 groupX.optionM 的条件判断依赖于资源选项 groupY.optionQ 的结果
      - id: optionN
  - id: groupY
    options:
      - id: optionP
        conditions:
          - option: groupX.optionN
        # 资源选项 groupY.optionP 的条件判断依赖于资源选项 groupX.optionN 的结果
      - id: optionQ
  # 因为一个资源组不能拆分开来，而且 groupX 和 groupY 都要求对方在自己前面判断，因此也构成循环依赖
```

资源列表对照是最先生成条件判断结果的阶段。在这之后，全局条件类型的对照值都已完成生成。后面才会进行 loaders、folders 以及资源定义和数据生成所需的条件判断，这时再使用全局条件类型，就不用担心对照值还未生成和循环依赖的问题了。

## 具体使用

条件整体往往以数组的形式出现，其键一般为 `conditions`。这时一般可以将 condition 字段省略，若省略则表示条件一定成立。条件整体也可能作为一个以满足条件后选中的结果的键的值，就像 [条件版本](version-choice.md#conditioned-versions) 和 list.yml 中 [folders](list-yml.md#folders) 的定义一样。