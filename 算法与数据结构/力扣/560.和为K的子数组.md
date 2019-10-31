[560.和为 k 的子数组](https://leetcode-cn.com/problems/subarray-sum-equals-k/submissions/)

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md)

## 方法一 暴力解法

时间复杂度：`O(n²)`

空间复杂度：`O(1)`

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
  if (nums.length <= 0) return 0;
  let count = 0;
  for (let start = 0; start < nums.length; start++) {
    let sum = 0;
    for (let end = start; end < nums.length; end++) {
      sum += nums[end];
      if (sum === k) {
        count++;
      }
    }
  }
  return count;
};
```

## 方法二 哈希法

利用前缀和的思想。

在进行 sum 计算过程中，每一个 sum 值都表示从下标 0 到当前下标的所有元素的和。

而本题所求子数组并不要求从下标 0 开始，只要连续即可，即保证 i~j 之间元素和为 k 即可。

i~j 之间的元素和怎么计算呢？

sum[j] - sum[i-1]即可。

即假设数组为`[0,1,2,3,4]`，要得到`[3,4]`的和，只需要将`sum[0,1,2,3,4] = 10`减去`sum[0,1,2] = 3`即可。

而本题要找到和为`k`的连续子数组，可以把问题转换为求总和为`sum - k`的值出现的次数即可，可以用 map 进行次数的记录。

时间复杂度：`O(n)`

空间复杂度：`O(n)`

```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var subarraySum = function(nums, k) {
  if (nums.length <= 0) return 0;
  let map = new Map([[0, 1]]);
  let sum = 0,
    count = 0;
  for (let i = 0; i < nums.length; i++) {
    sum += nums[i];
    // 注意顺序，要先判断存不存在sum - k
    // 然后再设置map
    if (map.has(sum - k)) {
      count += map.get(sum - k);
    }
    if (!map.has(sum)) {
      map.set(sum, 1);
    } else {
      map.set(sum, map.get(sum) + 1);
    }
  }
  return count;
};
```
