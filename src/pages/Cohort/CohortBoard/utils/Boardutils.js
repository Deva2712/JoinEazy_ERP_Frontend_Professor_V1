import { Calendar, Users, Badge, Share2 } from "lucide-react";

export const getTypeColor = (type) => {
  const colors = {
    announcement: "#ef4444",
    question: "#3b82f6",
    discussion: "#8b5cf6",
    resource: "#10b981",
  };
  return colors[type] || "#6b7280";
};

export const POST_TYPE_COLORS = {
  announcement: "#ef4444",
  question: "#3b82f6",
  discussion: "#8b5cf6",
  resource: "#10b981",
};

export const getIconComponent = (iconName) => {
  const iconMap = { Calendar, Users, Badge, Share2 };
  return iconMap[iconName] || Share2;
};

export const formatTimeAgo = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export const truncateContent = (content, maxLength = 250) => {
  const paragraphs = content.split("\n").filter((p) => p.trim());
  let totalLength = 0;
  const displayParagraphs = [];
  let needsEllipsis = false;

  for (let i = 0; i < paragraphs.length; i++) {
    const para = paragraphs[i];
    if (totalLength + para.length <= maxLength) {
      displayParagraphs.push(para);
      totalLength += para.length;
    } else {
      const remaining = maxLength - totalLength;
      if (remaining > 20) {
        const words = para.split(" ");
        let truncated = "";
        for (const word of words) {
          if ((truncated + word).length <= remaining) truncated += (truncated ? " " : "") + word;
          else break;
        }
        if (truncated) displayParagraphs.push(truncated);
      }
      needsEllipsis = true;
      break;
    }
  }

  if (displayParagraphs.length < paragraphs.length) needsEllipsis = true;
  return { displayParagraphs, needsEllipsis };
};

export const copyToClipboard = async () => {
  await navigator.clipboard.writeText(window.location.href);
};