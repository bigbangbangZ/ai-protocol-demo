// debate.js
// 辩论引擎 · 支持AI语义交换协议的结构化元数据传递

class DebateEngine {
    constructor(doubaoKey, doubaoEndpoint, deepseekKey) {
        this.doubaoKey = doubaoKey;
        this.doubaoEndpoint = doubaoEndpoint;
        this.deepseekKey = deepseekKey;
        this.debateHistory = [];
    }

    async startDebate(topic, rounds = 2) {
        this.debateHistory = [];

        // 初始化双方的消息历史（均不含系统提示词，由 api.js 自动添加）
        let doubaoMessages = [
            { role: 'user', content: `你是一个AI辩论专家，当前是正方，必须坚定地支持并论证以下观点：“${topic}”。请发表你的开场陈述。` }
        ];

        let deepseekMessages = [
            { role: 'user', content: `你是一个AI辩论专家，当前是反方，必须坚定地反驳并质疑以下观点：“${topic}”。` }
        ];

        for (let i = 0; i < rounds; i++) {
            console.log(`--- 第 ${i + 1} 轮辩论开始 ---`);

            // ========== 正方（豆包）发言 ==========
            console.log('豆包 (正方) 正在生成回应...');
            const doubaoTurn = await callDoubao(this.doubaoKey, this.doubaoEndpoint, doubaoMessages);
            this._addToHistory('doubao', '正方', doubaoTurn);

            // 将豆包的完整JSON响应加入自己的历史，以保持上下文
            doubaoMessages.push({ role: 'assistant', content: JSON.stringify(doubaoTurn) });

            // 构建传递给反方（DeepSeek）的结构化消息（方案二）
            const doubaoMetaMessage = this._buildMetaMessage(
                '正方',
                doubaoTurn.utterance,
                doubaoTurn.focus,
                doubaoTurn.extension,
                doubaoTurn.confidence,
                doubaoTurn.convergence_process
            );
            deepseekMessages.push({ role: 'user', content: doubaoMetaMessage });

            // ========== 反方（DeepSeek）发言 ==========
            console.log('DeepSeek (反方) 正在生成回应...');
            const deepseekTurn = await callDeepSeek(this.deepseekKey, deepseekMessages);
            this._addToHistory('deepseek', '反方', deepseekTurn);

            // 将DeepSeek的完整JSON响应加入自己的历史
            deepseekMessages.push({ role: 'assistant', content: JSON.stringify(deepseekTurn) });

            // 构建传递给正方（豆包）的结构化消息
            const deepseekMetaMessage = this._buildMetaMessage(
                '反方',
                deepseekTurn.utterance,
                deepseekTurn.focus,
                deepseekTurn.extension,
                deepseekTurn.confidence,
                deepseekTurn.convergence_process
            );
            doubaoMessages.push({ role: 'user', content: deepseekMetaMessage });

            console.log(`--- 第 ${i + 1} 轮辩论结束 ---`);
        }

        console.log('辩论结束，协议交换完成。');
        return this.debateHistory;
    }

    /**
     * 构建包含元数据的结构化消息（方案二核心）
     * 将对方模型的思考过程以JSON代码块形式嵌入，便于AI解析
     */
    _buildMetaMessage(role, utterance, focus, extension, confidence, convergence) {
        // 将延展字段统一为字符串展示（如果是数组则用顿号连接）
        const extensionStr = Array.isArray(extension) ? extension.join('、') : extension;

        return `【来自${role}的发言及思维元数据】

${utterance}

---
以下为对方模型根据「AI语义交换协议」提供的内部计算元数据，请你在理解其思考过程的基础上进行回应：

\`\`\`json
{
  "focus": "${focus}",
  "extension": "${extensionStr}",
  "confidence": ${confidence},
  "convergence_process": "${convergence}"
}
\`\`\`

请结合上述信息，继续你的论证。`;
    }

    /**
     * 内部方法：记录每一轮发言到历史数组（用于前端展示）
     */
    _addToHistory(model, stance, data) {
        this.debateHistory.push({
            model: model,
            stance: stance,
            utterance: data.utterance,
            focus: data.focus,
            extension: data.extension,
            confidence: data.confidence,
            convergence_process: data.convergence_process,
            timestamp: new Date().toISOString()
        });
    }
}