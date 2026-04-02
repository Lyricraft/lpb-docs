# 本地文件资源类型

平台资源类型（files）从本地获取文件作为资源打包进整合包中。指定文件在何处，是否进行压缩和进行什么压缩，以及将文件放进整合包的何处。

## 对象结构

平台资源类型具有的额外字段如下：

- file: 字符串。资源在本地的路径。末尾可以使用通配符 `/*` 匹配此目录下的所有文件。
- compress: 字符串。压缩类型，可选 `none`（不压缩）、`zip`（zip 压缩）。
- path: 字符串。[资源应用路径](resources-yml.md#path)，即资源放在哪个目录下。这个路径相对的是项目根目录，即 LPB 脚本运行的工作目录。如果你的 file 指定的是未经压缩的文件夹，要注意这不是应用资源后文件夹的路径，事实上，你的文件夹会放在这个路径指定的文件夹的子目录下。比如你要应用一个 `tools` 文件夹，在这里填写 `mods/tools` 事实上会使你应用的文件夹最终路径为 `mods/tools/tools`，因此实际上应该填写 `mods`。如果要给文件夹改名，请使用 rename。
- rename: （可选）字符串，[资源应用名称](resources-yml.md#rename)。将你选中的文件、文件夹或压缩文件更名后再放入整合包中。如果不填写，将使用原本的名称，压缩文件会使用被压缩文件名（单文件）或其所在目录的名称（多文件）。如果你在 file 中使用了通配符，则不应填写此项，因为无法给多个文件指定同一个名称。

一个应用模组配置文件的例子：

```yml
type: files
file: configs/create/common.toml
path: config
rename: create-common.toml
```

一个应用自制资源包的例子

```yml
type: files
file: resourcepacks/neofoundation-helper/*
path: resourcepacks
rename: NeoFoundation Helper.zip
```