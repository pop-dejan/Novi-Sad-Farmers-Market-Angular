import { Component, OnInit } from '@angular/core';
import { User } from '../model/users';
import { Router } from '@angular/router';
import { MarketsService } from '../service/markets.service';
import { get, getDatabase, ref } from 'firebase/database';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  user: User = new User;
  usersName: string | null = "";
  vegetables: boolean = true;
  fruits: boolean = false;
  other: boolean = false;
  loadedUser: boolean = false;

  constructor(private router: Router, private service: MarketsService) {
  }

  ngOnInit(): void {
    this.service.data$.subscribe(updatedData => {
      this.loadedUser = updatedData;
      if (this.loadedUser == true) {
        location.reload();
      }
    });

    let userString = localStorage.getItem("userObject");
    if (userString) {
      let userObject = JSON.parse(userString);
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

  Vegetables() {
    this.vegetables = true;
    this.fruits = false;
    this.other = false;
    this.router.navigateByUrl('/shop', {
      state: {
        vegetables: true,
        fruits: false,
        other: false,
        user: this.user
      }
    });
  }

  Fruits() {
    this.vegetables = false;
    this.fruits = true;
    this.other = false;
    this.router.navigateByUrl('/shop', {
      state: {
        vegetables: false,
        fruits: true,
        other: false,
        user: this.user
      }
    });
  }

  Other() {
    this.vegetables = false;
    this.fruits = false;
    this.other = true;
    this.router.navigateByUrl('/shop', {
      state: {
        vegetables: false,
        fruits: false,
        other: true,
        user: this.user
      }
    });
  }
}
