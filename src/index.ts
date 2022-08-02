import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  AxiosResponse,
  AxiosResponseHeaders,
} from 'axios';
import * as https from 'https';

export class CS141 {
  private readonly host: string;
  private readonly username: string;
  private readonly password: string;

  private headers: AxiosResponseHeaders;
  private readonly axios: AxiosInstance;

  constructor(host: string, username: string, password: string) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.axios = axios.create({
      baseURL: 'https://' + this.host,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });
  }

  private request(): Promise<AxiosResponse<Record<string, string>>> {
    return new Promise((resolve, reject) => {
      const requestHeader: AxiosRequestHeaders = {};
      if (this.headers && this.headers['set-cookie'])
        requestHeader['cookie'] = this.headers['set-cookie'].join(';');
      this.axios
        .get<Record<string, string>>(this.host + '/api/devices/ups/report', {
          headers: requestHeader,
        })
        .then((res) => {
          //console.log(res);
          resolve(res);
        })
        .catch(reject);
    });
  }

  public handleRequest() {
    return new Promise((resolve, reject) => {
      this.request()
        .then((request) => {
          // else {
          resolve(request.data);
          //this.request().then(resolve, reject);
          //}
        })
        .catch((e) => {
          //console.log(e);
          if (e.code === 'ERR_BAD_REQUEST') {
            this.login().then((login) => {
              this.headers = login.headers;
              this.request().then((d) => resolve(d.data), reject);
            });
          }
        });
    });
  }

  private login(): Promise<AxiosResponse<Record<string, string>>> {
    return new Promise((resolve, reject) => {
      this.axios
        .post<Record<string, string>>(this.host + '/api/login', {
          userName: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.status == 200) resolve(res);
          else reject();
        })
        .catch(reject);
    });
  }
}
