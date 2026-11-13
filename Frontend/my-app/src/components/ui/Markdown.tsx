import { useMemo } from 'react';
import { marked } from 'marked';
import { cn } from '@/libs/cn';

interface MarkdownProps {
  text: string;
  className?: string;
}

export function Markdown({ text, className }: MarkdownProps) {
  const html = useMemo(() => {
    const safeText = text.replace(/</g, '&lt;');
    return marked.parse(safeText, {
      async: false,
      breaks: true,
      gfm: true,
    });
  }, [text]);

  return (
    <div
      dir="auto"
      className={cn('markdown', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
