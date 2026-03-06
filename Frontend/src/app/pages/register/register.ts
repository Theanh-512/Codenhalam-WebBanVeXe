import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  onRegister(event: Event) {
    event.preventDefault();
    // TODO: Connect to AuthService API
    console.log('Register submitted');
  }
}
