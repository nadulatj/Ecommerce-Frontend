import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavigationService } from './services/navigation.service';
import * as $ from 'jquery'
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ecommerce-store1';
  user_language:any = "";

  constructor(private translateService: TranslateService,private readonly navigationService: NavigationService,private route: ActivatedRoute){
    
    $.get("https://ipinfo.io/?token=1931031af6cf74", (response) => {
      console.log(response.country);
      this.user_language = response.country
  }, "jsonp");

  if( this.user_language=='LK'){
    this.translateService.setDefaultLang('sn');
    this.translateService.use('sn')
  }else if( this.user_language=='KH'){
    this.translateService.setDefaultLang('kh');
    this.translateService.use('kh')
  }else{
    this.translateService.setDefaultLang('en');
    this.translateService.use('en')
  }

  let params = this.route.snapshot.params;
  let catergory_id = params['lang'];
  console.log("language is",catergory_id)
   
    this.navigationService

    var userLang = navigator.language;
    console.log("default lang",userLang)



  }

  ngOnInit(){


  }
}
