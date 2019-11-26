#### 项目架构
```
 |- build（与src目录的内部结构一致，为构建后代码文件）
 |- src  
 | |- assets    
 | |- plugin
 | |- index.html
 | |- view
 | | |- xxxx.html(视图)
 | |- module
 | | |- js(视图所需js)
 | | |- css(视图所需的css)
 |- .babelrc    
 |- .gitignore  
 |- Gruntfile.js    
 |- package.json   
```  
#### 项目指令
```
npm start 开启本地服务器，热加载代码，自动刷新
npm run build 构建生产环境代码
npm run clean 清除本地服务器的缓存代码
``` 
