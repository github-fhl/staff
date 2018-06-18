import Immutable from 'immutable'

//将数组转成对象的reduce方法
export const arrayReduceToObj=(field='id')=>arrayList=>arrayList.reduce((prev,curr)=>{prev[curr[field]]=curr;return prev;},{})

export const arrayToImmutableMap=(field='id')=>list=>Immutable.fromJS(list).reduce(($v,$curr)=>$v.set($curr.get(field),$curr),Immutable.OrderedMap())

// 防抖动
export function debounce (func, wait, immediate) {
  var timeout, args, context, timestamp, result

  var later = function () {
    var last = +new Date() - timestamp
    if (last < wait && last >= 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) { context = args = null }
      }
    }
  }

  return function () {
    context = this
    args = arguments
    timestamp = +new Date()
    var callNow = immediate && !timeout

    if (!timeout) { timeout = setTimeout(later, wait) }

    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
};
