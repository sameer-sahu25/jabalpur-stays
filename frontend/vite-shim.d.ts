declare module "vite" {
  interface ServerHmrConfig {
    overlay?: boolean;
  }

  interface ServerOptions {
    host?: string;
    port?: number;
    hmr?: ServerHmrConfig;
  }

  interface PreviewOptions {
    host?: string;
    port?: number;
  }

  interface ResolveOptions {
    alias?: Record<string, string>;
  }

  interface UserConfig {
    server?: ServerOptions;
    preview?: PreviewOptions;
    plugins?: unknown[];
    resolve?: ResolveOptions;
    define?: Record<string, unknown>;
  }

  function defineConfig(config: UserConfig): UserConfig;

  export { defineConfig, type UserConfig };
}
