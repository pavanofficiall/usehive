declare module "cloudflare:workers" {
  export const env: {
    DB?: any;
    [key: string]: any;
  };
}

interface Fetcher {
  fetch(request: Request | string, init?: RequestInit): Promise<Response>;
}

interface D1Database {
  prepare(query: string): any;
  dump(): Promise<ArrayBuffer>;
  batch<T = unknown>(statements: any[]): Promise<any[]>;
  exec<T = unknown>(query: string): Promise<any>;
}
