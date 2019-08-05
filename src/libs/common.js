
const common = {}
/**
 * 字符串是否为空
 * @param str 字符串
 */
common.isNull = function(str) {
    return null == str || typeof(str) == "undefined" || "" == str || "null" == str || str.length == 0;
}

common.isObjectNull = function(obj) {
    return undefined == obj || null == obj||JSON.stringify(obj)=='{}'
}

common.isNumber = function(val){

    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

common.copyArr = function(arr){
    return arr.map(function(e){
        if(typeof e === 'object'){
            return Object.assign({},e)
        }else{
            return e
        }
    })
}

common.copyObj = function(obj){
    var result={};
    for (var key in obj) {
        result[key] = typeof obj[key]==='object'?copyObj(obj[key]): obj[key];
    }
    return result;
}


export default common
