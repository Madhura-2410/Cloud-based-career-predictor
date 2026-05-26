import React from 'react';
import { FiExternalLink, FiTrash2, FiCheckCircle, FiArrowRight } from 'react-icons/fi';
import { useUser } from '../context/UserContext';

const LearningPath: React.FC = () => {
  const { userProfile, removeFromLearningPath, clearLearningPath } = useUser();
  const learningPath = Array.isArray(userProfile.learningPath) ? userProfile.learningPath : [];
  const hasItems = learningPath.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-blue-600 font-bold">My Learning Path</p>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-3">Saved courses and skill boosts</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={clearLearningPath}
            disabled={!hasItems}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear all learning paths
          </button>
        </div>
      </div>

      {!hasItems ? (
        <div className="rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-14 text-center shadow-sm">
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-3xl">
            <FiCheckCircle />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">No saved learning items yet</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Add courses or skills from the platform and they will appear here instantly. Your progress will stay saved locally in your browser.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {userProfile.learningPath.map((item) => (
            <div key={item.id} className="rounded-3xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex gap-3 items-center mb-3">
                    <div className="rounded-2xl bg-blue-600/10 px-3 py-1 text-sm font-semibold text-blue-700">{item.status}</div>
                    <div className="text-sm text-slate-500">Added on {item.dateAdded}</div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
                  {item.platforms.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.platforms.map((platform, idx) => (
                        <a
                          key={idx}
                          href={platform.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:border-blue-200 hover:bg-blue-50 transition"
                        >
                          <FiExternalLink /> {platform.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 md:items-end">
                  <button
                    onClick={() => window.open(item.platforms[0]?.url || '#', '_blank')}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                  >
                    Continue course
                    <FiArrowRight />
                  </button>
                  <button
                    onClick={() => removeFromLearningPath(item.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Remove course
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningPath;
