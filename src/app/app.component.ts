import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from './services/user.service';

import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';
import { AddEditUserComponent } from './component/add-edit-user/add-edit-user.component';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush // Enables OnPush change detection for performance optimization
})
export class AppComponent implements OnInit {
  title = 'UserManagementSystem'; // Title of the application
  displayedColumns: string[] = ['id', 'userName', 'email', 'role', 'action']; // Columns to display in the table
  dataSource!: MatTableDataSource<any>; // Data source for the table

  @ViewChild(MatPaginator) paginator!: MatPaginator; // ViewChild for paginator
  @ViewChild(MatSort) sort!: MatSort; // ViewChild for sorting functionality

  constructor(
    private _dialog: MatDialog, // Inject MatDialog for dialog operations
    private _userService: UserService, // Inject UserService to interact with backend API
    private _snackBar: MatSnackBar, // Inject MatSnackBar for displaying messages
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef for manual change detection
  ) { }

  ngOnInit(): void {
    this.getUserList(); // Fetch user list on component initialization
  }

  /**
   * Opens the Add/Edit User dialog.
   * After closing the dialog, refreshes the user list if changes were made and shows a success message.
   */
  openAddEditUserDialogForm() {
    const dialogRef = this._dialog.open(AddEditUserComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUserList();
          this.showSnackbar('User successfully added!');

        }
      },
    });
  }

  /**
   * Fetches the user list from the backend and initializes the table data source.
   */
  getUserList() {
    this._userService.getUser().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort; // Enables sorting on the table
        this.dataSource.paginator = this.paginator; // Enables pagination on the table

        // Custom filter to match userName and email fields
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const userNameMatch = data.userName.toLowerCase().includes(filter);
          const emailMatch = data.email.toLowerCase().includes(filter);
          return userNameMatch || emailMatch;
        };
      },
      error: (err: any) => {
        console.log(err); // Logs any error encountered during the API call
      },
    });
  }

  /**
   * Applies a filter to the table data.
   *
   * @param event - The event object triggered by the filter input field.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  
    // this.cdr.detectChanges(); // Manually trigger change detection
  }
  

  /**
   * Opens a confirmation dialog before deleting a user.
   * If confirmed, it deletes the user and refreshes the user list.
   *
   * @param id - The ID of the user to be deleted.
   */
  deleteEmployee(id: number) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this user?', actionLabel: 'Delete' }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._userService.deleteUsers(id).subscribe({
          next: (res) => {
            this.getUserList(); // Refresh user list after deletion
            this.showSnackbar('User successfully deleted!');
          },
          error: console.log,
        });
      }
    });
  }

  /**
   * Opens the Add/Edit User dialog with existing user data for editing.
   *
   * @param data - The user data to be edited.
   */
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditUserComponent, {
      data,
    });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUserList();
          this.showSnackbar('User successfully updated!');
        }
      },
    });
  }
  
  /**
  * Displays a snackbar message at the center of the screen on mobile devices.
  *
  * @param message - The message to display.
  */
  private showSnackbar(message: string, event?: MouseEvent) {
    let horizontalPosition: 'start' | 'center' | 'end' = 'center';
    let verticalPosition: 'top' | 'bottom' = 'bottom';
  
    if (event && window.innerWidth < 768) {
      const pointerY = event.clientY;
      verticalPosition = pointerY < window.innerHeight / 2 ? 'top' : 'bottom';
    }
  
    this._snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition,
      verticalPosition,
    });
  }
  
}