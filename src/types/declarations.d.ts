declare module 'i18next' {
  const i18n: any;
  export default i18n;
}

declare module 'react-i18next' {
  export const useTranslation: () => {
    t: (key: string, options?: any) => string;
    i18n: any;
  };
  export const initReactI18next: any;
  export const Trans: React.ComponentType<any>;
}
