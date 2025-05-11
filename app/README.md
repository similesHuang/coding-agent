
# 背景
       我们在搭建前端项目时，大多依赖cra或vite提供的脚手架。虽然脚手架方便了前端的开发，但是让开发人员丧失了搭建项目时的很多细节，不利于培养工程化的能力。接下来，我们手把手用webpack搭建一个react+ts的架子，带你复习webpack相关的知识。

# 初始化项目
      在开始webpack之前，我们要先创建一个空目录，并初始化包管理工具。

```javascript
npm init -y
```



初始化package.json后，往目录中添加下面所示的目录结构和文件。

```javascript
├── build
|   ├── webpack.base.js # 公共配置
|   ├── webpack.dev.js  # 开发环境配置
|   └── webpack.prod.js # 打包环境配置
├── public
│   └── index.html # html模板
├── src
|   ├── App.tsx
│   └── index.tsx # react应用入口页面
├── tsconfig.json  # ts配置
└── package.json
```



安装webpack和webpack-cli依赖.

```javascript
npm i webpack webpack-cli -D
```



安装react+类型依赖

```javascript
npm i react react-dom -S
npm i @types/react @types/react-dom -D
```



<font style="color:rgb(51, 51, 51);">添加</font>**<font style="color:rgb(51, 51, 51);">public/index.html</font>**<font style="color:rgb(51, 51, 51);">内容</font>

```html
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```



<font style="color:rgb(51, 51, 51);">添加</font>**<font style="color:rgb(51, 51, 51);">tsconfig.json</font>**<font style="color:rgb(51, 51, 51);">内容</font>

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": false,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react", // react18这里也可以改成react-jsx
  },
  "include": ["./src"]
}
```



添加src/App.jsx代码

```jsx
import React from "react";
const App =()=>{
  return <>hello webpack</>
}
export default App;
```



添加src/index.jsx入口文件代码

```jsx
import React from "react";
import {createRoot} from 'react-dom/client';
import App from "./App";
const root = document.getElementById('root');
if(root){
  createRoot(root).render(<App/>);
}
```



<font style="color:rgb(51, 51, 51);">现在项目业务基本代码已经添加好了,接下来可以配置</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">的代码了。</font>

<font style="color:rgb(51, 51, 51);"></font>

# <font style="color:rgb(51, 51, 51);">配置基础环境React+ts环境</font>
## webpack公共配置
修改webpack.base.js

1. **配置入口文件**

```javascript
// webpack.base.js
const path = require('path');

module.exports={
    // 入口文件
    entry:path.join(__dirname,'../src/index.tsx'),
}
```



2. **配置出口文件**

```javascript
// webpack.base.js
const path = require('path')

module.exports = {
  // ...
  // 打包文件出口
  output: {
    filename: 'static/js/[name].js', // 每个输出js的名称
    path: path.join(__dirname, '../dist'), // 打包结果输出路径
    clean: true, // webpack4需要配置clean-webpack-plugin来删除dist文件,webpack5内置了
    publicPath: '/' // 打包后文件的公共前缀路径
  },
}
```



3. **配置loader解析ts和jsx**

<font style="color:rgb(51, 51, 51);">    由于</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">默认只能识别</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">文件,不能识别</font>**<font style="color:rgb(51, 51, 51);">jsx</font>**<font style="color:rgb(51, 51, 51);">语法,需要配置</font>**<font style="color:rgb(51, 51, 51);">loader</font>**<font style="color:rgb(51, 51, 51);">的预设预设 </font>[@babel/preset-typescript](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-preset-typescript)<font style="color:rgb(51, 51, 51);"> 来先</font>**<font style="color:rgb(51, 51, 51);">ts</font>**<font style="color:rgb(51, 51, 51);">语法转换为 </font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);"> 语法,再借助预设 </font>[@babel/preset-react](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2Fdocs%2Fbabel-preset-react)<font style="color:rgb(51, 51, 51);"> 来识别</font>**<font style="color:rgb(51, 51, 51);">jsx</font>**<font style="color:rgb(51, 51, 51);">语法。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">  </font>**<font style="color:rgb(51, 51, 51);">安装babel核心模块和babel预设</font>**

```javascript
npm i babel-loader @babel/core @babel/preset-react @babel/preset-typescript -D
```

**<font style="color:rgb(51, 51, 51);"></font>**

<font style="color:rgb(51, 51, 51);">在</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">添加</font>**<font style="color:rgb(51, 51, 51);">module.rules</font>**<font style="color:rgb(51, 51, 51);">配置，配置loader。</font>

```javascript
// webpack.base.js
module.exports = {
module:{
        rules:[
            {
                test: /.(ts|tsx)$/, // 匹配.ts, tsx文件
                use: {
                    loader: 'babel-loader',
                    options: {
                    // 预设执行顺序由右往左,所以先处理ts,再处理jsx
                    presets: [
                        '@babel/preset-react',
                        '@babel/preset-typescript'
                    ]
                    }
                }
              }

        ]
    },
}
```



4. **配置extensions**

     **extensions**是**webpack**的**resolve**解析配置下的选项，在引入模块时不带文件后缀时，会来该配置数组里面依次添加后缀查找文件，因为**ts**不支持引入以 **.ts**, **tsx**为后缀的文件，所以要在**extensions**中配置，而第三方库里面很多引入**js**文件没有带后缀，所以也要配置下**js。**


<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">，注意把高频出现的文件后缀放在前面</font>

```javascript
// webpack.base.js
module.exports = {
  // ...
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
  }
}
```

<font style="color:rgb(51, 51, 51);">这里只配置</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">, </font>**<font style="color:rgb(51, 51, 51);">tsx</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">ts</font>**<font style="color:rgb(51, 51, 51);">，其他文件引入都要求带后缀，可以提升构建速度。</font>

<font style="color:rgb(51, 51, 51);"></font>

5. **添加html-webpack-plugin**

**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">需要把最终构建好的静态资源都引入到一个</font>**<font style="color:rgb(51, 51, 51);">html</font>**<font style="color:rgb(51, 51, 51);">文件中,这样才能在浏览器中运行,</font>[html-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fhtml-webpack-plugin)<font style="color:rgb(51, 51, 51);">就是来做这件事情的,安装依赖：</font>

```javascript
npm i html-webpack-plugin -D
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">因为该插件在开发和构建打包模式都会用到,所以还是放在公共配置</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">里面。</font>

```javascript
// webpack.base.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../public/index.html'), // 模板取定义root节点的模板
      inject: true, // 自动注入静态资源
    })
  ]
}
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">到这里一个最基础的</font>**<font style="color:rgb(51, 51, 51);">react</font>**<font style="color:rgb(51, 51, 51);">基本公共配置就已经配置好了,需要在此基础上分别配置开发环境和打包环境了。</font>

## <font style="color:rgb(51, 51, 51);">webpack开发环境配置</font>
1. **webpack-dev-srever**

<font style="color:rgb(51, 51, 51);">开发环境配置代码在</font>**<font style="color:rgb(51, 51, 51);">webpack.dev.js</font>**<font style="color:rgb(51, 51, 51);">中,需要借助 </font>[**webpack-dev-server**](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwebpack-dev-server)<font style="color:rgb(51, 51, 51);">在开发环境启动服务器来辅助开发,还需要依赖</font>[**webpack-merge**](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwebpack-merge)<font style="color:rgb(51, 51, 51);">来合并基本配置,安装依赖:</font>

```javascript
npm i webpack-dev-server webpack-merge -D
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.dev.js</font>**<font style="color:rgb(51, 51, 51);">代码, 合并公共配置，并添加开发模式配置</font>

```javascript
// webpack.dev.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
  mode: 'development', // 开发模式,打包更加快速,省了代码优化步骤
  devtool: 'eval-cheap-module-source-map', // 源码调试模式,后面会讲
  devServer: {
    port: 3000, // 服务端口号
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
    hot: true, // 开启热更新，后面会讲react模块热替换具体配置
    historyApiFallback: true, // 解决history路由404问题
    static: {
      directory: path.join(__dirname, "../public"), //托管静态资源public文件夹
    }
  }
})
```

<font style="color:rgb(51, 51, 51);"></font>

2. **<font style="color:rgb(51, 51, 51);">package.json添加dev脚本</font>**

```javascript
// package.json
"scripts": {
  "dev": "webpack-dev-server -c build/webpack.dev.js"
},
```



