# Generate SSE API

## 创建推文生成会话 POST /api/twitter/generate/session
 
#### 功能说明：

基于用户输入创建推文生成会话，为流式生成做准备
验证用户积分是否充足（不同模式消耗不同积分）
获取用户个性化设置并保存到session中
返回session_id用于后续流式生成调用

#### 请求参数：

* user_input: 用户输入内容（必填）
  * 描述要生成的推文主题或内容需求
  * 最少1个字符，支持中英文
* content_format: 内容格式，可选值：
  * thread: 推文串格式（默认）
  * longform: 长文格式
* mode: 生成模式，可选值：
  * lite: 轻量模式（默认）- 10积分，支持流式输出
  * analysis: 分析模式 - 10积分，深度分析+流式输出
  * deep: 深度研究模式 - 50积分，仅支持同步输出（不支持流式）
  * 注意：session模式不支持draft草案模式

#### 积分消耗：

* lite/analysis模式: 10 credits
* deep模式: 50 credits
* 积分不足时返回错误，不会创建session

#### 响应说明：

* session_id: 会话ID，用于后续流式生成调用
* 会话包含用户输入、个性化设置、生成模式等所有配置信息
* session具有一定有效期，建议创建后及时使用
#### 使用流程：

1. 调用此接口获取session_id
2. 使用session_id调用 /api/twitter/generate/stream 进行流式生成
3. 注意deep模式需要使用同步接口而非流式接口

#### 错误场景：

* 积分不足：返回 INSUFFICIENT_CREDITS 错误
* 用户输入为空或过短：返回参数验证错误
* 服务器内部错误：返回 INTERNAL_ERROR 错误

```json
// req 
{
  "user_input": "string",
  "content_format": "thread",
  "mode": "lite"
}


// res 
{
  "status": "string",
  "message": "string",
  "data": {
    "session_id": "string"
  },
  "code": 0
}
```


## 流式生成Twitter推文内容（基于会话） GET /api/twitter/generate/stream

#### 功能说明：
* 基于已创建的会话，实时流式生成完整的推文串或长文内容
* 返回Server-Sent Events (SSE)格式的实时数据流
* 支持生成过程的实时进度更新和状态监控
* 使用session管理，确保生成过程的安全性和连续性
* 在生成完成后自动扣除对应积分

#### 请求参数：
* **session_id**: 会话ID（必填）
  * 从 /api/twitter/generate/session 接口获得
  * 会话必须存在且有效，否则返回错误
  * 会话包含所有生成所需的配置信息

#### 支持的生成模式：
* **lite模式**: 轻量快速生成，支持流式输出
* **analysis模式**: 深度分析生成，包含更多研究步骤，支持流式输出
* **deep模式**: 仅支持同步接口，不支持此流式接口

#### 响应格式：
* 使用SSE (Server-Sent Events) 实时推送生成进度
* Content-Type: text/event-stream
* 事件类型包括：
  * expand_url.start/done: URL扩展处理
  * analyze_input.start/done: 输入分析处理
  * web_search.start/done: 网络搜索处理（analysis模式）
  * generate_tweet.start/done: 推文生成处理
  * extract_outline.start/done: 大纲提取处理
  * session.done: 生成完成，包含最终结果
  * error: 错误事件

#### 使用场景：
* 适用于需要实时反馈生成进度的前端应用
* 支持长时间运行的内容生成任务（特别是analysis模式）
* 可以在生成过程中向用户展示实时状态和进度
* 提供更好的用户体验，避免长时间等待

#### 使用流程：
1. 先调用 /api/twitter/generate/session 创建会话
2. 使用返回的session_id调用此接口进行流式生成
3. 监听SSE事件流，实时显示生成进度
4. 等待 session.done 事件获取最终生成结果

### 错误处理：
* session不存在或无效：返回错误事件
* 生成过程中出错：返回error事件并中断流
* 积分不足：在session创建时已验证，此处不会出现
* 网络或服务异常：返回相应的错误事件

#### 注意事项：
* deep模式不支持流式输出，请使用同步生成接口
* 建议在前端实现超时机制，避免长时间等待
* SSE连接可能因网络问题中断，需要实现重连机制

