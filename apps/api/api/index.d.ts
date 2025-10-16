import { Elysia } from "elysia";

//#region src/index.d.ts
declare const app: Elysia<"", {
  decorator: {};
  store: {};
  derive: {};
  resolve: {};
}, {
  typebox: {};
  error: {};
}, {
  schema: {};
  standaloneSchema: {};
  macro: {};
  macroFn: {};
  parser: {};
  response: {};
}, {
  stations: {
    get: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: {
        200: {
          id: number;
          address: string;
          address_en: string;
          lat: number;
          lng: number;
          name: string;
          name_en: string;
          total: number;
        }[];
        500: {
          error: string;
        };
        422: {
          type: "validation";
          on: string;
          summary?: string;
          message?: string;
          found?: unknown;
          property?: string;
          expected?: string;
        };
      };
    };
  };
} & {
  stations: {
    ":id": {
      get: {
        body: unknown;
        params: {
          id: string;
        };
        query: unknown;
        headers: unknown;
        response: {
          200: {
            id: number;
            address: string;
            address_en: string;
            lat: number;
            lng: number;
            name: string;
            name_en: string;
            total: number;
          };
          500: {
            error: string;
          };
          400: {
            error: string;
          };
          404: {
            error: string;
          };
          422: {
            type: "validation";
            on: string;
            summary?: string;
            message?: string;
            found?: unknown;
            property?: string;
            expected?: string;
          };
        };
      };
    };
  };
} & {
  current: {
    get: {
      body: unknown;
      params: {};
      query: unknown;
      headers: unknown;
      response: {
        200: {
          bikes: number;
          full: number;
          slots: number;
          station_id: number;
          status: "FULL" | "EMPTY" | "NORMAL";
          success: number;
          types: any;
          unavailable: number;
          update: string;
        }[];
        500: {
          error: string;
        };
        422: {
          type: "validation";
          on: string;
          summary?: string;
          message?: string;
          found?: unknown;
          property?: string;
          expected?: string;
        };
      };
    };
  };
} & {
  current: {
    ":id": {
      get: {
        body: unknown;
        params: {
          id: string;
        };
        query: unknown;
        headers: unknown;
        response: {
          200: {
            bikes: number;
            full: number;
            slots: number;
            station_id: {
              id: number;
              address: string;
              address_en: string;
              lat: number;
              lng: number;
              name: string;
              name_en: string;
              total: number;
            };
            status: "FULL" | "EMPTY" | "NORMAL";
            success: number;
            types: any;
            unavailable: number;
            update: string;
          };
          500: {
            error: string;
          };
          400: {
            error: string;
          };
          404: {
            error: string;
          };
          422: {
            type: "validation";
            on: string;
            summary?: string;
            message?: string;
            found?: unknown;
            property?: string;
            expected?: string;
          };
        };
      };
    };
  };
} & {
  history: {
    ":id": {
      get: {
        body: unknown;
        params: {
          id: string;
        };
        query: {
          limit?: string | undefined;
        };
        headers: unknown;
        response: {
          200: {
            station_id: number;
            types: any;
            id: string;
            at: string;
            available: number;
            empty: number;
          }[];
          500: {
            error: string;
          };
          400: {
            error: string;
          };
          422: {
            type: "validation";
            on: string;
            summary?: string;
            message?: string;
            found?: unknown;
            property?: string;
            expected?: string;
          };
        };
      };
    };
  };
}, {
  derive: {};
  resolve: {};
  schema: {};
  standaloneSchema: {};
  response: {};
}, {
  derive: {};
  resolve: {};
  schema: {};
  standaloneSchema: {};
  response: {};
}>;
//#endregion
export { app as default };