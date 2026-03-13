/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_YANDEX_METRIKA_ID: string;
  readonly VITE_YANDEX_MAPS_API_KEY: string;
  readonly VITE_COMPANY_PHONE: string;
  readonly VITE_COMPANY_EMAIL: string;
  readonly VITE_COMPANY_WORK_HOURS: string;
  readonly VITE_COMPANY_ADDRESS: string;
  readonly VITE_MAP_LATITUDE: string;
  readonly VITE_MAP_LONGITUDE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
