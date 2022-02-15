/*
 * @lc app=leetcode.cn id=1011 lang=javascript
 *
 * [1011] 在 D 天内送达包裹的能力
 *
 * https://leetcode-cn.com/problems/capacity-to-ship-packages-within-d-days/description/
 *
 * algorithms
 * Medium (62.49%)
 * Likes:    428
 * Dislikes: 0
 * Total Accepted:    67.1K
 * Total Submissions: 107.5K
 * Testcase Example:  '[1,2,3,4,5,6,7,8,9,10]\n5'
 *
 * 传送带上的包裹必须在 days 天内从一个港口运送到另一个港口。
 *
 * 传送带上的第 i 个包裹的重量为
 * weights[i]。每一天，我们都会按给出重量（weights）的顺序往传送带上装载包裹。我们装载的重量不会超过船的最大运载重量。
 *
 * 返回能在 days 天内将传送带上的所有包裹送达的船的最低运载能力。
 *
 *
 *
 * 示例 1：
 *
 *
 * 输入：weights = [1,2,3,4,5,6,7,8,9,10], days = 5
 * 输出：15
 * 解释：
 * 船舶最低载重 15 就能够在 5 天内送达所有包裹，如下所示：
 * 第 1 天：1, 2, 3, 4, 5
 * 第 2 天：6, 7
 * 第 3 天：8
 * 第 4 天：9
 * 第 5 天：10
 *
 * 请注意，货物必须按照给定的顺序装运，因此使用载重能力为 14 的船舶并将包装分成 (2, 3, 4, 5), (1, 6, 7), (8), (9),
 * (10) 是不允许的。
 *
 *
 * 示例 2：
 *
 *
 * 输入：weights = [3,2,2,4,1,4], days = 3
 * 输出：6
 * 解释：
 * 船舶最低载重 6 就能够在 3 天内送达所有包裹，如下所示：
 * 第 1 天：3, 2
 * 第 2 天：2, 4
 * 第 3 天：1, 4
 *
 *
 * 示例 3：
 *
 *
 * 输入：weights = [1,2,3,1,1], D = 4
 * 输出：3
 * 解释：
 * 第 1 天：1
 * 第 2 天：2
 * 第 3 天：3
 * 第 4 天：1, 1
 *
 *
 *
 *
 * 提示：
 *
 *
 * 1 <= days <= weights.length <= 5 * 10^4
 * 1 <= weights[i] <= 500
 *
 *
 */

// @lc code=start
/**
 * @param {number[]} weights
 * @param {number} days
 * @return {number}
 */
var shipWithinDays = function (weights, days) {
    let min = Math.max(...weights),
        max = weights.reduce((prev, cur) => prev + cur);

    // while (min < max) {
    while (min <= max) {
        const mid = min + Math.floor((max - min) / 2);

        // 首先注意这里的边界问题
        // 上面while的判断条件是 min < max时, 这里应该是max = mid
        // 上面是 min <= max 时, 这里应该是max = mid - 1, 不然会死循环
        if (canFinish(weights, days, mid)) {
            // max = mid;
            max = mid - 1;
        } else {
            min = mid + 1;
        }
    }

    // 以条件min <= max举例, 最后跳出循环的时候, max一定比min小1
    // 因为改题的条件是, 一定存在这样的值
    // 所以这时候mid + 1, 也就是min, 就是最终值
    return min;
};

function canFinish(weights, days, power) {
    let index = 0;
    for (let day = 0; day < days; day++) {
        let curPower = power;
        // 判断当前剩余的是否够一天的
        while (curPower - weights[index] >= 0) {
            curPower -= weights[index];
            index++;
            // 如果index等于weights.length, 说明前面你的元素都已经被送达了
            if (index === weights.length) {
                return true;
            }
        }
    }

    return false;
}
// @lc code=end
