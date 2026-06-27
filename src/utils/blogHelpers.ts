export const categoryLabel = (category: string) => category;

export const formatViews = (views: number = 0) =>
  new Intl.NumberFormat().format(views);

export const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const tagsToString = (tags: string[] = []) =>
  tags.join(", ");

export const parseTags = (value: string) =>
  value
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

export const statusColor = (status: string) => {
  switch (status) {
    case "PUBLISHED":
      return {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-300",
        dot: "bg-green-500",
      };

    case "DRAFT":
      return {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-300",
        dot: "bg-yellow-500",
      };

    default:
      return {
        bg: "bg-gray-100 dark:bg-gray-900",
        text: "text-gray-600 dark:text-gray-300",
        dot: "bg-gray-400",
      };
  }
};

export const contentTypeColor = (type: "ARTICLE" | "VIDEO") => {
  switch (type) {
    case "VIDEO":
      return {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-300",
      };

    default:
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-300",
      };
  }
};