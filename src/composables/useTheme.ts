import { useQuasar } from 'quasar';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { get as getSession, set as setSession } from '../utils/localStorageUtils';

const THEME_KEY = 'theme';

function setTheme(theme: 'dark' | 'light') {
  setSession(THEME_KEY, theme); // Salva no LOCAL_STORAGE
}

function getTheme(): 'dark' | 'light' | null {
  const value = getSession(THEME_KEY);
  return value === 'dark' || value === 'light' ? value : null;
}

export function useTheme() {
  const $q = useQuasar();
  const isDark = ref($q.dark.isActive);

  function applyTheme(theme: 'dark' | 'light') {
    $q.dark.set(theme === 'dark');
    // isDark.value será atualizado pelo watchEffect abaixo
  }

  function toggleDark() {
    const theme = isDark.value ? 'light' : 'dark';
    applyTheme(theme);
    setTheme(theme);
  }

  function detectAndApplyTheme() {
    let theme = getTheme();
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setTheme(theme);
    }
    applyTheme(theme);
  }

  function handleThemeChange(e: MediaQueryListEvent) {
    const theme = e.matches ? 'dark' : 'light';
    applyTheme(theme);
    setTheme(theme);
  }

  onMounted(() => {
    detectAndApplyTheme();
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', handleThemeChange);
  });

  onUnmounted(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.removeEventListener('change', handleThemeChange);
  });

  // Mantém isDark sempre sincronizado com o Quasar
  watchEffect(() => {
    isDark.value = $q.dark.isActive;
  });

  return {
    isDark,
    toggleDark,
  };
}
