import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  name = '';
  email = '';
  password = '';

  
  baseUrl = 'https://localhost:7262/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  onSignup() {
    const userData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post(`${this.baseUrl}/signup`, userData)
      .subscribe({
        next: (res: any) => {
          alert(res.message);
          console.log('Success:', res);
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Signup Failed');
          console.log(err);
        }
      });
  }
}