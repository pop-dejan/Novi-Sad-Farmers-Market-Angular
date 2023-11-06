import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FindMarketsComponent } from './find-markets/find-markets.component';
import { NewsComponent } from './news-wrapper/news/news.component';
import { MarketBarometerComponent } from './market-barometer/market-barometer.component';
import { SeasonalProductsComponent } from './seasonal-products/seasonal-products.component';
import { AboutComponent } from './about/about.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NewsItemComponent } from './news-wrapper/news-item/news-item.component';
import { News2Component } from './news-wrapper/news2/news2.component';
import { News3Component } from './news-wrapper/news3/news3.component';
import { MarketItemComponent } from './market-item/market-item.component';
import { ApplicationComponent } from './application/application.component';
import { ShopComponent } from './shop/shop.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FinalPurchaseComponent } from './final-purchase/final-purchase.component';
import { CompleteBuyComponent } from './complete-buy/complete-buy.component';
import { AuthGuard } from '../auth-guard/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'find-markets', component: FindMarketsComponent },
  { path: 'news', component: NewsComponent },
  { path: "news/:id", component: NewsItemComponent },
  { path: "news2", component: News2Component },
  { path: "news2/:id", component: NewsItemComponent },
  { path: "news3", component: News3Component },
  { path: "news3/:id", component: NewsItemComponent },
  { path: 'market-barometer', component: MarketBarometerComponent },
  { path: 'seasonal-products', component: SeasonalProductsComponent },
  { path: 'markets/:id', component: MarketItemComponent },
  { path: 'about', component: AboutComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'application', component: ApplicationComponent, canActivate: [AuthGuard] },
  { path: 'shop', component: ShopComponent, canActivate: [AuthGuard] },
  { path: 'final-purchase', component: FinalPurchaseComponent, canActivate: [AuthGuard] },
  { path: 'complete-buy', component: CompleteBuyComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
