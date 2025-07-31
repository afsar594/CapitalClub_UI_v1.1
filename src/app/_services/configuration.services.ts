import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class AppConfigService {

  public version: string;
  public apiEndpointSomeData: string;

  constructor(private http: HttpClient) {}

  load() :Promise<any>  {

      const promise = this.http.get('/assets/components/menu/menu.json')
        .toPromise()
        .then(data => {
          Object.assign(this, data);
          return data;
        });

      return promise;
  }
}