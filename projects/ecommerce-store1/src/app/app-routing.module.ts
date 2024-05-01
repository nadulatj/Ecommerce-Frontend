import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartViewComponent } from './pages/cart-view/cart-view.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { ThankyouPageComponent } from './pages/thankyou-page/thankyou-page.component';
import { ValidatorComponent } from './pages/validator/validator.component';
import { ViewItemComponent } from './pages/view-item/view-item.component';

const routes: Routes = [

  {
    path:'store/:cat_id',
    component:HomeComponent,
    },
    {
      path:'view-item/:item_id',
      component:ViewItemComponent,
      },
     {
      path:'checkout',
      component:CheckoutComponent,
      },
      {
        path:'cart-view',
        component:CartViewComponent,
        },
        {
          path:'thank-you/:order_id',
          component:ThankyouPageComponent,
          },
    {
      path:'',
      component:ValidatorComponent
      },
    {path:'',redirectTo:'', pathMatch: 'full' },
    { path: '**', component: ValidatorComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
