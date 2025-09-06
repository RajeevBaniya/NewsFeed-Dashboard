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
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        View:
      </span>
      <button
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          viewMode === 'draggable' 
            ? 'bg-blue-600' 
            : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            viewMode === 'draggable' ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {viewMode === 'draggable' ? 'Draggable' : 'Normal'}
      </span>
    </div>
  );
}
