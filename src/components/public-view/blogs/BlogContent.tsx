interface Props {
  content: string;
}

export function BlogContent({ content }: Props) {
  const isHtml = /<[a-z][\s\S]*>/i.test(content);

  if (isHtml) {
    return (
      <div
        className="
          prose prose-gray dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
          prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-img:rounded-xl prose-img:shadow-md
          prose-blockquote:border-l-amber-500 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          prose-code:text-amber-700 dark:prose-code:text-amber-300 prose-code:bg-amber-50 dark:prose-code:bg-amber-900/20
          prose-ul:text-gray-700 dark:prose-ul:text-gray-300
          prose-ol:text-gray-700 dark:prose-ol:text-gray-300
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  // Plain text: render as paragraphs split by newlines
  return (
    <div className="space-y-4">
      {content.split(/\n{2,}/).map((para, i) => (
        <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed text-base">
          {para.trim()}
        </p>
      ))}
    </div>
  );
}