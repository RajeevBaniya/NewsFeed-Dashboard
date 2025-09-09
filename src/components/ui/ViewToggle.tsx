import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setViewMode } from '@/store/slices/preferencesSlice';

export default function ViewToggle() {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => state.preferences.viewMode);

  const handleToggle = () => {
    dispatch(setViewMode(viewMode === 'normal' ? 'draggable' : 'normal'));
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
        View:
      </span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-5 w-9 sm:h-6 sm:w-11 items-center rounded-full transition-colors ${
          viewMode === 'draggable' 
            ? 'bg-blue-600' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-3 w-3 sm:h-4 sm:w-4 transform rounded-full bg-white transition-transform ${
            viewMode === 'draggable' ? 'translate-x-5 sm:translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
        {viewMode === 'draggable' ? 'Draggable' : 'Normal'}
      </span>
    </div>
  );
}
