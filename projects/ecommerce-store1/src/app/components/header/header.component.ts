import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StoreData } from '../../models/store-data.model';
import { environment } from 'projects/ecommerce-store1/src/environments/environment';
import { CartModel } from '../../models/cartModel.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges {
  // @Input() email: string = "";
  // @Input() logo: string = "";
  // @Input() contact: string = "";
  @Input() store_data: any ;
  @Output() checkForCartChange1 = new EventEmitter<string>();
  @Output() openMenu = new EventEmitter<string>();
  image_base_path = environment.aws;


  email:any = "";
  logo: any = "";
  contact:  any = "";
  cart_data=[]
  cart_total: number =0
  is_cart_open=false;

  // constructor(private translateService: TranslateService){
  //   this.translateService.setDefaultLang('en');
  //   this.translateService.use(localStorage.getItem('lang')||'en')
  // }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  
  ngOnInit(): void {
    localStorage.getItem("items")?localStorage.getItem("items"):localStorage.setItem("items",JSON.stringify([]))
// this.openCart()
    // $(document).ready(function () {
    
    //   $('#sidebarCollapse').on('click', function () {
    //     $('.sidebar-responsive').toggleClass('active');
    //   });

    //   $('#sidebarhide').on('click', function () {
    //     $('.sidebar-responsive').removeClass('active');
    //   });

    // });
    // $(document).on('click', 'a.thatTag', function (e) {
    //   // ...
    //   e.preventDefault();
    // });
    // $('#sort-btn').click(function () {
    //   $('.esort-popover').toggle('slow');
    // });

    // $('#scart-btn').click(function () {
    //   $('.scart-popover').toggle('slow');
    // });


this.HeaderInfo()
this.checkForCartChange()

  }

  openCart(){
    console.log("open")
this.is_cart_open=!this.is_cart_open
  }

  checkChange() {
    this.checkForCartChange1.emit();
  }

  
  ngOnChanges(changes: SimpleChanges): void {

    this.store_data = changes['store_data']['currentValue']
    this.email = changes['store_data']['currentValue']['email']
    this.contact = changes['store_data']['currentValue']['contact_no']
    this.logo = changes['store_data']['currentValue']['logo']
  }


  HeaderInfo():void{
    
    if(this.store_data){
      this.email = this.store_data['email']
      this.contact = this.store_data['contact_no']
      this.logo = this.store_data['logo']
    }
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

  removeCartItem(event:any,id:number):void{
    if(event){
      event.stopPropagation()
    }
 
    console.log("item called")
  this.cart_data.splice(id,1);
  localStorage.setItem("items",JSON.stringify(this.cart_data))
  this.checkForCartChange()
  this.checkChange()
  }


  redirectToCheckout():void{
this.openCart()
    this.router.config[2].data = {
      ...this.store_data
    }
    this.router.navigate(['/checkout'])



  }

  redirectTocartPage():void{
    
    this.openCart()

    this.router.config[4].data = {
      ...this.store_data
    }
    this.router.navigate(['/cart-view'])
  }

  addItemsToCartModel(items:CartModel,quantity:Number|any,maximumQuantity:number,sizeId:number,colorId:number):void{


    let item={
      id:items.id,
      logo:items.images?items.images[0]:"",
      name:items.name,
      quantity:quantity,
      price:items.net_amount,
      totalPrice:items.net_amount*quantity,
      sizeId:sizeId,
      colorId:colorId,
      maximumQuantity:maximumQuantity
    }
  
    let all_items = localStorage.getItem("items")
    let json_obje=JSON.parse(all_items?all_items:"")
    console.log(json_obje)
    json_obje.push(item)
    let stringyfy_obj = JSON.stringify(json_obje)
    localStorage.setItem("items",stringyfy_obj)

    this.checkForCartChange()
  }


  headerOpen(){
    this.openMenu.emit();
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