<font style="color:rgb(51, 51, 51);">执行</font>**<font style="color:rgb(51, 51, 51);">npm run dev</font>**<font style="color:rgb(51, 51, 51);">,就能看到项目已经启动起来了,访问</font>[http://localhost:3000/](https://link.juejin.cn/?target=http%3A%2F%2Flocalhost%3A3000%2F)<font style="color:rgb(51, 51, 51);">,就可以看到项目界面,具体完善的</font>**<font style="color:rgb(51, 51, 51);">react</font>**<font style="color:rgb(51, 51, 51);">模块热替换在下面会讲到。</font>

## webpack打包环境配置
1. **修改webpack.prod.js代码**

```javascript
// webpack.prod.js

const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')
module.exports = merge(baseConfig, {
  mode: 'production', // 生产模式,会开启tree-shaking和压缩代码,以及其他优化
})
```

****

2. **package.json的script中添加build打包命令**

<font style="color:rgb(51, 51, 51);">在</font>**<font style="color:rgb(51, 51, 51);">package.json</font>**<font style="color:rgb(51, 51, 51);">的</font>**<font style="color:rgb(51, 51, 51);">scripts</font>**<font style="color:rgb(51, 51, 51);">中添加</font>**<font style="color:rgb(51, 51, 51);">build</font>**<font style="color:rgb(51, 51, 51);">打包命令</font>

```javascript
"scripts": {
    "dev": "webpack-dev-server -c build/webpack.dev.js",
    "build": "webpack -c build/webpack.prod.js"
},
```



<font style="color:rgb(51, 51, 51);">执行</font>**<font style="color:rgb(51, 51, 51);">npm run build</font>**<font style="color:rgb(51, 51, 51);">,最终打包在</font>**<font style="color:rgb(51, 51, 51);">dist</font>**<font style="color:rgb(51, 51, 51);">文件中, 打包结果:</font>

```javascript
dist
├── static
|   ├── js
|     ├── main.js
├── index.html
```

3. 浏览器查看打包结果

```javascript
npm i serve -g
```



<font style="color:rgb(51, 51, 51);">然后在项目根目录命令行执行</font>**<font style="color:rgb(51, 51, 51);">serve -s dist</font>**<font style="color:rgb(51, 51, 51);">,就可以启动打包后的项目了。</font>

<font style="color:rgb(51, 51, 51);">到现在一个基础的支持</font>**<font style="color:rgb(51, 51, 51);">react</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">ts</font>**<font style="color:rgb(51, 51, 51);">的</font>**<font style="color:rgb(51, 51, 51);">webpack5</font>**<font style="color:rgb(51, 51, 51);">就配置好了,但只有这些功能是远远不够的,还需要继续添加其他配置。</font>

# <font style="color:rgb(51, 51, 51);">基础功能配置</font>
## 配置环境变量
环境变量的功能有两种：

   1. 区分开发环境和打包环境

   2. 区分项目业务环境，开发/测试/预测/正式环境



区分开发环境和打包环境可以使用**process.env.NODE_ENV**，大多第三方包里面判断都是采用这个环境变量。



<font style="color:rgb(51, 51, 51);">区分项目接口环境可以自定义一个环境变量</font>**<font style="color:rgb(51, 51, 51);">process.env.BASE_ENV</font>**<font style="color:rgb(51, 51, 51);">,设置环境变量可以借助</font>[cross-env](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcross-env)<font style="color:rgb(51, 51, 51);">和</font>[webpack.DefinePlugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.webpackjs.com%2Fplugins%2Fdefine-plugin%2F)（webpack自带插件）<font style="color:rgb(51, 51, 51);">来设置。</font>

+ **<font style="color:rgb(51, 51, 51);">cross-env</font>**<font style="color:rgb(51, 51, 51);">：兼容各系统的设置环境变量的包</font>
+ **<font style="color:rgb(51, 51, 51);">webpack.DefinePlugin</font>**<font style="color:rgb(51, 51, 51);">：</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">内置的插件,可以为业务代码注入环境变量</font>

<font style="color:rgb(51, 51, 51);">
</font>**<font style="color:rgb(51, 51, 51);">安装cross-env</font>**

```javascript
npm i cross-env -D
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">package.json</font>**<font style="color:rgb(51, 51, 51);">的</font>**<font style="color:rgb(51, 51, 51);">scripts</font>**<font style="color:rgb(51, 51, 51);">脚本字段,删除原先的</font>**<font style="color:rgb(51, 51, 51);">dev</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">build</font>**<font style="color:rgb(51, 51, 51);">,改为</font>

```json
"scripts": {
    "dev:dev": "cross-env NODE_ENV=development BASE_ENV=development webpack-dev-server -c build/webpack.dev.js",
    "dev:test": "cross-env NODE_ENV=development BASE_ENV=test webpack-dev-server -c build/webpack.dev.js",
    "dev:pre": "cross-env NODE_ENV=development BASE_ENV=pre webpack-dev-server -c build/webpack.dev.js",
    "dev:prod": "cross-env NODE_ENV=development BASE_ENV=production webpack-dev-server -c build/webpack.dev.js",

    "build:dev": "cross-env NODE_ENV=production BASE_ENV=development webpack -c build/webpack.prod.js",
    "build:test": "cross-env NODE_ENV=production BASE_ENV=test webpack -c build/webpack.prod.js",
    "build:pre": "cross-env NODE_ENV=production BASE_ENV=pre webpack -c build/webpack.prod.js",
    "build:prod": "cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.prod.js",
  },
```

**<font style="color:rgb(51, 51, 51);"></font>**

**<font style="color:rgb(51, 51, 51);">dev</font>**<font style="color:rgb(51, 51, 51);">开头是开发模式,</font>**<font style="color:rgb(51, 51, 51);">build</font>**<font style="color:rgb(51, 51, 51);">开头是打包模式,冒号后面对应的</font>**<font style="color:rgb(51, 51, 51);">dev</font>**<font style="color:rgb(51, 51, 51);">/</font>**<font style="color:rgb(51, 51, 51);">test</font>**<font style="color:rgb(51, 51, 51);">/</font>**<font style="color:rgb(51, 51, 51);">pre</font>**<font style="color:rgb(51, 51, 51);">/</font>**<font style="color:rgb(51, 51, 51);">prod</font>**<font style="color:rgb(51, 51, 51);">是对应的业务环境的</font>**<font style="color:rgb(51, 51, 51);">开发</font>**<font style="color:rgb(51, 51, 51);">/</font>**<font style="color:rgb(51, 51, 51);">测试</font>**<font style="color:rgb(51, 51, 51);">/</font>**<font style="color:rgb(51, 51, 51);">预测</font>**<font style="color:rgb(51, 51, 51);">/</font>**<font style="color:rgb(51, 51, 51);">正式</font>**<font style="color:rgb(51, 51, 51);">环境。</font>

<font style="color:rgb(51, 51, 51);"></font>

**<font style="color:#DF2A3F;">注意：</font>**

**<font style="color:rgb(51, 51, 51);">process.env.NODE_ENV</font>**<font style="color:rgb(51, 51, 51);">环境变量</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">会自动根据设置的</font>**<font style="color:rgb(51, 51, 51);">mode</font>**<font style="color:rgb(51, 51, 51);">字段来给业务代码注入对应的</font>**<font style="color:rgb(51, 51, 51);">development</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">prodction</font>**<font style="color:rgb(51, 51, 51);">。</font>

<font style="color:rgb(51, 51, 51);">这里在命令中再次设置环境变量</font>**<font style="color:rgb(51, 51, 51);">NODE_ENV</font>**<font style="color:rgb(51, 51, 51);">是为了在</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">babel</font>**<font style="color:rgb(51, 51, 51);">的配置文件中访问到。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"> 在</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">中打印一下设置的环境变量</font>

```javascript
// webpack.base.js
// ...

// NODE_ENV区分开发环境或生产环境
console.log("NODE_ENV",process.env.NODE_ENV);
// BASE_ENV 区分业务环境
console.log("Base_ENV",process.env.BASE_ENV);
```

<font style="color:rgb(51, 51, 51);">执行</font>**<font style="color:rgb(51, 51, 51);">npm run build:dev</font>**<font style="color:rgb(51, 51, 51);">,可以看到打印的信息</font>

![](https://cdn.nlark.com/yuque/0/2024/png/42776133/1735116613556-17287e37-43ae-464a-85ac-9e95cf56a8a6.png)

<font style="color:rgb(51, 51, 51);">       </font>

<font style="color:rgb(51, 51, 51);">当前是生产打包环境, 业务环境是开发环境,这里需要把</font>**<font style="color:rgb(51, 51, 51);">process.env.BASE_ENV注入到业务代码里面</font>**<font style="color:rgb(51, 51, 51);">,就可以通过该环境变量设置对应环境的接口地址和其他数据,要借助</font>**<font style="color:rgb(51, 51, 51);">webpack.DefinePlugin</font>**<font style="color:rgb(51, 51, 51);">插件。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**

```javascript
const webpack  = require('webpack');


module.exports={
    // ...
    plugins:[
          //...
        new webpack.DefinePlugin({
            'process.env.BASE_ENV': JSON.stringify(process.env.BASE_ENV)
        })
    ]
}
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"> 配置后</font>**<font style="color:rgb(51, 51, 51);">会把值注入到业务代码里面去</font>**<font style="color:rgb(51, 51, 51);">,</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">解析代码匹配到</font>**<font style="color:rgb(51, 51, 51);">process.env.BASE_ENV</font>**<font style="color:rgb(51, 51, 51);">,就会设置到对应的值。测试一下，在</font>**<font style="color:rgb(51, 51, 51);">src/app.tsx</font>**<font style="color:rgb(51, 51, 51);">打印一下两个环境变量。</font>

```jsx
import React from "react";
const App =()=>{
  //
  console.log(process.env.NODE_ENV);
  // 业务环境
  console.log(process.env.BASE_ENV);

  return <>hello webpack</>
}
export default App;
```



执行npm run dev:test后，控制台打印结果如下图。当前是开发环境，业务环境是测试环境。

![](https://cdn.nlark.com/yuque/0/2024/png/42776133/1735118138087-049f874a-df34-41df-99e2-d8058fc86503.png)

## 处理css和less文件
    webpack只能识别js模块，对于css和less需要借助loader进行转义，让webpack能够识别样式文件。



**安装css-loader和less-loader**

```jsx
npm i style-loader css-loader less-loader -D
```

+ **<font style="color:rgb(51, 51, 51);">style-loader</font>**<font style="color:rgb(51, 51, 51);">: 把解析后的</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">代码从</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">中抽离,放到头部的</font>**<font style="color:rgb(51, 51, 51);">style</font>**<font style="color:rgb(51, 51, 51);">标签中(在运行时做的)</font>
+ **<font style="color:rgb(51, 51, 51);">css-loader:</font>**<font style="color:rgb(51, 51, 51);"> 解析</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">文件代码</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">因为解析</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">的配置开发和打包环境都会用到,所以加在公共配置</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">中。</font>

```jsx
// webpack.base.js
// ...
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /.(css|less)$/, //匹配 css 文件
        use: ['style-loader','css-loader','less-loader']
      }
    ]
  },
  // ...
}
```

<font style="color:rgb(51, 51, 51);">    上面提到过，loader的执行顺序是从右往左的，需要先转义css和less文件因此相关loader放在右边，最后借助style-loader将css插入到头部style标签中。</font>

![](https://cdn.nlark.com/yuque/0/2024/png/42776133/1735179283492-65b3eb52-c634-4164-b4f4-0f4182d98d8f.png)

****

## 处理css3前缀兼容


 **浏览器前缀的作用**

虽然现在主流浏览器对 CSS3 的支持率已经非常高，但为了兼容低版本的浏览器（如老版的 Internet Explorer 或旧版的 Safari/Chrome/Firefox），需要为一些 CSS3 属性添加浏览器的专属前缀。

览器前缀是浏览器厂商为未完全实现或实验性支持的 CSS 属性提供的特殊标识，用来确保这些属性能够正常渲染。常见的浏览器前缀包括：

+ `-webkit-`：适用于 Chrome、Safari 和其他基于 WebKit 的浏览器。
+ `-moz-`：适用于 Firefox。
+ `-ms-`：适用于 Microsoft 浏览器（IE 和 Edge 的早期版本）。
+ `-o-`：适用于 Opera（旧版）。



示例： CSS 属性 `transform` 在某些老版本的浏览器中需要加前缀才能生效

```css
/* 无前缀的标准属性 */
transform: rotate(45deg);

/* 添加浏览器前缀后的代码 */
-webkit-transform: rotate(45deg); /* Chrome、Safari */
-moz-transform: rotate(45deg);    /* Firefox */
-ms-transform: rotate(45deg);     /* IE */
-o-transform: rotate(45deg);      /* Opera */
transform: rotate(45deg);         /* 标准写法 */
```



虽然**css3**现在浏览器支持率已经很高了, 但有时候需要兼容一些低版本浏览器,需要给**css3**加前缀,可以借助插件来自动加前缀, [postcss-loader](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Floaders%2Fpostcss-loader%2F)就是来给**css3**加浏览器前缀的,安装依赖：

```json
npm i postcss-loader autoprefixer -D
```

+ **<font style="color:rgb(51, 51, 51);">postcss-loader</font>**<font style="color:rgb(51, 51, 51);">：处理</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">时自动加前缀</font>
+ **<font style="color:rgb(51, 51, 51);">autoprefixer</font>**<font style="color:rgb(51, 51, 51);">：决定添加哪些浏览器前缀到</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">中</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">, 在解析</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">less</font>**<font style="color:rgb(51, 51, 51);">的规则中添加配置</font>

```jsx
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /.(css|less)$/, //匹配 css和less 文件
        use: [
          'style-loader',
          'css-loader',
          // 新增
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer']
              }
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  // ...
}
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">接下来我们看看效果，首先我添加了transform样式</font>

```css
// src/ndex.css
.container{
     background-color: red;
     transform: translateX(300px);
}
```

然后执行npm run build:test，再运行打包后文件serve -s dist。可以看到，打包后的样式已经添加了浏览器兼容前缀。

![](https://cdn.nlark.com/yuque/0/2024/png/42776133/1735180996407-db77b510-2654-4d74-94e6-7fb749ed3f5a.png)



## babel预设处理js兼容
     现在js新增很多语法来方便开发，但浏览器并不兼容新语法。因此，需要使用**babel**将新的语法转为较低的js语法，让浏览器可以识别。<font style="color:rgb(51, 51, 51);">这里只讲配置,更详细的可以看</font>[Babel 那些事儿](https://juejin.cn/post/6992371845349507108)<font style="color:rgb(51, 51, 51);">。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">安装依赖</font>

```json
npm i babel-loader @babel/core @babel/preset-env core-js -D
```

+ <font style="color:rgb(51, 51, 51);">babel-loader: 使用 </font>**babel**<font style="color:rgb(51, 51, 51);"> 加载最新js代码并将其转换为 </font>**ES5**<font style="color:rgb(51, 51, 51);">（上面已经安装过）</font>
+ <font style="color:rgb(51, 51, 51);">@babel/corer: </font>**babel**<font style="color:rgb(51, 51, 51);"> 编译的核心包</font>
+ <font style="color:rgb(51, 51, 51);">@babel/preset-env: </font>**babel**<font style="color:rgb(51, 51, 51);"> 编译的预设,可以转换目前最新的</font>**js**<font style="color:rgb(51, 51, 51);">标准语法</font>
+ <font style="color:rgb(51, 51, 51);">core-js: 使用低版本</font>**js**<font style="color:rgb(51, 51, 51);">语法模拟高版本的库,也就是垫片（ Polyfill  ）</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack-base.js</font>**

```javascript
// webpack.base.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',
          options: {
            // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
            presets: [
              [
                "@babel/preset-env",
                {
                  // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
                  // "targets": {
                  //  "chrome": 35,
                  //  "ie": 9
                  // },
                  "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
                  "corejs": 3, // 配置使用core-js低版本
                }
              ],
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  }
}
```

<font style="color:rgb(51, 51, 51);">此时再打包就会把语法转换为对应浏览器兼容的语法了。</font>



<font style="color:rgb(51, 51, 51);">为了避免</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">配置文件过于庞大,可以把</font>**<font style="color:rgb(51, 51, 51);">babel-loader</font>**<font style="color:rgb(51, 51, 51);">的配置抽离出来, 新建</font>**<font style="color:rgb(51, 51, 51);">babel.config.js</font>**<font style="color:rgb(51, 51, 51);">文件,使用</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">作为配置文件,是因为可以访问到</font>**<font style="color:rgb(51, 51, 51);">process.env.NODE_ENV</font>**<font style="color:rgb(51, 51, 51);">环境变量来区分是开发还是打包模式。</font>

```javascript
// babel.config.js
module.exports = {
  // 执行顺序由右往左,所以先处理ts,再处理jsx,最后再试一下babel转换为低版本语法
  "presets": [
    [
      "@babel/preset-env",
      {
        // 设置兼容目标浏览器版本,这里可以不写,babel-loader会自动寻找上面配置好的文件.browserslistrc
        // "targets": {
        //  "chrome": 35,
        //  "ie": 9
        // },
        "useBuiltIns": "usage", // 根据配置的浏览器兼容,以及代码中使用到的api进行引入polyfill按需添加
        "corejs": 3 // 配置使用core-js使用的版本
      }
    ],
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

<font style="color:rgb(51, 51, 51);">移除</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">中</font>**<font style="color:rgb(51, 51, 51);">babel-loader</font>**<font style="color:rgb(51, 51, 51);">的</font>**<font style="color:rgb(51, 51, 51);">options</font>**<font style="color:rgb(51, 51, 51);">配置</font>

```javascript
// webpack.base.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        use: 'babel-loader'
      },
      // 如果node_moduels中也有要处理的语法，可以把js|jsx文件配置加上
      // {
      //  test: /.(js|jsx)$/,
      //  use: 'babel-loader'
      // }
      // ...
    ]
  }
}
```

<font style="color:rgb(51, 51, 51);"></font>

## <font style="color:rgb(51, 51, 51);">babel处理js非标准语法（类组件使用）</font>
<font style="color:rgb(51, 51, 51);">现在</font>**<font style="color:rgb(51, 51, 51);">react</font>**<font style="color:rgb(51, 51, 51);">主流开发都是函数组件和</font>**<font style="color:rgb(51, 51, 51);">react-hooks</font>**<font style="color:rgb(51, 51, 51);">,但有时也会用类组件,可以用装饰器简化代码。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">新增</font>**<font style="color:rgb(51, 51, 51);">src/components/Class.tsx</font>**<font style="color:rgb(51, 51, 51);">组件, 在</font>**<font style="color:rgb(51, 51, 51);">App.tsx</font>**<font style="color:rgb(51, 51, 51);">中引入该组件使用。</font>

```javascript
import React, { PureComponent } from "react";

// 装饰器为,组件添加age属性
function addAge(Target: Function) {
  Target.prototype.age = 111
}
// 使用装饰圈
@addAge
class Class extends PureComponent {

  age?: number

  render() {
    return (
      <h2>我是类组件---{this.age}</h2>
    )
  }
}

export default Class
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">需要开启一下</font>**<font style="color:rgb(51, 51, 51);">ts</font>**<font style="color:rgb(51, 51, 51);">装饰器支持,修改</font>**<font style="color:rgb(51, 51, 51);">tsconfig.json</font>**<font style="color:rgb(51, 51, 51);">文件</font>

```javascript
// tsconfig.json
{
  "compilerOptions": {
    // ...
    // 开启装饰器使用
    "experimentalDecorators": true
  }
}
```

<font style="color:rgb(51, 51, 51);">上面Class组件代码中使用了装饰器,目前</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">标准语法是不支持的,现在运行或者打包会报错,不识别装饰器语法,需要借助</font>**<font style="color:rgb(51, 51, 51);">babel-loader</font>**<font style="color:rgb(51, 51, 51);">插件,安装依赖</font>

```javascript
npm i @babel/plugin-proposal-decorators -D
```

<font style="color:rgb(51, 51, 51);">在</font>**<font style="color:rgb(51, 51, 51);">babel.config.js或webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">中添加插件。</font>

```javascript
module.exports = {
  // ...
  "plugins": [
    ["@babel/plugin-proposal-decorators", { "legacy": true }]
  ]
}
```

<font style="color:rgb(51, 51, 51);">现在项目就支持装饰器了。</font>

## <font style="color:rgb(51, 51, 51);">复制public文件夹</font>
public文件夹会放一些静态资源，可以直接根据绝对路径引入。<font style="color:rgb(51, 51, 51);">比如</font>**<font style="color:rgb(51, 51, 51);">图片</font>**<font style="color:rgb(51, 51, 51);">,</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">,</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">文件等,不需要</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">进行解析,只需要打包的时候把</font>**<font style="color:rgb(51, 51, 51);">public</font>**<font style="color:rgb(51, 51, 51);">下内容复制到构建出口文件夹中,可以借助</font>[copy-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcopy-webpack-plugin)<font style="color:rgb(51, 51, 51);">插件,安装依赖。</font>

```javascript
npm i copy-webpack-plugin -D
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">开发环境已经在</font>**<font style="color:rgb(51, 51, 51);">devServer</font>**<font style="color:rgb(51, 51, 51);">中配置了</font>**<font style="color:rgb(51, 51, 51);">static</font>**<font style="color:rgb(51, 51, 51);">托管了</font>**<font style="color:rgb(51, 51, 51);">public</font>**<font style="color:rgb(51, 51, 51);">文件夹,在开发环境使用绝对路径可以访问到</font>**<font style="color:rgb(51, 51, 51);">public</font>**<font style="color:rgb(51, 51, 51);">下的文件,但打包构建时不做处理会访问不到,所以现在需要在打包配置文件</font>**<font style="color:rgb(51, 51, 51);">webpack.prod.js</font>**<font style="color:rgb(51, 51, 51);">中新增</font>**<font style="color:rgb(51, 51, 51);">copy</font>**<font style="color:rgb(51, 51, 51);">插件配置。</font>

```javascript
//webpack.prod.js
// ...
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path')
module.exports =merge(baseConfig,{
     mode:'production',
     plugins:[
          // 复制文件插件
          new CopyPlugin({
               from:path.resolve(__dirname,'../public'), // 复制public文件
               to:path.resolve(__dirname,'../dist'),
               filter:source=>!source.includes('index.html') // 忽略index.html
          })
     ]
})
```

<font style="color:rgb(51, 51, 51);">在上面的配置中,忽略了</font>**<font style="color:rgb(51, 51, 51);">index.html</font>**<font style="color:rgb(51, 51, 51);">,因为</font>**<font style="color:rgb(51, 51, 51);">html-webpack-plugin</font>**<font style="color:rgb(51, 51, 51);">会以</font>**<font style="color:rgb(51, 51, 51);">public</font>**<font style="color:rgb(51, 51, 51);">下的</font>**<font style="color:rgb(51, 51, 51);">index.html</font>**<font style="color:rgb(51, 51, 51);">为模板生成一个</font>**<font style="color:rgb(51, 51, 51);">index.html</font>**<font style="color:rgb(51, 51, 51);">到</font>**<font style="color:rgb(51, 51, 51);">dist</font>**<font style="color:rgb(51, 51, 51);">文件下,所以不需要再复制该文件了。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">执行npm run build查看打包结果</font>

![](https://cdn.nlark.com/yuque/0/2024/png/42776133/1735193460727-f50dc3af-e6c7-458e-859e-91f37e215a5a.png)

可以看到图片已经被复制到打包目录下。

## 处理图片文件
<font style="color:rgb(51, 51, 51);">对于图片文件,</font>**<font style="color:rgb(51, 51, 51);">webpack4</font>**<font style="color:rgb(51, 51, 51);">使用</font>**<font style="color:rgb(51, 51, 51);">file-loader</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">url-loader</font>**<font style="color:rgb(51, 51, 51);">来处理的,但</font>**<font style="color:rgb(51, 51, 51);">webpack5</font>**<font style="color:rgb(51, 51, 51);">不使用这两个</font>**<font style="color:rgb(51, 51, 51);">loader</font>**<font style="color:rgb(51, 51, 51);">了,而是采用自带的</font>[asset-module](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.js.org%2Fguides%2Fasset-modules%2F%23root)<font style="color:rgb(51, 51, 51);">来处理。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">,添加图片解析配置</font>

```javascript
module.exports = {
  module: {
    rules: [
      // ...
      {
        test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{
          filename:'static/images/[name][ext]', // 文件输出目录和命名
        },
      },
    ]
  }
}
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">测试一下，在app.tsx下引入一个图片，ts类型报错，找不到模块。</font>![](https://cdn.nlark.com/yuque/0/2024/png/42776133/1735297733237-7d20c38e-9815-470a-ba85-36959128444e.png)


在src目录下新建global.d.ts文件，添加模块声明后，报错消失。

```typescript
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.less'
declare module '*.css'
```

## 处理字体和媒体文件
<font style="color:rgb(51, 51, 51);">字体文件和媒体文件这两种资源处理方式和处理图片是一样的,只需要把匹配的路径和打包后放置的路径修改一下就可以了。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**<font style="color:rgb(51, 51, 51);">文件：</font>

```javascript
// webpack.base.js
module.exports = {
  module: {
    rules: [
      // ...
      {
        test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体图标文件
        type: "asset", // type选择asset
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024, // 小于10kb转base64位
          }
        },
        generator:{
          filename:'static/fonts/[name][ext]', // 文件输出目录和命名
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
          filename:'static/media/[name][ext]', // 文件输出目录和命名
        },
      },
    ]
  }
}
```

# <font style="color:rgb(51, 51, 51);">配置react模块热更新</font>
       在dev环境下，我们已经配置了devServer中配置Hot以支持热更新。<font style="color:rgb(51, 51, 51);">在</font>**<font style="color:rgb(51, 51, 51);">webpack4</font>**<font style="color:rgb(51, 51, 51);">中,还需要在插件中添加了</font>**<font style="color:rgb(51, 51, 51);">HotModuleReplacementPlugin</font>**<font style="color:rgb(51, 51, 51);">,在</font>**<font style="color:rgb(51, 51, 51);">webpack5</font>**<font style="color:rgb(51, 51, 51);">中,只要</font>**<font style="color:rgb(51, 51, 51);">devServer.hot</font>**<font style="color:rgb(51, 51, 51);">为</font>**<font style="color:rgb(51, 51, 51);">true</font>**<font style="color:rgb(51, 51, 51);">了,该插件就已经内置了。</font>

<font style="color:rgb(51, 51, 51);">     </font>

<font style="color:rgb(51, 51, 51);">     现在开发模式下修改</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">less</font>**<font style="color:rgb(51, 51, 51);">文件，页面样式可以在不刷新浏览器的情况实时生效，因为此时样式都在</font>**<font style="color:rgb(51, 51, 51);">style</font>**<font style="color:rgb(51, 51, 51);">标签里面，</font>**<font style="color:rgb(51, 51, 51);">style-loader</font>**<font style="color:rgb(51, 51, 51);">做了替换样式的热替换功能。</font>

<font style="color:rgb(51, 51, 51);">     但是修改</font>**<font style="color:rgb(51, 51, 51);">App.tsx</font>**<font style="color:rgb(51, 51, 51);">,浏览器会</font>**<font style="color:rgb(51, 51, 51);">自动刷新</font>**<font style="color:rgb(51, 51, 51);">后再显示修改后的内容,但我们想要的不是刷新浏览器,而是在不需要刷新浏览器的前提下模块热更新,并且能够保留</font>**<font style="color:rgb(51, 51, 51);">react</font>**<font style="color:rgb(51, 51, 51);">组件的状态。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">可以借助</font>[@pmmmwh/react-refresh-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2F%40pmmmwh%2Freact-refresh-webpack-plugin)<font style="color:rgb(51, 51, 51);">插件来实现,该插件又依赖于</font>[react-refresh](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Freact-refresh)<font style="color:rgb(51, 51, 51);">, 安装依赖：</font>

```javascript
npm i @pmmmwh/react-refresh-webpack-plugin react-refresh -D
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">配置react热更新插件，修改webpack.dev.js</font>

```javascript
// webpack.dev.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(baseConfig, {
  // ...
  plugins: [
    new ReactRefreshWebpackPlugin(), // 添加热更新插件
  ]
})
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">为</font>**<font style="color:rgb(51, 51, 51);">babel-loader</font>**<font style="color:rgb(51, 51, 51);">配置</font>**<font style="color:rgb(51, 51, 51);">react-refesh</font>**<font style="color:rgb(51, 51, 51);">刷新插件,修改</font>**<font style="color:rgb(51, 51, 51);">babel.config.js</font>**<font style="color:rgb(51, 51, 51);">文件</font>

```javascript
const isDEV = process.env.NODE_ENV === 'development' // 是否是开发模式
module.exports = {
  // ...
  "plugins": [
    isDEV && require.resolve('react-refresh/babel'), // 如果是开发模式,就启动react热更新插件
    // ...
  ].filter(Boolean) // 过滤空值
}
```

  此时，修改jsx文件代码，热更新生效且不会刷新页面。

# 优化构建速度
     无论是开发环境还是打包环境，webpack都需要对代码进行构建，优化构建速度可以提升开发者的体验。

## 构建耗时分析


<font style="color:rgb(51, 51, 51);">当进行优化的时候,肯定要先知道时间都花费在哪些步骤上了,而</font>[speed-measure-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fspeed-measure-webpack-plugin)<font style="color:rgb(51, 51, 51);">插件可以帮我们做到,安装依赖：</font>

```javascript
npm i speed-measure-webpack-plugin -D
```



<font style="color:rgb(51, 51, 51);">使用的时候为了不影响到正常的开发/打包模式,我们选择新建一个配置文件,新增</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">构建分析配置文件</font>**<font style="color:rgb(51, 51, 51);">build/webpack.analy.js</font>**

```javascript
// webpack-analy.js

const proConfig   = require('./webpack.prod.js');
const SpeedMeasurPlugin = require('speed-measure-webpack-plugin');
const { merge } = require('webpack-merge');
const smp = new SpeedMeasurPlugin();


// 使用smp.wrap方法，把生产环境配置传进去，后于后面可能要加分析配置，先留出空位
module.exports =smp.wrap(merge(proConfig,{

}));
```



<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">package.json</font>**<font style="color:rgb(51, 51, 51);">添加启动</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">打包分析脚本命令,在</font>**<font style="color:rgb(51, 51, 51);">scripts</font>**<font style="color:rgb(51, 51, 51);">新增：</font>

```json
{
  // ...
  "scripts": {
    // ...
    "build:analy": "cross-env NODE_ENV=production BASE_ENV=production webpack -c build/webpack.analy.js"
  }
  // ...
}
```



<font style="color:rgb(51, 51, 51);">执行</font>**<font style="color:rgb(51, 51, 51);">npm run build:analy</font>**<font style="color:rgb(51, 51, 51);">命令</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1735819370076-e95af1d6-66f3-4a6b-966a-baf3050a06e4.png)

<font style="color:rgb(51, 51, 51);">可以在图中看到各</font>**<font style="color:rgb(51, 51, 51);">plugin</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">loader</font>**<font style="color:rgb(51, 51, 51);">的耗时时间,现在因为项目内容比较少,所以耗时都比较少,在真正的项目中可以通过这个来分析打包时间花费在什么地方,然后来针对性的优化。</font>

## <font style="color:rgb(51, 51, 51);">开启持久化缓存</font>
<font style="color:#DF2A3F;">在</font>**<font style="color:#DF2A3F;">webpack5</font>**<font style="color:#DF2A3F;">之前做缓存是使用</font>**<font style="color:#DF2A3F;">babel-loader</font>**<font style="color:#DF2A3F;">缓存解决</font>**<font style="color:#DF2A3F;">js</font>**<font style="color:#DF2A3F;">的解析结果,</font>**<font style="color:#DF2A3F;">cache-loader</font>**<font style="color:#DF2A3F;">缓存</font>**<font style="color:#DF2A3F;">css</font>**<font style="color:#DF2A3F;">等资源的解析结果,还有模块缓存插件</font>**<font style="color:#DF2A3F;">hard-source-webpack-plugin</font>**<font style="color:#DF2A3F;">,配置好缓存后第二次打包,通过对文件做哈希对比来验证文件前后是否一致,如果一致则采用上一次的缓存,可以极大地节省时间。</font>



**webpack5** 较于 **webpack4**,新增了持久化缓存、改进缓存算法等优化,通过配置 [webpack 持久化缓存](https://link.juejin.cn?target=https%253A%252F%252Fwebpack.docschina.org%252Fconfiguration%252Fcache%252F%2523root),来缓存生成的 **webpack** 模块和 **chunk**,改善下一次打包的构建速度,可提速 **90%** 左右,配置也简单，修改**webpack.base.js**

```javascript
// webpack.base.js
// ...
module.exports = {
  // ...
  cache: {
    type: 'filesystem', // 使用文件缓存
  },
}
```

****

| 模式 | 第一次耗时 | 第二次耗时 |
| --- | --- | --- |
| 开发环境（dev） | 2573 | 376 |
| 生产环境（build） | 4492 | 512 |




缓存目录在nod_module的cache目录下，区分了开发环境和生产环境

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1735820913476-81b0fe7e-7dd7-4464-8c5c-83e2eb6ddd66.png)

## <font style="color:rgb(51, 51, 51);">开启多线程loader</font>
**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">的</font>**<font style="color:rgb(51, 51, 51);">loader</font>**<font style="color:rgb(51, 51, 51);">默认在单线程执行,现代电脑一般都有多核</font>**<font style="color:rgb(51, 51, 51);">cpu</font>**<font style="color:rgb(51, 51, 51);">,可以借助多核</font>**<font style="color:rgb(51, 51, 51);">cpu</font>**<font style="color:rgb(51, 51, 51);">开启多线程</font>**<font style="color:rgb(51, 51, 51);">loader</font>**<font style="color:rgb(51, 51, 51);">解析,可以极大地提升</font>**<font style="color:rgb(51, 51, 51);">loader</font>**<font style="color:rgb(51, 51, 51);">解析的速度,</font>[thread-loader](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Floaders%2Fthread-loader%2F%23root)<font style="color:rgb(51, 51, 51);">就是用来开启多进程解析</font>**<font style="color:rgb(51, 51, 51);">loader</font>**<font style="color:rgb(51, 51, 51);">的,安装依赖</font>

```javascript
npm i thread-loader -D
```

<font style="color:rgb(51, 51, 51);"></font>

**<font style="color:rgb(43, 58, 66);">使用时，需将此 loader 放置在其他 loader 之前。放置在此 loader 之后的 loader 会在一个独立的 worker 池中运行。</font>**

<font style="color:rgb(43, 58, 66);">在 worker 池中运行的 loader 是受到限制的。例如：</font>

+ <font style="color:rgb(43, 58, 66);">这些 loader 不能生成新的文件。</font>
+ <font style="color:rgb(43, 58, 66);">这些 loader 不能使用自定义的 loader API（也就是说，不能通过插件来自定义）。</font>
+ <font style="color:rgb(43, 58, 66);">这些 loader 无法获取 webpack 的配置。</font>

<font style="color:rgb(43, 58, 66);">每个 worker 都是一个独立的 node.js 进程，其开销大约为</font>**<font style="color:rgb(43, 58, 66);"> 600ms </font>**<font style="color:rgb(43, 58, 66);">左右。同时会</font>**<font style="color:rgb(43, 58, 66);">限制跨进程的数据交换。</font>**

**<font style="color:rgb(43, 58, 66);"></font>**

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**

```javascript
// webpack.base.js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        use: ['thread-loader', 'babel-loader']
      }
    ]
  }
}
```

**<font style="color:rgb(51, 51, 51);"></font>**

<font style="color:rgb(51, 51, 51);">由于</font>**<font style="color:rgb(51, 51, 51);">thread-loader</font>**<font style="color:rgb(51, 51, 51);">不支持抽离css插件</font>**<font style="color:rgb(51, 51, 51);">MiniCssExtractPlugin.loader</font>**<font style="color:rgb(51, 51, 51);">(下面会讲),所以这里只配置了多进程解析</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">,开启多线程也是需要启动时间,大约</font>**<font style="color:rgb(51, 51, 51);">600ms</font>**<font style="color:rgb(51, 51, 51);">左右,所以适合规模比较大的项目。</font>

## <font style="color:rgb(43, 58, 66);">配置alias别名</font>
   webpack支持设置别名,设置别名可以让后续引用减少路径复杂度

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**

```javascript
module.export = {
  // ...
   resolve: {
    // ...
    alias: {
      '@': path.join(__dirname, '../src')
    }
  }
}
```

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">tsconfig.json</font>**<font style="color:rgb(51, 51, 51);">,添加</font>**<font style="color:rgb(51, 51, 51);">baseUrl</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">paths，</font>**<font style="color:rgb(51, 51, 51);">让IDE自动提示生效</font>

```javascript
{
  "compilerOptions": {
    // ...
    "baseUrl": "./",//项目根目录作为基准
    "paths": {
      "@/*": [
        "src/*"   //将@映射到src目录
      ]
    }
  }
}
```

<font style="color:rgb(51, 51, 51);">配置修改完成后,在项目中使用 </font>**<font style="color:rgb(51, 51, 51);">@/xxx.xx</font>**<font style="color:rgb(51, 51, 51);">,就会指向项目中</font>**<font style="color:rgb(51, 51, 51);">src/xxx.xx,在js/ts</font>**<font style="color:rgb(51, 51, 51);">文件和</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">文件中都可以用。</font>

## <font style="color:rgb(51, 51, 51);">缩小loader作用范围</font>
     一般来说，第三方库库都是处理好的，不需要再次使用loader去解析。可以按实际情况去配置loader的作用范围，来减少不必要的loader解析，通过使用**include**和**exclude**两个配置项，可以实现这个功能。

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**

```javascript
// webpack.base.js
const path = require('path')
module.exports = {
  // ...
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, '../src')], 只对项目src文件的ts,tsx进行loader解析
        test: /.(ts|tsx)$/,
        use: ['thread-loader', 'babel-loader']
      }
    ]
  }
}
```

<font style="color:rgb(51, 51, 51);">其他</font>**<font style="color:rgb(51, 51, 51);">loader</font>**<font style="color:rgb(51, 51, 51);">也是相同的配置方式,如果除</font>**<font style="color:rgb(51, 51, 51);">src</font>**<font style="color:rgb(51, 51, 51);">文件外也还有需要解析的,就把对应的目录地址加上就可以了,比如需要引入</font>**<font style="color:rgb(51, 51, 51);">antd</font>**<font style="color:rgb(51, 51, 51);">的</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">,可以把</font>**<font style="color:rgb(51, 51, 51);">antd</font>**<font style="color:rgb(51, 51, 51);">的文件目录路径添加解析</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">规则到</font>**<font style="color:rgb(51, 51, 51);">include</font>**<font style="color:rgb(51, 51, 51);">里面。</font>

## <font style="color:rgb(51, 51, 51);">精确使用loader</font>
**loader**在**webpack**构建过程中使用的位置是在**webpack**构建模块依赖关系引入新文件时，会根据文件后缀来**倒序**遍历**rules**数组，如果文件后缀和**test**正则匹配到了，就会使用该**rule**中配置的**loader**依次对文件源代码进行处理，最终拿到处理后的**sourceCode**结果，可以通过避免使用无用的**loader**解析来提升构建速度，比如使用**less-loader**解析**css**文件。



<font style="color:rgb(51, 51, 51);">可以拆分上面配置的</font>**<font style="color:rgb(51, 51, 51);">less</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">, 避免让</font>**<font style="color:rgb(51, 51, 51);">less-loader</font>**<font style="color:rgb(51, 51, 51);">再去解析</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">文件</font>

```javascript
// webpack.base.js
// ...
module.exports = {
  module: {
    // ...
    rules: [
      // ...
      {
        test: /.\css$/, //匹配所有的 css 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /.\less$/, //匹配所有的 less 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
    ]
  }
}
```

**<font style="color:rgb(51, 51, 51);">ts</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">tsx</font>**<font style="color:rgb(51, 51, 51);">也是如此，</font>**<font style="color:rgb(51, 51, 51);">ts</font>**<font style="color:rgb(51, 51, 51);">里面是不能写</font>**<font style="color:rgb(51, 51, 51);">jsx</font>**<font style="color:rgb(51, 51, 51);">语法的，所以可以尽可能避免使用 </font>**<font style="color:rgb(51, 51, 51);">@babel/preset-react</font>**<font style="color:rgb(51, 51, 51);">对 </font>**<font style="color:rgb(51, 51, 51);">.ts</font>**<font style="color:rgb(51, 51, 51);"> 文件语法做处理。</font>

## <font style="color:rgb(51, 51, 51);">缩小模块搜索范围</font>
**<font style="color:rgb(51, 51, 51);">node</font>**<font style="color:rgb(51, 51, 51);">里面模块有三种</font>

+ **<font style="color:rgb(51, 51, 51);">node</font>**<font style="color:rgb(51, 51, 51);">核心模块</font>
+ **<font style="color:rgb(51, 51, 51);">node_modules</font>**<font style="color:rgb(51, 51, 51);">模块</font>
+ <font style="color:rgb(51, 51, 51);">自定义文件模块</font>

使用**require**和**import**引入模块时如果有准确的相对或者绝对路径,就会去按路径查询,如果引入的模块没有路径,会优先查询**node**核心模块,如果没有找到会去当前目录下**node_modules**中寻找,如果没有找到会查从父级文件夹查找**node_modules**,一直查到系统**node**全局模块。

<font style="color:rgb(51, 51, 51);"></font>

这样会有两个问题,一个是当前项目没有安装某个依赖,但是上一级目录下**node_modules**或者全局模块有安装,就也会引入成功,但是部署到服务器时可能就会找不到造成报错,另一个问题就是一级一级查询比较消耗时间。可以告诉**webpack**搜索目录范围,来规避这两个问题。

<font style="color:rgb(51, 51, 51);">
</font><font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.base.js</font>**

```javascript
// webpack.base.js
const path = require('path')
module.exports = {
  // ...
  resolve: {
     // ...
     // 如果用的是pnpm 就暂时不要配置这个，会有幽灵依赖的问题，访问不到很多模块。
     modules: [path.resolve(__dirname, '../node_modules')], // 查找第三方模块只在本项目的node_modules中查找
  },
}
```

**<font style="color:rgb(51, 51, 51);"></font>**

## <font style="color:rgb(51, 51, 51);">devtool配置sourceMap</font>
开发过程中或者打包后的代码都是**webpack**处理后的代码,如果进行调试肯定希望看到源代码,而不是编译后的代码, [source map](https://link.juejin.cn?target=http%3A%2F%2Fblog.teamtreehouse.com%2Fintroduction-source-maps)就是用来做源码映射的,不同的映射模式会明显影响到构建和重新构建的速度, [devtool](https://link.juejin.cn?target=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Fdevtool%2F)选项就是**webpack**提供的选择源码映射方式的配置。



**<font style="color:rgb(51, 51, 51);">devtool</font>**<font style="color:rgb(51, 51, 51);">的命名规则为 </font>**<font style="color:rgb(51, 51, 51);">^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$</font>**

**<font style="color:rgb(51, 51, 51);"></font>**

| 关键字 | 描述 |
| --- | --- |
| inline | <font style="color:rgb(51, 51, 51);">代码内通过 dataUrl 形式引入 SourceMap</font> |
| hidden | <font style="color:rgb(51, 51, 51);">生成 SourceMap 文件,但不使用</font> |
| eval | `<font style="color:rgb(255, 80, 44);">eval(...)</font>`<font style="color:rgb(51, 51, 51);">形式执行代码,通过 dataUrl 形式引入 SourceMap</font> |
| nosources | <font style="color:rgb(51, 51, 51);background-color:rgb(248, 248, 248);">不生成 SourceMap</font> |
| cheap | <font style="color:rgb(51, 51, 51);">只需要定位到行信息,不需要列信息</font> |
| module | <font style="color:rgb(51, 51, 51);">展示源代码中的错误位置</font> |


开发环境推荐：**eval-cheap-module-source-map**

+ 本地开发首次打包慢点没关系,因为 **eval** 缓存的原因, 热更新会很快
+ 开发中,我们每行代码不会写的太长,只需要定位到行就行,所以加上 **cheap**
+ 我们希望能够找到源代码的错误,而不是打包后的,所以需要加上 **module**

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.dev.js</font>**

```javascript
// webpack.dev.js
module.exports = {
  // ...
  devtool: 'eval-cheap-module-source-map'
}
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">打包环境推荐：</font>**<font style="color:rgb(51, 51, 51);">none</font>**<font style="color:rgb(51, 51, 51);">(就是不配置</font>**<font style="color:rgb(51, 51, 51);">devtool</font>**<font style="color:rgb(51, 51, 51);">选项了，不是配置</font>**<font style="color:rgb(51, 51, 51);">devtool</font>**<font style="color:rgb(51, 51, 51);">: '</font>**<font style="color:rgb(51, 51, 51);">none</font>**<font style="color:rgb(51, 51, 51);">')</font>

```javascript
// webpack.prod.js
module.exports = {
  // ...
  // devtool: '', // 不用配置devtool此项
}
```

+ **<font style="color:rgb(51, 51, 51);">none</font>**<font style="color:rgb(51, 51, 51);">话调试只能看到编译后的代码,也不会泄露源代码,打包速度也会比较快。</font>
+ <font style="color:rgb(51, 51, 51);">只是不方便线上排查问题, 但一般都可以根据报错信息在本地环境很快找出问题所在。</font>

# 优化构建结果文件
### webpack包分析工具
  [webpack-bundle-analyzer](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwebpack-bundle-analyzer)<font style="color:rgb(51, 51, 51);">是分析</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">打包后文件的插件,使用交互式可缩放树形图可视化 </font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);"> 输出文件的大小。通过该插件可以对打包后的文件进行观察和分析,可以方便我们对不完美的地方针对性的优化,安装依赖：</font>

```javascript
npm install webpack-bundle-analyzer -D
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改webpack.analy.js文件</font>

```javascript
// webpack.analy.js
const prodConfig = require('./webpack.prod.js')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const { merge } = require('webpack-merge')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer') // 引入分析打包结果插件
module.exports = smp.wrap(merge(prodConfig, {
  plugins: [
    new BundleAnalyzerPlugin() // 配置分析打包结果插件
  ]
}))
```

<font style="color:rgb(51, 51, 51);">配置好之后执行npm run build:analy命令，打包完成后浏览器会自动打开窗口，可以看到打包文件的分析结果以及各个文件所占的尺寸。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736151500558-2e07a471-9604-474f-8c7f-8f95873d9e33.png)

### 抽取css样式文件
    <font style="color:rgb(51, 51, 51);">在开发环境我们希望</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">嵌入在</font>**<font style="color:rgb(51, 51, 51);">style</font>**<font style="color:rgb(51, 51, 51);">标签里面,方便样式热替换,但打包时我们希望把</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">单独抽离出来,方便配置缓存策略。而插件</font>[mini-css-extract-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fwebpack-contrib%2Fmini-css-extract-plugin)<font style="color:rgb(51, 51, 51);">就是来帮我们做这件事的,安装依赖：</font>

```javascript
npm i mini-css-extract-plugin -D
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改webapck.base.js,根据环境变量设置开发环境使用style-loader，打包环境抽离css文件。</font>

```javascript
// webpack.base.js
// ...
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDev = process.env.NODE_ENV === 'development' // 是否是开发模式
module.exports = {
  // ...
  module: {
    rules: [
      // ...
      {
        test: /.css$/, //匹配所有的 css 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /.less$/, //匹配所有的 less 文件
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境使用style-looader,打包模式抽离css
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
    ]
  },
  // ...
}

```

修改webapck.prod.js,打包时添加抽离css插件，指定输出目录。

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports =merge(baseConfig,{
     mode:'production',
     plugins:[
         // ...
         // 抽离CSS插件
         new MiniCssExtractPlugin({
          filename:'static/css/[name].css'
         })
       // ...
     ]
})
```



**<font style="color:rgb(51, 51, 51);">配置完成后,在开发模式css会嵌入到style标签里面,方便样式热替换</font>**<font style="color:rgb(51, 51, 51);">,打包时会把</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">抽离成单独的</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">文件。</font>执行npm run build:test ,可以看到在打包环境下。dist目录中抽离出了单独的css文件。

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736154293541-ce1ee6c7-8899-4fa0-b145-d3cb2ec88628.png)

### 压缩css文件
<font style="color:rgb(51, 51, 51);">上面配置了打包时把</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">抽离为单独</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">文件的配置,打开打包后的文件查看,可以看到默认</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">是没有压缩的,需要手动配置一下压缩</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">的插件。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">可以借助</font>[css-minimizer-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcss-minimizer-webpack-plugin)<font style="color:rgb(51, 51, 51);">来压缩css,安装依赖</font>

```javascript
npm i css-minimizer-webpack-plugin -D
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.prod.js</font>**<font style="color:rgb(51, 51, 51);">文件， 需要在优化项</font>[optimization](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Foptimization%2F)<font style="color:rgb(51, 51, 51);">下的</font>[minimizer](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.js.org%2Fconfiguration%2Foptimization%2F%23optimizationminimizer)<font style="color:rgb(51, 51, 51);">属性中配置</font>

```javascript
// webpack.prod.js
// ...
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = {
  // ...
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
    ],
  },
}
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">再次执行打包就可以看到</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">已经被压缩了。</font>

### 压缩js文件
设置**mode**为**production**时,**webpack**会使用**内置**插件[terser-webpack-plugin](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fterser-webpack-plugin)压缩**js**文件,该插件**默认支持多线程压缩**,但是上面配置**optimization.minimizer**压缩**css**后,**js**压缩就失效了,需要手动再添加一下,**webpack**内部安装了该插件,由于**pnpm**解决了幽灵依赖问题,如果用的**pnpm**的话,需要手动再安装一下依赖。



```javascript
npm i terser-webpack-plugin -D
```

+ <font style="color:rgb(17, 17, 17);">terserOptions：提供删除log，debug代码的能力</font>
+ <font style="color:rgb(17, 17, 17);">parallel：开启多线程压缩</font>



<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.prod.js</font>**<font style="color:rgb(51, 51, 51);">文件</font>

```javascript
// ...
const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  // ...
  optimization: {
    minimizer: [
      // ...
      new TerserPlugin({ // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            drop_console:true,//删除打印
            drop_debugger:true,// 删除debugger
          }
        }
      }),
    ],
  },
}
```

<font style="color:rgb(51, 51, 51);">配置完成后再打包,</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">和</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">就都可以被压缩了。</font>

### <font style="color:rgb(51, 51, 51);">hash与优化</font>
    <font style="color:rgb(37, 41, 51);">使用 webpack 进行打包，每个资源都可以生成一个带 hash 的路径。浏览器可以利用该 hash 能够做到资源缓存，访问性能提升。</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">打包的</font>**<font style="color:rgb(51, 51, 51);">hash</font>**<font style="color:rgb(51, 51, 51);">分三种：</font>

+ **hash**：跟整个项目的构建相关,只要项目里有文件更改,整个项目构建的**hash**值都会更改,并且全部文件都共用相同的**hash**值
+ **chunkhash**：不同的入口文件进行依赖文件解析、构建对应的**chunk**,生成对应的哈希值,文件本身修改或者依赖文件修改,**chunkhash**值会变化
+ **contenthash**：每个文件自己单独的 **hash** 值,文件的改动只会影响自身的 **hash** 值



**<font style="color:rgb(51, 51, 51);">hash</font>**<font style="color:rgb(51, 51, 51);">是在输出文件时配置的,格式是</font>**<font style="color:rgb(51, 51, 51);">filename: "[name].[chunkhash:8][ext]"</font>**<font style="color:rgb(51, 51, 51);">,</font>**<font style="color:rgb(51, 51, 51);">[xx]</font>**<font style="color:rgb(51, 51, 51);"> 格式是</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">提供的占位符, </font>**<font style="color:rgb(51, 51, 51);">:8</font>**<font style="color:rgb(51, 51, 51);">是生成</font>**<font style="color:rgb(51, 51, 51);">hash</font>**<font style="color:rgb(51, 51, 51);">的长度。</font>

| <font style="color:rgb(51, 51, 51);">占位符</font> | <font style="color:rgb(51, 51, 51);">解释</font> |
| --- | --- |
| <font style="color:rgb(51, 51, 51);">ext</font> | <font style="color:rgb(51, 51, 51);">文件后缀名</font> |
| <font style="color:rgb(51, 51, 51);">name</font> | <font style="color:rgb(51, 51, 51);">文件名</font> |
| <font style="color:rgb(51, 51, 51);">path</font> | <font style="color:rgb(51, 51, 51);">文件相对路径</font> |
| <font style="color:rgb(51, 51, 51);">folder</font> | <font style="color:rgb(51, 51, 51);">文件所在文件夹</font> |
| <font style="color:rgb(51, 51, 51);">hash</font> | <font style="color:rgb(51, 51, 51);">每次构建生成的唯一 hash 值</font> |
| <font style="color:rgb(51, 51, 51);">chunkhash</font> | <font style="color:rgb(51, 51, 51);">根据 chunk 生成 hash 值</font> |
| <font style="color:rgb(51, 51, 51);">contenthash</font> | <font style="color:rgb(51, 51, 51);">根据文件内容生成hash 值</font> |




<font style="color:rgb(51, 51, 51);">因为</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">我们在生产环境里会把一些公共库和程序入口文件区分开,单独打包构建,采用</font>**<font style="color:rgb(51, 51, 51);">chunkhash</font>**<font style="color:rgb(51, 51, 51);">的方式生成哈希值,那么只要我们不改动公共库的代码,就可以保证其哈希值不会受影响,可以继续使用浏览器缓存,所以</font>**<font style="color:rgb(51, 51, 51);">js</font>**<font style="color:rgb(51, 51, 51);">适合使用</font>**<font style="color:rgb(51, 51, 51);">chunkhash</font>**<font style="color:rgb(51, 51, 51);">。</font>

<font style="color:rgb(51, 51, 51);"></font>

**css**和图片资源媒体资源一般都是单独存在的,可以采用**contenthash**,只有文件本身变化后会生成新**hash**值。

<font style="color:rgb(51, 51, 51);">修改</font>**webpack.base.js**<font style="color:rgb(51, 51, 51);">,把</font>**js**<font style="color:rgb(51, 51, 51);">输出的文件名称格式加上</font>**chunkhash**<font style="color:rgb(51, 51, 51);">,把</font>**css**<font style="color:rgb(51, 51, 51);">和图片媒体资源输出格式加上</font>**contenthash。**

```javascript
// webpack.base.js
// ...
module.exports = {
  // 打包文件出口
  output: {
    filename: 'static/js/[name].[chunkhash:8].js', // // 加上[chunkhash:8]
    // ...
  },
  module: {
    rules: [
      {
        test:/.(png|jpg|jpeg|gif|svg)$/, // 匹配图片文件
        // ...
        generator:{
          filename:'static/images/[name].[contenthash:8][ext]' // 加上[contenthash:8]
        },
      },
      {
        test:/.(woff2?|eot|ttf|otf)$/, // 匹配字体文件
        // ...
        generator:{
          filename:'static/fonts/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
      {
        test:/.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // 匹配媒体文件
        // ...
        generator:{
          filename:'static/media/[name].[contenthash:8][ext]', // 加上[contenthash:8]
        },
      },
    ]
  },
  // ...
}
```

****

<font style="color:rgb(51, 51, 51);">再修改</font>**<font style="color:rgb(51, 51, 51);">webpack.prod.js</font>**<font style="color:rgb(51, 51, 51);">,修改抽离</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">文件名称格式</font>

```javascript
// webpack.prod.js
// ...
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = merge(baseConfig, {
  mode: 'production',
  plugins: [
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css' // 加上[contenthash:8]
    }),
    // ...
  ],
  // ...
})
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">再次打包就可以看到文件后面的</font>**<font style="color:rgb(51, 51, 51);">hash</font>**<font style="color:rgb(51, 51, 51);">了</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736256059427-11f19901-184c-443e-978b-069f5aa14686.png)

