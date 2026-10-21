/*eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-explicit-any*/
import { fetch, Agent, RequestInit, BodyInit } from 'undici';
import { HeaderRecord } from 'undici/types/header';

export interface IAPIResponseData {
  report: {
    time: string;
    refresh: number;
    _platform: string;
  };
  ups: {
    _oemViewName: string;
    _selected_ups_id: number;
    valtable: Record<string, string | string[] | number | number[]>;
  };
}

export class CS141 {
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;
  private cookie?: string;
  private readonly agent: Agent;

  constructor(host: string, username: string, password: string) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.agent = new Agent({ connect: { rejectUnauthorized: false } });
  }

  private createRequestOptions(method: 'GET' | 'POST', body?: BodyInit | null) {
    const options: RequestInit = {
      method,
      headers: {},
      dispatcher: this.agent,
    };
    if (this.cookie) {
      (options.headers as HeaderRecord)['Cookie'] = this.cookie;
    }
    if (body) {
      (options.headers as HeaderRecord)['Content-Type'] = 'application/json';
      options.body = body;
    }
    return options;
  }

  private async request(): Promise<IAPIResponseData> {
    const url = `https://${this.host}/api/devices/ups/report`;
    const opts = this.createRequestOptions('GET');
    const response = await fetch(url, opts);
    if (response.status !== 200) {
      const err = new Error(`HTTP ${response.status}`);
      (err as any).status = response.status;
      throw err;
    }
    const textString = await response.text();
    return JSON.parse(textString) as IAPIResponseData;
  }

  public async handleRequest(): Promise<IAPIResponseData> {
    try {
      return await this.request();
    } catch (e: any) {
      if (e.status === 400 || e.status === 401) {
        await this.login();
        return await this.request();
      }
      throw e;
    }
  }

  private async login(): Promise<void> {
    const url = `https://${this.host}/api/login`;
    const body = { userName: this.username, password: this.password };
    const opts = this.createRequestOptions('POST', JSON.stringify(body));
    const { status, headers } = await fetch(url, opts);
    if (status !== 200) {
      throw new Error(`Login failed with status ${status}`);
    }
    const setCookie = headers.getSetCookie();
    if (Array.isArray(setCookie)) {
      this.cookie = setCookie.join('; ');
    } else if (typeof setCookie === 'string') {
      this.cookie = setCookie;
    }
  }
}
