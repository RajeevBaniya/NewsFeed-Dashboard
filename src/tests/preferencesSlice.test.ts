import reducer, {
  toggleDarkMode,
  setDarkMode,
  updateCategories,
  addCategory,
  removeCategory,
  setLanguage,
  toggleNotifications,
  setViewMode,
} from '@/store/slices/preferencesSlice';

describe('preferencesSlice', () => {
  it('should return initial state on first run', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.darkMode).toBe(false);
    expect(state.categories.length).toBeGreaterThan(0);
    expect(state.viewMode).toBe('normal');
  });

  it('toggleDarkMode should flip darkMode', () => {
    const s1 = reducer(undefined, toggleDarkMode());
    expect(s1.darkMode).toBe(true);
    const s2 = reducer(s1, toggleDarkMode());
    expect(s2.darkMode).toBe(false);
  });

  it('setDarkMode should set explicit value', () => {
    const s = reducer(undefined, setDarkMode(true));
    expect(s.darkMode).toBe(true);
  });

  it('setViewMode should switch between modes', () => {
    const s = reducer(undefined, setViewMode('draggable'));
    expect(s.viewMode).toBe('draggable');
  });

  it('updateCategories should replace list', () => {
    const s = reducer(undefined, updateCategories(['tech', 'science']));
    expect(s.categories).toEqual(['tech', 'science']);
  });

  it('addCategory should add when missing and avoid duplicates', () => {
    const s1 = reducer(undefined, addCategory('gaming'));
    expect(s1.categories).toContain('gaming');
    const s2 = reducer(s1, addCategory('gaming'));
    expect(s2.categories.filter(c => c === 'gaming').length).toBe(1);
  });

  it('removeCategory should remove a category', () => {
    const withCat = reducer(undefined, addCategory('health'));
    const s = reducer(withCat, removeCategory('health'));
    expect(s.categories).not.toContain('health');
  });

  it('setLanguage should update language', () => {
    const s = reducer(undefined, setLanguage('fr'));
    expect(s.language).toBe('fr');
  });

  it('toggleNotifications should flip notifications', () => {
    const s1 = reducer(undefined, toggleNotifications());
    expect(s1.notifications).toBe(false);
    const s2 = reducer(s1, toggleNotifications());
    expect(s2.notifications).toBe(true);
  });
});


