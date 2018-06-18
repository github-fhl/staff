
//去掉怪异的小数
export const fixedNumber=(num,fractionDigits=2)=>(Math.round(num * Math.pow( 10, fractionDigits  ))/Math.pow(10,fractionDigits));

// num toFixed
export const toFixed=(num,fractionDigits=2)=>fixedNumber(num,fractionDigits).toFixed(fractionDigits);

// 如果是小数则 fixed
export const autoFixed=(num,fractionDigits)=>{
  let value=fixedNumber(num)
  if(parseInt(value)==value){
    return value;
  }else{
    return toFixed(value,fractionDigits)
  }
}


// 货币格式化
export const numberWithCommas=(x)=>{
  if(isNaN(x)){
    return'';
  }
  let parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

//用户格式化输出数据
export const format={
  money:m=>numberWithCommas(toFixed(m/100)),
  percent:value=>isNaN(value)?'0%':autoFixed(value*100)+'%'
}

/**
 * 系统设置--格式化数据
**/

// salary type 数组转成对象
export const salaryTypeArray2Object=salaryArray=>salaryArray.reduce((value,item)=>{
  value[item.salaryTypeId]=item.amount;
  return value;
},{})

//salary type 对象转成数组
export const salaryTypeObject2Array=salaryObject=>Object.keys(salaryObject).map(key=>({salaryTypeId:key,amount:salaryObject[key]}))

