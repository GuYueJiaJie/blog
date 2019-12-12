[221.最大正方形](https://leetcode-cn.com/problems/maximal-square/submissions/)

[力扣 JS 题解。](https://github.com/GuYueJiaJie/blog/blob/master/%E7%AE%97%E6%B3%95%E4%B8%8E%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84/README.md) 

## 暴力解法

**时间复杂度**：`O((mn)²)`。   
**空间复杂度**：`O(1)`。

```javascript
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function(matrix) {
    let rows = matrix.length,
        cols = rows > 0 ? matrix[0].length : 0;
    let maxSideLength = 0; // 表示最大的边长
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (matrix[i][j] === "1") {
                let flag = true,
                    sideLength = 1;
                while (i + sideLength < rows && j + sideLength < cols && flag) {
                    for (let k = i; k <= i + sideLength; k++) {
                        // 注意此处是j+sideLength
                        if (matrix[k][j+sideLength] === "0") {
                            flag = false;
                            break;
                        }
                    }
                    
                    for (let k = j; k <= j + sideLength; k++) {
                        // 注意此处是i+sideLength
                        if (matrix[i+sideLength][k] === "0") {
                            flag = false;
                            break;
                        }
                    }
                    
                    if (flag) {
                        sideLength++;
                    }
                }
                maxSideLength = Math.max(maxSideLength, sideLength);
            }
        }
    }
    return maxSideLength * maxSideLength;
};
```

## 动态规划

**时间复杂度**：`O(mn)`。   
**空间复杂度**：`O(mn)`。

```javascript
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function(matrix) {
    let rows = matrix.length,
        cols = rows > 0 ? matrix[0].length : 0;
    let maxSideLength = 0;
    // 初始化二维数组
    // dp[i][j]表示matrix[i-1][j-1]所能构成的正方形的最大边长
    let dp = new Array(rows+1);
    for (let i = 0; i <= rows; i++) {
        dp[i] = new Array(cols+1).fill(0);
    }
    
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            if (matrix[i-1][j-1] === "1") {
                // 状态转移方程
                dp[i][j] = Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1;
                maxSideLength = Math.max(maxSideLength, dp[i][j]);
            }
        }
    }
    return maxSideLength * maxSideLength;
};
```

## 动态规划的优化

这里是一个常见的对于动态规划的空间复杂度的优化问题，本题的不同之处在于，还需要保存`dp[i-1][j-1]`处的值，因此，使用一个临时变量将`dp[i-1][j-1]`进行保存即可。

**时间复杂度**：`O(mn)`。   
**空间复杂度**：`O(n)`。

```javascript
/**
 * @param {character[][]} matrix
 * @return {number}
 */
var maximalSquare = function(matrix) {
    let rows = matrix.length,
        cols = rows > 0 ? matrix[0].length : 0;
    let maxSideLength = 0, prev = 0;
    let dp = new Array(cols+1).fill(0);
    
    for (let i = 1; i <= rows; i++) {
        for (let j = 1; j <= cols; j++) {
            let temp = dp[j];
            if (matrix[i-1][j-1] === "1") {
                dp[j] = Math.min(dp[j-1], prev, dp[j]) + 1;
                maxSideLength = Math.max(dp[j], maxSideLength);
            } else {
                dp[j] = 0;
            }
            
            prev = temp;;
        }
    }
    
    return maxSideLength * maxSideLength;
};
```