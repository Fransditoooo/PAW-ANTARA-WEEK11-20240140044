function renderTheme() {
  const state = themeStore.getState();

  const isDark = state.theme === "dark";

  document.documentElement.classList.toggle(
    "dark",
    isDark
  );

  const icon =
    document.getElementById("theme-icon");

  if (icon) {
    icon.textContent = isDark
      ? "☀️"
      : "🌙";
  }

  localStorage.setItem(
    "theme",
    state.theme
  );
}


function toggleTheme() {
  const current =
    themeStore.getState().theme;

  themeStore.setState({
    theme:
      current === "dark"
        ? "light"
        : "dark",
  });
}


document.addEventListener(
  "DOMContentLoaded",
  () => {
    const button =
      document.getElementById(
        "theme-toggle"
      );

    if (button) {
      button.addEventListener(
        "click",
        toggleTheme
      );
    }

    renderTheme();

    themeStore.subscribe(
      renderTheme
    );
  }
);