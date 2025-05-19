// AI服务，用于调用大语言模型API

// API配置
let apiKey = 'demo-key'; // 演示用API密钥
let currentModel = 'longcat'; // 默认使用LongCat模型
let appId = ''; // 美团大模型的appId

// 设置API密钥
export const setApiKey = (newApiKey) => {
  apiKey = newApiKey;
  console.log('API密钥已设置');
  localStorage.setItem('apiKey', newApiKey);
  return true;
};

// 设置美团大模型的appId
export const setAppId = (newAppId) => {
  appId = newAppId;
  console.log('美团大模型appId已设置');
  localStorage.setItem('mtAppId', newAppId);
  return true;
};

// 设置KIMI API密钥
export const setKimiApiKey = (newApiKey) => {
  apiKey = newApiKey;
  console.log('KIMI API密钥已设置');
  localStorage.setItem('kimiApiKey', newApiKey);
  return true;
};

// 设置当前使用的模型
export const setCurrentModel = (model) => {
  currentModel = model.toLowerCase();
  console.log(`当前模型已设置为: ${model}`);
  return true;
};

// 获取当前使用的模型
export const getCurrentModel = () => {
  return currentModel;
};

// 检查API密钥是否已设置
export const isApiKeySet = () => {
  return true; // 演示环境中始终返回true
};

// 模拟数据 - UEC模型分析结果
const mockUECData = {
  user: [
    { name: "产品经理", description: "负责编写和维护PRD文档，需要高效传达产品需求" },
    { name: "设计师", description: "需要理解产品需求，转化为设计方案" },
    { name: "开发人员", description: "需要理解产品需求，实现功能开发" }
  ],
  event: [
    { name: "导入PRD", description: "用户将PRD文档导入到系统中" },
    { name: "分析PRD", description: "系统自动分析PRD内容，生成UEC模型、流程图等" },
    { name: "查看结果", description: "用户查看分析结果，理解需求" }
  ],
  goal: [
    { name: "提高理解效率", description: "快速理解复杂的PRD文档，减少阅读和理解时间" },
    { name: "减少沟通成本", description: "通过可视化内容，减少团队成员之间的沟通成本" },
    { name: "确保需求对齐", description: "确保团队成员对需求有一致的理解，减少误解" }
  ]
};

// 模拟数据 - 流程图
const mockFlowChartData = {
  mermaidCode: `graph TD
    A[输入PRD] --> B[分析PRD内容]
    B --> C[生成UEC模型]
    B --> D[生成流程图]
    B --> E[生成简洁描述]
    C --> F[展示结果]
    D --> F
    E --> F
    F --> G[团队协作与反馈]
    G --> H[调整与优化]
    H --> A`,
  rawResponse: "已生成流程图"
};

// 模拟数据 - 设计团队执行流程步骤
const mockFlowChartSteps = {
  steps: [
    "需求分析与理解",
    "设计方案制定",
    "方案评审与调整",
    "开发实现",
    "测试与验证",
    "交付与部署"
  ]
};

// 模拟数据 - 需求摘要
const mockSummaryData = `
## 产品概述
需求解读器插件是一款能够将复杂的需求文档（如 PRD）转化为易于理解和高效沟通的视觉化内容的浏览器插件，帮助团队成员快速理解需求，减少沟通成本，确保团队对需求的高度对齐。

## 核心功能
1. PRD 转 UEC 模型：自动分析PRD内容，提取用户、体验和约束要素
2. 自动生成流程图：将PRD中的流程转化为直观的流程图
3. 生成简洁描述：提炼PRD核心内容，形成简洁明了的摘要
4. 团队协作与反馈：支持团队成员在线讨论和反馈

## 目标用户
产品经理、设计师、开发人员等需要理解和使用PRD的团队成员

## 主要价值
提高团队理解需求的效率，减少沟通成本，确保团队对需求的高度对齐，最终提升产品开发效率和质量
`;

