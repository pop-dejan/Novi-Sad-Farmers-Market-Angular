import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BuyProduct, Order, User } from '../model/users';
import { HttpClient } from '@angular/common/http';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { get, getDatabase, ref, set } from 'firebase/database';
import { MarketsService } from '../service/markets.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  myForm: FormGroup;
  user: User = new User;

  constructor(private router: Router, private formBuilder: FormBuilder, private renderer: Renderer2, private el: ElementRef, private http: HttpClient, private service: MarketsService) {
    this.myForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      selectValue: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  getId(id: string) {
    if (localStorage.getItem(id.toString()) !== null || id.toString() === undefined) {
      return;
    } else {
      localStorage.setItem("id", id.toString());
    }
  }

  navigatePage(path: string) {
    this.router.navigate([`/${path}`])
      .then(() => {
        location.replace(location.pathname);
      });
  }

  getSeeProducts(seeProducts: boolean) {
    if (localStorage.getItem(seeProducts.toString()) !== null || seeProducts.toString() === undefined) {
      return;
    } else {
      localStorage.setItem("seeProducts", seeProducts.toString());
    }
  }

  getValues(user: User) {
    if (localStorage.getItem(JSON.stringify(user)) !== null || JSON.stringify(user) === undefined) {
      return;
    } else {
      localStorage.setItem("userObject", JSON.stringify(user));
    }
  }

  onSubmit(event: any) {
    event?.preventDefault;

    let retVal: boolean = true;

    if (this.myForm.controls['username'].value === "") {
      document.querySelector('#username-blank')?.classList.add('block');
      document.querySelector('#username-blank')?.classList.remove('none');
      document.querySelector('#username-length')?.classList.remove('block');
      document.querySelector('#username-length')?.classList.add('none');
      document.querySelector('#username')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['username'].value !== "" && this.myForm.controls['username'].value.length < 6) {
      document.querySelector('#username-blank')?.classList.add('none');
      document.querySelector('#username-blank')?.classList.remove('block');
      document.querySelector('#username-length')?.classList.remove('none');
      document.querySelector('#username-length')?.classList.add('block');
      document.querySelector('#username')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['username'].value !== "" && this.myForm.controls['username'].value.length >= 6) {
      document.querySelector('#username-blank')?.classList.add('none');
      document.querySelector('#username-blank')?.classList.remove('block');
      document.querySelector('#username-length')?.classList.remove('block');
      document.querySelector('#username-length')?.classList.add('none');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'background-color', '#fff');
    }

    if (this.myForm.controls['email'].value === "") {
      document.querySelector('#email-blank')?.classList.add('block');
      document.querySelector('#email-blank')?.classList.remove('none');
      document.querySelector('#email-invalid')?.classList.add('none');
      document.querySelector('#email-invalid')?.classList.remove('block');
      document.querySelector('#email-match')?.classList.add('none');
      document.querySelector('#email-match')?.classList.remove('block');
      document.querySelector('#email')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else {
      document.querySelector('#email-match')?.classList.add('none');
      document.querySelector('#email-match')?.classList.remove('block');
      document.querySelector('#email-invalid')?.classList.add('none');
      document.querySelector('#email-invalid')?.classList.remove('block');
      document.querySelector('#email-blank')?.classList.add('none');
      document.querySelector('#email-blank')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', '#fff');
    }

    if (this.myForm.controls['password'].value === "") {
      document.querySelector('#password-blank')?.classList.add('block');
      document.querySelector('#password-blank')?.classList.remove('none');
      document.querySelector('#password-length')?.classList.remove('block');
      document.querySelector('#password-length')?.classList.add('none');
      document.querySelector('#password')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['password'].value !== "" && this.myForm.controls['password'].value.length < 6) {
      document.querySelector('#password-blank')?.classList.add('none');
      document.querySelector('#password-blank')?.classList.remove('block');
      document.querySelector('#password-length')?.classList.remove('none');
      document.querySelector('#password-length')?.classList.add('block');
      document.querySelector('#password')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['password'].value !== "" && this.myForm.controls['password'].value.length >= 6) {
      document.querySelector('#password-blank')?.classList.add('none');
      document.querySelector('#password-blank')?.classList.remove('block');
      document.querySelector('#password-length')?.classList.remove('block');
      document.querySelector('#password-length')?.classList.add('none');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'background-color', '#fff');
    }

    if (this.myForm.controls['confirmPassword'].value === "") {
      document.querySelector('#confirmPassword-blank')?.classList.add('block');
      document.querySelector('#confirmPassword-blank')?.classList.remove('none');
      document.querySelector('#confirmPassword-match')?.classList.remove('block');
      document.querySelector('#confirmPassword-match')?.classList.add('none');
      document.querySelector('#confirmPassword')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['confirmPassword'].value !== this.myForm.controls['password'].value) {
      document.querySelector('#confirmPassword-match')?.classList.remove('none');
      document.querySelector('#confirmPassword-match')?.classList.add('block');
      document.querySelector('#confirmPassword-blank')?.classList.add('none');
      document.querySelector('#confirmPassword-blank')?.classList.remove('block');
      document.querySelector('#confirmPassword')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'background-color', 'rgb(232, 191, 191)');
      retVal = false;
    } else if (this.myForm.controls['confirmPassword'].value === this.myForm.controls['password'].value) {
      document.querySelector('#confirmPassword-match')?.classList.remove('block');
      document.querySelector('#confirmPassword-match')?.classList.add('none');
      document.querySelector('#confirmPassword-blank')?.classList.add('none');
      document.querySelector('#confirmPassword-blank')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'background-color', '#fff');
    }

    if (retVal == true) {
      let auth = getAuth();

      createUserWithEmailAndPassword(auth, this.myForm.value.email, this.myForm.value.password)
        .then((userCredential) => {
          let user = userCredential.user;
          let db = getDatabase();
          let userRef = ref(db, 'users/' + user.uid);

          let BuyProducts: BuyProduct[] = [];
          let orders: Order[] = [];
          set(userRef, {
            email: user.email,
            id: user.uid,
            username: this.myForm.value.username,
            buyProducts: BuyProducts,
            orders: orders
          }).then(() => {
            let userRef = ref(db, 'users/' + user.uid);

            get(userRef).then((snapshot) => {
              if (snapshot.exists()) {
                this.user = snapshot.val();
                this.getId(this.user.id);
                if (this.user.id) {
                  this.user.id = String(localStorage.getItem("id"));
                }
                this.service.updateAddCart(true);
                this.getSeeProducts(true);
                this.service.updateLoadedUser(true);

                this.getValues(this.user);
                let userString = localStorage.getItem("userObject");
                if (userString) {
                  let userObject = JSON.parse(userString);
                  this.user = userObject;
                }

                this.router.navigateByUrl('/application');
              } else {
                console.log('No data available for this user.');
              }
            }).catch((error) => {
              console.error(error);
            });

          }).catch((error) => {
            console.error(error);
          });
        })
        .catch((error) => {
          if (error.message === "Firebase: Error (auth/invalid-email).") {
            document.querySelector('#email-invalid')?.classList.add('block');
            document.querySelector('#email-invalid')?.classList.remove('none');
            document.querySelector('#email-blank')?.classList.add('none');
            document.querySelector('#email-blank')?.classList.remove('block');
            document.querySelector('#email-match')?.classList.add('none');
            document.querySelector('#email-match')?.classList.remove('block');
            document.querySelector('#email')?.classList.add('shake');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
          } else if (error.message === "Firebase: Error (auth/email-already-in-use).") {
            document.querySelector('#email-match')?.classList.add('block');
            document.querySelector('#email-match')?.classList.remove('none');
            document.querySelector('#email-invalid')?.classList.add('none');
            document.querySelector('#email-invalid')?.classList.remove('block');
            document.querySelector('#email-blank')?.classList.add('none');
            document.querySelector('#email-blank')?.classList.remove('block');
            document.querySelector('#email')?.classList.add('shake');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
          }
        });
    }
  }



  toggleInputUsername() {
    if (this.myForm.controls['username'].value === "") {
      document.querySelector('#username-blank')?.classList.add('block');
      document.querySelector('#username-blank')?.classList.remove('none');
      document.querySelector('#username-length')?.classList.remove('block');
      document.querySelector('#username-length')?.classList.add('none');
      document.querySelector('#username')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['username'].value !== "" && this.myForm.controls['username'].value.length < 6) {
      document.querySelector('#username-blank')?.classList.add('none');
      document.querySelector('#username-blank')?.classList.remove('block');
      document.querySelector('#username-length')?.classList.remove('none');
      document.querySelector('#username-length')?.classList.add('block');
      document.querySelector('#username')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['username'].value !== "" && this.myForm.controls['username'].value.length >= 6) {
      document.querySelector('#username-blank')?.classList.add('none');
      document.querySelector('#username-blank')?.classList.remove('block');
      document.querySelector('#username-length')?.classList.remove('block');
      document.querySelector('#username-length')?.classList.add('none');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#username'), 'background-color', '#fff');
    }
  }

  toggleInputEmail() {
    if (this.myForm.controls['email'].value === "") {
      document.querySelector('#email-blank')?.classList.add('block');
      document.querySelector('#email-blank')?.classList.remove('none');
      document.querySelector('#email-invalid')?.classList.add('none');
      document.querySelector('#email-invalid')?.classList.remove('block');
      document.querySelector('#email-match')?.classList.add('none');
      document.querySelector('#email-match')?.classList.remove('block');
      document.querySelector('#email')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['email'].invalid) {
      document.querySelector('#email-invalid')?.classList.add('block');
      document.querySelector('#email-invalid')?.classList.remove('none');
      document.querySelector('#email-blank')?.classList.add('none');
      document.querySelector('#email-blank')?.classList.remove('block');
      document.querySelector('#email-match')?.classList.add('none');
      document.querySelector('#email-match')?.classList.remove('block');
      document.querySelector('#email')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
    } else {
      document.querySelector('#email-match')?.classList.add('none');
      document.querySelector('#email-match')?.classList.remove('block');
      document.querySelector('#email-invalid')?.classList.add('none');
      document.querySelector('#email-invalid')?.classList.remove('block');
      document.querySelector('#email-blank')?.classList.add('none');
      document.querySelector('#email-blank')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', '#fff');
    }
  }

  toggleInputPassword() {
    if (this.myForm.controls['password'].value === "") {
      document.querySelector('#password-blank')?.classList.add('block');
      document.querySelector('#password-blank')?.classList.remove('none');
      document.querySelector('#password-length')?.classList.remove('block');
      document.querySelector('#password-length')?.classList.add('none');
      document.querySelector('#password')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['password'].value !== "" && this.myForm.controls['password'].value.length < 6) {
      document.querySelector('#password-blank')?.classList.add('none');
      document.querySelector('#password-blank')?.classList.remove('block');
      document.querySelector('#password-length')?.classList.remove('none');
      document.querySelector('#password-length')?.classList.add('block');
      document.querySelector('#password')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['password'].value !== "" && this.myForm.controls['password'].value.length >= 6) {
      document.querySelector('#password-blank')?.classList.add('none');
      document.querySelector('#password-blank')?.classList.remove('block');
      document.querySelector('#password-length')?.classList.remove('block');
      document.querySelector('#password-length')?.classList.add('none');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#password'), 'background-color', '#fff');
    }
  }

  toggleInputConfirmPassword() {
    if (this.myForm.controls['confirmPassword'].value === "") {
      document.querySelector('#confirmPassword-blank')?.classList.add('block');
      document.querySelector('#confirmPassword-blank')?.classList.remove('none');
      document.querySelector('#confirmPassword-match')?.classList.remove('block');
      document.querySelector('#confirmPassword-match')?.classList.add('none');
      document.querySelector('#confirmPassword')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['confirmPassword'].value !== this.myForm.controls['password'].value) {
      document.querySelector('#confirmPassword-match')?.classList.remove('none');
      document.querySelector('#confirmPassword-match')?.classList.add('block');
      document.querySelector('#confirmPassword-blank')?.classList.add('none');
      document.querySelector('#confirmPassword-blank')?.classList.remove('block');
      document.querySelector('#confirmPassword')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'background-color', 'rgb(232, 191, 191)');
    } else if (this.myForm.controls['confirmPassword'].value === this.myForm.controls['password'].value) {
      document.querySelector('#confirmPassword-match')?.classList.remove('block');
      document.querySelector('#confirmPassword-match')?.classList.add('none');
      document.querySelector('#confirmPassword-blank')?.classList.add('none');
      document.querySelector('#confirmPassword-blank')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#confirmPassword'), 'background-color', '#fff');
    }
  }

  togglePassword() {
    let passwordInputs: any = document.querySelectorAll('.psw');
    for (let i = 0; i < passwordInputs.length; i++) {
      if (passwordInputs[i].type === "password") {
        passwordInputs[i].type = "text";
      } else {
        passwordInputs[i].type = "password";
      }
    }
  }
}
