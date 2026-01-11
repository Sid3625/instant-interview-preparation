import React from 'react';

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => (
  <div className="code-block">
    <pre>
      <code>{code}</code>
    </pre>
  </div>
);