[169.求众数。](https://leetcode-cn.com/problems/majority-element/solution/java-wei-yun-suan-by-mxnhujryvx/)

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md)

## 方法一 哈希

可以采用 hash 来存储每个数字出现过的次数，最后找出出现次数最大的那个（或者次数大于`⌊ n/2 ⌋`的那个）即可。

时间和空间复杂度均为`O(N)`。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  let map = new Map();
  for (let i = 0; i < nums.length; i++) {
    if (!map.has(nums[i])) {
      map.set(nums[i], 1);
    } else {
      map.set(nums[i], map.get(nums[i]) + 1);
    }
  }
  let maxKey;
  let maxNum = -Infinity;
  for (let [key, value] of map.entries()) {
    if (value > maxNum) {
      maxKey = key;
      maxNum = value;
    }
  }
  return maxKey;
};
```

## 方法二 摩尔投票法

这个是借鉴[别人的方法](https://leetcode-cn.com/problems/majority-element/solution/du-le-le-bu-ru-zhong-le-le-ru-he-zhuang-bi-de-qiu-/)，感觉想法很巧妙。

可以把问题换个角度去考虑，因为要找的数出现次数是大于`⌊ n/2 ⌋`的，所以要找的数的出现次数一定大于其他所有数出现次数的和。

可以设置一个临时变量 tmpNum 表示当前数组，设置一个 tmpTimes 表示当前变量出现的次数。

如果 tmpNum 与当前数相同，tmpTimes 加 1；如果不同则 tmpTimes 减 1。

如果 tmpTimes 等于 0，则将 tmpNum 设置为当前数。

```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var majorityElement = function(nums) {
  let tmpNum;
  let tmpTimes = 0;
  for (let i = 0; i < nums.length; i++) {
    if (tmpTimes === 0) {
      tmpNum = nums[i];
      tmpTimes = 1;
    } else if (tmpNum === nums[i]) {
      tmpTimes++;
    } else {
      tmpTimes--;
    }
  }
  return tmpNum;
};
```

**时间复杂度**：`O(N)`

**空间复杂度**：`O(1)`
