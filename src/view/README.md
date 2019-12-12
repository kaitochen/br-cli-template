视图目录，结构为view/\*\*/\*\*.tpl
在页面视图中可以通过采用
```
{%src=header.tpl;data={json对象}%}
支持{%%}语法；
通过src属性引入template中的模板文件，直接使用template里面的相对路径即可；
还可通过data属性将json对象传入模板中，通过模板的nunjucks引擎直接解析读取json对象中键值对进行数据渲染


```
