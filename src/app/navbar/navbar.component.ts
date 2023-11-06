import { Component, OnInit, Renderer2, ElementRef, HostListener } from '@angular/core';
import { MarketsService } from '../service/markets.service';
import { MarketsUnit } from '../model/markets';
import { BuyProduct, User } from '../model/users';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { get, getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: User = new User;
  id: string = String(localStorage.getItem("id"));
  buyProducts: BuyProduct[] = [];
  markets: MarketsUnit[] = [];
  addCart: boolean = false;
  cartIcon: boolean = true;
  seeProducts: boolean = Boolean(localStorage.getItem("seeProducts"));

  @HostListener('window:scroll', [])
  onScroll(): void {
    let myBar = this.el.nativeElement.querySelector('#myBar');
    let winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    let height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let scrolled = (winScroll / height) * 100;
    this.renderer.setStyle(myBar, "width", scrolled + "%");
  }

  observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        let width: MediaQueryList = window.matchMedia('(max-width: 992px)');
        let element = entry.target;
        let credentials = this.el.nativeElement.querySelector('.credentials');
        let heads = this.el.nativeElement.querySelectorAll('.head');
        if (width.matches) {
          element?.classList.remove('dropstart');
          element?.classList.add('dropdown');
          this.renderer.setStyle(credentials, "borderBottom", "3px solid white");
          heads.forEach((head: any) => { this.renderer.setStyle(head, "marginRight", "5px") });
        } else {
          element?.classList.add('dropstart');
          element?.classList.remove('dropdown');
        }
      }
    });
  }, { threshold: 0.5 });

  constructor(private service: MarketsService, private renderer: Renderer2, private el: ElementRef, private router: Router) {
  }

  ngOnInit(): void {
    this.getMarketsInfo();
    this.getUser();

    let userDropdown = this.el.nativeElement.querySelector('#user-dropdown');
    if (this.seeProducts == true) {
      this.renderer.setStyle(userDropdown, "display", "block");
    } else {
      this.renderer.setStyle(userDropdown, "display", "none");
    }
    this.observer.observe(userDropdown);

    this.service.datac$.subscribe(updatedData => {
      this.cartIcon = updatedData;
      let cartButton = this.el.nativeElement.querySelector('#cart-button');
      if (this.cartIcon == true) {
        this.getUser();
        this.renderer.setStyle(cartButton, "display", "block");
      } else {
        this.renderer.setStyle(cartButton, "display", "none");
      }
    });

    this.service.datas$.subscribe(updatedData => {
      this.addCart = updatedData;
      if (this.addCart == true) {
        let db = getDatabase();
        let userRef = ref(db, 'users/' + this.user.id);

        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            this.user = snapshot.val();
            let myCart = this.el.nativeElement.querySelector('#my-offcanvas-cart');
            let counter = this.el.nativeElement.querySelector('.counter');
            let badge = this.el.nativeElement.querySelector('.badge');
            let total = this.el.nativeElement.querySelector('#total');

            if (this.user) {
              this.renderer.setProperty(myCart, "innerHTML", "");
              if (this.user.buyProducts) {
                for (let i = 0; i < this.user.buyProducts.length; i++) {
                  let card = this.createOffcanvasCard(this.user.buyProducts[i]);
                  this.renderer.appendChild(myCart, card);

                  if (i === 0) {
                    this.renderer.setStyle(card, "border", "3px solid rgb(248, 47, 47)");
                    setTimeout(() => { this.renderer.setStyle(card, "border", "2px solid white"); }, 1000);
                  }
                }
              } else {
                this.user.buyProducts = [];
              }

              if (this.user.buyProducts.length != 0) {
                this.openOffcanvas();
              }

              this.renderer.setProperty(counter, "innerText", this.user.buyProducts.length);
              if (this.user.buyProducts.length === 0) {
                badge?.classList.add('none');
                badge?.classList.remove('block');
              } else {
                this.renderer.setProperty(badge, "innerText", this.user.buyProducts.length);
                badge?.classList.add('block');
                badge?.classList.remove('none');
              }
              let totalPrice: number = 0;
              for (let i = 0; i < this.user.buyProducts.length; i++) {
                totalPrice += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
              }
              this.renderer.setProperty(total, "innerText", totalPrice.toFixed(1));

            }
          }
        }).catch((error) => {
          console.error(error);
        });

      }
    });

    let width: MediaQueryList = window.matchMedia('(max-width: 992px)');
    let closeInnerOffcanvasButton = this.el.nativeElement.querySelector('#innerOffcanvasBtn');
    let cartLabel = this.el.nativeElement.querySelector('.cart-label');
    let links = this.el.nativeElement.querySelectorAll('.link');
    width.addEventListener('change', (event) => {
      if (width.matches) {
        links.forEach((link: { classList: { remove: (arg0: string) => void; }; }) => { link.classList.remove('mx-3') });
        this.renderer.setStyle(cartLabel, 'display', 'block');
        closeInnerOffcanvasButton?.removeAttribute("data-bs-dismiss");
        closeInnerOffcanvasButton?.setAttribute("data-bs-toggle", "offcanvas");
        closeInnerOffcanvasButton?.setAttribute("data-bs-target", "#offcanvasDarkNavbar");
        closeInnerOffcanvasButton?.setAttribute("aria-controls", "offcanvasDarkNavbar");
      } else {
        links.forEach((link: { classList: { add: (arg0: string) => void; }; }) => { link.classList.add('mx-3') });
        this.renderer.setStyle(cartLabel, 'display', 'none');
        closeInnerOffcanvasButton?.setAttribute("data-bs-dismiss", "offcanvas");
        closeInnerOffcanvasButton?.removeAttribute("data-bs-toggle");
        closeInnerOffcanvasButton?.removeAttribute("data-bs-target");
        closeInnerOffcanvasButton?.removeAttribute("aria-controls");
      }
    });

    if (width.matches) {
      links.forEach((link: { classList: { remove: (arg0: string) => void; }; }) => { link.classList.remove('mx-3') });
      if (cartLabel) {
        this.renderer.setStyle(cartLabel, 'display', 'block');
      }
      closeInnerOffcanvasButton?.removeAttribute("data-bs-dismiss");
      closeInnerOffcanvasButton?.setAttribute("data-bs-toggle", "offcanvas");
      closeInnerOffcanvasButton?.setAttribute("data-bs-target", "#offcanvasDarkNavbar");
      closeInnerOffcanvasButton?.setAttribute("aria-controls", "offcanvasDarkNavbar");
    } else {
      links.forEach((link: { classList: { add: (arg0: string) => void; }; }) => { link.classList.add('mx-3') });
      if (cartLabel) {
        this.renderer.setStyle(cartLabel, 'display', 'none');
      }
      closeInnerOffcanvasButton?.setAttribute("data-bs-dismiss", "offcanvas");
      closeInnerOffcanvasButton?.removeAttribute("data-bs-toggle");
      closeInnerOffcanvasButton?.removeAttribute("data-bs-target");
      closeInnerOffcanvasButton?.removeAttribute("aria-controls");
    }
  }

  getMarketsInfo() {
    this.service.getMarketsInfo().subscribe({
      next: (data: any) => {
        this.markets = data;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  openOffcanvas() {
    let offcanvas = this.el.nativeElement.querySelector('#offcanvasRight');
    let bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
    bsOffcanvas.show();
  }

  getSeeProducts(seeProducts: boolean) {
    if (localStorage.getItem(seeProducts.toString()) !== null || seeProducts.toString() === undefined) {
      return;
    } else {
      localStorage.setItem("seeProducts", seeProducts.toString());
    }
  }

  loadUser() {
    this.router.navigateByUrl('/shop', {
      state: {
        vegetables: true,
        fruits: false,
        other: false,
        user: this.user
      }
    }).then(() => {
      location.replace(location.pathname);
    });
  }

  navigateMarkets(path: string, id: number) {
    this.router.navigate([`/${path}`, id])
      .then(() => {
        location.replace(location.pathname);
      });
  }

  navigatePage(path: string) {
    this.router.navigate([`/${path}`])
      .then(() => {
        location.replace(location.pathname);
      });
  }

  signOut() {
    let auth = getAuth();
    auth.signOut();
    localStorage.clear();
    this.router.navigate(['/sign-in'])
      .then(() => {
        location.replace(location.pathname);
      });
  }

  proceedToCart() {
    let productErrors = this.el.nativeElement.querySelectorAll('.product-error');
    let offcanvasCart: HTMLDivElement = this.el.nativeElement.querySelector('#my-offcanvas-cart');
    let counter: number[] = [];
    productErrors.forEach((error: Element) => {
      if (error) {
        let isDisplayed = window.getComputedStyle(error).display !== 'none';

        if (isDisplayed) {
          counter.push(1);
        } else {
          counter.push(0);
        }
      }
    })

    let menuError = this.el.nativeElement.querySelector('.menu-error');
    let offcanvasAmount = this.el.nativeElement.querySelector('.offcanvas-amount');
    if (counter.includes(1)) {
      this.renderer.setProperty(menuError, 'innerText', "Some products have incorect amount!");
      this.renderer.setStyle(offcanvasAmount, 'margin-top', "0px");
      setTimeout(() => { this.renderer.setProperty(menuError, 'innerText', ""); }, 5000);
      setTimeout(() => { this.renderer.setStyle(offcanvasAmount, 'margin-top', "15px"); }, 5000);
      this.openOffcanvas();
    } else if (offcanvasCart.children.length === 0) {
      this.renderer.setProperty(menuError, 'innerText', "There is no products in cart!");
      this.renderer.setStyle(offcanvasAmount, 'margin-top', "0px");
      setTimeout(() => { this.renderer.setProperty(menuError, 'innerText', ""); }, 5000);
      setTimeout(() => { this.renderer.setStyle(offcanvasAmount, 'margin-top', "15px"); }, 5000);
      this.openOffcanvas();
    } else if (counter.includes(1) == false && offcanvasCart.children.length != 0) {
      this.renderer.setProperty(menuError, 'innerText', "");
      this.renderer.setStyle(offcanvasAmount, 'margin-top', "15px");
      this.router.navigate(['/final-purchase'])
        .then(() => {
          location.replace(location.pathname);
        });
    }
  }

  getUser() {
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

            let myCart = this.el.nativeElement.querySelector('#my-offcanvas-cart');
            let counter = this.el.nativeElement.querySelector('.counter');
            let badge = this.el.nativeElement.querySelector('.badge');
            let total = this.el.nativeElement.querySelector('#total');
            if (this.user) {
              this.renderer.setProperty(myCart, "innerHTML", "");
              if (this.user.buyProducts) {
                for (let i = 0; i < this.user.buyProducts.length; i++) {
                  let card = this.createOffcanvasCard(this.user.buyProducts[i]);
                  this.renderer.appendChild(myCart, card);
                }
              } else {
                this.user.buyProducts = [];
              }

              this.renderer.setProperty(counter, "innerText", this.user.buyProducts.length);
              if (this.user.buyProducts.length === 0) {
                badge?.classList.add('none');
                badge?.classList.remove('block');
              } else {
                if (badge) {
                  this.renderer.setProperty(badge, "innerText", this.user.buyProducts.length);
                  badge.classList.add('block');
                  badge.classList.remove('none');
                }
              }
              let totalPrice: number = 0;
              for (let i = 0; i < this.user.buyProducts.length; i++) {
                totalPrice += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
              }
              this.renderer.setProperty(total, "innerText", totalPrice.toFixed(1));

            } else {
              console.log('No data available for this user.');
            }
          }
        }).catch((error) => {
          console.error(error);
        });

      }
    }
  }

  //** Creating offcanvas card element function **//
  createOffcanvasCard(product: BuyProduct) {

    // Creating cart-card div
    let cartCard = this.renderer.createElement("div");
    this.renderer.addClass(cartCard, "card");
    this.renderer.addClass(cartCard, "mb-3");
    this.renderer.addClass(cartCard, "cart-card");
    this.renderer.setAttribute(cartCard, "id", product.name)

    // Creating cart-card row div
    let cartCardRow = this.renderer.createElement("div");
    this.renderer.addClass(cartCardRow, "row");
    this.renderer.addClass(cartCardRow, "g-0");
    this.renderer.addClass(cartCardRow, "my-row");

    // Creating image-col div
    let imgCol = this.renderer.createElement("div");
    this.renderer.addClass(imgCol, "col-4");
    this.renderer.addClass(imgCol, "img-col");

    // Creating image-col img
    let img = this.renderer.createElement("img");
    this.renderer.addClass(img, "img-cart");
    this.renderer.setAttribute(img, "src", product.imgUrl);
    this.renderer.setAttribute(img, "alt", product.name);

    // Appending img to image-col
    this.renderer.appendChild(imgCol, img);

    // Creating body-col div
    let bodyCol = this.renderer.createElement("div");
    this.renderer.addClass(bodyCol, "col-7");
    this.renderer.addClass(bodyCol, "body-col");

    // Creating card-body div
    let cardBody = this.renderer.createElement("div");
    this.renderer.addClass(cardBody, "card-body");

    // Creating product-title h5
    let productTitle = this.renderer.createElement("h5");
    this.renderer.addClass(productTitle, "product-title");
    this.renderer.setProperty(productTitle, 'innerText', product.name);

    // Creating product-select
    let productSelect = this.renderer.createElement("select");
    this.renderer.addClass(productSelect, "form-select");
    this.renderer.addClass(productSelect, "product-select");
    this.renderer.setAttribute(productSelect, "aria-label", "Default select example");

    // Creating select options determining selected option and appending options to card select
    let selectedOption;
    for (let i = 0; i < product.markets.length; i++) {
      let option = this.renderer.createElement('option');
      this.renderer.setProperty(option, "value", product.markets[i].price);
      let optionTextNode = this.renderer.createText(product.markets[i].name);
      this.renderer.appendChild(option, optionTextNode);
      this.renderer.appendChild(productSelect, option);
    }

    for (let i = 0; i < productSelect.length; i++) {
      if (productSelect[i].value === product.option) {
        productSelect[i].selected = "true";
        selectedOption = productSelect[i];
      }
    }

    // Changing price based on selected market 
    let optionValue: number = selectedOption.value;
    this.renderer.listen(productSelect, 'change', (event) => {
      let currentValue: number = event.target.value;
      optionValue = currentValue;
      this.renderer.setProperty(productPricel, 'innerText', currentValue);
      this.renderer.setProperty(productTotal, 'innerText', (Number(productPricel.innerText) * Number(inputAmount.value)).toFixed(1));

      let db = getDatabase();
      let userRef = ref(db, 'users/' + this.user.id);

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.user = snapshot.val();
          let regex = /^\d+\.\d+$/;
          let total = this.el.nativeElement.querySelector('#total');
          if (this.user) {
            if (this.user.buyProducts) {
              for (let i = 0; i < this.user.buyProducts.length; i++) {
                if (this.user.buyProducts[i].name === product.name) {
                  this.user.buyProducts[i].price = currentValue;
                }
              }
            } else {
              this.user.buyProducts = [];
            }


            let updatedData = {
              ...this.user
            };

            set(userRef, updatedData)
              .then(() => {
                let totalPrice: number = 0;
                for (let i = 0; i < this.user.buyProducts.length; i++) {
                  if (this.user.buyProducts[i].amount < inputAmount.min) {
                    this.renderer.setStyle(productError, "display", "block");
                  } else if (product.unitInput != "kg" && regex.test(this.user.buyProducts[i].amount.toString()) == true) {
                    this.renderer.setStyle(productError, "display", "block");
                  } else if (product.unitInput === "kg" && regex.test(this.user.buyProducts[i].amount.toString()) == true) {
                    totalPrice += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
                    this.renderer.setStyle(productError, "display", "none");
                  } else if (this.user.buyProducts[i].amount >= inputAmount.min) {
                    totalPrice += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
                    this.renderer.setStyle(productError, "display", "none");
                  }
                }
                this.renderer.setProperty(total, "innerText", totalPrice.toFixed(1));
              })
              .catch((error) => {
                console.error('Error updating user data:', error);
              });

          }
        }
      }).catch((error) => {
        console.error(error);
      })
    });

    // Creating product-card-text paragraph
    let productCardText = this.renderer.createElement("p");
    this.renderer.addClass(productCardText, "product-card-text");
    this.renderer.setProperty(productCardText, 'innerText', "Price: ");

    // Creating product-pricel span
    let productPricel = this.renderer.createElement("span");
    this.renderer.addClass(productPricel, "price");
    this.renderer.addClass(productPricel, "product-pricel");
    this.renderer.setProperty(productPricel, 'innerText', selectedOption.value);

    // Creating product-unitl span
    let productUnitl = this.renderer.createElement("span");
    this.renderer.addClass(productUnitl, "unit");
    this.renderer.addClass(productUnitl, "product-unitl");
    this.renderer.setProperty(productUnitl, 'innerText', product.unit);

    // Appending product-pricel and product-unitl to product-card-text
    this.renderer.appendChild(productCardText, productPricel);
    this.renderer.appendChild(productCardText, productUnitl);

    // Creating product-price div
    let productPrice = this.renderer.createElement("div");
    this.renderer.addClass(productPrice, "product-price");
    this.renderer.setProperty(productPrice, 'innerText', "Total: ");

    // Creating product-error div
    let productError = this.renderer.createElement("div");
    this.renderer.addClass(productError, "product-error");
    this.renderer.setProperty(productError, 'innerText', "Incorect amount!");

    // Creating product-total span
    let productTotal = this.renderer.createElement("span");
    this.renderer.addClass(productTotal, "product-total");
    this.renderer.setProperty(productTotal, 'innerText', (product.amount * product.price).toFixed(1));

    // Creating product-unit span
    let productUnit = this.renderer.createElement("span");
    this.renderer.addClass(productUnit, "product-unit");
    this.renderer.setProperty(productUnit, 'innerText', " din");

    // Appending product-total and product-unit to product-price
    this.renderer.appendChild(productPrice, productTotal);
    this.renderer.appendChild(productPrice, productUnit);
    this.renderer.appendChild(productPrice, productError);

    // Creating product-amount div
    let productAmount = this.renderer.createElement("div");
    this.renderer.addClass(productAmount, "product-amount");

    // Creating product-amount-span span
    let productAmountSpan = this.renderer.createElement("span");
    this.renderer.addClass(productAmountSpan, "product-amount-span");
    this.renderer.setProperty(productAmountSpan, 'innerText', "Amount:");

    // Creating input-amount input
    let inputAmount = this.renderer.createElement("input");
    this.renderer.addClass(inputAmount, "input-amount");
    this.renderer.setAttribute(inputAmount, "type", "number");

    if (product.unitInput != "kg") {
      this.renderer.setAttribute(inputAmount, "min", "1");
      this.renderer.setAttribute(inputAmount, "step", "1");
    } else {
      this.renderer.setAttribute(inputAmount, "min", "0.01");
      this.renderer.setAttribute(inputAmount, "step", "0.01");
    }
    this.renderer.setProperty(inputAmount, "value", product.amount);

    // Changing price based on input change 
    this.renderer.listen(inputAmount, 'input', (event) => {
      let currentValue: number = event.target.value;

      let db = getDatabase();
      let userRef = ref(db, 'users/' + this.user.id);

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.user = snapshot.val();
          let total = this.el.nativeElement.querySelector('#total');
          let regex = /^\d+\.\d+$/;
          if (this.user) {
            if (inputAmount.value < inputAmount.min) {
              this.renderer.setStyle(productError, "display", "block");
            } else if (product.unitInput != "kg" && regex.test(inputAmount.value.toString()) == true) {
              this.renderer.setStyle(productError, "display", "block");
            } else if (product.unitInput === "kg" && regex.test(inputAmount.value.toString()) == true) {
              this.renderer.setProperty(productTotal, 'innerText', (currentValue * optionValue).toFixed(1));
              this.renderer.setStyle(productError, "display", "none");

              if (this.user.buyProducts) {
                for (let i = 0; i < this.user.buyProducts.length; i++) {
                  if (this.user.buyProducts[i].name === product.name) {
                    this.user.buyProducts[i].amount = currentValue;
                  }
                }
              } else {
                this.user.buyProducts = [];
              }


              let updatedData = {
                ...this.user
              };

              set(userRef, updatedData)
                .then(() => {
                  let totalPrice: number = 0;
                  for (let i = 0; i < this.user.buyProducts.length; i++) {
                    totalPrice += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
                  }
                  this.renderer.setProperty(total, "innerText", totalPrice.toFixed(1));
                })
                .catch((error) => {
                  console.error('Error updating user data:', error);
                });

            } else if (inputAmount.value >= inputAmount.min) {
              this.renderer.setProperty(productTotal, 'innerText', (currentValue * optionValue).toFixed(1));
              this.renderer.setStyle(productError, "display", "none");
              for (let i = 0; i < this.user.buyProducts.length; i++) {
                if (this.user.buyProducts[i].name === product.name) {
                  this.user.buyProducts[i].amount = currentValue;
                }
              }

              let updatedData = {
                ...this.user
              };

              set(userRef, updatedData)
                .then(() => {
                  let totalPrice: number = 0;
                  for (let i = 0; i < this.user.buyProducts.length; i++) {
                    totalPrice += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
                  }
                  this.renderer.setProperty(total, "innerText", totalPrice.toFixed(1));
                })
                .catch((error) => {
                  console.error('Error updating user data:', error);
                });

            }
          }
        }
      }).catch((error) => {
        console.error(error);
      });
    });

    // Creating unitInput span
    let unitInput = this.renderer.createElement("span");
    this.renderer.setProperty(unitInput, 'innerText', product.unitInput);

    // Appending product-amount-span, input-amount and unitInput to product-amount 
    this.renderer.appendChild(productAmount, productAmountSpan);
    this.renderer.appendChild(productAmount, inputAmount);
    this.renderer.appendChild(productAmount, unitInput);

    // Appending product-title, product-select, product-card-text, product-price to card-body
    this.renderer.appendChild(cardBody, productTitle);
    this.renderer.appendChild(cardBody, productSelect);
    this.renderer.appendChild(cardBody, productCardText);
    this.renderer.appendChild(cardBody, productPrice);
    this.renderer.appendChild(cardBody, productAmount);

    // Appending card-body to body-col
    this.renderer.appendChild(bodyCol, cardBody);

    // Creating bin-col div
    let binCol = this.renderer.createElement("div");
    this.renderer.addClass(binCol, "col-1");
    this.renderer.addClass(binCol, "bin-col");

    // Creating product-delete icon
    let productDelete = this.renderer.createElement("i");
    this.renderer.addClass(productDelete, "bi");
    this.renderer.addClass(productDelete, "bi-trash3");
    this.renderer.addClass(productDelete, "product-delete");

    // Removing card when delete button is clicked
    this.renderer.listen(productDelete, 'click', (event) => {

      let db = getDatabase();
      let userRef = ref(db, 'users/' + this.user.id);

      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          this.user = snapshot.val();
          if (this.user) {
            let newBuyProducts: BuyProduct[] = this.user.buyProducts.filter(buyProduct => buyProduct.name !== product.name);
            this.user.buyProducts = newBuyProducts;

            let updatedData = {
              ...this.user,

            };

            set(userRef, updatedData)
              .then(() => {
                get(userRef).then((snapshot) => {
                  if (snapshot.exists()) {
                    this.user = snapshot.val();
                    let myCart = this.el.nativeElement.querySelector('#my-offcanvas-cart');
                    let counter = this.el.nativeElement.querySelector('.counter');
                    let badge = this.el.nativeElement.querySelector('.badge');
                    let total = this.el.nativeElement.querySelector('#total');
                    if (this.user) {
                      this.renderer.setProperty(myCart, "innerHTML", "");
                      if (this.user.buyProducts) {
                        for (let i = 0; i < this.user.buyProducts.length; i++) {
                          this.renderer.appendChild(myCart, this.createOffcanvasCard(this.user.buyProducts[i]));
                        }
                      } else {
                        this.user.buyProducts = [];
                      }

                      this.renderer.setProperty(counter, "innerText", this.user.buyProducts.length);
                      if (this.user.buyProducts.length === 0) {
                        badge?.classList.add('none');
                        badge?.classList.remove('block');
                      } else {
                        this.renderer.setProperty(badge, "innerText", this.user.buyProducts.length);
                        badge?.classList.add('block');
                        badge?.classList.remove('none');
                      }
                      let totalPrice: number = 0;
                      for (let i = 0; i < this.user.buyProducts.length; i++) {
                        totalPrice += (this.user.buyProducts[i].amount * this.user.buyProducts[i].price);
                      }
                      this.renderer.setProperty(total, "innerText", totalPrice.toFixed(1));
                    }
                  }
                }).catch((error) => {
                  console.error(error);
                })

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

    // Appending product-delete to bin-col
    this.renderer.appendChild(binCol, productDelete);

    // Appending imgCol, bodyCol and binCol to cart-card-row
    this.renderer.appendChild(cartCardRow, imgCol);
    this.renderer.appendChild(cartCardRow, bodyCol);
    this.renderer.appendChild(cartCardRow, binCol);

    // Appending cart-card-row to cart-card
    this.renderer.appendChild(cartCard, cartCardRow);

    return cartCard;
  }
}


