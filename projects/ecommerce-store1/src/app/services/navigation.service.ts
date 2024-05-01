import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, map, pairwise } from 'rxjs';

const HOME_URL = '/store/0';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private previousUrl?: string;

  constructor(
    private readonly router: Router,
    private readonly location: Location
  ) {
   
    this.router.events
      .pipe(
        
        filter((event) => event instanceof RoutesRecognized),
        map((event) => event as RoutesRecognized),
        pairwise()
      )
      .subscribe((events: [RoutesRecognized, RoutesRecognized]) => {

        this.previousUrl = events[0].urlAfterRedirects;
      });
      console.log("previous events",this.router.events)
  }

  public back(): void {

    if (this.previousUrl !== undefined) {
      this.location.back();
    } else {
      this.router.navigate([HOME_URL], { replaceUrl: true });
    }
  }
}