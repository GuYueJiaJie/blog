[1186.删除一次得到数组最大和](https://leetcode-cn.com/problems/maximum-subarray-sum-with-one-deletion/submissions/)

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md) 

## 动态规划

```javascript
/**
 * @param {number[]} arr
 * @return {number}
 */
var maximumSum = function(arr) {
    // sum表示不删除元素的最大值
    // deleteSum表示删除了某个元素的最大值
    let sum = new Array(arr.length);
    let deleteSum = new Array(arr.length);
    
    sum[0] = arr[0];
    deleteSum[0] = -Infinity;
    
    let res = Math.max(sum[0], deleteSum[0]);
    
    for (let i = 1; i < arr.length; i++) {
        sum[i] = Math.max(sum[i-1] + arr[i], arr[i]);
        deleteSum[i] = Math.max(deleteSum[i-1] + arr[i], sum[i-1]); // 第二种情况是删除当前元素
        res = Math.max(res, sum[i], deleteSum[i]);
    }
    
    return res;
};
```