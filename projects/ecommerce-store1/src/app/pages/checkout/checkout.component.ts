import { Component, OnInit } from '@angular/core';
import { StoreData } from '../../models/store-data.model';
import * as $ from 'jquery'
import { environment } from 'projects/ecommerce-store1/src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreService } from '../../services/store.service';
import { EncriptionService } from '../../services/encryption.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import {Title} from "@angular/platform-browser";
import { SpinnerOverlayService } from '../../services/spinner-overlay.service';
import { Clipboard } from '@angular/cdk/clipboard';
import {MatSnackBar} from '@angular/material/snack-bar';
import { Modal } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { ValidateReview } from '../../_directives/review.validator';
import { OrderReview } from '../../_directives/ordernote.validator';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  store_data: StoreData = new StoreData();

  cart_data=[]
  cart_total=0
  checkoutForm: UntypedFormGroup;
  profile_pic_form: UntypedFormGroup;
  is_menu_opened=false;
catergoryData:any=[{id: -1, name: 'DEFAULT'}]
flat_rate=0;
final_total=0;
  favIcon: HTMLLinkElement = document.querySelector('#appIcon')!;

  constructor(
    private _snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private spinnerOverlayService:SpinnerOverlayService,
    private titleService:Title,  private fb: UntypedFormBuilder,public route: ActivatedRoute,private router: Router,private storeService:StoreService, private encryption: EncriptionService) {
    this.checkoutForm = new UntypedFormGroup({})
    this.profile_pic_form= new UntypedFormGroup({})
  
  }

  ngOnInit(): void {
    
    this.route.data.subscribe((res: any) => {
      if(JSON.stringify(res)!==JSON.stringify({})){
        console.log(res)
              // this.catergoryData= [...this.catergoryData,...res['categories']]
        this.store_data=res
        this.calculateFlatRate()
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
        this.favIcon.href = 'https://onepayserviceimages.s3.amazonaws.com/'+data3.logo;
        this.calculateFlatRate()
        console.log(this.store_data)
      }else{
        this.router.navigate(['/'])
      }
   
    }, (error:any) => {
    
    })




       // this.router.navigate(['/'])
      }
    
    });
    this.checkForCartChange()


    this.checkoutForm = new UntypedFormGroup({
      fname: new UntypedFormControl('', Validators.required),
      lname: new UntypedFormControl('',Validators.required),
      phone: new UntypedFormControl('',[
        Validators.required,Validators.minLength(6)
      ]),
      email_address: new UntypedFormControl('',[Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'),Validators.required]),
      country: new UntypedFormControl('',Validators.required),
      address: new UntypedFormControl('',Validators.required),
      town: new UntypedFormControl('',Validators.required),
      postal: new UntypedFormControl('',ValidateReview),
      notes: new UntypedFormControl('',OrderReview),
      is_different_shipping: new UntypedFormControl(false),
      country_secondary: new UntypedFormControl({value:'',disabled:true}),
      address_secondary: new UntypedFormControl({value:'',disabled:true}),
      town_secondary: new UntypedFormControl({value:'',disabled:true}),
      postal_secondary: new UntypedFormControl({value:'',disabled:true}),
      direct_bank: new UntypedFormControl(false),
      cod: new UntypedFormControl(false),

    })

    this.profile_pic_form = new UntypedFormGroup({
      picture: new UntypedFormControl('', Validators.required),
    });

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

    this.calculateFlatRate()
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action,{duration: 5000,});
  }


  orderSubmit(payslip:string):void{
    let order_array=[]
    // this.spinnerOverlayService.show("")
    if(localStorage.getItem("items")){
      const items:any=localStorage.getItem("items")?localStorage.getItem("items"):null
      const items_parsed=JSON.parse(items)
      console.log(items_parsed.length)
      for (let i=0;i<items_parsed.length;i++){
        console.log("visited for loop")
        let values= {
          item_id:items_parsed[i].id,
          size_id:parseInt(items_parsed[i].sizeId),
          color_id:parseInt(items_parsed[i].colorId),
          quantity:items_parsed[i].quantity,
       }

       order_array.push(values)
      }
    }

    let checkout_data;

if(payslip){
  checkout_data={
    customer_first_name:this.checkoutForm.value['fname'],
    "customer_last_name":this.checkoutForm.value['lname'],
    "customer_street_address":this.checkoutForm.value['address'],
    "customer_city":this.checkoutForm.value['town'],
    "customer_zip_code":this.checkoutForm.value['postal'],
    "customer_country":this.checkoutForm.value['country'],
    "customer_mobile_no":this.checkoutForm.value['phone'],
    "customer_email":this.checkoutForm.value['email_address'],
    "order_note":this.checkoutForm.value['notes'],
    "is_different_address":this.checkoutForm.value['is_different_shipping'],
    "secondary_country":this.checkoutForm.value['country_secondary']?this.checkoutForm.value['country_secondary']:"",
    "secondary_street_address":this.checkoutForm.value['address_secondary']?this.checkoutForm.value['address_secondary']:"",
    "secondary_city":this.checkoutForm.value['town_secondary']?this.checkoutForm.value['town_secondary']:"",
    "secondary_zip_code":this.checkoutForm.value['postal_secondary']?this.checkoutForm.value['postal_secondary']:"",
    "payment_type":this.checkoutForm.value['cod']?'cash_on_delivery':'bank_deposit',
    "order_data":order_array,
    "payment_slip":payslip
}
}else{

  checkout_data={
    customer_first_name:this.checkoutForm.value['fname'],
    "customer_last_name":this.checkoutForm.value['lname'],
    "customer_street_address":this.checkoutForm.value['address'],
    "customer_city":this.checkoutForm.value['town'],
    "customer_zip_code":this.checkoutForm.value['postal'],
    "customer_country":this.checkoutForm.value['country'],
    "customer_mobile_no":this.checkoutForm.value['phone'],
    "customer_email":this.checkoutForm.value['email_address'],
    "order_note":this.checkoutForm.value['notes'],
    "is_different_address":this.checkoutForm.value['is_different_shipping'],
    "secondary_country":this.checkoutForm.value['country_secondary']?this.checkoutForm.value['country_secondary']:"",
    "secondary_street_address":this.checkoutForm.value['address_secondary']?this.checkoutForm.value['address_secondary']:"",
    "secondary_city":this.checkoutForm.value['town_secondary']?this.checkoutForm.value['town_secondary']:"",
    "secondary_zip_code":this.checkoutForm.value['postal_secondary']?this.checkoutForm.value['postal_secondary']:"",
    "payment_type":this.checkoutForm.value['cod']?'cash_on_delivery':'bank_deposit',
    "order_data":order_array,
}

}
 

  // var base64_data = this.encryption.base64Encoder(checkout_data)
  // var encrypted_data= this.encryption.request_encript(base64_data)

    this.storeService.placeOrder(checkout_data).subscribe((res:any) => {

      // var data= this.encryption.response_decript2(res)
      // var data2 = this.encryption.base64Decoder(data)
      // let data3=JSON.parse(res);
      // console.log(data3)
      if(res){

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your order is successfully placed',
          showConfirmButton: false,
          timer: 1500
        })
        localStorage.setItem("items",JSON.stringify([]))
        this.spinnerOverlayService.hide()
        this.router.navigate(['/thank-you/'+res])

      }else{
        this.spinnerOverlayService.hide()
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: res,
        })
      }
    }, (error:any) => {
      this.spinnerOverlayService.hide()
      console.log("error submitting order",error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error,
      })
    })
    console.log(checkout_data)
  }


  checkValue():void{
    
    if(this.checkoutForm.value['is_different_shipping'])
    {
      this.checkoutForm.get('country_secondary')?.enable()
      this.checkoutForm.get('address_secondary')?.enable()
      this.checkoutForm.get('town_secondary')?.enable()
      this.checkoutForm.get('postal_secondary')?.enable()
    }else{
      this.checkoutForm.get('country_secondary')?.disable()
      this.checkoutForm.get('address_secondary')?.disable()
      this.checkoutForm.get('town_secondary')?.disable()
      this.checkoutForm.get('postal_secondary')?.disable()
    }

  }

  onFileChange(file:any):void{
 
    if (!file || Array.isArray(file) || typeof file !== 'object') {
      
      this.profile_pic_form.get('picture')?.setValue('');
      return;
    }

    const render = new FileReader();
    render.readAsDataURL(file);
 
    render.onload = () => {
    
      this.profile_pic_form.get('picture')?.setValue(render.result);
    };

  }

  inputChange(value:any):void{
console.log(value.target.name)
if(value.target.name=="checkbox-cod"){
this.checkoutForm.get('direct_bank')?.setValue(false)
}else{
  this.checkoutForm.get('cod')?.setValue(false)
}
  }


onBankReceiptSubmit():void{
  this.spinnerOverlayService.show("")
  console.log("acacacac")
  var myModalEl = document?.getElementById('myModal')
  var modal = bootstrap.Modal?.getInstance(myModalEl!)

  const bank_image={
    image:this.profile_pic_form?.value['picture'],
}

console.log("this is image",bank_image)
var base64_data = this.encryption.base64Encoder(bank_image)
var encrypted_data= this.encryption.request_encript(base64_data)

  this.storeService.uploadImage(this.store_data['token'],'',encrypted_data).subscribe((res:any) => {
    console.log("encrypted response",res)
    var data= this.encryption.response_decript2(res)
    var data2 = this.encryption.base64Decoder(data)
    let data3=JSON.parse(data2);
    console.log(data3)
    if(data3){
      modal!.hide()
      // document.getElementById("emodal-close")?.click();
      this.orderSubmit(data3.data)


    }else{
      this.spinnerOverlayService.hide()
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: data3.message,
      })
    }
  }, (error:any) => {
    this.spinnerOverlayService.hide()

    console.log("error submitting file",error)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: error,
    })
  })
}


copyText(textToCopy: string) {
  this.clipboard.copy(textToCopy);
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