// 调用美团大模型API进行UEC分析
const callMeituanModelForUEC = async (prdContent) => {
  if (!appId) {
    throw new Error('美团大模型appId未设置');
  }

  try {
    const prompt = `请分析以下PRD内容，从用户(User)、事件(Event)和目标(Goal)三个维度进行分析，并以JSON格式返回结果。

PRD内容：
${prdContent}

请返回以下JSON格式：
{
  "user": [
    {"name": "用户角色名称", "description": "详细描述"}
  ],
  "event": [
    {"name": "事件名称", "description": "详细描述"}
  ],
  "goal": [
    {"name": "目标名称", "description": "详细描述"}
  ]
}`;

    console.log('发送到美团大模型的请求:', prompt.substring(0, 100) + '...');
    console.log('使用的appId:', appId);

    // 根据提供的Python示例代码修改API调用
    const REQUEST_URL = 'https://aigc.sankuai.com/v1/openai/native/chat/completions';
    const MODEL_NAME = 'LongCat-Large-Thinking';

    const requestContent = {
      messages: [{ role: 'user', content: prompt }],
      model: MODEL_NAME,
      max_tokens: 4096,
      stream: false
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${appId}`
    };

    console.log('API请求URL:', REQUEST_URL);
    console.log('API请求头:', headers);
    console.log('API请求体:', JSON.stringify(requestContent).substring(0, 100) + '...');

    try {
      const response = await fetch(REQUEST_URL, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestContent)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API响应错误:', response.status, errorText);
        throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('美团大模型返回结果:', data);

      // 解析返回的JSON
      try {
        // 根据API返回格式提取内容
        if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          const content = data.choices[0].message.content;
          console.log('提取的内容:', content);

          // 尝试从返回的文本中提取JSON
          const jsonMatch = content.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonStr = jsonMatch[0];
            const parsedData = JSON.parse(jsonStr);
            return parsedData;
          } else {
            console.error('无法从返回结果中提取JSON:', content);
            throw new Error('无法从返回结果中提取JSON');
          }
        } else {
          console.error('API返回格式不符合预期:', data);
          throw new Error('API返回格式不符合预期');
        }
      } catch (parseError) {
        console.error('解析JSON失败:', parseError);
        // 如果解析失败，返回模拟数据
        console.log('解析失败，使用模拟数据');
        return mockUECData;
      }
    } catch (fetchError) {
      console.error('fetch调用失败:', fetchError);
      // 如果API调用失败，返回模拟数据
      console.log('API调用失败，使用模拟数据');
      return mockUECData;
    }
  } catch (error) {
    console.error('调用美团大模型API失败:', error);
    // 返回模拟数据
    return mockUECData;
  }
};

// 调用美团大模型API进行流程图分析
const callMeituanModelForFlowChart = async (prdContent) => {
  if (!appId) {
    throw new Error('美团大模型appId未设置');
  }

  try {
    const prompt = `请分析以下PRD内容，提取出设计团队的执行流程步骤，并以JSON格式返回结果。

PRD内容：
${prdContent}

请返回以下JSON格式：
{
  "steps": [
    "步骤1",
    "步骤2",
    "步骤3",
    ...
  ]
}

注意：
1. 步骤应该是设计团队从需求分析到最终交付的完整流程
2. 步骤数量应该在4-8个之间
3. 如果PRD中没有明确的流程，请根据常见的设计开发流程提供合理的步骤`;

    console.log('发送到美团大模型的流程图分析请求:', prompt.substring(0, 100) + '...');

    const REQUEST_URL = 'https://aigc.sankuai.com/v1/openai/native/chat/completions';
    const MODEL_NAME = 'LongCat-Large-Thinking';

    const requestContent = {
      messages: [{ role: 'user', content: prompt }],
      model: MODEL_NAME,
      max_tokens: 2048,
      stream: false
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${appId}`
    };

    const response = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestContent)
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('美团大模型流程图分析返回结果:', data);

    // 解析返回的JSON
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      const content = data.choices[0].message.content;

      // 尝试从返回的文本中提取JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const parsedData = JSON.parse(jsonStr);
        return parsedData;
      }
    }

    // 如果无法解析，返回模拟数据
    console.log('无法解析API返回结果，使用模拟数据');
    return mockFlowChartSteps;

  } catch (error) {
    console.error('调用美团大模型API进行流程图分析失败:', error);
    // 返回模拟数据
    return mockFlowChartSteps;
  }
};

