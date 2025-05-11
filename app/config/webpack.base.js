const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack  = require('webpack');
const isDev = process.env.NODE_ENV === 'development';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

          
module.exports={
    // 入口文件
    entry:path.join(__dirname,'../src/index.tsx'), 
    output:{
        filename:'static/js/[name].[chunkhash:8].js',
        path:path.join(__dirname,'../dist'),
        clean:true,  // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了,
        publicPath: '/' // 打包后文件的公共前缀路径
    },
    module:{
        rules:[
            {   
                include:[path.resolve(__dirname,'../src')], // 只解析src目录下的文件
                test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
                use: [ 'thread-loader','babel-loader'], // thread-loader放在所有loader最前面
              },
            {
            test:/.(css|less)$/,
            use:[
                isDev? 'style-loader':MiniCssExtractPlugin.loader, // 开发环境下用style-loader，打包模式抽取css
                'css-loader',
                //新增
                {
                    loader:'postcss-loader',
                    options:{
                    postcssOptions:{
                        plugins:['autoprefixer']
                    }
                    }
                },
                'less-loader'
              ]
            },
            {
               test:/.(png|jpg|jpeg|gif|svg)$/,//匹配图片文件
               type:'asset/resource',
               parser:{
                 dataUrlCondition:{
                    maxSize:10*1024,//小于10k转base64
                 }
               },
               generator:{
                filename:'static/images/[name].[contenthash:8][ext]',//文件输出目录和名称
               }
            },
            {
                test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体文件
                type:'asset',
                parser:{
                  dataUrlCondition:{
                      maxSize:10*1024,//小于10k转base64
                   }
                },
                generator:{ 
                  filename:'static/fonts/[name].[contenthash:8][ext]', // 文件输出目录和命名
                },
            },
            {
                test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
                type: "asset", // type选择asset
                parser: {
                  dataUrlCondition: {
                    maxSize: 10 * 1024, // 小于10kb转base64位
                  }
                },
                generator:{ 
                  filename:'static/media/[name].[contenthash:8][ext]', // 文件输出目录和命名
                },
            },
           
        ]
    },
    resolve:{
      extensions:['.js','.tsx','.ts'],  // 引入模块不添加后缀
      alias:{
        '@':path.join(__dirname,'../src')
      },
      modules:[path.resolve(__dirname,'../node_modules')],// 查找第三方模块只在本项目的node_modules中查找
    },
    plugins:[
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'../public/index.html'),
            inject:true
        }),
        new webpack.DefinePlugin({
            'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
        }),
    ],
    cache:{
      type:'filesystem',// 文件缓存
    }
}