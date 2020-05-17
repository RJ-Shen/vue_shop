// 产品发布阶段的插件数组
const prodPlugin = []

if(process.env.NODE_ENV === 'production'){
  prodPlugin.push('transform-remove-console')
}
module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
     ...prodPlugin,// 这个是移除console
     '@babel/plugin-syntax-dynamic-import'
  ]
}