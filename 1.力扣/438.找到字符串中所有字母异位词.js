/*
 * @lc app=leetcode.cn id=438 lang=javascript
 *
 * [438] 找到字符串中所有字母异位词
 *
 * https://leetcode-cn.com/problems/find-all-anagrams-in-a-string/description/
 *
 * algorithms
 * Medium (53.79%)
 * Likes:    756
 * Dislikes: 0
 * Total Accepted:    138K
 * Total Submissions: 256.5K
 * Testcase Example:  '"cbaebabacd"\n"abc"'
 *
 * 给定两个字符串 s 和 p，找到 s 中所有 p 的 异位词 的子串，返回这些子串的起始索引。不考虑答案输出的顺序。
 *
 * 异位词 指由相同字母重排列形成的字符串（包括相同的字符串）。
 *
 *
 *
 * 示例 1:
 *
 *
 * 输入: s = "cbaebabacd", p = "abc"
 * 输出: [0,6]
 * 解释:
 * 起始索引等于 0 的子串是 "cba", 它是 "abc" 的异位词。
 * 起始索引等于 6 的子串是 "bac", 它是 "abc" 的异位词。
 *
 *
 * 示例 2:
 *
 *
 * 输入: s = "abab", p = "ab"
 * 输出: [0,1,2]
 * 解释:
 * 起始索引等于 0 的子串是 "ab", 它是 "ab" 的异位词。
 * 起始索引等于 1 的子串是 "ba", 它是 "ab" 的异位词。
 * 起始索引等于 2 的子串是 "ab", 它是 "ab" 的异位词。
 *
 *
 *
 *
 * 提示:
 *
 *
 * 1 <= s.length, p.length <= 3 * 10^4
 * s 和 p 仅包含小写字母
 *
 *
 */

// @lc code=start
/**
 * @param {string} s
 * @param {string} p
 * @return {number[]}
 */
var findAnagrams = function (s, p) {
    const map = new Map();

    for (let c of p) {
        mapSet(map, c);
    }

    let left = (right = 0);
    let validStr = 0;
    const windowsMap = new Map();
    const result = [];

    while (right < s.length) {
        const char = s[right];
        right++;

        if (map.has(char)) {
            mapSet(windowsMap, char);

            if (map.get(char) === windowsMap.get(char)) {
                validStr++;
            }
        }

        while (right - left >= p.length) {
            if (validStr === map.size) {
                result.push(left);
            }

            const delChar = s[left];
            left++;

            if (map.has(delChar)) {
                if (map.get(delChar) === windowsMap.get(delChar)) {
                    validStr--;
                }

                windowsMap.set(delChar, windowsMap.get(delChar) - 1);
            }
        }
    }

    return result;
};

function mapSet(map, char) {
    if (map.has(char)) {
        map.set(char, map.get(char) + 1);
    } else {
        map.set(char, 1);
    }
}
// @lc code=end
