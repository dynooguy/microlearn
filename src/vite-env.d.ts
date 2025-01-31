/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SEATABLE_BASE_URL: string
  readonly VITE_SEATABLE_BASE_ID: string
  readonly VITE_SEATABLE_APP_ACCESS_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
