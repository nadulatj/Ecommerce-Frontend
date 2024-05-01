import { Component, OnInit } from '@angular/core';
import { StoreData } from '../../models/store-data.model';
import * as $ from 'jquery'
import { environment } from 'projects/ecommerce-store1/src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { EncriptionService } from '../../services/encryption.service';
import { UntypedFormBuilder, FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {Title} from "@angular/platform-browser";
import { SpinnerOverlayService } from '../../services/spinner-overlay.service';
@Component({
  selector: 'app-thankyou-page',
  templateUrl: './thankyou-page.component.html',
  styleUrls: ['./thankyou-page.component.scss']
})
export class ThankyouPageComponent implements OnInit {

  store_data: StoreData = new StoreData();

  cart_data=[]
  cart_total=0
  checkoutForm: UntypedFormGroup;
  profile_pic_form: UntypedFormGroup;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon')!;
  order_id:any;
  order_details:any;
  image_base_path = environment.aws;
  constructor(
    private spinnerOverlayService:SpinnerOverlayService,
    private titleService:Title,  private fb: UntypedFormBuilder,public route: ActivatedRoute,private router: Router,private storeService:StoreService, private encryption: EncriptionService) {
    this.checkoutForm = new UntypedFormGroup({})
    this.profile_pic_form= new UntypedFormGroup({})
  
  }

  ngOnInit(): void {

    let params = this.route.snapshot.params;
    this.order_id=params['order_id'];

    this.route.data.subscribe((res: any) => {
      if(JSON.stringify(res)!==JSON.stringify({})){
        console.log(res)
        this.store_data=res
        this.retreiveOrderDetails(this.store_data['token'],this.store_data['id'],this.order_id)

      }
      else{

        const { hostname }  = new URL(window.location.href)
        const [subdomain] = hostname.split('.')
        console.log(subdomain)    //SUBDOMAIN
        this.titleService.setTitle(subdomain);
        this.spinnerOverlayService.show("")
    this.storeService.requestStoreDetails(subdomain).subscribe((res:any) => {
 
      var data= this.encryption.response_decript2(res)
      var data2 = this.encryption.base64Decoder(data)
      let data3=JSON.parse(data2);
      this.spinnerOverlayService.hide()
      if(data3.status==100){

        localStorage.setItem("token",data3.data.token)
        this.store_data=data3.data
        this.favIcon.href = 'https://onepayserviceimages.s3.amazonaws.com/'+data3.data.logo;
        console.log(this.store_data)
        this.retreiveOrderDetails(this.store_data['token'],this.store_data['id'],this.order_id)
      }else{
        this.router.navigate(['/'])
      }
   
    }, (error:any) => {
    })




       // this.router.navigate(['/'])
      }
    
    });
    this.checkForCartChange()
    // console.log(this.checkoutForm.value['is_different_shipping'])
  }




  checkForCartChange():void{
    this.cart_total=0
    let all_items = localStorage.getItem("items")
    let json_obje=JSON.parse(all_items?all_items:"")
    this.cart_data=json_obje

    for(let i=0;i<json_obje.length;i++){
      this.cart_total=this.cart_total+json_obje[i].totalPrice
    }
  }

  retreiveOrderDetails(token:any,store:any,order_id:any):void{
    this.storeService.getOrderDetails(token,store,order_id).subscribe((res:any) => {
 
      var data= this.encryption.response_decript2(res)
      var data2 = this.encryption.base64Decoder(data)
      let data3=JSON.parse(data2);

      if(data3.status==100){
        this.order_details = data3
        console.log(data3)
        // localStorage.setItem("token",data3.data.token)
        // this.store_data=data3.data
        // this.favIcon.href = 'https://onepayserviceimages.s3.amazonaws.com/'+data3.data.logo;
        // console.log(this.store_data)
      }else{
        this.router.navigate(['/'])
      }
   
    }, (error:any) => {
    })
  }


  currencyFormatter(amount:any) {
    try {
      amount = parseFloat(amount);
      return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } catch (error) {
      return amount;
    }
  }

  getTotal(val:any,val2:any){
return parseFloat(val)+parseFloat(val2);
  }

}