### 代码分割第三方包和公共模块
 一般来说，第三方包变化频率比较小，可以单独把**node_modules**中的代码单独打包。当第三方包没有拜年话时，对应的chunkhash也不会变化，可以有效利用浏览器缓存，还有的公共模块也可以提取出来，避免重复打包加大代码体积，webpack提供了代码分割功能，需要我们手动在优化项**optimization**中手动配置代码分割[**splitChunks**](https://webpack.js.org/configuration/optimization/#optimizationsplitchunks)规则。



<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">webpack.prod.js</font>**

```javascript
module.exports = {
  // ...
  optimization: {
    // ...
    splitChunks: { // 分隔代码
      cacheGroups: {
        vendors: { // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1, // 提取优先级为1
        },
        commons: { // 提取页面公共代码
          name: 'commons', // 提取文件命名为commons
          minChunks: 2, // 只要使用两次就提取出来
          chunks: 'initial', // 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
        }
      }
    }
  }
}
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">配置完成后执行打包,可以看到</font>**<font style="color:rgb(51, 51, 51);">node_modules</font>**<font style="color:rgb(51, 51, 51);">里面的模块被抽离到</font>**<font style="color:rgb(51, 51, 51);">verdors.ec725ef1.js</font>**<font style="color:rgb(51, 51, 51);">中,业务代码在</font>**<font style="color:rgb(51, 51, 51);">main.9a6bf38a.js</font>**<font style="color:rgb(51, 51, 51);">中。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736257753549-c225446e-356c-48cf-b83b-ad435a6c2cb2.png)



改动一下**App.tsx**,再次打包,可以看到下图**main.js**的**chunkhash**值变化了,但是**vendors.js**的**chunkhash**还是原先的,这样发版后,浏览器就可以继续使用缓存中的**verdors.ec72b1ec0d.js**,只需要重新请求**main.js**就可以了。

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736258255876-176cc2a8-811e-4edd-92f4-1c12ab220a1d.png)

### tree-shaking清理未引用js
    tree-shaking最早在rollup打包工具中出现，它可以移除未使用的js代码，主要原理是ESModlue。<font style="color:rgb(51, 51, 51);">模式</font>**<font style="color:rgb(51, 51, 51);">mode</font>**<font style="color:rgb(51, 51, 51);">为</font>**<font style="color:rgb(51, 51, 51);">production</font>**<font style="color:rgb(51, 51, 51);">时就会</font><font style="color:#000000;">默认开启</font>**<font style="color:rgb(51, 51, 51);">tree-shaking</font>**<font style="color:rgb(51, 51, 51);">功能以此来标记未引入代码然后移除掉,测试一下。</font>

### <font style="color:rgb(51, 51, 51);">tree-shaking清理未使用CSS</font>
     使用[purgecss-webpack-plugin](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fpurgecss-webpack-plugin)插件打包的时候移除未使用到的**css**样式,这个插件是和[mini-css-extract-plugin](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fmini-css-extract-plugin)插件配合使用的,在上面已经安装过,还需要[glob-all](https://link.juejin.cn?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fglob-all)来选择要检测哪些文件里面的类名和**id**还有标签名称, 安装依赖:

```javascript
npm i purgecss-webpack-plugin@4 glob-all -D
```

注：

+ <font style="color:rgb(51, 51, 51);background-color:rgb(255, 249, 249);">本文版本是4版本最新的5版本导入方式需要改为 const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')</font>

<font style="color:rgb(51, 51, 51);background-color:rgb(255, 249, 249);"></font>

修改webapck.prod.js

```javascript
// webpack.prod.js
// ...
const globAll = require('glob-all')
const PurgeCSSPlugin = require('purgecss-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  // ...
  plugins: [
    // 抽离css插件
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    // 清理无用css
    new PurgeCSSPlugin({
      // 检测src下所有tsx文件和public下index.html中使用的类名和id和标签名称
      // 只打包这些文件中用到的样式
      paths: globAll.sync([
        `${path.join(__dirname, '../src')}/**/*.tsx`,
        path.join(__dirname, '../public/index.html')
      ]),
    }),
  ]
}
```

配置完成，当项目中有未使用的样式时，在webapck打包时就会清除未使用的css样式。

### 资源懒加载
   像spa单页面应用默认会将代码打包在一个js文件中，虽然使用代码分割可以把**node_modules**模块和**公共模块分离，**但**页面初始加载还是会把整个项目的代码下载下来**，其实只需要公共资源和当前页面资源就可以了，其他资源可以等使用到的时候再加载，可以有效提升**首屏加载速度。**



    webpack默认支持资源懒加载，只需要引入的资源使用**动态import语法**引入资源，**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">打包的时候就会自动打包为单独的资源文件,等使用到的时候动态加载。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">在component目录下新建LazyDemo组件，然后使用react提供的懒加载组件功能和动态import。</font>

+ <font style="color:rgb(51, 51, 51);">懒加载技术在react中一般放在路由对应的组件中，并结合Suspense组件。</font>

<font style="color:rgb(51, 51, 51);"></font>

**<font style="color:rgb(51, 51, 51);">lazyDemo.tsx</font>**

```jsx
import React from "react";

interface LazyDemoProps{

}
const LazyDemo:React.FC<LazyDemoProps> =()=>{
  return <>懒加载</>
  };
  export default LazyDemo;
```

**<font style="color:rgb(51, 51, 51);">App.tsx</font>**

```jsx
import React, { lazy, useState } from "react";
import '@/index.css';
const LazyDemo = lazy(()=>import('./component/lazyDemo'));

const App =()=>{
  const [showLazy,setShowLazy] = useState(false);


  return <div className="container">
    <button onClick={()=>{
    setShowLazy((pre)=>!pre)
  }}>展示懒加载组件</button>
    {
      showLazy&&<LazyDemo/>
    }
  </div>
}
export default App;
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">点击按钮之后,才会动态加载</font>**<font style="color:rgb(51, 51, 51);">LazyDemo</font>**<font style="color:rgb(51, 51, 51);">组件的资源。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736307296038-e0914447-dfee-431d-854e-8bdc4b010013.png)

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"></font>

### 资源预加载
      资源懒加载，虽然提升了首屏渲染速度，但是加载到资源是会有一个请求资源的延时，如果资源比较大会出现延迟卡顿的现象，可以借助**link标签**的rel属性**prefetch和preload**做预加载，link标签除了加载css之外也可以加载js资源，设置rel属性可以规定link提前加载资源，但是加载资源后不阻塞渲染线程，等用到了再执行。



**<font style="color:rgb(51, 51, 51);">rel的属性值</font>**

+ **<font style="color:rgb(51, 51, 51);">preload</font>**<font style="color:rgb(51, 51, 51);">是告诉浏览器页面必定需要的资源,浏览器一定会加载这些资源。</font>
+ **<font style="color:rgb(51, 51, 51);">prefetch</font>**<font style="color:rgb(51, 51, 51);">是告诉浏览器页面可能需要的资源,浏览器不一定会加载这些资源,会在空闲时加载。</font>

**<font style="color:rgb(51, 51, 51);">webpack v4.6.0+</font>**<font style="color:rgb(51, 51, 51);"> 增加了对</font>[预获取和预加载](https://link.juejin.cn/?target=https%3A%2F%2Fwebpack.docschina.org%2Fguides%2Fcode-splitting%2F%23prefetchingpreloading-modules)<font style="color:rgb(51, 51, 51);">的支持,使用方式也比较简单,在</font>**<font style="color:rgb(51, 51, 51);">import</font>**<font style="color:rgb(51, 51, 51);">引入动态资源时使用</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">的魔法注释</font>

```jsx
// 单个目标
import(
  /* webpackChunkName: "my-chunk-name" */ // 资源打包后的文件chunkname
  /* webpackPrefetch: true */ // 开启prefetch预获取
  /* webpackPreload: true */ // 开启preload预获取
  './module'
);
```



**修改App.tsx**

```jsx
import React, { lazy, useState } from "react";
import '@/index.css';
const LazyDemo = lazy(()=>import(
  /* webpackChunkName: "LazyDemo" */
  /*webpackPrefetch: true*/
  './component/lazyDemo'
  ));

const App =()=>{
  const [showLazy,setShowLazy] = useState(false);


  return <div className="container">
    <button onClick={()=>{
    setShowLazy((pre)=>!pre)
  }}>展示懒加载组件</button>
    {
      showLazy&&<LazyDemo/>
    }
  </div>
}
export default App;
```





![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736314274049-4398dea9-da12-4b33-8552-c21363aa211a.png)

可以看到，LazyDemo代码在它**还未在页面渲染时浏览器就提前获取该资源**了。也就是预加载了这个组件的资源，**避免了需要用到该组件时再获取资源的等待时间过长**。



### 打包生成gzip文件
     之前的配置中，我们在**开发环境**下设置了**devServer.compress(默认值为true)**, 这个属性用于控制是否开启gzip压缩，但是开发环境中我们希望提升热更新的速度，而开启压缩必然带来了时间开销，所以我们设置为了false。

```javascript
// webpack.dev.js
const path = require('path')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.js')

// 合并公共配置,并添加开发环境配置
module.exports = merge(baseConfig, {
  //...
  devServer: {
    port: 3000, // 服务端口号
    compress: false, // gzip压缩,开发环境不开启,提升热更新速度
  },
  // ...
})
```

     而**打包环境**下是需要gzip压缩的，资源所占体积越小，响应就越快，页面加载速度就会越快，有助于提升用户体验。<font style="color:rgb(51, 51, 51);">现在大部分浏览器和服务器都支持</font>**<font style="color:rgb(51, 51, 51);">gzip</font>**<font style="color:rgb(51, 51, 51);">,可以有效减少静态资源文件大小,压缩率在 </font>**<font style="color:rgb(51, 51, 51);">70%</font>**<font style="color:rgb(51, 51, 51);"> 左右。</font>

<font style="color:rgb(51, 51, 51);"></font>

**     nginx**可以配置**gzip: on**来开启压缩,但是只在**nginx**层面开启,会在每次请求资源时都对资源进行压缩,压缩文件会需要时间和占用服务器**cpu**资源，更好的方式是前端在打包的时候直接生成**gzip**资源,服务器接收到请求,可以直接把对应压缩好的**gzip**文件返回给浏览器,节省时间和**cpu**。

<font style="color:rgb(51, 51, 51);">
</font>**<font style="color:rgb(51, 51, 51);">webpack</font>**<font style="color:rgb(51, 51, 51);">可以借助</font>[compression-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fcompression-webpack-plugin)<font style="color:rgb(51, 51, 51);"> 插件在打包时生成 </font>**<font style="color:rgb(51, 51, 51);">gzip</font>**<font style="color:rgb(51, 51, 51);"> 文章,安装依赖</font>

```javascript
npm i compression-webpack-plugin -D
```



<font style="color:rgb(51, 51, 51);">添加配置,修改</font>**<font style="color:rgb(51, 51, 51);">webpack.prod.js</font>**

```javascript
const CompressionPlugin  = require('compression-webpack-plugin')
module.exports = {
  // ...
  plugins: [
     // ...
     new CompressionPlugin({
      test: /.(js|css)$/, // 只生成css,js压缩文件
      filename: '[path][base].gz', // 文件命名
      algorithm: 'gzip', // 压缩格式,默认是gzip
      test: /.(js|css)$/, // 只生成css,js压缩文件
      threshold: 10240, // 只有大小大于该值的资源会被处理。默认值是 10k
      minRatio: 0.8 // 压缩率,默认值是 0.8
    })
  ]
}
```

**<font style="color:rgb(51, 51, 51);"></font>**

<font style="color:rgb(51, 51, 51);">配置完成后再打包,可以看到打包后js的目录下多了一个 </font>**<font style="color:rgb(51, 51, 51);">.gz</font>**<font style="color:rgb(51, 51, 51);"> 结尾的文件</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736316329570-c9c9df36-8e32-46ce-acb7-73a352e03600.png)



<font style="color:rgb(51, 51, 51);">因为只有</font>**<font style="color:rgb(51, 51, 51);">verdors.js</font>**<font style="color:rgb(51, 51, 51);">的大小超过了</font>**<font style="color:rgb(51, 51, 51);">10k</font>**<font style="color:rgb(51, 51, 51);">, 所以只有它生成了</font>**<font style="color:rgb(51, 51, 51);">gzip</font>**<font style="color:rgb(51, 51, 51);">压缩文件,借助</font>**<font style="color:rgb(51, 51, 51);">serve -s dist</font>**<font style="color:rgb(51, 51, 51);">启动</font>**<font style="color:rgb(51, 51, 51);">dist</font>**<font style="color:rgb(51, 51, 51);">,查看</font>**<font style="color:rgb(51, 51, 51);">verdors.js</font>**<font style="color:rgb(51, 51, 51);">加载情况。</font>

![](https://cdn.nlark.com/yuque/0/2025/webp/42776133/1736316548408-14b8f101-db36-4462-b068-fd0742398912.webp)

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">可以看到</font>**<font style="color:rgb(51, 51, 51);">verdors.js</font>**<font style="color:rgb(51, 51, 51);">的原始大小是</font>**<font style="color:rgb(51, 51, 51);">182kb</font>**<font style="color:rgb(51, 51, 51);">, 使用</font>**<font style="color:rgb(51, 51, 51);">gzip</font>**<font style="color:rgb(51, 51, 51);">压缩后的文件只剩下了</font>**<font style="color:rgb(51, 51, 51);">60.4kb</font>**<font style="color:rgb(51, 51, 51);">,减少了</font>**<font style="color:rgb(51, 51, 51);">70%</font>**<font style="color:rgb(51, 51, 51);"> 的大小,可以极大提升页面加载速度。</font>

<font style="color:rgb(51, 51, 51);"></font>

# <font style="color:rgb(51, 51, 51);">参考</font>
1. [<font style="color:#117CEE;">webpack官网</font>](https://link.juejin.cn/?target=https%3A%2F%2Fwww.webpackjs.com%2F)
2. [<font style="color:#117CEE;">babel官网</font>](https://link.juejin.cn/?target=https%3A%2F%2Fwww.babeljs.cn%2F)
3. [<font style="color:#117CEE;">【万字】透过分析 webpack 面试题，构建 webpack5.x 知识体系</font>](https://juejin.cn/post/7023242274876162084)
4. [<font style="color:#117CEE;">Babel 那些事儿</font>](https://juejin.cn/post/6992371845349507108)
5. [<font style="color:#117CEE;">阔别两年，webpack 5 正式发布了！</font>](https://juejin.cn/post/6882663278712094727)
6. [<font style="color:#117CEE;">webpack从入门到进阶</font>](https://link.juejin.cn/?target=https%3A%2F%2Fwww.bilibili.com%2Fvideo%2FBV1Pf4y157Ni%3Fp%3D1)
7. [<font style="color:#117CEE;">webpack配置react项目</font>](https://juejin.cn/post/7111922283681153038#heading-41)


# 代码规范技术栈
## 代码格式规范和语法检测
+ [vscode](https://link.juejin.cn?target=http%3A%2F%2Fvscode.bianjiqi.net%2F)：统一前端编辑器。
+ [editorconfig](https://link.juejin.cn?target=https%3A%2F%2Feditorconfig.org%2F): 统一团队vscode编辑器默认配置。
+ [prettier](https://link.juejin.cn?target=https%3A%2F%2Fwww.prettier.cn%2F): 保存文件自动格式化代码。
+ [eslint](https://link.juejin.cn?target=https%3A%2F%2Feslint.bootcss.com%2F): 检测代码语法规范和错误。
+ [lint-staged](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fokonet%2Flint-staged): 只检测暂存区文件代码，优化eslint检测速度。
+ [style-lint](https://link.juejin.cn?target=https%3A%2F%2Fstylelint.io%2F): 对css样式进行规范检测。

## git提交规范
+ [husky](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Ftypicode%2Fhusky):可以监听[githooks](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fbook%2Fzh%2Fv2%2F%25E8%2587%25AA%25E5%25AE%259A%25E4%25B9%2589-Git-Git-%25E9%2592%25A9%25E5%25AD%2590)执行，在对应hook执行阶段做一些处理的操作。
+ [pre-commit](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fbook%2Fzh%2Fv2%2F%25E8%2587%25AA%25E5%25AE%259A%25E4%25B9%2589-Git-Git-%25E9%2592%25A9%25E5%25AD%2590)：githooks之一， 在commit提交前使用tsc和eslint对语法进行检测。
+ [commitlint](https://link.juejin.cn?target=https%3A%2F%2Fcommitlint.js.org%2F%23%2F)：对git commit 提交信息进行规范检测。
+ [commit-msg](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fbook%2Fzh%2Fv2%2F%25E8%2587%25AA%25E5%25AE%259A%25E4%25B9%2589-Git-Git-%25E9%2592%25A9%25E5%25AD%2590)：githooks之一，在commit提交前对commit备注信息进行检测。

# editorconfig统一编辑器配置
    <font style="color:rgb(51, 51, 51);">由于每个人的</font>**<font style="color:rgb(51, 51, 51);">vsocde</font>**<font style="color:rgb(51, 51, 51);">编辑器默认配置可能不一样，比如有的默认缩进是</font>**<font style="color:rgb(51, 51, 51);">4</font>**<font style="color:rgb(51, 51, 51);">个空格，有的是</font>**<font style="color:rgb(51, 51, 51);">2</font>**<font style="color:rgb(51, 51, 51);">个空格，如果自己编辑器和项目代码缩进不一样，会给开发和项目代码规范带来一定影响，所以需要在项目中为编辑器配置下格式。</font>

## <font style="color:rgb(51, 51, 51);">安装vscode插件EditorConfig</font>
<font style="color:rgb(51, 51, 51);">打开</font>**<font style="color:rgb(51, 51, 51);">vsocde</font>**<font style="color:rgb(51, 51, 51);">插件商店，搜索</font>**<font style="color:rgb(51, 51, 51);">EditorConfig for VS Code</font>**<font style="color:rgb(51, 51, 51);">，然后进行安装。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736333098752-d1219643-8107-40aa-bf74-94c9251af273.png)

## 添加.editorconfig配置文件
```shell
root = true # 控制配置文件 .editorconfig 是否生效的字段

[**] # 匹配全部文件
indent_style = space # 缩进风格，可选space｜tab
indent_size = 2 # 缩进的空格数
charset = utf-8 # 设置字符集
trim_trailing_whitespace = true # 删除一行中的前后空格
insert_final_newline = true # 设为true表示使文件以一个空白行结尾
end_of_line = lf

[**.md] # 匹配md文件
trim_trailing_whitespace = false
```

<font style="color:rgb(51, 51, 51);">上面的配置可以规范本项目中文件的缩进风格，和缩进空格数等，会覆盖</font>**<font style="color:rgb(51, 51, 51);">vscode</font>**<font style="color:rgb(51, 51, 51);">的配置，来达到不同编辑器中代码默认行为一致的作用。</font>

# <font style="color:rgb(51, 51, 51);">prettier规范代码风格</font>
<font style="color:rgb(51, 51, 51);">每个人写代码的风格习惯不一样，比如代码换行，结尾是否带分号，单双引号，缩进等，而且不能只靠口头规范来约束，项目紧急的时候可能会不太注意代码格式，这时候需要有工具来帮我们自动格式化代码，而</font>**<font style="color:rgb(51, 51, 51);">prettier</font>**<font style="color:rgb(51, 51, 51);">就是帮我们做这件事的。</font>

## 安装prettier插件
<font style="color:rgb(51, 51, 51);">打开</font>**<font style="color:rgb(51, 51, 51);">vsocde</font>**<font style="color:rgb(51, 51, 51);">插件商店，搜索</font>**<font style="color:rgb(51, 51, 51);">Prettier - Code formatter</font>**<font style="color:rgb(51, 51, 51);">，然后进行安装。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736333440307-f12eecd1-ffcb-448f-ad3e-c7c1f187bd76.png)

## 添加.prettierrc.js配置文件
```javascript
module.exports = {
  printWidth: 100, // 一行的字符数，如果超过会进行换行
  tabWidth: 2, // 一个tab代表几个空格数，默认就是2
  useTabs: false, // 是否启用tab取代空格符缩进，.editorconfig设置空格缩进，所以设置为false
  semi: true, // 行尾是否使用分号，默认为true
  singleQuote: true, // 字符串是否使用单引号
  trailingComma: 'none', // 对象或数组末尾是否添加逗号 none| es5| all
  jsxSingleQuote: true, // 在jsx里是否使用单引号，你看着办
  bracketSpacing: true, // 对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
  arrowParens: 'avoid' // 箭头函数如果只有一个参数则省略括号
};
```

## 添加.vscode/settings.json
<font style="color:rgb(51, 51, 51);">配置前两步后，虽然已经配置</font>**<font style="color:rgb(51, 51, 51);">prettier</font>**<font style="color:rgb(51, 51, 51);">格式化规则，</font>**<font style="color:rgb(51, 51, 51);">但还需要让vscode来支持保存后触发格式化。</font>**

**<font style="color:rgb(51, 51, 51);"></font>**

<font style="color:rgb(51, 51, 51);">在项目根目录新建 </font>**<font style="color:rgb(51, 51, 51);">.vscode</font>**<font style="color:rgb(51, 51, 51);">文件夹，内部新建</font>**<font style="color:rgb(51, 51, 51);">settings.json</font>**<font style="color:rgb(51, 51, 51);">文件配置文件，内容如下：</font>

```json
{
  "search.exclude": {
    "/node_modules": true,
    "dist": true,
    "pnpm-lock.sh": true
  },
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "vscode.json-language-features"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "liveServer.settings.port": 5502,


}
```

<font style="color:rgb(51, 51, 51);">先配置了忽略哪些文件不进行格式化，又添加了保存代码后触发格式化代码配置，以及各类型文件格式化使用的格式。</font>

<font style="color:rgb(51, 51, 51);">这一步配置完成后，修改项目代码，把格式打乱，点击保存时就会看到编辑器自动把代码格式规范化了。</font>

# <font style="color:rgb(51, 51, 51);">eslint+lint-staged检测代码</font>
## 安装eslint插件
![](https://cdn.nlark.com/yuque/0/2025/webp/42776133/1736342855647-124b3a78-86f6-4da7-b6ee-670fae63cb52.webp)

## 安装依赖
```json
npm i eslint -D
```



## 配置eslint.config.js


<font style="color:rgb(51, 51, 51);">安装</font>**<font style="color:rgb(51, 51, 51);">eslint</font>**<font style="color:rgb(51, 51, 51);">后，执行</font>**<font style="color:rgb(51, 51, 51);">pnpm init @eslint/config</font>**<font style="color:rgb(51, 51, 51);">，选择自己需要的配置</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736343157693-fd22d089-a4ed-4d22-b4e0-175b3fc52dab.png)

<font style="color:rgb(51, 51, 51);">这里我们选择了</font>

+ <font style="color:rgb(51, 51, 51);">使用</font>**<font style="color:rgb(51, 51, 51);">eslint</font>**<font style="color:rgb(51, 51, 51);">检测并问题</font>
+ <font style="color:rgb(51, 51, 51);">项目使用的模块规范是</font>**<font style="color:rgb(51, 51, 51);">es module</font>**
+ <font style="color:rgb(51, 51, 51);">使用的框架是</font>**<font style="color:rgb(51, 51, 51);">react</font>**
+ <font style="color:rgb(51, 51, 51);">使用了</font>**<font style="color:rgb(51, 51, 51);">typescript</font>**
+ <font style="color:rgb(51, 51, 51);">代码选择运行在浏览器端</font>
+ <font style="color:rgb(51, 51, 51);">是否现在安装相关依赖，选择是</font>
+ <font style="color:rgb(51, 51, 51);">使用</font>**<font style="color:rgb(51, 51, 51);">npm</font>**<font style="color:rgb(51, 51, 51);">包管理器安装依赖</font>



<font style="color:rgb(51, 51, 51);">选择完成后会在根目录下生成 </font>**<font style="color:rgb(51, 51, 51);">eslint.config.mjs</font>**<font style="color:rgb(51, 51, 51);">文件，默认配置如下:</font>

```javascript
// eslint.config.js

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];
```



可以看到它采用ESM模块化方案，我们修改为common.js风格。

```javascript
const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const pluginReact = require('eslint-plugin-react');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser} },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
];
```

## 解决当前eslint语法错误


+ **<font style="color:rgb(51, 51, 51);">eslint.congfig.js</font>**<font style="color:rgb(51, 51, 51);">有红色报错，报错是 </font>**<font style="color:rgb(51, 51, 51);">'module' is not defined</font>**<font style="color:rgb(51, 51, 51);">。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736343787870-4a633662-784c-40d5-80b9-89054c3a4b07.png)

<font style="color:rgb(51, 51, 51);">这个是因为上面选择的浏览器环境，配置文件的</font>**<font style="color:rgb(51, 51, 51);">module.exports</font>**<font style="color:rgb(51, 51, 51);">需要</font>**<font style="color:rgb(51, 51, 51);">node</font>**<font style="color:rgb(51, 51, 51);">环境，需要在</font>**<font style="color:rgb(51, 51, 51);">eslint</font>**<font style="color:rgb(51, 51, 51);">的</font>**<font style="color:rgb(51, 51, 51);">env</font>**<font style="color:rgb(51, 51, 51);">环境配置中添加支持</font>**<font style="color:rgb(51, 51, 51);">node</font>**<font style="color:rgb(51, 51, 51);">环境。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);"> </font>**<font style="color:rgb(51, 51, 51);">配置node环境</font>**

```javascript
const globals = require('globals');
/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  /...
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } }, //添加node环境
  /...
];
```

<font style="color:rgb(51, 51, 51);"></font>

+ **<font style="color:rgb(51, 51, 51);">eslint.congfig.js</font>**<font style="color:rgb(51, 51, 51);">有红色报错，报错是 </font>**A `require()` style import is forbidden**<font style="color:rgb(51, 51, 51);">。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736344043562-e9ddb5ef-9235-4c83-b2e7-2bd4ee9f5996.png)



关闭**'@typescript-eslint/no-require-imports'**

```javascript
const globals = require('globals');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const pluginReact = require('eslint-plugin-react');

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  //...
  {
    rules: {
      '@typescript-eslint/no-require-imports': 'off' //关闭no-require
    },
  }
  //...
];
```

<font style="color:rgb(51, 51, 51);"></font>

+ <font style="color:rgb(51, 51, 51);">看到</font>**<font style="color:rgb(51, 51, 51);">index.tsx</font>**<font style="color:rgb(51, 51, 51);">文件带有警告颜色，看警告提示是</font>**<font style="color:rgb(51, 51, 51);">Forbidden non-null assertion</font>**

![](https://cdn.nlark.com/yuque/0/2025/webp/42776133/1736344726202-dabb4af5-56e2-4f6e-862e-1a6f0f5ec9e2.webp)



<font style="color:rgb(51, 51, 51);">这个提示是不允许使用非空操作符!，但实际在项目中经常会用到，所以可以把该项校验给关闭掉。</font>

```javascript
 rules: {
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
```



## 添加eslint语法检测脚本
<font style="color:rgb(51, 51, 51);">前面的</font>**<font style="color:rgb(51, 51, 51);">eslint</font>**<font style="color:rgb(51, 51, 51);">报错和警告都是我们用眼睛看到的，有时候需要通过脚本执行能检测出来，在</font>**<font style="color:rgb(51, 51, 51);">package.json</font>**<font style="color:rgb(51, 51, 51);">的</font>**<font style="color:rgb(51, 51, 51);">scripts</font>**<font style="color:rgb(51, 51, 51);">中新增。</font>

```json
"eslint": "eslint src/**/*.{ts,tsx}"
```

<font style="color:rgb(51, 51, 51);">执行</font>**<font style="color:rgb(51, 51, 51);">npm run eslint</font>**

**<font style="color:rgb(51, 51, 51);"></font>**

**<font style="color:rgb(51, 51, 51);">报错如下：</font>**

+ **eslint**警告**React version not specified in eslint-plugin-react settings**,需要告诉**eslint**使用的**react**版本。

在 **eslint.config.js**中添加s**ettings**配置，让**eslint**自己检测**react**版本,对应[issuse](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fyannickcr%2Feslint-plugin-react%2Fissues%2F2157)。

```javascript
settings: {
      react: {
        version: 'detect' // 自动检测 React 版本
      }
    }
```



## lint-staged优化eslint检测速度
     上面配置的eslint会检测src下的所有的ts,tsx文件，虽然功能可以实现，但当项目多的时候，检测的文件会很多，需要的时间越来越长。其实只需要**检测提交到暂存区的文件**，就是git add添加的文件，不在暂存区的文件不用再次检测，而**lint-staged**就是用来做这个事的。



安装lint-staged依赖（如果当前项目没有添加git仓库，请先**初始化项目到git仓库**）

```javascript
npm i lint-staged -D
```



<font style="color:rgb(51, 51, 51);">修改</font>**<font style="color:rgb(51, 51, 51);">package.json</font>**<font style="color:rgb(51, 51, 51);">脚本</font>**<font style="color:rgb(51, 51, 51);">eslint</font>**<font style="color:rgb(51, 51, 51);">的配置</font>

```javascript
"eslint": "eslint"
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">在</font>**<font style="color:rgb(51, 51, 51);">package.json</font>**<font style="color:rgb(51, 51, 51);">添加</font>**<font style="color:rgb(51, 51, 51);">lint-staged</font>**<font style="color:rgb(51, 51, 51);">配置</font>

```json
"lint-staged": {
    "src/**/*.{tsx,tsx}": [
      "npm run eslint"
    ]
  },
```



然后修改App.tsx代码，并git add .将修改的代码暂存至暂存区，再修改其他组件的代码。

<font style="color:rgb(51, 51, 51);">执行</font>**<font style="color:rgb(51, 51, 51);">npx lint-staged</font>**

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736400013763-b5839af8-38a9-4528-95b8-26ec40be839e.png)

可以看到，只有在**暂存区的代码做了eslint检查**，<font style="color:rgb(51, 51, 51);">避免每次都全量检测文件</font>。



<font style="color:rgb(51, 51, 51);">如果需要出现警告也阻止代码提交，需要给eslint检测配置参数 </font>**<font style="color:rgb(51, 51, 51);">--max-warnings=0</font>**

```javascript
 "eslint": "eslint --max-warnings=0"
```

**<font style="color:rgb(51, 51, 51);"></font>**

# <font style="color:rgb(51, 51, 51);">使用tsc检测类型和报错</font>
<font style="color:rgb(51, 51, 51);">在项目中使用了</font>**<font style="color:rgb(51, 51, 51);">ts</font>**<font style="color:rgb(51, 51, 51);">,但一些类型问题，现在配置的</font>**<font style="color:rgb(51, 51, 51);">eslint</font>**<font style="color:rgb(51, 51, 51);">是检测不出来的，需要使用</font>**<font style="color:rgb(51, 51, 51);">ts</font>**<font style="color:rgb(51, 51, 51);">提供的</font>**<font style="color:rgb(51, 51, 51);">tsc</font>**<font style="color:rgb(51, 51, 51);">工具进行检测。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">a变量类型为string，但是赋值的值类型为number类型。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736404492953-a4a92fe7-7d00-4d69-90c0-b1bca61d246f.png)

但是执行npm run eslint，并未检测出ts类型错误。<font style="color:rgb(51, 51, 51);">所以需要配置下</font>**<font style="color:rgb(51, 51, 51);">tsc</font>**<font style="color:rgb(51, 51, 51);">来检测类型，在</font>**<font style="color:rgb(51, 51, 51);">package.json中的script中</font>**<font style="color:rgb(51, 51, 51);">添加脚本命令。</font>

```javascript
"pre-check": "tsc && npx lint-staged"
```

<font style="color:rgb(51, 51, 51);">执行</font>**<font style="color:rgb(51, 51, 51);">npm run pre-check</font>**<font style="color:rgb(51, 51, 51);">，发现已经可以检测出类型报错了。</font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736405012138-a312c89b-0816-4e4c-8d0a-cb7492d35806.png)

# git 提交时检测语法提交（husky）


为了避免把不规范的代码提交到远程仓库，一般会在**git**提交代码时对代码语法进行检测，只有检测通过时才能被提交，**git**提供了一系列的[githooks](https://link.juejin.cn?target=https%3A%2F%2Fgit-scm.com%2Fwomdocs%2Fgithooks) ，而我们需要其中的**pre-commit**钩子，它会在**git commit**把代码提交到本地仓库之前执行，可以在这个阶段检测代码，如果检测不通过就退出命令行进程停止**commit**。



<font style="color:rgb(51, 51, 51);">而</font>[**husky**](https://husky.nodejs.cn/get-started.html)<font style="color:rgb(51, 51, 51);">就是可以监听</font>**<font style="color:rgb(51, 51, 51);">githooks</font>**<font style="color:rgb(51, 51, 51);">的工具，可以借助它来完成这件事情。</font>

<font style="color:rgb(51, 51, 51);"></font>

+ **<font style="color:rgb(51, 51, 51);">安装husky依赖（当前用的版本是9.1）</font>**

```javascript
 npm i husky -D
```



+ **初始化husky**

****

**   ** 确保项目已经添加到git仓库中

```javascript
npx husky init
```

`init`<font style="color:rgb(60, 60, 67);"> 命令简化了在项目中设置 husky 的过程。它在 </font>`.husky/`<font style="color:rgb(60, 60, 67);"> 中创建一个 </font>`pre-commit`<font style="color:rgb(60, 60, 67);"> 脚本，并在 </font>`package.json`<font style="color:rgb(60, 60, 67);"> 中更新 </font>`prepare`<font style="color:rgb(60, 60, 67);"> 脚本。可以稍后进行修改以适合你的工作流程。</font>

<font style="color:rgb(60, 60, 67);"></font>

+ **<font style="color:rgb(60, 60, 67);">在pre-commit添加新钩子</font>**

<font style="color:rgb(60, 60, 67);">添加钩子就像创建文件一样简单。这可以使用你最喜欢的编辑器、脚本或基本的 echo 命令来完成。在pre-commit文件中添加我们刚刚在package.json中添加的</font>**<font style="color:rgb(60, 60, 67);">pre-check</font>**<font style="color:rgb(60, 60, 67);">脚本命令。</font>

```javascript
// pre-commit
npm run pre-check

```



测试一下，提交代码git commit，npm run pre-check就生效了。

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736425204274-25fc9ad0-d367-4d82-a8b2-f6b9eb1159a7.png)



+ 安装依赖后自动husky install



**husky 9.1版本好像不需要配置，可以直接忽略。**

<font style="color:rgb(51, 51, 51);">husky生效需要手动执行husky install，可以借助package.json里面的postintall钩子实现这个功能，该钩子会在依赖安装完成后执行，在package.json里面添加</font>

```javascript
"scripts": {
    "postinstall": "husky install"
}
```

<font style="color:rgb(51, 51, 51);">这样每一次安装依赖时就都会执行husky install了，不过.husky文件不能被git忽略，需要提交到远程仓库上，不然得重新配置pre-commit钩子。</font>

<font style="color:rgb(51, 51, 51);"></font>

# <font style="color:rgb(51, 51, 51);">添加git commit 规范</font>
   commit信息也应该符合规范，[commitlint](https://commitlint.js.org/guides/getting-started.html)提供了commit规范的能力。



+ **安装commitlint相关**

```javascript
// mac
npm install --save-dev @commitlint/{cli,config-conventional}

// window
 npm install --save-dev '@commitlint/cli' '@commitlint/config-conventional'
```



+ **根目录下添加commitlint.config.js文件，添加如下代码**

```javascript
module.exports = { extends: ['@commitlint/config-conventional'] };
```



+ **配置husky中的commit-msg钩子**

****

<font style="color:rgb(51, 51, 51);">在 </font>**.husky**目录中创建**commit-msg，添加下方代码。**

```javascript
npx --no-install commitlint --edit $1
```

+ 在 `commit-msg` 钩子中添加命令：`npx --no-install commitlint --edit $1`，这个命令会检查提交信息是否符合 `commitlint` 的规则。
+ `$1` 是 Git 自动传递给钩子的文件路径，它指向提交信息文件。

 这意味着在每次提交时，Husky 会调用 `commitlint` 来验证提交信息。



测试一下:

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736429712997-955bef59-57fd-4673-85de-8ba8c5e4b924.png)

  commit信息不符合提交规范，commit-msg提示失败。需要重新填写commit信息。

# stylelint规范样式和保存自动修复
随便现在设备还有网络，浏览器性能越来越好，在前端代码性能方面关注的更多的是js层面的，但**css**层面也能做很多性能优化，**css**属性的书写顺序，选择器使用，都会对整体应用性能产生影响。所以配置一套完善的**css**代码书写规范可以有效提升应用的性能，而[stylelint](https://link.juejin.cn?target=https%3A%2F%2Fstylelint.io%2F)就是现在比较流行的**csslint**库。



## **vscode安装stylelint插件**
![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736431054962-60886458-ac0a-4cf2-98fe-774db81a583a.png)

## **安装stylelint依赖和配置**
```javascript
npm init stylelint
```

    这个命令会在根目录创建**.stylelintrc.json**文件和stylelint相关依赖包，依赖包如下

+  stylelint: css样式lint工具
+ stylelint-config-standard：`<font style="color:rgb(199, 54, 54);background-color:rgb(255, 238, 237);">Stylelint</font>`<font style="color:rgb(37, 43, 58);">的标准可共享配置规则，详细可查看官方文档</font>

## **安装其他依赖工具**
+ **安装stylelint-order**

stylelint-order用于<font style="color:rgb(37, 43, 58);">指定样式书写的顺序，在</font>`<font style="color:rgb(199, 54, 54);background-color:rgb(255, 238, 237);">.stylelintrc.js</font>`<font style="color:rgb(37, 43, 58);">中</font>`<font style="color:rgb(199, 54, 54);background-color:rgb(255, 238, 237);">order/properties-order</font>`<font style="color:rgb(37, 43, 58);">指定配置顺序规则。</font>

```javascript
 npm i stylelint-order -D
```



+ ** 支持less语法规则检测**

```javascript
 npm i stylelint-config-recommended-less stylelint-less -D
```

<font style="color:rgb(37, 43, 58);"> </font>[stylelint-config-recommended-less](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fssivanatarajan%2Fstylelint-config-recommended-less):less的推荐可共享配置规则

<font style="color:rgb(37, 43, 58);"> </font>[stylelint-less](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fssivanatarajan%2Fstylelint-less):<font style="color:rgb(37, 43, 58);"> </font>`<font style="color:rgb(199, 54, 54);background-color:rgb(255, 238, 237);">stylelint-config-recommended-less</font>`<font style="color:rgb(37, 43, 58);">的依赖，</font>`<font style="color:rgb(199, 54, 54);background-color:rgb(255, 238, 237);">less</font>`<font style="color:rgb(37, 43, 58);">的</font>`<font style="color:rgb(199, 54, 54);background-color:rgb(255, 238, 237);">stylelint</font>`<font style="color:rgb(37, 43, 58);">规则集合。</font>

<font style="color:rgb(37, 43, 58);"></font>

+ **<font style="color:rgb(37, 43, 58);">编写.stylelintrc.js，配置规则</font>**

```javascript
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-less'],
  plugins: ['stylelint-order'],
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/*.json', '**/*.md', '**/*.yaml'],
  rules: {
    // 指定样式的排序
    'order/properties-order': [
      'position',
      'top',
      'right',
      'bottom',
      'left',
      'z-index',
      'display',
      'justify-content',
      'align-items',
      'float',
      'clear',
      'overflow',
      'overflow-x',
      'overflow-y',
      'padding',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
      'width',
      'min-width',
      'max-width',
      'height',
      'min-height',
      'max-height',
      'font-size',
      'font-family',
      'text-align',
      'text-justify',
      'text-indent',
      'text-overflow',
      'text-decoration',
      'white-space',
      'color',
      'background',
      'background-position',
      'background-repeat',
      'background-size',
      'background-color',
      'background-clip',
      'border',
      'border-style',
      'border-width',
      'border-color',
      'border-top-style',
      'border-top-width',
      'border-top-color',
      'border-right-style',
      'border-right-width',
      'border-right-color',
      'border-bottom-style',
      'border-bottom-width',
      'border-bottom-color',
      'border-left-style',
      'border-left-width',
      'border-left-color',
      'border-radius',
      'opacity',
      'filter',
      'list-style',
      'outline',
      'visibility',
      'box-shadow',
      'text-shadow',
      'resize',
      'transition'
    ]
  }
};
```

主要配置less相关的工具还有样式属性的顺序规则

## 设置自动保存自动修复
<font style="color:rgb(51, 51, 51);">一般希望在保存文件</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">文件后自动修复</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">中的不合理的地方，在安装</font>**<font style="color:rgb(51, 51, 51);">vscode</font>**<font style="color:rgb(51, 51, 51);">插件</font>**<font style="color:rgb(51, 51, 51);">stylelint</font>**<font style="color:rgb(51, 51, 51);">后，需要修改一下 </font>**<font style="color:rgb(51, 51, 51);">.vscode/settins.json</font>**<font style="color:rgb(51, 51, 51);">文件</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">因为要使用</font>**<font style="color:rgb(51, 51, 51);">stylelint</font>**<font style="color:rgb(51, 51, 51);">的规则格式化代码，不使用</font>**<font style="color:rgb(51, 51, 51);">perttier</font>**<font style="color:rgb(51, 51, 51);">来格式化</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">,</font>**<font style="color:rgb(51, 51, 51);">less</font>**<font style="color:rgb(51, 51, 51);">,</font>**<font style="color:rgb(51, 51, 51);">scss</font>**<font style="color:rgb(51, 51, 51);">文件了，删除掉 </font>**<font style="color:rgb(51, 51, 51);">.vscode/settins.json</font>**<font style="color:rgb(51, 51, 51);">中配置的使用</font>**<font style="color:rgb(51, 51, 51);">perttier</font>**<font style="color:rgb(51, 51, 51);">格式化</font>**<font style="color:rgb(51, 51, 51);">css</font>**<font style="color:rgb(51, 51, 51);">,</font>**<font style="color:rgb(51, 51, 51);">less</font>**<font style="color:rgb(51, 51, 51);">,</font>**<font style="color:rgb(51, 51, 51);">scss</font>**<font style="color:rgb(51, 51, 51);">的配置。</font>

```javascript
  // 删除该代码
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[scss]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
```

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">在 </font>**<font style="color:rgb(51, 51, 51);">.vscode/settins.json</font>**<font style="color:rgb(51, 51, 51);">新增</font>**<font style="color:rgb(51, 51, 51);">styleint</font>**<font style="color:rgb(51, 51, 51);">保存文件格式化样式文件配置</font>

```json
{
  // ...
// 开启stylelint自动修复
"editor.codeActionsOnSave": {
  "source.fixAll.stylelint": "explicit"
},
// 关闭编辑器内置样式检查（避免与stylelint冲突）
"css.validate": false,
"less.validate": false,
"scss.validate": false,
// 配置stylelint检查的文件类型范围
"stylelint.validate": ["css", "less"],
// ...
}
```

## husky添加钩子
  <font style="color:rgb(51, 51, 51);">自动修复只能修复一部分可通过改变属性顺序或者缩进换行来修复的问题，但像类名命名规则不符合规定命名的，自动修复就无能为力，需要手动调整，为了避免把不符合规范的样式代码提交到git远程仓库，需要在提交代码时对本次更改的样式文件进行语法检测。</font>

<font style="color:rgb(51, 51, 51);"></font>

<font style="color:rgb(51, 51, 51);">上面已经配置了</font>**<font style="color:rgb(51, 51, 51);">husky</font>**<font style="color:rgb(51, 51, 51);">钩子，</font>**<font style="color:rgb(51, 51, 51);">git commit</font>**<font style="color:rgb(51, 51, 51);">时会执行</font>**<font style="color:rgb(51, 51, 51);">pre-check</font>**<font style="color:rgb(51, 51, 51);">脚本，我们照猫画虎即可</font>

+ **<font style="color:rgb(51, 51, 51);">packag.json添加命令行</font>**

```json
"script":{
  //...
 "lint:style": "stylelint src/**/*.{css,less}"
  // ...
}
```

+ **<font style="color:rgb(51, 51, 51);">.husky/.pre-commit添加该命令</font>**

```json
// .pre-commit
npm run lint:style
```

**<font style="color:rgb(51, 51, 51);"></font>**

**<font style="color:rgb(51, 51, 51);"> 测试配置结果</font>**

<font style="color:rgb(51, 51, 51);"></font>

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736499400763-3b1d670d-53a0-4e8e-a986-017e28036f05.png)

上述代码写了一段不符合小驼峰命令的样式，然后将其保存至暂存区并commit，commit出现错误。错误如下：

![](https://cdn.nlark.com/yuque/0/2025/png/42776133/1736499575201-746d8bfd-5fa0-4343-86d5-784809b58d52.png)

husky生效，说明配置生效。husky在提交代码前执行stylelint命令，检测不符合规范的style语法，避免了将不规范的样式提交至远程仓库。

# 总结
    我们在webpack创建react+ts项目的基础上，增加了代码规范相关的配置。规范编辑器默认配置，pretter代码风格配置以及代码自动格式化；配置eslint+lint-staged语法检查; 配置tsc支持ts类型检查；配置husky以支持代码提交时触发lint检查；配置commit信息规范；style-lint规范样式。

# 参考
[Getting started | commitlint](https://commitlint.js.org/guides/getting-started.html)

[【前端工程化】配置React+ts企业级代码规范及样式格式和git提交规范使用prettier+eslint+style - 掘金](https://juejin.cn/post/7101596844181962788#heading-30)

[开始 | Husky 中文网](https://husky.nodejs.cn/get-started.html)

