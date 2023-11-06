import { NgModule } from '@angular/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { FindMarketsComponent } from './find-markets/find-markets.component';
import { NewsComponent } from './news-wrapper/news/news.component';
import { MarketBarometerComponent } from './market-barometer/market-barometer.component';
import { SeasonalProductsComponent } from './seasonal-products/seasonal-products.component';
import { AboutComponent } from './about/about.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewsItemComponent } from './news-wrapper/news-item/news-item.component';
import { News2Component } from './news-wrapper/news2/news2.component';
import { News3Component } from './news-wrapper/news3/news3.component';
import { MarketItemComponent } from './market-item/market-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafePipe } from './safe.pipe';
import { ApplicationComponent } from './application/application.component';
import { ShopComponent } from './shop/shop.component';
import { FinalPurchaseComponent } from './final-purchase/final-purchase.component';
import { CompleteBuyComponent } from './complete-buy/complete-buy.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics, getAnalytics, ScreenTrackingService, UserTrackingService } from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideRemoteConfig, getRemoteConfig } from '@angular/fire/remote-config';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { ScrollButtonComponent } from './scroll-button/scroll-button.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    FindMarketsComponent,
    NewsComponent,
    MarketBarometerComponent,
    SeasonalProductsComponent,
    AboutComponent,
    SignInComponent,
    SignUpComponent,
    NewsItemComponent,
    News2Component,
    News3Component,
    MarketItemComponent,
    SafePipe,
    ApplicationComponent,
    ShopComponent,
    FinalPurchaseComponent,
    CompleteBuyComponent,
    ScrollButtonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    NgbPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig()),
    provideStorage(() => getStorage())
  ],
  providers: [
    ScreenTrackingService, UserTrackingService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
