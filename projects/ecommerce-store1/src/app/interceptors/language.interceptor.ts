import { Injectable } from "@angular/core";
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse,HttpErrorResponse} from '@angular/common/http';
import { Observable } from "rxjs";


@Injectable()
export class LanguageInterceptor implements HttpInterceptor{
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const lang = localStorage.getItem('lang') || 'en';

        req = req.clone({
            setHeaders:{
                'Accept-Language': lang
            }
        });
        return next.handle (req)
    }
}