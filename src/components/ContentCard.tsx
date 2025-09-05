import Image from 'next/image';
import { ContentItem } from '@/store/slices/feedSlice';
import { CONTENT_ICONS, ACTION_TEXTS } from '@/constants';

interface ContentCardProps {
  item: ContentItem;
  onAction: (url: string) => void;
}

export default function ContentCard({ item, onAction }: ContentCardProps) {
  const getIcon = () => {
    switch (item.type) {
      case 'news':
        return CONTENT_ICONS.NEWS;
      case 'movie':
        return CONTENT_ICONS.MOVIE;
      case 'music':
        return CONTENT_ICONS.MUSIC;
      case 'social':
        return CONTENT_ICONS.SOCIAL;
      default:
        return '📄';
    }
  };

  const getActionText = () => {
    switch (item.type) {
      case 'news':
        return ACTION_TEXTS.NEWS;
      case 'movie':
        return ACTION_TEXTS.MOVIE;
      case 'music':
        return ACTION_TEXTS.MUSIC;
      case 'social':
        return ACTION_TEXTS.SOCIAL;
      default:
        return 'View';
    }
  };

  const getMetadata = () => {
    switch (item.type) {
      case 'news':
        return `${item.source} • ${item.readTime ? `${item.readTime} min read` : 'Just now'}`;
      case 'movie':
        return `${item.source} • ${item.rating ? `⭐ ${item.rating}` : 'New Release'}`;
      case 'music':
        return `${item.artist} • ${item.album}`;
      case 'social':
        return `@${item.author} • ${item.platform} • ${item.likes} likes`;
      default:
        return item.source;
    }
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex space-x-4">
        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              {getIcon()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {item.title}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {getMetadata()}
            </span>
            <button
              onClick={() => onAction(item.url)}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
            >
              {getActionText()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
