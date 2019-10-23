[力扣 187.重复的 DNA 序列](https://leetcode-cn.com/problems/repeated-dna-sequences/)

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md)

对于求序列问题，都可以首先考虑一下 set 或者 map，然后利用滑动窗口去解决问题。本题目采用了 set 用于记录出现过的字符串，只需要一次遍历。

遍历过程中对于 set 中存在的字符串，判断结果数组 res 中是否已经存在，存在则跳过，不存在则存进结果数组 res。

```javascript
/**
 * @param {string} s
 * @return {string[]}
 */
var findRepeatedDnaSequences = function(s) {
  if (s.length < 10) return [];
  let set = new Set(),
    tmpStr;
  let res = [];
  for (let left = 0, right = 10; right <= s.length; right++, left++) {
    tmpStr = s.substring(left, right);
    if (!set.has(tmpStr)) {
      set.add(tmpStr);
    } else {
      if (!res.includes(tmpStr)) {
        res.push(tmpStr);
      }
    }
  }
  return res;
};
```