// 调用美团大模型API生成简洁需求摘要
const callMeituanModelForSummary = async (prdContent) => {
  if (!appId) {
    throw new Error('美团大模型appId未设置');
  }

  try {
    const prompt = `请对以下PRD内容进行分析，生成一个简洁的需求摘要。摘要应该包括产品的核心功能、目标用户和主要价值，用简明扼要的语言表达。

PRD内容：
${prdContent}

请提供以下格式的摘要：
1. 用1-2句话概括产品是什么，解决什么问题
2. 用3-5个要点列出核心功能
3. 简述目标用户和主要价值

注意：摘要应该简洁明了，突出重点，避免冗余信息。`;

    console.log('发送到美团大模型的需求摘要请求:', prompt.substring(0, 100) + '...');

    const REQUEST_URL = 'https://aigc.sankuai.com/v1/openai/native/chat/completions';
    const MODEL_NAME = 'LongCat-Large-Thinking';

    const requestContent = {
      messages: [{ role: 'user', content: prompt }],
      model: MODEL_NAME,
      max_tokens: 2048,
      stream: false
    };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${appId}`
    };

    const response = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestContent)
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('美团大模型需求摘要返回结果:', data);

    // 提取返回的文本内容
    if (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      const content = data.choices[0].message.content;
      return content;
    }

    // 如果无法解析，返回模拟数据
    console.log('无法解析API返回结果，使用模拟数据');
    return mockSummaryData;

  } catch (error) {
    console.error('调用美团大模型API生成需求摘要失败:', error);
    // 返回模拟数据
    return mockSummaryData;
  }
};

// 分析PRD - 使用美团大模型或模拟数据
export const analyzePRD = async (prdContent) => {
  console.log('分析PRD内容:', prdContent.substring(0, 50) + '...');

  try {
    // 如果设置了appId，则调用美团大模型API
    if (appId) {
      try {
        const result = await callMeituanModelForUEC(prdContent);
        return result;
      } catch (apiError) {
        console.error('调用美团大模型API失败:', apiError);
        // 如果API调用失败，尝试从prdContent生成动态内容而不是使用静态模板
        return generateDynamicUECData(prdContent);
      }
    } else {
      // 否则使用基于输入内容的动态数据
      console.log('使用基于输入的动态数据 (未设置美团大模型appId)');
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      return generateDynamicUECData(prdContent);
    }
  } catch (error) {
    console.error('分析PRD失败:', error);
    throw error;
  }
};

// 根据输入内容生成动态UEC数据
const generateDynamicUECData = (prdContent) => {
  // 简单的内容分析逻辑
  const lines = prdContent.split('\n').filter(line => line.trim().length > 0);
  const firstLine = lines[0] || '需求文档';

  // 提取可能的功能点
  const features = lines.filter(line =>
    line.includes('功能') ||
    /^\d+\./.test(line) || // 数字开头的行
    line.includes('：') || line.includes(':') // 包含冒号的行
  ).slice(0, 3);

  // 生成动态UEC数据
  return {
    user: [
      { name: "产品经理", description: "负责编写和维护" + firstLine.substring(0, 10) + "相关文档" },
      { name: "设计师", description: "需要理解" + firstLine.substring(0, 10) + "的需求，转化为设计方案" },
      { name: "开发人员", description: "实现" + firstLine.substring(0, 10) + "的功能开发" }
    ],
    event: [
      { name: "导入需求", description: "用户将" + firstLine.substring(0, 10) + "导入到系统中" },
      { name: features[0]?.substring(0, 15) || "分析需求", description: "系统分析" + firstLine.substring(0, 10) + "内容" },
      { name: features[1]?.substring(0, 15) || "查看结果", description: "用户查看分析结果，理解需求" }
    ],
    goal: [
      { name: "提高理解效率", description: "快速理解" + firstLine.substring(0, 10) + "，减少理解时间" },
      { name: "减少沟通成本", description: "通过可视化内容，减少团队成员之间的沟通成本" },
      { name: features[2]?.substring(0, 15) || "确保需求对齐", description: "确保团队成员对需求有一致的理解" }
    ]
  };
};

// 分析PRD内容并生成流程图数据
export const analyzePRDForFlowChart = async (prdContent) => {
  console.log('分析PRD内容生成流程图:', prdContent.substring(0, 50) + '...');

  try {
    // 如果设置了appId，则调用美团大模型API
    if (appId) {
      try {
        const result = await callMeituanModelForFlowChart(prdContent);
        return result;
      } catch (apiError) {
        console.error('调用美团大模型API生成流程图失败:', apiError);
        // 如果API调用失败，尝试从prdContent生成动态内容而不是使用静态模板
        return generateDynamicFlowChartSteps(prdContent);
      }
    } else {
      // 否则使用基于输入内容的动态数据
      console.log('使用基于输入的动态流程图数据 (未设置美团大模型appId)');
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      return generateDynamicFlowChartSteps(prdContent);
    }
  } catch (error) {
    console.error('分析PRD生成流程图失败:', error);
    // 出错时也返回动态生成的数据
    return generateDynamicFlowChartSteps(prdContent);
  }
};

// 根据输入内容生成动态流程图步骤
const generateDynamicFlowChartSteps = (prdContent) => {
  // 简单的内容分析逻辑
  const lines = prdContent.split('\n').filter(line => line.trim().length > 0);
  const firstLine = lines[0] || '需求文档';

  // 提取可能的功能点或流程相关内容
  const processRelatedLines = lines.filter(line =>
    line.includes('流程') ||
    line.includes('步骤') ||
    line.includes('阶段') ||
    /^\d+\./.test(line) || // 数字开头的行
    line.includes('：') || line.includes(':') // 包含冒号的行
  );

  // 基础流程步骤
  const baseSteps = [
    "需求分析与理解",
    "设计方案制定",
    "方案评审与调整",
    "开发实现",
    "测试与验证",
    "交付与部署"
  ];

  // 如果找到了足够的流程相关内容，则使用它们
  if (processRelatedLines.length >= 4) {
    // 提取每行的主要内容，去除数字前缀和冒号等
    const extractedSteps = processRelatedLines.slice(0, 6).map(line => {
      // 去除数字前缀、冒号等
      return line.replace(/^\d+[\.\、\:]?\s*/, '')
                .replace(/.*[：:]\s*/, '')
                .substring(0, 20); // 限制长度
    });

    return { steps: extractedSteps };
  }

  // 否则，基于文档内容修改基础流程步骤
  const customizedSteps = baseSteps.map((step, index) => {
    // 为前两个步骤添加文档相关的内容
    if (index === 0) {
      return `${firstLine.substring(0, 10)}需求分析`;
    }
    if (index === 1 && processRelatedLines[0]) {
      return processRelatedLines[0].replace(/^\d+[\.\、\:]?\s*/, '')
                                  .replace(/.*[：:]\s*/, '')
                                  .substring(0, 20);
    }
    return step;
  });

  return { steps: customizedSteps };
};

// 生成流程图 - 使用模拟数据
export const generateFlowChart = async (prdContent) => {
  console.log('生成流程图:', prdContent.substring(0, 50) + '...');

  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 1500));

  return mockFlowChartData;
};

// 生成需求摘要 - 使用美团大模型或模拟数据
export const generateSummary = async (prdContent) => {
  console.log('生成需求摘要:', prdContent.substring(0, 50) + '...');

  try {
    // 如果设置了appId，则调用美团大模型API
    if (appId) {
      return await callMeituanModelForSummary(prdContent);
    } else {
      // 否则使用模拟数据
      console.log('使用模拟需求摘要数据 (未设置美团大模型appId)');
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      return mockSummaryData;
    }
  } catch (error) {
    console.error('生成需求摘要失败:', error);
    // 出错时也返回模拟数据
    return mockSummaryData;
  }
};