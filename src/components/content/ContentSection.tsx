import { ContentItem } from '@/store/slices/feedSlice';
import ContentCard from './ContentCard';

interface ContentSectionProps {
  title: string;
  icon: string;
  items: ContentItem[];
  type: ContentItem['type'] | 'all';
  maxItems?: number;
  onItemAction: (url: string) => void;
}

export default function ContentSection({
  title,
  icon,
  items,
  type,
  maxItems = 5,
  onItemAction,
}: ContentSectionProps) {
  const filteredItems = type === 'all' ? items : items.filter((item) => item.type === type);
  const displayItems = filteredItems.slice(0, maxItems);

  if (displayItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {icon} {title} ({filteredItems.length})
      </h3>
      <div className="space-y-4">
        {displayItems.map((item, index) => (
          <ContentCard key={`${title}-${item.id}-${index}`} item={item} onAction={onItemAction} />
        ))}
      </div>
    </div>
  );
}
