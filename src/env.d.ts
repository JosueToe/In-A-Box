/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  readonly VITE_BASE_PATH: string;
  readonly VITE_TEMPO: string;
  readonly PICA_SECRET_KEY: string;
  readonly PICA_CLERK_CONNECTION_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
