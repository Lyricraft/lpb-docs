import {defineConfig} from 'vitepress'

export default defineConfig({
    base: '/lpb-docs/',
    lang: 'zh-CN',
    title: 'Lyric Pack Builder 文档',
    description: 'Lyric Pack Builder 的说明与教程文档',
    themeConfig: {
        nav: [{text: 'Home', link: '/'}],
        socialLinks: [{icon: 'github', link: 'https://github.com/lyricraft'}],
        sidebar: [
            {text: 'Home', link: '/'},
            {
                text: '制作整合包',
                items: [
                    {text: '开始', link: '/build-a-pack/getting-started'},
                    {
                        text: '整合包配置',
                        items: [
                            {text: '总览', link: '/build-a-pack/pack-configs/overview'},
                            {text: '整合包元数据', link: '/build-a-pack/pack-configs/pack-yml'},
                            {text: '资源列表', link: '/build-a-pack/pack-configs/list-yml'},
                            {
                                text: '资源定义',
                                items: [
                                    {text: '资源定义', link: '/build-a-pack/pack-configs/resources/resources-yml'},
                                    {text: '平台资源类型', link: '/build-a-pack/pack-configs/resources/platform-resource'},
                                ]
                            },
                            {text: '版本选择规则', link: '/build-a-pack/pack-configs/version-choice'},
                            {text: '条件', link: '/build-a-pack/pack-configs/condition'},
                        ]
                    },
                ]
            }
        ]
    },
    ignoreDeadLinks: true, // 忽略死链
})

