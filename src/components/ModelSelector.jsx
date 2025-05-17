import React from 'react';

const ModelSelector = ({ selectedModel, onModelSelect }) => {
  // 可选的模型列表
  const modelOptions = ['LongCat-Largethinking', 'Deepseek', 'GPT-4', 'Claude'];

  return (
    <div className="relative custom-select">
      <select
        value={selectedModel}
        onChange={(e) => {
          console.log('选择模型:', e.target.value);
          onModelSelect(e.target.value);
        }}
        className="h-[20px] appearance-none flex items-center gap-1 px-3 py-0 text-xs text-black bg-gray-100 bg-opacity-80 border border-gray-300 rounded-[8px] cursor-pointer pr-6"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 16 16' fill='none'%3E%3Cpath d='M4 6l4 4 4-4' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 6px center"
        }}
      >
        {modelOptions.map((model) => (
          <option key={model} value={model} className="text-black">
            {model}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ModelSelector;
