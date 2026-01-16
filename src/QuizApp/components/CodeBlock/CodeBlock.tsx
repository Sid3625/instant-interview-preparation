import React from "react";

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  return (
    <div className="relative rounded-xl bg-slate-900 p-4 shadow-lg border border-white/10">
      <pre className="overflow-x-auto text-sm text-slate-100 leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
};
