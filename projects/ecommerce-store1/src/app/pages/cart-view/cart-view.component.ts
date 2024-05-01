import { Component, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { StoreData } from '../../models/store-data.model';
import { ActivatedRoute, Router } from '@angular/router';

import { StoreService } from '../../services/store.service';
import { EncriptionService } from '../../services/encryption.service';
import { environment } from 'projects/ecommerce-store1/src/environments/environment';
import { HeaderComponent } from '../../components/header/header.component';
import {Title} from "@angular/platform-browser";
import { MatSnackBar } from '@angular/material/snack-bar';
import { SocketService } from '../../services/socket.service';
@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrls: ['./cart-view.component.scss']
})
export class CartViewComponent implements OnInit {
  @ViewChild(HeaderComponent) addItems?: HeaderComponent 
  image_base_path = environment.aws;
  store_data: StoreData = new StoreData();
  cart_data=[]
  cart_total=0
  is_menu_opened=false;
catergoryData:any=[{id: -1, name: 'DEFAULT'}]
flat_rate=0;
final_total=0;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon')!;
  
  constructor(    private socketService: SocketService,private _snackBar: MatSnackBar,private titleService:Title,private router: Router,private storeService:StoreService, private encryption: EncriptionService,public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.socketService.fetchMovies();
		this.socketService.onFetchMovies().subscribe((data: any) => this.catergoryData = data)

    this.route.data.subscribe((res: any) => {
      if(JSON.stringify(res)!==JSON.stringify({})){
        console.log(res)
        this.store_data=res
        // this.catergoryData= [...this.catergoryData,...res['categories']]
        this.calculateFlatRate()
      }
      else{
        const { hostname }  = new URL(window.location.href)
        const [subdomain] = hostname.split('.')
        console.log(subdomain)    //SUBDOMAIN
        this.titleService.setTitle("");
        
    this.storeService.requestStoreDetails("clothes").subscribe((res:any) => {
 
      // var data= this.encryption.response_decript2(res)
      // var data2 = this.encryption.base64Decoder(data)
      let data3=JSON.parse(res);

      if(data3){
         localStorage.setItem("token",data3.token)

         this.favIcon.href = 'https://onepayserviceimages.s3.amazonaws.com/'+data3.logo;
        this.store_data=data3
        this.calculateFlatRate()
        // this.catergoryData= [...this.catergoryData,...this.store_data['categories']]
        console.log(this.store_data)
      }else{
        this.router.navigate(['/'])
      }

     
      console.log(this.store_data)
    }, (error:any) => {
    })




       // this.router.navigate(['/'])
      }
    
    });

    this.checkForCartChange()
    this.calculateTotal()

  }


  


  checkForCartChange():void{
 
    let all_items = localStorage.getItem("items")
    let json_obje=JSON.parse(all_items?all_items:"")
    this.cart_data=json_obje
    this.calculateTotal()
    this.calculateFlatRate()
  }

  calculateTotal():void{
    this.cart_total=0
    let all_items = localStorage.getItem("items")
    let json_obje=JSON.parse(all_items?all_items:"")
    
    for(let i=0;i<json_obje.length;i++){
      this.cart_total=this.cart_total+json_obje[i].totalPrice
    }
    this.calculateFlatRate()
  }


  redirectToCheckout():void{
    this.router.config[2].data = {
      ...this.store_data
    }
    this.router.navigate(['/checkout'])
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{duration: 5000,});
  }

  updateItemsCount=(index:any,item:any,type:String)=>{
    let all_items = localStorage.getItem("items")
    let json_obje=JSON.parse(all_items?all_items:"")
    let quantity=json_obje[index].quantity

    if(type=="add"){
      if(quantity<json_obje[index].maximumQuantity)
      {
        quantity=quantity+1
        json_obje[index].quantity = quantity
        json_obje[index].totalPrice = quantity * json_obje[index].price
        let stringyfy_obj = JSON.stringify(json_obje)
  
      localStorage.setItem("items",stringyfy_obj)
      this.checkForCartChange()
      this.addItems?.checkForCartChange()
      this.calculateTotal()
      this.calculateFlatRate()
        console.log( json_obje[index].quantity )
      }else{
        
          this.openSnackBar('Maximum available items added', '')
      }

    }else if(type=="substract"){
      if(quantity>1)
      {
        quantity=quantity-1
        json_obje[index].quantity = quantity
        json_obje[index].totalPrice = quantity * json_obje[index].price
        let stringyfy_obj = JSON.stringify(json_obje)
        localStorage.setItem("items",stringyfy_obj)
        this.checkForCartChange()
        this.addItems?.checkForCartChange()
      this.calculateTotal()
      this.calculateFlatRate()
      }


    }

  }


  DeleteCartItems=(id:number)=>{
this.addItems?.removeCartItem("",id);
this.checkForCartChange();
this.calculateTotal()
this.calculateFlatRate()
  }


  openMenuBar(){
    console.log("called")
    this.is_menu_opened=!this.is_menu_opened
  }
  
  navigateToCategory(catID:any){
    this.router.navigate(['/store/'+catID])
  }

  calculateFlatRate():void{
    console.log("ddadad")
    if(this.store_data['delivery_charges']){
      this.flat_rate=0
      for(let i=0;i<this.store_data['delivery_charges'].length;i++){
        console.log("ddadad",this.store_data['delivery_charges'][i].min_amount)
        if(this.cart_total>this.store_data['delivery_charges'][i].min_amount && this.cart_total<this.store_data['delivery_charges'][i].max_amount){
          this.flat_rate = parseInt(this.store_data['delivery_charges'][i].charge)
        }
      }
    }
this.final_total=this.flat_rate+this.cart_total

  }


  currencyFormatter(amount:any) {
    try {
      amount = parseFloat(amount);
      return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    } catch (error) {
      return amount;
    }
  }


}