#### 参考数据例子
```yml
event: session.start
data: {"event_type": "session.start", "message": "Start...", "data": {}}

event: analyze_input.start
data: {"event_type": "analyze_input.start", "message": "Starting user input analysis", "data": {}}

event: analyze_input.done
data: {"event_type": "analyze_input.done", "message": "Finished analyzing user input", "data": {"topic": "Summarize the content of the specified tweet and verify it via web search", "language": "Chinese"}}

event: fetch_url.start
data: {"event_type": "fetch_url.start", "message": "Starting fetching urls", "data": {"urls": ["https://x.com/tmel0211/status/1965695700005777846"]}}

event: fetch_url.done
data: {"event_type": "fetch_url.done", "message": "Finished fetching urls", "data": {"urls": ["https://x.com/tmel0211/status/1965695700005777846"], "fetched_failures": []}}

event: web_search.start
data: {"event_type": "web_search.start", "message": "Starting web search", "data": {"search_queries": ["tmel0211 tweet 1965695700005777846 summary", "fact check tmel0211 tweet 1965695700005777846", "latest news related to tmel0211 tweet"]}}

event: web_search.done
data: {"event_type": "web_search.done", "message": "Web search completed", "data": {"query_results": {"latest news related to tmel0211 tweet": ["https://www.ainvest.com/news/tmel0211-posted-cryptoinsight-haotian-shared-insights-ethereum-simplified-consensus-roadmap-noting-aligns-vitalik-buterin-expectations-showing-ethereum-commitment-major-overhaul-similar-pow-pos-transition-2509/", "https://twitter.com/ProjectZKM/status/1849415785057235073", "https://twitter.com/nervosnetwork/?lang=bn"]}}}

event: generate_tweet.start
data: {"event_type": "generate_tweet.start", "message": "Starting generating content", "data": {}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "刚看到一个有趣的观察 "}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "- OpenLedger在TGE前3天内成功上"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "线了Bithumb和Upbit两大韩国"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "交易所 📈\n\n这背后反映了一"}}

: ping - 2025-09-10 09:06:11.579162+00:00

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "个值得思考的市场现象：在"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "当前\"VC币上币即"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "巅峰\"的魔咒下，项"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "目方的上所策略正在发"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "生微妙变化\n\n🔍 策"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "略对比很明显：\n• 币安路"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "线：需要承担高"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "昂的airdrop成本，"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "竞争激烈\n• Upbit路线："}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "虽无明确规则，但本"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "土化运营效果显著\n\nOpen"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "Ledger的韩国市"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "场策略特别值得关注 "}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "🇰🇷\n\n他们在上"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "所前的准备工作堪称\"教"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "科书级别\"：\n- 设"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "立70亿韩元开发者基金\n- 向"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "韩国洪水受灾者捐款\n- "}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "举办全国性\"Paldo\"营销活动"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "\n\n这已经超越了纯商业考量，更"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "像是一种\"文化输入\"策略 🎯"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "\n\n在全球化的crypto市场中，深度本土化运"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "营可能比单纯的技"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "术或资金优势更重要。项"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "目方需要真正理解并融"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "入当地文化，而不是简单的"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "\"一刀切\"全球策"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "略\n\n这种差异化的"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "市场进入策略，或"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "许正在重新定义项"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "目成功的路径 "}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "💭"}}

event: generate_tweet.done
data: {"event_type": "generate_tweet.done", "message": "Content generation completed", "data": {}}

event: extract_outline.start
data: {"event_type": "extract_outline.start", "message": "Starting outline extraction", "data": {}}

event: extract_outline.done
data: {"event_type": "extract_outline.done", "message": "Outline extraction completed", "data": {}}

event: session.done
data: {"event_type": "session.done", "message": "Done", "data": {"outline": {"id": "c2542828-3f30-4e9e-b515-827f9a10e469", "topic": "OpenLedger韩国上市策略与市场现象分析", "content_format": "longform", "nodes": [{"title": "Opening Hook", "tweets": [{"tweet_number": 1, "title": "OpenLedger成功上线韩国交易所的有趣观察", "content": "刚看到一个有趣的观察 - OpenLedger在TGE前3天内成功上线了Bithumb和Upbit两大韩国交易所 📈", "image_url": null}]}, {"title": "市场现象与上所策略变化", "tweets": [{"tweet_number": 2, "title": "VC币上币即巅峰魔咒下的策略变化", "content": "这背后反映了一个值得思考的市场现象：在当前\"VC币上币即巅峰\"的魔咒下，项目方的上所策略正在发生微妙变化\n\n🔍 策略对比很明显：\n• 币安路线：需要承担高昂的airdrop成本，竞争激烈\n• Upbit路线：虽无明确规则，但本土化运营效果显著", "image_url": null}]}, {"title": "OpenLedger的韩国本土化策略", "tweets": [{"tweet_number": 3, "title": "OpenLedger的本土化准备与文化输入", "content": "OpenLedger的韩国市场策略特别值得关注 🇰🇷\n\n他们在上所前的准备工作堪称\"教科书级别\"：\n- 设立70亿韩元开发者基金\n- 向韩国洪水受灾者捐款\n- 举办全国性\"Paldo\"营销活动\n\n这已经超越了纯商业考量，更像是一种\"文化输入\"策略 🎯", "image_url": null}]}, {"title": "本土化运营的重要性与市场策略新趋势", "tweets": [{"tweet_number": 4, "title": "深度本土化与差异化市场进入策略的意义", "content": "在全球化的crypto市场中，深度本土化运营可能比单纯的技术或资金优势更重要。项目方需要真正理解并融入当地文化，而不是简单的\"一刀切\"全球策略\n\n这种差异化的市场进入策略，或许正在重新定义项目成功的路径 💭", "image_url": null}]}], "total_tweets": 4}}}

: ping - 2025-09-10 09:06:26.652304+00:00


```


