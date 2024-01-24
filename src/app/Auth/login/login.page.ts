import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginPage {
  form!: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.valid) {
      const account = {
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
      };

      this.authService.login(account).subscribe({
        next: (response) => {
          if (response) {
            this.router.navigateByUrl('/home');
          }
        },
        error: (error) => {
          console.error('Error', error);
        },
        complete: () => {},
      });
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  toRegister() {
    this.router.navigateByUrl('/register');
  }

  getErrorText(controlName: string): string {
    const control = this.form.get(controlName)!;

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    return '';
  }
}
