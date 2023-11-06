import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { NewsUnit } from '../model/news';
import { MarketsUnit } from '../model/markets';
import { Product } from '../model/products';

@Injectable({
  providedIn: 'root'
})
export class MarketsService {

  constructor(private http: HttpClient) {
  }

  getNewsInfo(): Observable<NewsUnit> {
    return this.http.get("https://dejanpopovic-fccfa-default-rtdb.europe-west1.firebasedatabase.app/news.json").pipe(
      map((data: any) => {
        return data.map((elem: any) => new NewsUnit(elem));
      })
    );
  }

  getNewsDetails(id: number): Observable<NewsUnit> {
    return this.http.get("https://dejanpopovic-fccfa-default-rtdb.europe-west1.firebasedatabase.app/news" + '/' + id + ".json").pipe(
      map((elem: any) => {
        return new NewsUnit(elem);
      })
    );
  }

  getMarketsInfo(): Observable<MarketsUnit> {
    return this.http.get("https://dejanpopovic-fccfa-default-rtdb.europe-west1.firebasedatabase.app/markets.json").pipe(
      map((data: any) => {
        return data.map((elem: any) => new MarketsUnit(elem));
      })
    );
  }

  getMarketsDetails(id: number): Observable<MarketsUnit> {
    return this.http.get("https://dejanpopovic-fccfa-default-rtdb.europe-west1.firebasedatabase.app/markets" + '/' + id + ".json").pipe(
      map((elem: any) => {
        return new MarketsUnit(elem);
      })
    );
  }

  getProducts(): Observable<Product> {
    return this.http.get("https://dejanpopovic-fccfa-default-rtdb.europe-west1.firebasedatabase.app/products.json").pipe(
      map((data: any) => {
        return data.map((elem: any) => new Product(elem));
      })
    );
  }

  getVegetables(): Observable<Product> {
    return this.http.get("https://dejanpopovic-fccfa-default-rtdb.europe-west1.firebasedatabase.app/vegetables.json").pipe(
      map((data: any) => {
        return data.map((elem: any) => new Product(elem));
      })
    );
  }

  getFruits(): Observable<Product> {
    return this.http.get("https://dejanpopovic-fccfa-default-rtdb.europe-west1.firebasedatabase.app/fruits.json").pipe(
      map((data: any) => {
        return data.map((elem: any) => new Product(elem));
      })
    );
  }

  getOther(): Observable<Product> {
    return this.http.get("https://dejanpopovic-fccfa-default-rtdb.europe-west1.firebasedatabase.app/other.json").pipe(
      map((data: any) => {
        return data.map((elem: any) => new Product(elem));
      })
    );
  }

  get isLoggedIn(): boolean {
    let user = JSON.parse(localStorage.getItem('userObject')!);
    if (user == null) {
      return false;
    } else {
      return true;
    }
  }

  private loadedUser = new BehaviorSubject<boolean>(false);
  data$ = this.loadedUser.asObservable();

  private cartIcon = new BehaviorSubject<boolean>(true);
  datac$ = this.cartIcon.asObservable();

  private seeProducts = new BehaviorSubject<boolean>(Boolean(localStorage.getItem("seeProducts")));
  datab$ = this.seeProducts.asObservable();

  private addCart = new BehaviorSubject<boolean>(false);
  datas$ = this.addCart.asObservable();

  updateLoadedUser(loadedUser: boolean): void {
    this.loadedUser.next(loadedUser);
  }

  updateSeeProducts(seeProducts: boolean): void {
    this.seeProducts.next(seeProducts);
  }

  updateAddCart(addCart: boolean): void {
    this.addCart.next(addCart);
  }

  updateCartIcon(cartIcon: boolean): void {
    this.cartIcon.next(cartIcon);
  }
}
