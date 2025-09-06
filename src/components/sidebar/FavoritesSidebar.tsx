import { useAppSelector } from '@/store/hooks';
import ContentCard from './ContentCard';

export default function FavoritesSidebar() {
  const favorites = useAppSelector((state) => state.favorites.items);

  const handleAction = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (favorites.length === 0) {
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Favorites
        </h3>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">💝</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No favorites yet. Click the heart icon on any content to add it here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Favorites ({favorites.length})
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {favorites.map((item) => (
          <div key={item.id} className="transform scale-95">
            <ContentCard item={item} onAction={handleAction} />
          </div>
        ))}
      </div>
    </div>
  );
}
