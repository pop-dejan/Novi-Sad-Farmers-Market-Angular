import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { MarketsService } from '../service/markets.service';
import { NavigationStart, Router } from '@angular/router';
import { BuyProduct, User } from '../model/users';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, OrderProduct } from '../model/users';
import { get, getDatabase, ref, set } from 'firebase/database';

@Component({
  selector: 'app-final-purchase',
  templateUrl: './final-purchase.component.html',
  styleUrls: ['./final-purchase.component.scss']
})
export class FinalPurchaseComponent implements OnInit {

  orders: Order[] = [];
  user: User = new User;
  id: string = String(localStorage.getItem("id"));
  myForm: FormGroup;

  constructor(private service: MarketsService, private router: Router, private renderer: Renderer2, private el: ElementRef, private formBuilder: FormBuilder) {

    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.service.updateCartIcon(true);
      }
    });

    this.myForm = this.formBuilder.group({
      finalName: ['', [Validators.required]],
      finalAddress: ['', [Validators.required]],
      finalTelephone: ['', [Validators.required]],
      finalNote: [''],
    });
  }

  ngOnInit(): void {
    this.service.updateCartIcon(false);
    this.getUsers();
  }

  backToProducts() {
    this.service.updateCartIcon(true);
    this.router.navigate(['/shop'])
      .then(() => {
        location.replace(location.pathname);
      });
  }

  getUsers() {
    let userString = localStorage.getItem("userObject");
    if (userString) {
      let userObject = JSON.parse(userString);
      if (userObject) {
        this.user = userObject;

        let db = getDatabase();
        let userRef = ref(db, 'users/' + this.user.id);

        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            this.user = snapshot.val();

            let itemsWrapper = this.el.nativeElement.querySelector('.items-wrapper');
            let totalText: number = 0;
            let shipText: number = 0;
            let total = this.el.nativeElement.querySelector('.p-total');
            let shipTotal = this.el.nativeElement.querySelector('.ship-total');
            let taxTotal = this.el.nativeElement.querySelector('.tax-total');
            let totalPrice = this.el.nativeElement.querySelector('.total-items');

            if (this.user) {
              if (this.user.buyProducts) {
                for (let i = 0; i < this.user.buyProducts.length; i++) {
                  totalText += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
                  let card = this.createFinalCard(this.user.buyProducts[i]);
                  this.renderer.appendChild(itemsWrapper, card);
                }
              } else {
                this.user.buyProducts = [];
              }

              this.renderer.setProperty(total, 'innerText', totalText.toFixed(1));

              if (totalText === 0) {
                shipText = 0;
                this.renderer.setProperty(shipTotal, 'innerText', shipText.toFixed(1));
              } else if (totalText > 0 && totalText < 2000) {
                shipText = 500;
                this.renderer.setProperty(shipTotal, 'innerText', shipText.toFixed(1));
              } else if (totalText >= 2000) {
                shipText = 0;
                this.renderer.setProperty(shipTotal, 'innerText', shipText.toFixed(1));
              }

              this.renderer.setProperty(taxTotal, 'innerText', (totalText * 0.2).toFixed(1));
              this.renderer.setProperty(totalPrice, 'innerText', (shipText + totalText).toFixed(1));
            }
          }
        }).catch((error) => {
          console.error(error);
        });
      }
    }
  }

  onSubmit(event: any) {
    event?.preventDefault;

    let retVal: boolean = true;
    let itemsWrapper: HTMLDivElement = this.el.nativeElement.querySelector('.items-wrapper');

    if (this.myForm.controls['finalName'].value === "") {
      document.querySelector('.name-error')?.classList.add('block');
      document.querySelector('.name-error')?.classList.remove('none');
      document.querySelector('#finalName')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalName'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalName'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['finalName'].value != "") {
      document.querySelector('.name-error')?.classList.add('none');
      document.querySelector('.name-error')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalName'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalName'), 'background-color', '#dcd4cb');
    }

    if (this.myForm.controls['finalAddress'].value === "") {
      document.querySelector('.address-error')?.classList.add('block');
      document.querySelector('.address-error')?.classList.remove('none');
      document.querySelector('#finalAddress')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalAddress'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalAddress'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['finalAddress'].value != "") {
      document.querySelector('.address-error')?.classList.add('none');
      document.querySelector('.address-error')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalAddress'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalAddress'), 'background-color', '#dcd4cb');
    }

    if (this.myForm.controls['finalTelephone'].value.trim() === "") {
      document.querySelector('.telephone-error')?.classList.add('block');
      document.querySelector('.telephone-error')?.classList.remove('none');
      document.querySelector('.telephone-error2')?.classList.add('none');
      document.querySelector('.telephone-error2')?.classList.remove('block');
      document.querySelector('#finalTelephone')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (isNaN(this.myForm.controls['finalTelephone'].value.trim())) {
      document.querySelector('.telephone-error2')?.classList.add('block');
      document.querySelector('.telephone-error2')?.classList.remove('none');
      document.querySelector('.telephone-error')?.classList.add('none');
      document.querySelector('.telephone-error')?.classList.remove('block');
      document.querySelector('#finalTelephone')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['finalTelephone'].value.trim() != "") {
      document.querySelector('.telephone-error')?.classList.add('none');
      document.querySelector('.telephone-error')?.classList.remove('block');
      document.querySelector('.telephone-error2')?.classList.add('none');
      document.querySelector('.telephone-error2')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'background-color', '#dcd4cb');
    }

    if (itemsWrapper.children.length === 0) {
      document.querySelector('.blank-cart-error')?.classList.add('block');
      document.querySelector('.blank-cart-error')?.classList.remove('none');
      retVal = false;
    } else if (itemsWrapper.children.length > 0) {
      document.querySelector('.blank-cart-error')?.classList.add('none');
      document.querySelector('.blank-cart-error')?.classList.remove('block');
    }

    if (retVal == true) {
      let db = getDatabase();
      let userRef = ref(db, 'users/' + this.user.id);

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.user = snapshot.val();
          if (this.user) {
            let order = new Order;
            order.email = this.user.email;
            order.deliveryAddress = this.myForm.value.finalAddress;
            order.nameAndSurname = this.myForm.value.finalName;
            order.note = this.myForm.value.finalNote;
            order.telephone = this.myForm.value.finalTelephone;
            for (let i = 0; i < this.user.buyProducts.length; i++) {
              let product = new OrderProduct;
              product.name = this.user.buyProducts[i].name;
              product.price = Number(this.user.buyProducts[i].price);
              product.amount = Number(this.user.buyProducts[i].amount);
              product.totalPrice = product.price * product.amount;
              order.orderProducts.push(product);
            }
            let totalPrice: HTMLDivElement = this.el.nativeElement.querySelector('.total-items');
            order.finalPrice = Number(totalPrice.innerText);

            if (this.user.orders) {
              this.user.orders.push(order);
            } else {
              this.user.orders = [];
              this.user.orders.push(order);
            }

            let userRefs = ref(db, 'users/' + this.user.id);
            let updatedData = {
              ...this.user
            };

            set(userRefs, updatedData)
              .then(() => {
                this.user.buyProducts = [];

                let updatedData = {
                  ...this.user
                };

                set(userRef, updatedData)
                  .then(() => {
                    this.router.navigate(['/complete-buy'])
                      .then(() => {
                        location.replace(location.pathname);
                      });
                  })
                  .catch((error) => {
                    console.error('Error updating user data:', error);
                  });

              })
              .catch((error) => {
                console.error('Error updating user data:', error);
              });
          }
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }

  toggleInputName() {
    if (this.myForm.controls['finalName'].value === "") {
      document.querySelector('.name-error')?.classList.add('block');
      document.querySelector('.name-error')?.classList.remove('none');
      document.querySelector('#finalName')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalName'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalName'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['finalName'].value != "") {
      document.querySelector('.name-error')?.classList.add('none');
      document.querySelector('.name-error')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalName'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalName'), 'background-color', '#dcd4cb');
    }
  }

  toggleInputAddress() {
    if (this.myForm.controls['finalAddress'].value === "") {
      document.querySelector('.address-error')?.classList.add('block');
      document.querySelector('.address-error')?.classList.remove('none');
      document.querySelector('#finalAddress')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalAddress'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalAddress'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['finalAddress'].value != "") {
      document.querySelector('.address-error')?.classList.add('none');
      document.querySelector('.address-error')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalAddress'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalAddress'), 'background-color', '#dcd4cb');
    }
  }

  toggleInputTelephone() {
    if (this.myForm.controls['finalTelephone'].value.trim() === "") {
      document.querySelector('.telephone-error')?.classList.add('block');
      document.querySelector('.telephone-error')?.classList.remove('none');
      document.querySelector('.telephone-error2')?.classList.add('none');
      document.querySelector('.telephone-error2')?.classList.remove('block');
      document.querySelector('#finalTelephone')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'background-color', 'rgb(232, 191, 191)');
    } else if (isNaN(this.myForm.controls['finalTelephone'].value.trim())) {
      document.querySelector('.telephone-error2')?.classList.add('block');
      document.querySelector('.telephone-error2')?.classList.remove('none');
      document.querySelector('.telephone-error')?.classList.add('none');
      document.querySelector('.telephone-error')?.classList.remove('block');
      document.querySelector('#finalTelephone')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['finalTelephone'].value.trim() != "") {
      document.querySelector('.telephone-error')?.classList.add('none');
      document.querySelector('.telephone-error')?.classList.remove('block');
      document.querySelector('.telephone-error2')?.classList.add('none');
      document.querySelector('.telephone-error2')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#finalTelephone'), 'background-color', '#dcd4cb');
    }
  }


  //** Creating final purchase card function **//
  createFinalCard(product: BuyProduct) {

    // Creating item div
    let item = this.renderer.createElement("div");
    this.renderer.addClass(item, "item");
    this.renderer.setAttribute(item, "id", product.name)

    // Creating final image
    let finalImg = this.renderer.createElement("img");
    this.renderer.addClass(finalImg, "w-img");
    this.renderer.setAttribute(finalImg, "src", product.imgUrl);
    this.renderer.setAttribute(finalImg, "alt", product.name);

    // Creating first span
    let firstSpan = this.renderer.createElement("span");
    this.renderer.addClass(firstSpan, "first");

    // Creating first txt
    let firstTxt = this.renderer.createElement("span");
    this.renderer.addClass(firstTxt, "first-txt");
    this.renderer.setProperty(firstTxt, 'innerText', product.name);

    // Appending first txt to first span
    this.renderer.appendChild(firstSpan, firstTxt);

    // Creating second span
    let secondSpan = this.renderer.createElement("span");
    this.renderer.addClass(secondSpan, "second");

    // Creating final price
    let finalPrice = this.renderer.createElement("span");
    this.renderer.addClass(finalPrice, "final-price");
    this.renderer.setProperty(finalPrice, 'innerText', (product.amount * product.price).toFixed(1));


    // Creating final unit
    let finalUnit = this.renderer.createElement("span");
    this.renderer.addClass(finalUnit, "final-unit");
    this.renderer.setProperty(finalUnit, 'innerText', " din");

    // Creating final delete
    let finalDelete = this.renderer.createElement("span");
    this.renderer.addClass(finalDelete, "final-delete");

    // Appending final price, final unit and final delete to second span
    this.renderer.appendChild(secondSpan, finalPrice);
    this.renderer.appendChild(secondSpan, finalUnit);
    this.renderer.appendChild(secondSpan, finalDelete);

    // Creating delete icon
    let deleteIcon = this.renderer.createElement("i");
    this.renderer.addClass(deleteIcon, "bi");
    this.renderer.addClass(deleteIcon, "bi-trash3");
    this.renderer.addClass(deleteIcon, "final-del");

    // Removing card when delete button is clicked
    this.renderer.listen(deleteIcon, 'click', (event) => {
      let db = getDatabase();
      let userRef = ref(db, 'users/' + this.user.id);

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.user = snapshot.val();
          if (this.user) {
            let newBuyProducts: BuyProduct[] = this.user.buyProducts.filter(buyProduct => buyProduct.name !== product.name);
            this.user.buyProducts = newBuyProducts;
            let updatedData = {
              ...this.user
            };

            set(userRef, updatedData)
              .then(() => {
                let db = getDatabase();
                let userRef = ref(db, 'users/' + this.user.id);

                get(userRef).then((snapshot) => {
                  if (snapshot.exists()) {
                    this.user = snapshot.val();
                    let itemsWrapper = this.el.nativeElement.querySelector('.items-wrapper');
                    let totalText: number = 0;
                    let shipText: number = 0;
                    let total = this.el.nativeElement.querySelector('.p-total');
                    let shipTotal = this.el.nativeElement.querySelector('.ship-total');
                    let taxTotal = this.el.nativeElement.querySelector('.tax-total');
                    let totalPrice = this.el.nativeElement.querySelector('.total-items');

                    if (this.user) {
                      this.renderer.setProperty(itemsWrapper, "innerHTML", "");
                      if (this.user.buyProducts) {
                        for (let i = 0; i < this.user.buyProducts.length; i++) {
                          totalText += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
                          let card = this.createFinalCard(this.user.buyProducts[i]);
                          this.renderer.appendChild(itemsWrapper, card);
                        }
                      } else {
                        this.user.buyProducts = [];
                      }

                      this.renderer.setProperty(total, 'innerText', totalText.toFixed(1));

                      if (totalText === 0) {
                        shipText = 0;
                        this.renderer.setProperty(shipTotal, 'innerText', shipText.toFixed(1));
                      } else if (totalText > 0 && totalText < 2000) {
                        shipText = 500;
                        this.renderer.setProperty(shipTotal, 'innerText', shipText.toFixed(1));
                      } else if (totalText >= 2000) {
                        shipText = 0;
                        this.renderer.setProperty(shipTotal, 'innerText', shipText.toFixed(1));
                      }

                      this.renderer.setProperty(taxTotal, 'innerText', (totalText * 0.2).toFixed(1));
                      this.renderer.setProperty(totalPrice, 'innerText', (shipText + totalText).toFixed(1));
                    }
                  }
                }).catch((error) => {
                  console.error(error);
                });

              })
              .catch((error) => {
                console.error('Error updating user data:', error);
              });
          }
        }
      }).catch((error) => {
        console.error(error);
      });
    });

    // Appending delete icon to final delete
    this.renderer.appendChild(finalDelete, deleteIcon);

    // Appending final img, first span and second span to item
    this.renderer.appendChild(item, finalImg);
    this.renderer.appendChild(item, firstSpan);
    this.renderer.appendChild(item, secondSpan);

    return item;
  }
}
