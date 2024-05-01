import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  token_value:string = localStorage.getItem("token")!;

  constructor(private http: HttpClient, private router: Router) {
    this.token_value = localStorage.getItem("token")!;
  }
   

  

  getData(url: any){
    const headers = new HttpHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.get(environment.apiBaseUrl + url, { responseType: 'text'})
  }

  postData(url: any, data: any){
    // let headers =  new HttpHeaders({
    //   'Content-Type': 'text/plain; charset=utf-8', 
    //   'Authorization': "6d75641792639648d975d5f609f6631c196a94d1f8b4ca126f37cb7ddfe96a8a568a31dd694e9c5c.E2MA118BFC568A6D560EF"
    // })

    return this.http.post(environment.apiBaseUrl + url, data)
  }

  getAuthorizedData(token:any,url: any){
    const headers = new HttpHeaders().set('Authorization', token);
    return this.http.get(environment.apiBaseUrl + url, { headers,responseType: 'text'})
  }

  AutherizedputData(url: any, data: any, token: string){
    let headers =  new HttpHeaders({
      'Content-Type': 'text/plain; charset=utf-8', 
      'Authorization': token
    })

    return this.http.put(environment.apiBaseUrl + url, data, { headers, responseType: 'text'})
  }


  AutherizedpostData(token:any,url: any, data: any){
    let headers =  new HttpHeaders({
      'Content-Type': 'text/plain; charset=utf-8', 
      'Authorization': "6d75641792639648d975d5f609f6631c196a94d1f8b4ca126f37cb7ddfe96a8a568a31dd694e9c5c.E2MA118BFC568A6D560EF"
    })

    return this.http.post(environment.apiBaseUrl2 + url, data, { headers, responseType: 'text'})
  }

}
