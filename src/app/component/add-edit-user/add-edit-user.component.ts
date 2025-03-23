import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../services/user.service';
@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.css']
})

export class AddEditUserComponent implements OnInit {

  userForm: FormGroup;
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; // Regex pattern for valid emails

  role: string[] = [
    'Admin',
    'User'
  ];

  constructor(
    private _fb: FormBuilder,
    private _userService: UserService,
    private _dialogRef: MatDialogRef<AddEditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) {
    this.userForm = this._fb.group({
      userName: ['', Validators.required], // Username required
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]], // Custom regex for email validation
      role: ['', Validators.required] // Role required
    });
  }

  ngOnInit(): void {
    this.userForm.patchValue(this.data);
  }
  get email() {
    return this.userForm.get('email');
  }
  onFormSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.data) {
        // Updating existing user
        this._userService.updateUsers(this.data.id, userData).subscribe({
          next: () => this._dialogRef.close(true),
          error: (err: any) => console.error(err),
        });
      } else {
        // Adding a new user
        this._userService.addUser(userData).subscribe({
          next: () => this._dialogRef.close(true),
          error: (err: any) => console.error(err),
        });
      }
    } else {
      console.log('Form is invalid');
    }
  }

}