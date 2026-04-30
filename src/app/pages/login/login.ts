import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, HttpClientModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';

  baseUrl = 'https://localhost:7262/api/Auth';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onLogin() {
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.http.post(`${this.baseUrl}/login`, loginData)
      .subscribe({
        next: (res: any) => {
          // alert(res.message);

          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify(res.user));

          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          alert('Invalid Email or Password');
        }
      });
  }
}