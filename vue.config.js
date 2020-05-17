module.exports = {
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NONE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args => {
                args[0].isProd = true
                return args
            })
        })

        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main.js')
            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })
        })
    }
}