import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { MarketsService } from '../service/markets.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../model/users';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { get, getDatabase, ref } from 'firebase/database';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  myForm: FormGroup;
  users: User[] = [];
  user: User = new User;

  constructor(private service: MarketsService, private router: Router, private formBuilder: FormBuilder, private renderer: Renderer2, private el: ElementRef) {
    this.myForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
  }

  getId(id: string) {
    if (localStorage.getItem(id.toString()) !== null || id.toString() === undefined) {
      return;
    } else {
      localStorage.setItem("id", id.toString());
    }
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

  navigatePage(path: string) {
    this.router.navigate([`/${path}`])
      .then(() => {
        location.replace(location.pathname);
      });
  }

  onSubmit(event: any) {
    event?.preventDefault;
    let retVal = true;
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
    }

    if (retVal == true) {
      let auth = getAuth();
      signInWithEmailAndPassword(auth, this.myForm.value.email, this.myForm.value.password)
        .then((userCredential) => {

          let db = getDatabase();
          let userRef = ref(db, 'users/' + userCredential.user.uid);

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
          if (error.message === "Firebase: Error (auth/invalid-email).") {
            document.querySelector('#email-invalid')?.classList.add('block');
            document.querySelector('#email-invalid')?.classList.remove('none');
            document.querySelector('#email-blank')?.classList.add('none');
            document.querySelector('#email-blank')?.classList.remove('block');
            document.querySelector('#email-match')?.classList.add('none');
            document.querySelector('#email-match')?.classList.remove('block');
            document.querySelector('#email-match2')?.classList.add('none');
            document.querySelector('#email-match2')?.classList.remove('block');
            document.querySelector('#email')?.classList.add('shake');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
          } else if (error.message === "Firebase: Error (auth/user-not-found).") {
            document.querySelector('#email-match2')?.classList.add('block');
            document.querySelector('#email-match2')?.classList.remove('none');
            document.querySelector('#email-match')?.classList.add('none');
            document.querySelector('#email-match')?.classList.remove('block');
            document.querySelector('#email-invalid')?.classList.add('none');
            document.querySelector('#email-invalid')?.classList.remove('block');
            document.querySelector('#email-blank')?.classList.add('none');
            document.querySelector('#email-blank')?.classList.remove('block');
            document.querySelector('#email')?.classList.add('shake');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
          } else if (error.message === "Firebase: Error (auth/wrong-password).") {
            document.querySelector('#email-match')?.classList.add('block');
            document.querySelector('#email-match')?.classList.remove('none');
            document.querySelector('#email-match2')?.classList.add('none');
            document.querySelector('#email-match2')?.classList.remove('block');
            document.querySelector('#email-invalid')?.classList.add('none');
            document.querySelector('#email-invalid')?.classList.remove('block');
            document.querySelector('#email-blank')?.classList.add('none');
            document.querySelector('#email-blank')?.classList.remove('block');
            document.querySelector('#email')?.classList.add('shake');
            document.querySelector('#password')?.classList.add('shake');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
            this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
          }
        });
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

  toggleInputEmail() {
    if (this.myForm.controls['email'].value === "") {
      document.querySelector('#email-blank')?.classList.add('block');
      document.querySelector('#email-blank')?.classList.remove('none');
      document.querySelector('#email-invalid')?.classList.add('none');
      document.querySelector('#email-invalid')?.classList.remove('block');
      document.querySelector('#email-match')?.classList.add('none');
      document.querySelector('#email-match')?.classList.remove('block');
      document.querySelector('#email-match2')?.classList.add('none');
      document.querySelector('#email-match2')?.classList.remove('block');
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
      document.querySelector('#email-match2')?.classList.add('none');
      document.querySelector('#email-match2')?.classList.remove('block');
      document.querySelector('#email')?.classList.add('shake');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'red');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', 'rgb(232, 191, 191)');
    } else {
      document.querySelector('#email-match')?.classList.add('none');
      document.querySelector('#email-match')?.classList.remove('block');
      document.querySelector('#email-match2')?.classList.add('none');
      document.querySelector('#email-match2')?.classList.remove('block');
      document.querySelector('#email-invalid')?.classList.add('none');
      document.querySelector('#email-invalid')?.classList.remove('block');
      document.querySelector('#email-blank')?.classList.add('none');
      document.querySelector('#email-blank')?.classList.remove('block');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'border-color', 'black');
      this.renderer.setStyle(this.el.nativeElement.querySelector('#email'), 'background-color', '#fff');
    }
  }

  togglePassword() {
    let passwordInput: any = document.querySelector('.psw');

    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }
}
