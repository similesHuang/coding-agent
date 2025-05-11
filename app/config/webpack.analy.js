// webpack-analy.js

const proConfig   = require('./webpack.prod.js');
const SpeedMeasurPlugin = require('speed-measure-webpack-plugin');
const { merge } = require('webpack-merge');
const smp = new SpeedMeasurPlugin();
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')// 引入分析打包工具结果插件

// 使用smp.wrap方法，把生产环境配置传进去，后于后面可能要加分析配置，先留出空位
module.exports =smp.wrap(merge(proConfig,{
     plugins:[
        new BundleAnalyzerPlugin(), // 配置插件
     ]
}));