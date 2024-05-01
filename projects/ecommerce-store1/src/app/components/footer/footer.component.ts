import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StoreData } from '../../models/store-data.model';
import { environment } from 'projects/ecommerce-store1/src/environments/environment';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() store_data: any ;
  image_base_path = environment.aws;
  email:any = "";
  logo: any = "";
  contact:  any = "";
  description:string = ""
  business_address:string = ""
  telegram:string = "https://t.me/"

  constructor() { }

  ngOnInit(): void {
    this.footerInfo()
  }


  ngOnChanges(changes: SimpleChanges): void {

    this.store_data = changes['store_data']['currentValue']
    this.email = changes['store_data']['currentValue']['email']
    this.contact = changes['store_data']['currentValue']['contact_no']
    this.logo = changes['store_data']['currentValue']['logo']
    this.description = changes['store_data']['currentValue']['business_description']
    this.business_address = changes['store_data']['currentValue']['business_address']
  }


  footerInfo():void{
    
    if(this.store_data){
      this.email = this.store_data['email']
      this.contact = this.store_data['contact_no']
      this.logo = this.store_data['logo']
      this.description = this.store_data['business_description']
      this.business_address = this.store_data['business_address']
    }
  }


}
