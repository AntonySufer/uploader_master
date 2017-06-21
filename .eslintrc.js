module.exports = {
    "extends": "standard",
    "plugins": [
        "standard",
        "promise"
    ],
     "rules": { 
  
    // 指定数组的元素之间要以空格隔开(,后面)， never参数：[ 之前和 ] 之后不能带空格，always参数：[ 之前和 ] 之后必须带空格  
    "array-bracket-spacing": [2, "never"],  
    // 在块级作用域外访问块内定义的变量是否报错提示  
    "block-scoped-var": 0,  
    // if while function 后面的{必须与if在同一行，java风格。  
    "brace-style": [2, "1tbs", { "allowSingleLine": true }],  
    // 双峰驼命名格式  
    "camelcase": 0,  
    // 数组和对象键值对最后一个逗号， never参数：不能带末尾的逗号, always参数：必须带末尾的逗号，  
    // always-multiline：多行模式必须带逗号，单行模式不能带逗号  
    "comma-dangle": [2, "never"],  
    // 控制逗号前后的空格  
    "comma-spacing": [2, { "before": false, "after": true }],  
    // 控制逗号在行尾出现还是在行首出现  
    // http://eslint.org/docs/rules/comma-style  
    "comma-style": [2, "last"]
     }

};