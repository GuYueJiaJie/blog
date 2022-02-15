/*
 * @lc app=leetcode.cn id=567 lang=javascript
 *
 * [567] 字符串的排列
 *
 * https://leetcode-cn.com/problems/permutation-in-string/description/
 *
 * algorithms
 * Medium (43.47%)
 * Likes:    540
 * Dislikes: 0
 * Total Accepted:    145.4K
 * Total Submissions: 334.5K
 * Testcase Example:  '"ab"\n"eidbaooo"'
 *
 * 给你两个字符串 s1 和 s2 ，写一个函数来判断 s2 是否包含 s1 的排列。如果是，返回 true ；否则，返回 false 。
 *
 * 换句话说，s1 的排列之一是 s2 的 子串 。
 *
 *
 *
 * 示例 1：
 *
 *
 * 输入：s1 = "ab" s2 = "eidbaooo"
 * 输出：true
 * 解释：s2 包含 s1 的排列之一 ("ba").
 *
 *
 * 示例 2：
 *
 *
 * 输入：s1= "ab" s2 = "eidboaoo"
 * 输出：false
 *
 *
 *
 *
 * 提示：
 *
 *
 * 1 <= s1.length, s2.length <= 10^4
 * s1 和 s2 仅包含小写字母
 *
 *
 */

// @lc code=start
/**
 * @param {string} s1
 * @param {string} s2
 * @return {boolean}
 */
var checkInclusion = function (s1, s2) {
    const map = new Map();

    for (let c of s1) {
        mapSet(map, c);
    }

    let left = (right = valid = 0);
    const windowsMap = new Map();

    while (right < s2.length) {
        const char = s2[right];
        right++;

        if (map.has(char)) {
            mapSet(windowsMap, char);

            if (map.get(char) === windowsMap.get(char)) {
                valid++;
            }
        }

        while (map.size === valid) {
            if (right - left === s1.length) {
                return true;
            }

            const del = s2[left];
            left++;

            if (map.has(del)) {
                if (map.get(del) === windowsMap.get(del)) {
                    valid--;
                }
                windowsMap.set(del, windowsMap.get(del) - 1);
            }
        }
    }

    return false;
};

function mapSet(map, char) {
    if (map.has(char)) {
        map.set(char, map.get(char) + 1);
    } else {
        map.set(char, 1);
    }
}
// @lc code=end
