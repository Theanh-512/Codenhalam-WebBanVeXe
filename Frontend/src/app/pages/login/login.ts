import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  onLogin(event: Event) {
    event.preventDefault();
    // TODO: Connect to AuthService API
    console.log('Login submitted');
  }
}
