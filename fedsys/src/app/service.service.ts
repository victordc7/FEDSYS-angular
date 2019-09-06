import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  url = environment.apiRoot
  constructor(
    private http: HttpClient
  ) { }
  graphql(data: object) {
    return this.http.post(this.url,data);
  }
}
