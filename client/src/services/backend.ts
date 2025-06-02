import i18n, { d } from "../lib/i18n";
import { log } from "../util/log";

export const BACKEND_ORIGIN = import.meta.env.WEBPHONE_BACKEND_ORIGIN + import.meta.env.WEBPHONE_CONTEXT_PATH;

export interface Page<E> {
  number: number;
  size: number;
  totalPages: number;
  totalItems: number;
  items: E[];
}

export interface PageOptions {
  number: number;
  size: number;
}

export interface QueryPageOptions extends PageOptions {
  query?: string;
}

export class URLBuilder {
  private _origin = "";
  private _path = "";
  private _params = new URLSearchParams();

  origin(origin: string): this {
    this._origin = origin;
    return this;
  }

  path(path: string): this {
    this._path = path;
    return this;
  }

  param(key: string, value: string | number | null | undefined): this {
    if (value !== undefined && value !== null && value !== "") {
      this._params.set(key, value.toString());
    }
    return this;
  }

  build(): string {
    const query = this._params.toString();
    return `${this._origin}${this._path}${query ? `?${query}`: ""}`;
  }
}

export class RequestBuilder {
  private _url: string = "";
  private _init: RequestInit = {};

  url(build: (b: URLBuilder) => URLBuilder): this {
    this._url = build(new URLBuilder()).build();
    return this;
  }

  method(method: string): this {
    this._init.method = method;
    return this;
  }

  get(): this { return this.method("GET"); }
  post(): this { return this.method("POST"); }
  put(): this { return this.method("PUT"); }
  delete(): this { return this.method("DELETE"); }

  header(key: string, value: string): this {
    const headers = new Headers(this._init.headers);
    headers.set(key, value);
    this._init.headers = headers;
    return this;
  }

  content(contentType: string): this {
    return this.header("Content-Type", contentType);
  }

  json(): this {
    return this.content("application/json");
  }

  authorization(value: string): this {
    return this.header("Authorization", value);
  }

  bearer(token: string): this {
    return this.authorization(`Bearer ${token}`);
  }
  
  body(body: BodyInit): this {
    this._init.body = body;
    return this;
  }

  bodyJson(body: any): this {
    this.json();
    return this.body(JSON.stringify(body));
  }

  async fetch(): Promise<ResponseBrancher> {
    const request = new Request(this._url, this._init);
    const response = await fetch(request);
    return new ResponseBrancher(request, response);
  }
}

export type Process = (req: Request, res: Response) => Promise<void>;
export type ProcessResponse<T> = (res: ResponseProcessor) => Promise<T>;

export class ResponseBrancher {
  constructor(
    private readonly _req: Request,
    private readonly _res: Response,
    private readonly _processes: Process[] = []
  ) {}

  any(process: Process): this {
    this._processes.push(process);
    return this;
  }

  condition(predicate: (response: Response) => boolean, process: Process): this {
    if (predicate(this._res)) this._processes.push(process);
    return this;
  }

  success(process: Process): this {
    return this.condition((res: Response) => res.ok, process);
  }

  error(process: Process): this {
    return this.condition((res: Response) => !res.ok, process);
  }

  clientError(process: Process): this {
    return this.condition((res: Response) => res.status >= 400 && res.status < 500, process);
  }

  serverError(process: Process): this {
    return this.condition((res: Response) => res.status >= 500, process);
  }

  async process(): Promise<void> {
    for (const process of this._processes) {
      await process(this._req, this._res);
    }
  }

  async handle<T>(handler: ProcessResponse<T>): Promise<T> {
    await this.process();
    return handler(new ResponseProcessor(this._res));
  }
}

export class ResponseProcessor {
  constructor(private readonly _res: Response) {}

  async blob(): Promise<Blob> {
    return await this._res.blob();
  }

  async blobUrl(): Promise<string> {
    return URL.createObjectURL(await this.blob());
  }

  async json<T>(): Promise<T> {
    return (await this._res.json()) as T;
  }

  raw(): Response {
    return this._res;
  }
}

// Utility
export async function logRequestResponse(request: Request, response: Response) {
  log(`${response.status} ${request.method} ${request.url}`);
}


export async function handleApiError(_: Request, res: Response) {
  const body = await res.json();
  throw buildError(body as ApiError);
}

interface ApiError {
  timestamp: Date;
  type: string;
  message: string;
  details?: any;
}

function buildError(error?: ApiError): Error {
  console.warn(error?.message || "Unexpected error response!");
  const errObj = new Error(localizeError(error));
  errObj.name = error?.type ?? "Error";
  return errObj;
}

function localizeError(error?: ApiError): string {
  const defaultMsg = i18n.t(d.backend.errors.unexpected);
  if (!error) return defaultMsg;

  if (error.type === "error.invalid.value") {
    let key;
    switch (error.details?.name) {
      case "number type": key = d.backend.errors.invalid.numberType; break;
      case "call status": key = d.backend.errors.invalid.callStatus; break;
    }
    if (key) return i18n.t(key);
  }

  if (error.type === "error.photo.upload") {
    const name = error.details?.name;
    return i18n.t("backend.error.uploadPhoto", { name });
  }

  if (error.type === "error.entity.already.exists") {
    const entity = error.details?.entity;
    let key;
    if (entity === "contact") {
      switch (error.details?.fieldName) {
        case "id": key = d.backend.errors.entityExists.contact.id; break;
        case "name": key = d.backend.errors.entityExists.contact.name; break;
        case "number": key = d.backend.errors.entityExists.contact.number; break;
      }
    } else if (entity === "account") {
      switch (error.details?.fieldName) {
        case "user": key = d.backend.errors.entityExists.account.user; break;
        case "sip username": key = d.backend.errors.entityExists.account.sipUsername; break;
      }
    }
    if (key) return i18n.t(key, { value: error.details?.fieldValue });
  }

  if (error.type === "error.entity.not.found") {
    const entity = error.details?.entity;
    if (entity === "contact") {
      let key;
      switch (error.details?.fieldName) {
        case "id": key = d.backend.errors.entityNotFound.contact.id; break;
      }
      if (key) return i18n.t(key, { value: error.details?.fieldValue });
    }
  }

  if (error.type === "error.validation") {
    const fields = error.details as InvalidField[]
    return fields.map(field => {
      return field.errors.map(error => {

        if (error.code === "NotBlank" || error.code === "NotNull") {
          if (field.name === "name") return i18n.t(d.backend.errors.missing.name);
          if (field.name.startsWith("numbers[")) return i18n.t(d.backend.errors.missing.number);
        }

        if (error.code === "NotEmpty") {
          if (field.name === "numbers") return i18n.t(d.backend.errors.empty.numbers);
        }

        if (error.code === "Size") {
          const min = error.arguments?.min;
          const max = error.arguments?.max;
          if (field.name === "name") return i18n.t(d.backend.errors.size.name, { min, max });
          if (field.name === "bio") return i18n.t(d.backend.errors.size.name, { min, max });
          if (field.name === "numbers") return i18n.t(d.backend.errors.size.name, { min, max });
        }

        if (error.code === "Pattern") {
          if (field.name.startsWith("numbers[")) return i18n.t(d.backend.errors.pattern.number);
        }
        return "";
      }).filter(msg => !!msg).join(" ")
    }).join("\n");
  }

  return defaultMsg;
}

interface InvalidField {
  name: string;
  value: any;
  errors: ValidationError[]
}

interface ValidationError {
  code: string;
  arguments: any;
}
