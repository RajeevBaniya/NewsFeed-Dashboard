'use client';

export default function MainContent() {
  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your personalized content feed
          </p>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main feed */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📰 Personalized Feed
              </h3>
              <div className="space-y-4">
                {/* Placeholder content cards */}
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border border-gray-200 dark:border-gray-700 
                                          rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                          Sample Content Title {item}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          This is a placeholder for content description. Real content will be loaded here.
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Category • 2 min read
                          </span>
                          <button className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                            Read More
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar content */}
          <div className="space-y-6">
            {/* Trending */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🔥 Trending
              </h3>
              <div className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Trending Item {item}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {item * 100} views
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorites */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ❤️ Favorites
              </h3>
              <div className="space-y-3">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Favorite Item {item}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        Saved 2 days ago
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
