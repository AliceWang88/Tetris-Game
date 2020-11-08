const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const  CleanWebpackPlugin  = require('clean-webpack-plugin');


module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve('./dist'),
        filename: 'script/bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:'./public/index.html',  // 模板html文件
        }),
        new CleanWebpackPlugin(), // 把老文件清理，再重新打包
    ],
    module:{
        rules:[
            {test:/.ts$/, use:{
                loader: "ts-loader",
                options:{
                    transpileOnly:true,
                }
            }}
        ]
    },
    resolve:{
        extensions:['.ts','.js']  // 导入文件 解析后缀名
    }
}


