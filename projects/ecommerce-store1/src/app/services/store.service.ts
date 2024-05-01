import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { EncriptionService } from './encryption.service';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private apiService: ApiService, private encryptionService: EncriptionService) { }


  requestStoreDetails(name: String){
    return this.apiService.getData(
        'web/'+name+"/");
}

requestCategoryDetails(){
  return this.apiService.getData(
      'categories/');
}

requestItemDetails(id: String,keyword:String){
  return this.apiService.getData(
      'items/'+id+"/");
}

requestSingleItemDetails(id: String){
  return this.apiService.getData(
      'items/single/'+id+"/");
}

requestStoreDetailsByID(store_id: Number,item_id:Number,token:string){
  return this.apiService.getAuthorizedData(token,
    'website/'+store_id+ '/item/'+item_id);
}

getItemsByPage(page: Number,limit:Number,catergory:Number,store_id:Number,token:string,keyword:string){
  return this.apiService.getAuthorizedData(token,
    'website/'+store_id+ '/item/?page='+page+'&limit='+limit+'&category_id='+catergory+'&keyword='+keyword);
}


placeOrder(data:any){
  return this.apiService.postData(
    'orders/add/',data);
}


uploadImage(token:any,store_id:any,data:any){
  return this.apiService.AutherizedpostData(token,
    'website/17/image',data);
}

getOrderDetails(token:any,store_id:any,orderId:any){
  return this.apiService.getAuthorizedData(token,
    'website/'+store_id+'/order/'+orderId);
}

}
