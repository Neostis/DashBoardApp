import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AccountModel } from 'src/app/model/account.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
})
export class RegisterPage {
  form!: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, this.emailValidator()]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          this.passwordValidator(),
        ],
      ],
      phone: '',
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  register() {
    if (this.form.valid) {
      const newAccount: AccountModel = {
        name: this.form.get('name')?.value,
        email: this.form.get('email')?.value,
        phone: this.form.get('phone')?.value,
        username: this.form.get('username')?.value,
        password: this.form.get('password')?.value,
        createDate: new Date(),
        updateDate: new Date(),
        role: 'user',
        projects: [],
      };

      this.authService.register(newAccount).subscribe({
        next: (response) => {
          console.log('Successfully Create an account.');
        },
        error: (error) => {
          console.error('Error', error);
        },
        complete: () => {
          this.router.navigateByUrl('/login');
        },
      });
    }
  }

  toLogin() {
    this.router.navigateByUrl('/login');
  }

  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;

      const uppercaseRegex = /[A-Z]/;
      const lowercaseRegex = /[a-z]/;
      const digitRegex = /\d/;
      const specialCharRegex = /[~`!@#$%^&*()-_+={}[\]|\\;:"<>,./?]/;

      const hasUppercase = uppercaseRegex.test(value);
      const hasLowercase = lowercaseRegex.test(value);
      const hasDigit = digitRegex.test(value);
      const hasSpecialChar = specialCharRegex.test(value);

      if (!hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
        return { passwordRequirements: true };
      }

      return null;
    };
  }

  emailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value: string = control.value;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (value === '' || emailRegex.test(value)) {
        return null;
      }

      return { invalidEmail: true };
    };
  }

  getErrorText(controlName: string): string {
    const control = this.form.get(controlName)!;

    if (control.hasError('required')) {
      return 'This field is required.';
    }

    if (
      control.hasError('invalidEmail') &&
      (control.dirty || control.touched)
    ) {
      return 'Please enter a valid email address.';
    }

    if (control.hasError('minlength')) {
      return 'Password must be at least 8 characters long.';
    }

    if (control.hasError('passwordRequirements')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, one numeric digit, and one special characters.';
    }

    return '';
  }
}
