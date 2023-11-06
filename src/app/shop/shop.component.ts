import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Product } from '../model/products';
import { MarketsService } from '../service/markets.service';
import { BuyProduct, User } from '../model/users';
import { getAuth } from "firebase/auth";
import { get, getDatabase, ref, set } from 'firebase/database';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  user: User = new User;
  vegetables: boolean = false;
  fruits: boolean = true;
  other: boolean = false;
  products: Product[] = [];
  vegetablesProducts: Product[] = [];
  fruitsProducts: Product[] = [];
  otherProducts: Product[] = [];

  constructor(private el: ElementRef, private service: MarketsService, private renderer: Renderer2) {
  }

  ngOnInit(): void {
    let veg = history.state.vegetables;
    let fru = history.state.fruits;
    let oth = history.state.other;
    let user = history.state.user;
    this.getValues(veg, fru, oth, user);

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
          } else {
            console.log('No data available for this user.');
          }
        }).catch((error) => {
          console.error(error);
        });

      }
    }

    let vegBool = (localStorage.getItem("veg")?.toLowerCase() === 'true');
    let fruBool = (localStorage.getItem("fru")?.toLowerCase() === 'true');
    let othBool = (localStorage.getItem("oth")?.toLowerCase() === 'true');

    this.vegetables = vegBool;
    this.fruits = fruBool;
    this.other = othBool;

    if (this.vegetables == true) {
      let mybtnradio1 = this.el.nativeElement.querySelector('#mybtnradio1');
      mybtnradio1.checked = true;
    } else if (this.fruits == true) {
      let mybtnradio2 = this.el.nativeElement.querySelector('#mybtnradio2');
      mybtnradio2.checked = true;
    } else if (this.other == true) {
      let mybtnradio3 = this.el.nativeElement.querySelector('#mybtnradio3');
      mybtnradio3.checked = true;
    }

    this.getProducts();
    this.getVegetables();
    this.getFruits();
    this.getOther();

    let width: MediaQueryList = window.matchMedia('(max-width: 395px)');
    let inputMessages = this.el.nativeElement.querySelectorAll('.input-message');

    width.addEventListener('change', (event) => {
      if (width.matches) {
        inputMessages.forEach((input: any) => {
          this.renderer.setStyle(input, 'height', '43px');
        });
      } else {
        inputMessages.forEach((input: any) => {
          this.renderer.setStyle(input, 'height', '24px');
        });
      }
    });

    if (width.matches) {
      inputMessages.forEach((input: any) => {
        this.renderer.setStyle(input, 'height', '43px');
      });
    } else {
      inputMessages.forEach((input: any) => {
        this.renderer.setStyle(input, 'height', '24px');
      });
    }
  }

  setInputMessages() {
    let width: MediaQueryList = window.matchMedia('(max-width: 395px)');
    let inputMessages = this.el.nativeElement.querySelectorAll('.input-message');

    width.addEventListener('change', (event) => {
      if (width.matches) {
        inputMessages.forEach((input: any) => {
          this.renderer.setStyle(input, 'height', '45px');
        });
      } else {
        inputMessages.forEach((input: any) => {
          this.renderer.setStyle(input, 'height', '24px');
        });
      }
    });

    if (width.matches) {
      inputMessages.forEach((input: any) => {
        this.renderer.setStyle(input, 'height', '45px');
      });
    } else {
      inputMessages.forEach((input: any) => {
        this.renderer.setStyle(input, 'height', '24px');
      });
    }
  }
  getValues(veg: string, fru: string, oth: string, user: User) {
    if (localStorage.getItem(veg) !== null || veg === undefined) {
      return;
    } else {
      localStorage.setItem("veg", veg);
    }

    if (localStorage.getItem(fru) !== null || fru === undefined) {
      return;
    } else {
      localStorage.setItem("fru", fru);
    }

    if (localStorage.getItem(oth) !== null || oth === undefined) {
      return;
    } else {
      localStorage.setItem("oth", oth);
    }

    if (localStorage.getItem(JSON.stringify(user)) !== null || JSON.stringify(user) === undefined) {
      return;
    } else {
      localStorage.setItem("userObject", JSON.stringify(user));
    }
  }

  vegetablesShow() {
    this.vegetables = true;
    this.fruits = false;
    this.other = false;
    this.getVegetables();
  }

  fruitsShow() {
    this.vegetables = false;
    this.fruits = true;
    this.other = false;
    this.getFruits();
  }

  otherShow() {
    this.vegetables = false;
    this.fruits = false;
    this.other = true;
    this.getOther();
  }

  getProducts() {
    this.service.getProducts().subscribe({
      next: (data: any) => {
        this.products = data;
      },
      error: () => {
        console.log('Error');
      },
    });
  }

  getVegetables() {
    this.service.getVegetables().subscribe({
      next: (data: any) => {
        this.vegetablesProducts = data;
        let vegetablesCard = this.el.nativeElement.querySelector('.vegetables-card');
        if (vegetablesCard) {
          for (let i = 0; i < this.vegetablesProducts.length; i++) {
            this.renderer.appendChild(vegetablesCard, this.createElementCard(this.vegetablesProducts[i]));
          }
          this.setInputMessages();
        }
      },
      error: () => {
        console.log('Error');
      },
    });
  }

  getFruits() {
    this.service.getFruits().subscribe({
      next: (data: any) => {
        this.fruitsProducts = data;
        let fruitsCard = this.el.nativeElement.querySelector('.fruits-card');
        if (fruitsCard) {
          for (let i = 0; i < this.fruitsProducts.length; i++) {
            this.renderer.appendChild(fruitsCard, this.createElementCard(this.fruitsProducts[i]));
          }
          this.setInputMessages();
        }
      },
      error: () => {
        console.log('Error');
      },
    });
  }

  getOther() {
    this.service.getOther().subscribe({
      next: (data: any) => {
        this.otherProducts = data;
        let otherCard = this.el.nativeElement.querySelector('.other-card');
        if (otherCard) {
          for (let i = 0; i < this.otherProducts.length; i++) {
            this.renderer.appendChild(otherCard, this.createElementCard(this.otherProducts[i]));
          }
          this.setInputMessages();
        }
      },
      error: () => {
        console.log('Error');
      },
    });
  }

  addProduct(id: string, buyProducts: BuyProduct[]) {
    let auth = getAuth();
    if (id === auth.currentUser?.uid) {
      let database = getDatabase();
      let userRef1 = ref(database, `users/${id}`);
      get(userRef1).then((snapshot) => {
        if (snapshot.exists()) {
          let existingData = snapshot.val();

          let userRef = ref(database, 'users/' + id);

          let updatedData = {
            ...existingData,
            buyProducts: buyProducts
          };

          set(userRef, updatedData)
            .then(() => {
              this.service.updateAddCart(true);
            })
            .catch((error) => {
              console.error('Error updating user data:', error);
            });

        }
      }).catch((error) => {
        console.log(error);
      });

    } else {
      console.log("neee")
    }
  }

  createElementCard(product: Product) {

    // Creating mycard div
    let mycard = this.renderer.createElement("div");
    this.renderer.addClass(mycard, "card");
    this.renderer.addClass(mycard, "my-card");
    this.renderer.addClass(mycard, "g-col-6");
    this.renderer.addClass(mycard, "g-col-sm-4");
    this.renderer.addClass(mycard, "g-col-md-4");
    this.renderer.addClass(mycard, "g-col-lg-3");
    this.renderer.setAttribute(mycard, "id", product.name)

    // Creating card img
    let cardImgTop = this.renderer.createElement("img");
    this.renderer.addClass(cardImgTop, "card-img-top");
    this.renderer.setAttribute(cardImgTop, "src", product.imgUrl);
    this.renderer.setAttribute(cardImgTop, "alt", product.name);

    // Creating card body div
    let cardBody = this.renderer.createElement("div");
    this.renderer.addClass(cardBody, "card-body");

    // Creating card body h5
    let cardTitle = this.renderer.createElement("h5");
    this.renderer.addClass(cardTitle, "card-title");
    let cardTitleTextNode = this.renderer.createText(product.name);
    this.renderer.appendChild(cardTitle, cardTitleTextNode);

    // Creating select title span
    let selectTitle = this.renderer.createElement("span");
    this.renderer.addClass(selectTitle, "select-title");
    let selectTitleTextNode = this.renderer.createText("Select Market");
    this.renderer.appendChild(selectTitle, selectTitleTextNode);

    // Creating card select
    let cardSelect = this.renderer.createElement("select");
    this.renderer.addClass(cardSelect, "form-select");
    this.renderer.setAttribute(cardSelect, "aria-label", "Default select example");

    // Creating select options determining selected option and appending options to card select
    let selectedOption;
    for (let i = 0; i < product.markets.length; i++) {
      let option = this.renderer.createElement('option');
      this.renderer.setProperty(option, "value", product.markets[i].price);
      let optionTextNode = this.renderer.createText(product.markets[i].name);
      this.renderer.appendChild(option, optionTextNode);
      this.renderer.appendChild(cardSelect, option);
    }

    for (let i = 0; i < cardSelect.length; i++) {
      if (cardSelect[i].value != 0) {
        cardSelect[i].selected = "true";
        selectedOption = cardSelect[i];
        break;
      }
    }

    //** Changing price based on selected market **/
    let optionValue: number = selectedOption.value;
    this.renderer.listen(cardSelect, 'change', (event) => {
      let currentValue = event.target.value;
      optionValue = currentValue;
      this.renderer.setProperty(price, 'innerText', currentValue);
    });

    // Creating card text paragraph
    let cardText = this.renderer.createElement("p");
    this.renderer.addClass(cardText, "card-text");

    // Creating price span
    let price = this.renderer.createElement("span");
    this.renderer.addClass(price, "price");
    let priceTextNode = this.renderer.createText(selectedOption.value);
    this.renderer.appendChild(price, priceTextNode);

    // Creating unit span
    let unit = this.renderer.createElement("span");
    this.renderer.addClass(unit, "unit");
    let unitTextNode = this.renderer.createText(product.unit);
    this.renderer.appendChild(unit, unitTextNode);

    // Creating input message
    let inputMessage = this.renderer.createElement("p");
    this.renderer.addClass(inputMessage, "input-message");

    // Appending price, unit and input-message spans to card text paragraph
    this.renderer.appendChild(cardText, price);
    this.renderer.appendChild(cardText, unit);
    this.renderer.appendChild(cardText, inputMessage);

    // Creating amount wrapper div
    let amountWrapper = this.renderer.createElement("div");
    this.renderer.addClass(amountWrapper, "amount-wrapper");

    // Creating amount input
    let amountInput = this.renderer.createElement("input");
    this.renderer.addClass(amountInput, "amount-input");
    this.renderer.setAttribute(amountInput, "type", "number");

    if (product.unitInput != "kg") {
      this.renderer.setProperty(amountInput, "value", "1");
      this.renderer.setAttribute(amountInput, "min", "1");
      this.renderer.setAttribute(amountInput, "step", "1");
    } else {
      this.renderer.setProperty(amountInput, "value", "0.01");
      this.renderer.setAttribute(amountInput, "min", "0.01");
      this.renderer.setAttribute(amountInput, "step", "0.01");
    }

    // Creating amount button
    let amountButton = this.renderer.createElement("button");
    this.renderer.addClass(amountButton, "btn");
    this.renderer.addClass(amountButton, "btn-success");
    this.renderer.addClass(amountButton, "amount-button");

    // Adding clicked product to cart
    this.renderer.listen(amountButton, 'click', (event) => {
      let buyProduct: BuyProduct = new BuyProduct;
      buyProduct.amount = amountInput.value;
      buyProduct.price = price.innerText;
      buyProduct.option = optionValue;
      buyProduct.imgUrl = product.imgUrl;
      buyProduct.name = product.name;
      buyProduct.unit = product.unit;
      buyProduct.unitInput = product.unitInput;
      buyProduct.markets = product.markets;

      let db = getDatabase();
      let userRef = ref(db, 'users/' + this.user.id);

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.user = snapshot.val();
          let regex = /^\d+\.\d+$/;
          let addedProducts: string[] = [];
          let buyProducts: BuyProduct[] = this.user.buyProducts;
          if (buyProducts) {
            for (let i = 0; i < buyProducts.length; i++) {
              addedProducts.push(buyProducts[i].name)
            }
          } else {
            buyProducts = [];
          }

          if (buyProducts.length != 0) {
            if (addedProducts.includes(buyProduct.name) == false) {
              if (buyProduct.amount > 0) {
                if (buyProduct.amount >= amountInput.min) {
                  if (product.unitInput === "kg") {
                    addedProducts.push(buyProduct.name);
                    buyProducts.unshift(buyProduct);

                    this.addProduct(this.user.id, buyProducts);

                    this.renderer.setProperty(inputMessage, 'innerText', '');
                  } else if (product.unitInput != "kg") {
                    if (regex.test(buyProduct.amount.toString()) == true) {
                      this.renderer.setProperty(inputMessage, 'innerText', 'Incorect ampunt!');
                      setTimeout(() => { this.renderer.setProperty(inputMessage, 'innerText', 'Incorect ampunt!'); }, 2000);
                    } else if (regex.test(buyProduct.amount.toString()) == false) {
                      addedProducts.push(buyProduct.name);
                      buyProducts.unshift(buyProduct);

                      this.addProduct(this.user.id, buyProducts);

                      this.renderer.setProperty(inputMessage, 'innerText', '');
                    }
                  }
                } else if (buyProduct.amount < amountInput.min) {
                  this.renderer.setProperty(inputMessage, 'innerText', 'Incorect ampunt!');
                  setTimeout(() => { this.renderer.setProperty(inputMessage, 'innerText', 'Incorect ampunt!'); }, 2000);
                }
              } else {
                this.renderer.setProperty(inputMessage, 'innerText', 'Add quantity!');
                setTimeout(() => { this.renderer.setProperty(inputMessage, 'innerText', 'Add quantity!'); }, 2000);
              }
            } else {
              if (buyProduct.amount <= 0) {
                this.renderer.setProperty(inputMessage, 'innerText', 'Product is already added!');
                setTimeout(() => { this.renderer.setProperty(inputMessage, 'innerText', 'Product is already added!'); }, 2000);
              } else {
                this.renderer.setProperty(inputMessage, 'innerText', 'Product is already added!');
                setTimeout(() => { this.renderer.setProperty(inputMessage, 'innerText', ''); }, 2000);
              }
            }
          } else if (buyProducts.length === 0) {
            if (buyProduct.amount > 0) {
              if (buyProduct.amount >= amountInput.min) {
                if (product.unitInput === "kg") {
                  addedProducts.push(buyProduct.name);
                  buyProducts.push(buyProduct);

                  this.addProduct(this.user.id, buyProducts);

                  this.renderer.setProperty(inputMessage, 'innerText', '');
                } else if (product.unitInput != "kg") {
                  if (regex.test(buyProduct.amount.toString()) == true) {
                    this.renderer.setProperty(inputMessage, 'innerText', 'Incorect ampunt!');
                    setTimeout(() => { this.renderer.setProperty(inputMessage, 'innerText', 'Incorect ampunt!'); }, 2000);
                  } else if (regex.test(buyProduct.amount.toString()) == false) {
                    addedProducts.push(buyProduct.name);
                    buyProducts.unshift(buyProduct);

                    this.addProduct(this.user.id, buyProducts);

                    this.renderer.setProperty(inputMessage, 'innerText', '');
                  }
                }
              } else if (buyProduct.amount < amountInput.min) {
                this.renderer.setProperty(inputMessage, 'innerText', 'Incorect ampunt!');
                setTimeout(() => { this.renderer.setProperty(inputMessage, 'innerText', ''); }, 2000);
              }
            } else {
              this.renderer.setProperty(inputMessage, 'innerText', 'Add quantity!');
              setTimeout(() => { this.renderer.setProperty(inputMessage, 'innerText', ''); }, 2000);
            }
          }

        }
      }).catch((error) => {
        console.error(error);
      })
    });

    // Creating amount button text node
    let amountButtonTextNode = this.renderer.createText("ADD");

    // Creating amount cart icon
    let amountCart = this.renderer.createElement("i");
    this.renderer.addClass(amountCart, "bi");
    this.renderer.addClass(amountCart, "bi-cart4");
    this.renderer.addClass(amountCart, "m-1");

    // Appending amount cart icon and amount button text node to amount button
    this.renderer.appendChild(amountButton, amountCart);
    this.renderer.appendChild(amountButton, amountButtonTextNode);

    // Appending amount input and amount button to amount wrapper
    this.renderer.appendChild(amountWrapper, amountInput);
    this.renderer.appendChild(amountWrapper, amountButton);

    // Appending card title, select title, card select, card text and amount wrapper to card body
    this.renderer.appendChild(cardBody, cardTitle);
    this.renderer.appendChild(cardBody, selectTitle);
    this.renderer.appendChild(cardBody, cardSelect);
    this.renderer.appendChild(cardBody, cardText);
    this.renderer.appendChild(cardBody, amountWrapper);

    // Appending card img and card body to my card
    this.renderer.appendChild(mycard, cardImgTop);
    this.renderer.appendChild(mycard, cardBody);

    return mycard;
  }
}


