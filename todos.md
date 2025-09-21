Ruby Helpers Cheat Sheet

⸻

🔢 Numbers & Iterations

Code Result
5.times { ... } repeats the block 5 times
1.upto(5) { ... } counts from 1 to 5 (inclusive)
5.downto(1) { ... } counts from 5 down to 1
(1..5).each { ... } iterates over a range
(1..10).step(2) { ... } increments by 2 each time

⸻

📝 Strings

Code Result
"Hello".upcase "HELLO"
"Hello".downcase "hello"
"Hello".capitalize "Hello"
"Hello".swapcase "hELLO"
"Hello".reverse "olleH"
"Hello".gsub("H", "J") "Jello" (replace)
"Hello".include?("lo") true
"   hi   ".strip "hi"
"hi".ljust(5, ".") "hi..."
"hi".rjust(5, ".") "...hi"
"abc".chars ["a", "b", "c"]

Destructive versions with ! exist (upcase!, downcase!, strip!, …) which modify the string in place.

⸻

📦 Arrays

Code Result
`[1,2,3].each { x
`[1,2,3].map { x
`[1,2,3].select { x
`[1,2,3].reject { x
[1,2,3].include?(2) true
[1,2,3].first 1
[1,2,3].last 3
[1,2,3].push(4) / << 4 [1,2,3,4]
[1,2,3,4].pop removes and returns 4
[1,2,3].join("-") "1-2-3"
"1,2,3".split(",") ["1","2","3"]
[1,2,3].shuffle random order
[1,2,3].uniq removes duplicates
[1,2,3].sample picks a random element

⸻

🗂️ Hashes

Code Result
{a: 1, b: 2}.keys [:a, :b]
{a: 1, b: 2}.values [1, 2]
{a: 1, b: 2}[:a] 1
{a: 1, b: 2}.merge({c: 3}) {a:1, b:2, c:3}
`{a: 1, b: 2}.each { k,v