```yml
event: session.start
data: {"event_type": "session.start", "message": "Start...", "data": {}}

event: analyze_input.start
data: {"event_type": "analyze_input.start", "message": "Starting user input analysis", "data": {}}

event: analyze_input.done
data: {"event_type": "analyze_input.done", "message": "Finished analyzing user input", "data": {"topic": "网球正手拉拍技术（Tennis Forehand Backswing Technique）", "language": "Chinese"}}

event: generate_tweet.start
data: {"event_type": "generate_tweet.start", "message": "Starting generating content", "data": {}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "1/6\n\n网球正手拉拍不"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "是简单的挥拍动作——它是一套"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "精密的生物力学系统。当"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "你掌握了这套技术的"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "核心原理，你就能从"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "业余选手蜕变为场"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "上的统治者。让我们深入"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "剖析这个让无数球员"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "头疼的技术难"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "题 🎾\n\n2/6\n\n正"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "手拉拍的秘密在于\""}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "鞭打效应\"——从脚"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "踝开始的动力链"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "传递。很多人以为是"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "手臂在发力，实际上：\n•"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": " 腿部蹬地提供基础动力\n• "}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "髋部旋转放大力量\n• "}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "躯干扭转加速传递\n• 肩膀"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "顺势而动\n• 手臂只是最"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "后的执行者\n\n这就是为什么职"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "业选手看起来毫不费力，"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "却能打出致命球速的原因。\n\n3/6"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "\n\n拉拍时机是关键中"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "的关键。大多数业余选手"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "犯的致命错误：看到"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "球才开始准备。正确的节"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "奏应该是：\n\n判断来"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "球方向 → 立即开始"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "拉拍 → 球在对方拍"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "面离开瞬间完成拉拍"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "\n\n这0.5秒的时间差，决定"}}

: ping - 2025-09-12 03:19:44.946529+00:00

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "了你是被动应付还是主动进"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "攻。职业选手的预判能力，本质上就是对"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "这个时间窗口的精准把控。\n\n4/6"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "\n\n拉拍轨迹的物"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "理学原理让人着迷：\n\n直"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "线拉拍 = 力量"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "浪费\n弧形拉拍 = 能"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "量最大化\n\n想象你在"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "甩鞭子——直线运动无"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "法积蓄足够势能，只"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "有弧形轨迹才能让"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "肌肉群依次发力。这"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "就是为什么费德勒的"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "拉拍看起来如此优雅流畅，每"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "个动作都在为下一个环节"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "蓄能。\n\n5/6\n\n常"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "见的拉拍误区，90%的球"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "员都中招：\n\n❌ 拉拍过"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "高：破坏击球角度\n❌ 拉"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "拍不够：力量传递中"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "断  \n❌ 拉拍过早"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "：节奏混乱\n❌ "}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "拉拍僵硬：肌肉对"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "抗\n\n正确的拉拍应该像"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "弹簧压缩一样——"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "自然、流畅、充满弹性。记"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "住，技术不是死板的模"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "仿，而是身体协调性的"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "艺术表达。\n\n6/6\n\n掌握正手拉拍"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "技术需要时间，但理解原理能"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "让你事半功倍。从"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "今天开始，每次"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "挥拍都想想动"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "力链传递，感受身体各"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "部位的协调配合。"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "\n\n你的正手拉拍"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "遇到过什么困难？"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "在评论区分享你的经"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "验，让我们一起进"}}

event: generate_tweet.delta
data: {"event_type": "generate_tweet.delta", "message": "Generated content delta", "data": {"content": "步！🚀"}}

event: generate_tweet.done
data: {"event_type": "generate_tweet.done", "message": "Content generation completed", "data": {}}

event: extract_outline.start
data: {"event_type": "extract_outline.start", "message": "Starting outline extraction", "data": {}}

: ping - 2025-09-12 03:19:59.946701+00:00

event: extract_outline.done
data: {"event_type": "extract_outline.done", "message": "Outline extraction completed", "data": {}}

event: message.start
data: {"event_type": "message.start", "message": "Start responding to user", "data": {}}

event: message.done
data: {"event_type": "message.done", "message": "Message done", "data": {"text": "Your content has been generated! If you need further refinement or have other requests, feel free to let us know."}}

event: session.done
data: {"event_type": "session.done", "message": "Done", "data": {"outline": {"id": "959cf005-ed91-4df5-8e46-c7cd636a18b5", "topic": "网球正手拉拍的生物力学与技术要点", "content_format": "longform", "nodes": [{"title": "Opening Hook", "tweets": [{"tweet_number": 1, "title": "正手拉拍的核心与重要性", "content": "网球正手拉拍不是简单的挥拍动作——它是一套精密的生物力学系统。当你掌握了这套技术的核心原理，你就能从业余选手蜕变为场上的统治者。让我们深入剖析这个让无数球员头疼的技术难题 🎾", "image_url": null}]}, {"title": "动力链与鞭打效应", "tweets": [{"tweet_number": 2, "title": "鞭打效应与动力链传递", "content": "正手拉拍的秘密在于\"鞭打效应\"——从脚踝开始的动力链传递。很多人以为是手臂在发力，实际上：\n• 腿部蹬地提供基础动力\n• 髋部旋转放大力量\n• 躯干扭转加速传递\n• 肩膀顺势而动\n• 手臂只是最后的执行者\n\n这就是为什么职业选手看起来毫不费力，却能打出致命球速的原因。", "image_url": null}]}, {"title": "拉拍时机与轨迹原理", "tweets": [{"tweet_number": 3, "title": "拉拍时机的重要性", "content": "拉拍时机是关键中的关键。大多数业余选手犯的致命错误：看到球才开始准备。正确的节奏应该是：\n\n判断来球方向 → 立即开始拉拍 → 球在对方拍面离开瞬间完成拉拍\n\n这0.5秒的时间差，决定了你是被动应付还是主动进攻。职业选手的预判能力，本质上就是对这个时间窗口的精准把控。", "image_url": null}, {"tweet_number": 4, "title": "拉拍轨迹的物理学原理", "content": "拉拍轨迹的物理学原理让人着迷：\n\n直线拉拍 = 力量浪费\n弧形拉拍 = 能量最大化\n\n想象你在甩鞭子——直线运动无法积蓄足够势能，只有弧形轨迹才能让肌肉群依次发力。这就是为什么费德勒的拉拍看起来如此优雅流畅，每个动作都在为下一个环节蓄能。", "image_url": null}]}, {"title": "常见误区与技术提升建议", "tweets": [{"tweet_number": 5, "title": "拉拍常见误区与正确方法", "content": "常见的拉拍误区，90%的球员都中招：\n\n❌ 拉拍过高：破坏击球角度\n❌ 拉拍不够：力量传递中断  \n❌ 拉拍过早：节奏混乱\n❌ 拉拍僵硬：肌肉对抗\n\n正确的拉拍应该像弹簧压缩一样——自然、流畅、充满弹性。记住，技术不是死板的模仿，而是身体协调性的艺术表达。", "image_url": null}, {"tweet_number": 6, "title": "技术掌握与互动鼓励", "content": "掌握正手拉拍技术需要时间，但理解原理能让你事半功倍。从今天开始，每次挥拍都想想动力链传递，感受身体各部位的协调配合。\n\n你的正手拉拍遇到过什么困难？在评论区分享你的经验，让我们一起进步！🚀", "image_url": null}]}], "total_tweets": 6}}}


```