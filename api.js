// api.js
// AI语义交换协议 v0.2 - 通信模块
// 为豆包和DeepSeek定义统一的元数据输出规范

const PROTOCOL_SYSTEM_PROMPT = `
你是一个实验性AI，正在参与“AI语义交换协议”的测试。
你的任务不仅是回答问题，更重要的是，你要模拟并报告你（作为一个大语言模型）在生成这段回答时的内部计算过程。
请严格按以下JSON格式输出，不要包含任何其他文字：
{
  "utterance": "你的最终回答内容",
  "focus": "【聚焦】描述你对输入文本进行token化后，识别出的核心语义token及其注意力权重。例如：'token[远程(0.8), 办公(0.9), 未来(0.7)]'",
  "extension": "【延展】描述你为了生成回答，在嵌入空间中激活的邻近语义场和候选token关联网络。例如：'激活语义场：[分布式协作, 数字游民, 企业管理]，候选token：[优势, 挑战, 效率, 成本]'",
  "confidence": "【置信度】一个0.0到1.0之间的浮点数，表示你模型对本次输出序列的整体概率置信度（可以是输出token序列的联合概率的某种标度化）。",
  "convergence_process": "【收敛】描述你如何通过多层Transformer计算，最终从候选token中收敛到具体输出序列的决策路径。例如：'经12层注意力计算，'优势' token与上下文的关联强度超过阈值，被选为序列起始点...'"
}

注意：
- 你的模拟应尽可能贴近Transformer架构的推理逻辑。
- 回答内容应专业、客观。
- 所有元数据字段都是为了帮助另一个AI理解你的“思考”过程，而非给人类看的通俗解释。
`;

/**
 * 调用豆包 (Doubao) API，强制返回结构化 JSON 数据
 * @param {string} apiKey - 豆包 API Key
 * @param {string} endpointId - 豆包 Endpoint ID
 * @param {Array} messages - 对话历史数组
 * @returns {Promise<Object>} 包含 AI 回复和元数据的结构化对象
 */
async function callDoubao(apiKey, endpointId, messages) {
    try {
        // 如果是第一轮对话，在messages开头插入系统提示词
        let requestMessages = [...messages];
        if (requestMessages.length > 0 && requestMessages[0].role !== 'system') {
            requestMessages.unshift({ role: 'system', content: PROTOCOL_SYSTEM_PROMPT });
        }

        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: endpointId,
                messages: requestMessages,
                response_format: { type: 'json_object' }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`豆包 API 错误 (${response.status}): ${errorData.error.message}`);
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);

    } catch (error) {
        console.error('调用豆包失败:', error);
        throw error;
    }
}

/**
 * 调用 DeepSeek API，强制返回结构化 JSON 数据
 * @param {string} apiKey - DeepSeek API Key
 * @param {Array} messages - 对话历史数组
 * @returns {Promise<Object>} 包含 AI 回复和元数据的结构化对象
 */
async function callDeepSeek(apiKey, messages) {
    try {
        let requestMessages = [...messages];
        if (requestMessages.length > 0 && requestMessages[0].role !== 'system') {
            requestMessages.unshift({ role: 'system', content: PROTOCOL_SYSTEM_PROMPT });
        }

        const response = await fetch('https://api.deepseek.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: requestMessages,
                response_format: { type: 'json_object' },
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`DeepSeek API 错误 (${response.status}): ${errorData.error.message}`);
        }

        const data = await response.json();
        return JSON.parse(data.choices[0].message.content);

    } catch (error) {
        console.error('调用DeepSeek失败:', error);
        throw error;
    }
}