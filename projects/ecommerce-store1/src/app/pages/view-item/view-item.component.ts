import { Component, OnChanges, OnInit, SimpleChanges, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreData } from '../../models/store-data.model';
import { StoreService } from '../../services/store.service';
import { EncriptionService } from '../../services/encryption.service';
import { environment } from 'projects/ecommerce-store1/src/environments/environment';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from 'angular-toastify';
import { ToastType } from '../../models/ToastType';
import {Title} from "@angular/platform-browser";
import { SpinnerOverlayService } from '../../services/spinner-overlay.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-view-item',
  templateUrl: './view-item.component.html',
  styleUrls: ['./view-item.component.scss']
})
export class ViewItemComponent implements OnInit  {

  @ViewChild(HeaderComponent) addItems?: HeaderComponent 
  favIcon: HTMLLinkElement = document.querySelector('#appIcon')!;
  store_data: StoreData = new StoreData();
  item_id:any;
  item_data:any = [];
  image_base_path = environment.aws;
  quantityValue:any = 1;
  maximumQuantity:any = -1;
  selectedDevice:any = 0;
  colorDetails:any = [];
  selectedIndex: number = -1;
  selectedImage:any = "";
  SelectedSizeId:number = 0;
  SelectedColorId:number = 0;
  activeImage:number=0;
  item_images:any[] = [];
is_menu_opened=false;
catergoryData:any=[{_id: -1, name: 'DEFAULT'}]
current_URL=window.location.href


  message = 'This is a Angular Toastify test # ';
  messageIndex = 1;
  transitions = ['bounce', 'slide', 'zoom', 'flip'];
  transition = 'bounce';

  positions = ['top-left', 'top-right', 'top-center', 'bottom-left', 'bottom-right', 'bottom-center'];
  position = 'top-right';

  iconLibraries = ['none', 'material', 'font-awesome'];
  iconLibrary = 'material';
  ToastType = ToastType;
  autoClose = 50000;
  disableAutoClose = false;
  hideProgress = false;
  newestOnTop = false;
  closeOnClick = true;
  pauseDelayHover = true;
  pauseVisibilityChange = true;
  constructor(private clipboards: Clipboard,private _snackBar: MatSnackBar,private spinnerOverlayService:SpinnerOverlayService,private titleService:Title,public route: ActivatedRoute,public router: Router,private storeService:StoreService, private encryption: EncriptionService,private _toastService: ToastService) {

  }


  
  ngOnInit(): void {

    


    
    localStorage.getItem("items")?localStorage.getItem("items"):localStorage.setItem("items",JSON.stringify([]))

   
    this.route.data.subscribe( (res: any) => {
      if(JSON.stringify(res)!==JSON.stringify({})){
        console.log(res)
        this.store_data=res
        this.getAllCategories()
        // this.catergoryData= [...this.catergoryData,...res['categories']]
        this.getDataByID()
      }
      else{

        const { hostname }  = new URL(window.location.href)
        const [subdomain] = hostname.split('.')
        console.log(subdomain)    //SUBDOMAIN
        this.titleService.setTitle(subdomain);
        this.spinnerOverlayService.show("")
         this.storeService.requestStoreDetails("clothes").subscribe((res:any) => {
 
      // var data= this.encryption.response_decript2(res)
      // var data2 = this.encryption.base64Decoder(data)
      let data3=JSON.parse(res);
      this.spinnerOverlayService.hide()
      if(data3){
      
         localStorage.setItem("token",data3.token)
        this.store_data=data3
        // this.catergoryData= [...this.catergoryData,...this.store_data['categories']]
        this.getAllCategories()
        this.favIcon.href = 'https://onepayserviceimages.s3.amazonaws.com/'+data3.logo;
        console.log(this.store_data)
        this.getDataByID()
       
      }
      // else{
      //   this.router.navigate(['/'])
      // }
    }, (error:any) => {
    })




       // this.router.navigate(['/'])
      }
    
    });



      
  }




  getAllCategories(){
    this.storeService.requestCategoryDetails().subscribe((res:any) => {
      let data3=JSON.parse(res);
      
        this.catergoryData= [...this.catergoryData,...data3]

    }, (error:any) => {
    })
  }

 

  addSuccessToast() {
    this._toastService.success(this.message + this.messageIndex);
    this.messageIndex++;
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{duration: 5000,});
  }


  getDataByID():void{

    let params = this.route.snapshot.params
    // let store_id = params['store_id']
    let item_id = params['item_id']
console.log(item_id)
    let token=localStorage.getItem("token")!;
  
    this.storeService.requestSingleItemDetails(item_id).subscribe((res:any) => {
   
      // var data= this.encryption.response_decript2(res)
      // var data2 = this.encryption.base64Decoder(data)
      let data3=JSON.parse(res);
      console.log("sdcssdc",data3)
      this.item_data = data3
      this.item_images=this.item_data['images']
      this.maximumQuantity = data3['current_quantity']
      console.log(data3.data)
    }, (error:any) => {
    })



  }


  quantityControl(type:String):void{
    
if(type==="substract"){
  if(this.quantityValue!=1){
    this.quantityValue --
  }
}else{
 
   if(this.quantityValue < this.maximumQuantity){
    this.quantityValue ++
   }else{
    this.openSnackBar('Maximum available items added', '')
   }

}
  }

  onOptionsSelected(deviceValue:any) {
    console.log(deviceValue);

    this.quantityValue = 1
    
 let index = this.item_data['item_details'].findIndex((x:any) =>  x['id'].toString() == deviceValue.toString());

this.SelectedSizeId = deviceValue
this.selectedIndex=-1;
this.colorDetails = this.item_data['item_details'][index].colors

this.maximumQuantity = this.item_data['item_details'][index].current_quantity

}


setIndex(index: number) {
  this.quantityValue = 1
  this.selectedIndex = index;
this.SelectedColorId = this.colorDetails[index].id
  console.log(this.colorDetails[index].current_quantity)
  this.maximumQuantity=this.colorDetails[index].current_quantity
}

addToCart():void{
  
  this.addItems?.addItemsToCartModel(this.item_data,this.quantityValue,this.maximumQuantity,this.SelectedSizeId,this.SelectedColorId)
  // let item={
  //   logo:this.item_data.images[0]?this.item_data.images[0]:"",
  //   name:this.item_data.name,
  //   quantity:this.quantityValue,
  //   price:this.item_data.net_amount,
  //   totalPrice:this.item_data.net_amount*this.quantityValue,
  // }

  // let all_items = localStorage.getItem("items")
  // let json_obje=JSON.parse(all_items?all_items:"")
  // console.log(json_obje)
  // json_obje.push(item)
  // let stringyfy_obj = JSON.stringify(json_obje)
  // localStorage.setItem("items",stringyfy_obj)
  this.SelectedSizeId = 0;
  this.SelectedColorId = 0;
  this.openSnackBar('Added item to cart', '')
 
}

ChangeImages=(image:String)=>{
this.selectedImage=image
}

changeActive(id:number):void{
this.activeImage=id
}

openMenuBar(){
  console.log("called")
  this.is_menu_opened=!this.is_menu_opened
}

navigateToCategory(catID:any){
  this.router.navigate(['/store/'+catID])
}

copyText(textToCopy: string) {
  console.log("adaddadafafeaa")
  this.clipboards.copy("dacdacaca")
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
