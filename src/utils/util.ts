
/**
 * 子级找父级
 *
 * @param {*} arr
 */
export const getValues=(arr1:any, id:any)=> {
  var temp:any = []
  var forFn = function (arr:any, id:any) {
        for (var i = 0; i < arr.length; i++) {
          var item = arr[i]
          if (item.value === id) {
            temp.push(item.value)
            forFn(arr1, item.fid)
            break
          } else {
            if (item.children) {
              forFn(item.children, id)
            }
          }
        }
  }
  forFn(arr1, id)
  return temp.reverse()
}
/**
 * 多维数组对象拉平降维一维数组
 *
 * @param {*} arr
 */
export const flatten = (arr) => {
  return [].concat(
    ...arr.map((item) => [].concat(item, ...flatten(item.children))),
  );
};

/**
 * 二维数组中获取指定字段生成新数组
 *
 * @param {*} arr
 * @param {*} key
 */
export const arrayColumn = (arr, key) => {
  return arr.map((arr) => {
    return arr[key];
  });
};

export const arrayColumnFlatten = (arr, key) => {
  arr = flatten(arr);
  return arr.map((arr) => {
    return arr[key];
  });
};

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some((_) => arr.indexOf(_) > -1);
};
export const getValueBykey=(key:string,value:any,arr:any,key1:string)=>{
  var str=null
  for(var i =0;i<arr.length;i++){
    if(arr[i][key]==value){
      str=arr[i][key1]
    }
  }
  return str
}
export const creatUUId=()=>{
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('',),
uuid = new Array(36),
rnd = 0,
r;
for (let i = 0; i < 36; i++) {
if (i == 8 || i == 13 || i == 18 || i == 23) {
  uuid[i] = '-';
} else if (i == 14) {
  uuid[i] = '4';
} else {
  if (rnd <= 0x02) rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
  r = rnd & 0xf;
  rnd = rnd >> 4;
  uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
}
}
return uuid.join('');
}