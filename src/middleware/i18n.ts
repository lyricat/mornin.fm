export default function ({ app }) {
  const locale = navigator.language.includes('zh') ? 'zh' : 'en'
  app.i18n.setLocale(locale)
}
