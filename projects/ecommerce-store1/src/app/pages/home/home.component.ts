import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StoreData } from '../../models/store-data.model';
import * as $ from 'jquery'
import { environment } from 'projects/ecommerce-store1/src/environments/environment';
import { StoreService } from '../../services/store.service';
import { EncriptionService } from '../../services/encryption.service';
import { NavigationService } from '../../services/navigation.service';
import { BehaviorSubject } from 'rxjs';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SpinnerOverlayService } from '../../services/spinner-overlay.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  sub: any;
  store_data: any = new StoreData();
  selectedIndex: number = 0;
  image_base_path = environment.aws;
  product_details:Array<any> = []
  item_count=0;
  catergoryData:any=[{_id: -1, name: 'DEFAULT'}]
  is_menu_opened=false;
 searchForm: UntypedFormGroup;

  public content = new BehaviorSubject<any>(this.route.snapshot.params['cat_id']);    
  public share = this.content.asObservable();  

  constructor(
    private spinnerOverlayService:SpinnerOverlayService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService:StoreService, private encryption: EncriptionService,
    private socketService: SocketService,
  ) { 
    this.searchForm = new UntypedFormGroup({})
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.socketService.fetchMovies();
		this.socketService.onFetchMovies().subscribe((data: any) => this.catergoryData = data)
// console.log(this.share)

// this.share.subscribe(x =>    
//  console.log(x))    

//     let params = this.route.snapshot.params;
//     let catergory_id = params['cat_id'];
//     this.searchForm = new FormGroup({
//       search: new FormControl(this.route.snapshot.queryParamMap.get('keyword')?this.route.snapshot.queryParamMap.get('keyword'):'', Validators.required),

//     })

//     if(catergory_id==0){
//       this.sub = this.route.data.subscribe((res: any) => {
//         if(res['status']==100){
//           this.store_data=res.data
//           //this.product_details = res.data['items']
//           this.catergoryData= [...this.catergoryData,...res.data['categories']]

//           if(this.route.snapshot.queryParamMap.get('keyword')){
 
//             this.getDataByCategory()
//           }else{
//             this.product_details = res.data['items']
//           }
//         }
//         else{
          
//           this.router.navigate(['/'])
//         }
      
//       });
//     }else{

//       this.sub = this.route.data.subscribe((res: any) => {
      
//         if(res && res['status']==100){
         
//           this.store_data=res.data
//           this.catergoryData= [...this.catergoryData,...res.data['categories']]
//           let cat_index = this.catergoryData.findIndex((data:any)=>{ return parseInt(data.id) == parseInt(catergory_id); console.log(catergory_id)})
//            console.log("cat index",cat_index)

        

//           if(this.route.snapshot.queryParamMap.get('keyword')){
//             this.getDataByCategory()
//           }else{
//             this.setIndex(cat_index,catergory_id,"")
//           }

         
//         }
//         else{
          
//           this.router.navigate(['/'])
//         }
      
//       });
     
//     }

this.share.subscribe(x =>    
 console.log(x))    

    let params = this.route.snapshot.params;
    let catergory_id = params['cat_id'];
    this.searchForm = new UntypedFormGroup({
      search: new UntypedFormControl(this.route.snapshot.queryParamMap.get('keyword')?this.route.snapshot.queryParamMap.get('keyword'):'', Validators.required),

    })

    // this.getAllCategories();
    if(catergory_id==0){

    }else{
      console.log( this.catergoryData)
      let cat_index = this.catergoryData.findIndex((data:any)=>{  data._id == catergory_id; console.log("hi",data)})
         
      console.log("The default cat")
      if(this.route.snapshot.queryParamMap.get('keyword')){
            this.getDataByCategory()
          }else{
            this.setIndex(cat_index,catergory_id,"")
          }

    }
this.sub = this.route.data.subscribe((res: any) => {

  if(res['logo']){
    console.log("went to if")
    this.store_data=res

  }else{
    this.router.navigate(['/'])
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


  setIndex(index: number,cat_id:String,keyword:any) {
     this.selectedIndex = index;
     console.log("this is index",index)
     console.log("this is catergory",cat_id)
     if(cat_id!=""){
     this.router.navigate(['/store/'+cat_id],{ replaceUrl: false })
      let token=localStorage.getItem("token")!;
      this.storeService.requestItemDetails(cat_id,keyword).subscribe((res:any) => {
  
      //  var data= this.encryption.response_decript2(res)
      //  var data2 = this.encryption.base64Decoder(data)
       let data3=JSON.parse(res);
       if(data3){
        this.product_details = data3
        // this.item_count=data3.count
  
        console.log(data3)
       }

 
     }, (error:any) => {
     })
 
     }else{
      this.router.navigate(['/store/'+0],{ replaceUrl: false })
      this.product_details = this.store_data['items']
     }

     
  }

  viewItem(item_id:String):void{

    this.router.config[1].data = {
      ...this.store_data
    }
    if(item_id)
    {
      this.router.navigate(['/view-item/'+item_id])
    }

    // this.router.navigate(['/view-item/'+item_id])

  }

  openMenuBar(){
    console.log("called")
    this.is_menu_opened=!this.is_menu_opened
  }


  getDataByCategory():void{
    this.spinnerOverlayService.show("")
    let params = this.route.snapshot.params;
    let catergory_id = params['cat_id'];
    this.router.navigate(['/store/'+catergory_id],{ replaceUrl: false, queryParams:{keyword:this.searchForm.value['search']} })
    
    let cat_index = this.catergoryData.findIndex((data:any)=>{ return data._id == catergory_id; console.log(catergory_id)})
    console.log("cat index",cat_index)

    this.setIndex2(cat_index===-1?0:cat_index,catergory_id,this.searchForm.value['search'])
    this.spinnerOverlayService.hide()
  }



  setIndex2(index: number,cat_id:String,keyword:any) {
    this.selectedIndex = index;
    console.log("this is index",index)
    console.log("this is catergory",cat_id)
    if(cat_id!=""){
      console.log("went inside")
     this.router.navigate(['/store/'+cat_id],{ replaceUrl: false ,queryParams:{keyword:keyword}})
     let token=localStorage.getItem("token")!;
     this.storeService.requestItemDetails(cat_id,keyword).subscribe((res:any) => {
 
      // var data= this.encryption.response_decript2(res)
      // var data2 = this.encryption.base64Decoder(data)
      let data3=JSON.parse(res);
      this.product_details = data3
      // this.item_count=data3.count

      console.log(data3)

    }, (error:any) => {
    })

    }else{
     this.router.navigate(['/store/'+0],{ replaceUrl: false })
    //  this.product_details = this.store_data['items']
    }

    
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
