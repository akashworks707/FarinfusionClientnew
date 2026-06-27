import { VerificationStatus, VerificationCategory, VerificationContentType } from "@/types/productVerification";

export const VERIFICATION_STATUS_OPTIONS: { label: string; value: VerificationStatus; color: string }[] = [
  { label: "Published", value: "PUBLISHED", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { label: "Draft", value: "DRAFT", color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200" },
];

export const VERIFICATION_CONTENT_TYPE_OPTIONS: { label: string; value: VerificationContentType; icon: string }[] = [
  { label: "Video", value: "VIDEO", icon: "Play" },
  { label: "PDF", value: "PDF", icon: "FileText" },
  { label: "Article", value: "ARTICLE", icon: "BookOpen" },
  { label: "External Link", value: "EXTERNAL_LINK", icon: "ExternalLink" },
];

export const VERIFICATION_CATEGORY_OPTIONS: { label: string; value: VerificationCategory }[] = [
  { label: "Cosmetics", value: "COSMETICS" },
  { label: "Skin Care", value: "SKIN_CARE" },
  { label: "Health", value: "HEALTH" },
  { label: "Perfume", value: "PERFUME" },
  { label: "Others", value: "OTHERS" },
];

export const TABLE_COLUMNS = [
  { id: "thumbnail", label: "Thumbnail", sortable: false },
  { id: "title", label: "Title", sortable: true },
  { id: "slug", label: "Slug", sortable: true },
  { id: "mediaType", label: "Media Type", sortable: true },
  { id: "status", label: "Status", sortable: true },
  { id: "featured", label: "Featured", sortable: true },
  { id: "views", label: "Views", sortable: true },
  { id: "createdAt", label: "Created At", sortable: true },
  { id: "actions", label: "Actions", sortable: false },
];

export const ITEMS_PER_PAGE = 10;

export const MEDIA_TYPE_DISPLAY: Record<VerificationContentType, string> = {
  VIDEO: "Video",
  PDF: "PDF",
  ARTICLE: "Article",
  IMAGE: "Image",
  EXTERNAL_LINK: "External Link",
};

export const STATUS_DISPLAY: Record<VerificationStatus, string> = {
  PUBLISHED: "Published",
  DRAFT: "Draft",
};

export const CATEGORY_DISPLAY: Record<VerificationCategory, string> = {
  COSMETICS: "Cosmetics",
  SKIN_CARE: "Skin Care",
  HEALTH: "Health",
  PERFUME: "Perfume",
  OTHERS: "Others",
};

export const SUPPORTED_MEDIA_TYPES = ["youtube.com", "youtu.be", ".pdf", "drive.google.com"];

export const SEARCH_PLACEHOLDER = "Search by title, slug, description...";