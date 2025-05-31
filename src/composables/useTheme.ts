import { useQuasar } from 'quasar';
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';

const THEME_COOKIE = 'theme';

function setThemeCookie(theme: 'dark' | 'light') {
  document.cookie = `${THEME_COOKIE}=${theme};path=/;max-age=31536000`;
}

function getThemeCookie(): 'dark' | 'light' | null {
  const match = document.cookie.match(new RegExp('(^| )' + THEME_COOKIE + '=([^;]+)'));
  return match ? (match[2] as 'dark' | 'light') : null;
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
    setThemeCookie(theme);
  }

  function detectAndApplyTheme() {
    let theme = getThemeCookie();
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeCookie(theme);
    }
    applyTheme(theme);
  }

  function handleThemeChange(e: MediaQueryListEvent) {
    const theme = e.matches ? 'dark' : 'light';
    applyTheme(theme);
    setThemeCookie(theme);
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
