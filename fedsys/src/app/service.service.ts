import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Category } from './models/category.model';
import { Competitor } from './models/competitor.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  url = environment.apiRoot;
  constructor(
    private http: HttpClient
  ) { }
  graphql(data: object) {
    return this.http.post<Category[]>(this.url, data);
  }
}
