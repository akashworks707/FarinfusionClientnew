import { extractYouTubeId } from "@/utils/blogHelpers";

interface Props {
  url: string;
  title: string;
}

export function YouTubeEmbed({ url, title }: Props) {
  const videoId = extractYouTubeId(url);

  if (!videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 text-sm font-medium hover:underline"
      >
        ▶ Watch Video
      </a>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 shadow-lg my-6">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}