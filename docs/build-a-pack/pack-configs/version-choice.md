# 版本选择规则

版本选择规则（Version Choice）告诉 LPB 如何选择资源或模组加载器的版本。版本选择规则包含两部分，条件版本（versions）和自动选择规则（choice）。条件版本定义满足特定条件时选择的指定版本，而自动选择规则定义在没有指定条件版本或所有条件都不符合时自动选择版本的方法。通常情况下，这两个字段都可以省略。

### 条件版本（versions）{#conditioned-versions}

条件版本的键为 `versions`，值为一个对象。在这个对象中，以具体版本号为键，以 [条件数组](condition.md) 为值来定义满足特定条件时选取指定的版本。例子如下：

```yml
versions:
  6.0.8:
    - mcVersion: 1.20.1
    # 在 Minecraft 1.20.1 版本下使用该模组的 6.0.8 版本。
  6.0.9:
    - mcVersion: 1.21.1
    # 在 Minecraft 1.21.1 版本下使用该模组的 6.0.9 版本。
```

条件版本可以不配置。如果省略，则全部交给自动选择规则来决定选择什么版本。自动选择规则配置为 `static` 的情况除外。

### 自动选择规则（choice）

自动选择规则的键为 `choice`，值为一个文本。指定除 `static` 外所有合法值时，LPB 都会默许一个原则，即新版本优先。然后，根据具体设置值的不同，选择最符合的版本。各设置值与其具体选择逻辑如下：

- `latest`: 直接选择最新版本，无其他条件。
- `stable`: 在有 stable（或 release）版本时选择最新的 stable 的版本，如果没有就直接选择最新版本。
- `stableRequired`: 在有 stable 版本时选择最新的 stable 版本，如果没有就停止构件并抛出错误。
- `mostStable`: 选择相对来说最稳定版本中最新的。

`static` 是个特殊值，如果设为这个值，则会显式地要求不进行任何自动选择。这时条件版本是必须的。如果构建过程中条件版本无任何一个条件满足，则构建失败并抛出错误。

自动选择规则可以不配置。如果省略，则会选用构建策略中定义的值。如果策略中也没有定义，则会使用 `latest`。

## 具体使用

版本选择规则往往不被包裹在专门的独立对象中。使用版本选择规则，往往是直接将 versions 和 choice 这两个字段填写在需要指定此规则的那个对象内。如下是一个在资源定义中实际使用版本选择规则的例子。

```yml
main:
  # 机械动力
  type: platform
  content: mod
  size: both
  links:
    modrinth: "https://modrinth.com/mod/create"
    curseforge: "https://www.curseforge.com/minecraft/mc-mods/create"
  versions:
    6.0.8:
      - mcVersion: 1.20.1
      # 在 Minecraft 1.20.1 版本下使用机械动力的 6.0.8 版本。
    6.0.9:
      - mcVersion: 1.21.1
      # 在 Minecraft 1.21.1 版本下使用机械动力的 6.0.9 版本。
  choice: latest # 其他情况自动选择最新版本
```