import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-item-search',
  templateUrl: './item-search.component.html',
  styleUrls: ['./item-search.component.scss']
})
export class ItemSearchComponent implements OnInit, OnChanges  {
  @Input() store_data: any ;
  is_category_open=false;
  selectedIndex=0;
  catergoryData:any=[{id: -1, name: 'DEFAULT'}]
  searchForm: UntypedFormGroup;
  catergory_id=0;

  constructor(    private route: ActivatedRoute,
    private router: Router) { 
    this.searchForm = new UntypedFormGroup({})
  }

  ngOnInit(): void {
    this.searchForm = new UntypedFormGroup({
      search: new UntypedFormControl('', Validators.required),

    })
    console.log(this.store_data)
    this.catergoryData=[{id: -1, name: 'DEFAULT'}]
    this.catergoryData= [...this.catergoryData,...this.store_data['categories']]
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['store_data']['currentValue'])
        this.store_data = changes['store_data']['currentValue']
        this.catergoryData=[{id: -1, name: 'DEFAULT'}]
        this.catergoryData= [...this.catergoryData,...this.store_data['categories']]
      }

  opencategory(){
    console.log("open")
this.is_category_open=!this.is_category_open
  }



  setIndex(index: number,cat_id:number,keyword:any) {

    this.selectedIndex = index;
    this.catergory_id=cat_id;
    
 }

 searchData(){
  this.router.navigate(['/store/'+ this.catergory_id],{ replaceUrl: false ,queryParams:{keyword:this.searchForm.value['search']}})

 }



}
