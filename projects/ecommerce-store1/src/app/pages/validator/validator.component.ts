import { Component, OnInit } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { EncriptionService } from '../../services/encryption.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { NavigationService } from '../../services/navigation.service';
import {Title} from "@angular/platform-browser";
import { SpinnerOverlayService } from '../../services/spinner-overlay.service';

@Component({
  selector: 'app-validator',
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss']
})
export class ValidatorComponent implements OnInit {
   favIcon: HTMLLinkElement = document.querySelector('#appIcon')!;
  constructor(

    private titleService:Title,
    private router: Router,
    private route: ActivatedRoute,
    private storeService:StoreService, private encryption: EncriptionService,private readonly navigationService: NavigationService) { }

  ngOnInit(): void {

    console.log(this.route)
    this.getStoreData()
  }

  getStoreData():void{
    // this.storeService.requestStoreDetails(''); Observable<any> 
  

const { hostname }  = new URL(window.location.href)
const [subdomain] = hostname.split('.')
console.log(subdomain)    //SUBDOMAIN
this.titleService.setTitle(subdomain);
    this.storeService.requestStoreDetails("clothes").subscribe((res:any) => {
 
      // var data= this.encryption.response_decript2(res)
      // var data2 = this.encryption.base64Decoder(data)
      let data3=JSON.parse(res);
      // console.log(data3)
      if(res){
        this.favIcon.href = 'https://onepayserviceimages.s3.amazonaws.com/'+data3.logo;
        localStorage.setItem("token",data3.token)

        this.router.config[0].data = {
          ...data3
        }
        this.navigationService.back()
        //this.router.navigate(['/store/0'])
      }else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "The website you requested is not available at the moment",
        })
      }

  
    }, (error:any) => {
    })
    
  }

}
