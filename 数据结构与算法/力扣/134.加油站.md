[134.加油站](https://leetcode-cn.com/problems/gas-station/submissions/)

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md) 

## 贪心算法

```javascript
/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
var canCompleteCircuit = function(gas, cost) {
    let sum = 0,
        curSum = 0,
        startIndex = 0;
    
    for (let i = 0; i < gas.length; i++) {
        sum += gas[i] - cost[i];
        curSum += gas[i] - cost[i];
        if (curSum < 0) {
            curSum = 0;
            startIndex = i + 1;
        }
    }
    
    return sum >= 0 ? startIndex : -1;
};
```