[76.最小覆盖子串](https://leetcode-cn.com/problems/minimum-window-substring/submissions/)    

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md)   

对于子串问题，可以优先想到使用滑动窗口来解决，本题也不例外，可以使用滑动窗口来进行处理。   

处理过程分为以下几步：   

1. 在字符串s中设置双指针left和right，left和right初始化为0，`[left, right]`为一个滑动窗口。   
2. 不断增大right的值，直到滑动窗口能够匹配到给定的t字符串。   
3. 移动left指针对滑动窗口进行优化，移动left过程中需要记录最新的能够匹配t的left和right的值；当滑动窗口匹配不到t时，停止优化。   
4. 重复第2步和第3步，直到字符串s遍历结束。   

思路不难，但难在处理，有了思路之后，本题中核心问题就变成了怎么判断滑动窗口能否匹配到t字符串的问题。   

为了解决是否匹配的问题，可以设置两个辅助map：  
- 一个tMap用于记录字符串t中每一个字符出现的次数；
- 一个windowMap用于记录当前滑动窗口中每一个字符出现的次数；
- 同时设置一个辅助变量matchNum表示已经成功匹配到的字符的个数，当matchNum等于tMap.size时，就表示当前滑动窗口能够成功匹配到t字符串。  

方法一就是以上思路，滑动窗口系列问题可以前往[力扣JS题解](https://github.com/GuYueJiaJie/blog/tree/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)进行查看。   

## 方法一


```javascript
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    if (s.length === 0 || t.length === 0) return "";
    let tMap = new Map(); // 目标子串t的辅助map，用于记录t中每个字符的出现次数
    // 对tMap进行初始化，记录每一个字符出现的次数
    for (let i = 0; i < t.length; i++) {
        let char = t[i];
        if (tMap.has(char)) {
            tMap.set(char, tMap.get(char) + 1);
        } else {
            tMap.set(char, 1);
        }
    }
    
    let windowMap = new Map(); // 滑动窗口的辅助map，用于记录当前滑动窗口中各个字符出现的次数
    let matchNum = 0; // 记录滑动窗口中对应字符匹配到t中字符的个数
    
    let left = 0, right = 0; // 定义左右指针
    
    let miniLength = -1, // 记录最小长度
        miniLeft = 0, // 长度最小是左指针下标
        miniRight = 0; // 长度最小时右指针下标
    
    while (right < s.length) {
        let char = s[right];
        // 对windowMap进行初始化
        if (windowMap.has(char)) {
            windowMap.set(char, windowMap.get(char)+1);
        } else {
            windowMap.set(char, 1);
        }
        
        // 如果某一个字符的次数匹配成功，则matchNum个数加1
        if (tMap.has(char) && windowMap.get(char) === tMap.get(char)) {
            matchNum++
        }
        
        // 如果已匹配成功字符的个数等于tMap的长度，则说明当前滑动窗口中已经存在t
        // 则对滑动窗口进行优化
        while (matchNum === tMap.size) {
            char = s[left];
            // 只有当滑动窗口长度小于当前最小覆盖子串的长度时，才重新计算miniLeft和miniRight
            // 第一次时需要计算
            if (miniLength === -1 || right - left + 1 < miniLength) {
                miniLength = right- left + 1;
                miniLeft = left;
                miniRight = right;
            }
            
            // 删除滑动窗口中的char，修改windowMap中char的个数
            windowMap.set(char, windowMap.get(char) - 1);
            
            // 如果当前字符的个数小于t中需求的个数，则匹配到的字符个数matchNum减1
            if (tMap.has(char) && windowMap.get(char) < tMap.get(char)) {
                matchNum--;
            }
            left++;
        }
        right++;
    }
    return miniLength === -1 ? "" : s.substring(miniLeft, miniRight+1);
};
```

## 方法二   

优化方法是先对字符串s进行遍历，然后只记录字符串t中出现的字符及其下标，在进行双指针遍历时，只遍历t中存在的有效字符。   

只有在s长度远大于有效字符个数时，有明显效果。