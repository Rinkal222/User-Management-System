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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  title = 'User Management System';
  displayedColumns: string[] = ['id', 'userName', 'email', 'role', 'action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filteredUsers: any[] = [];
  searchValue: string = '';
  sortDirection: any;

  serverError = false;

  constructor(
    private _dialog: MatDialog,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getUserList();
  }

  /**
   * Opens the Add/Edit User dialog and refreshes the user list upon closing.
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
      error: (err) => this.showSnackbar('An error occurred while adding the user.', 'error'),
    });
  }

  /**
   * Fetches the user list from the backend API and sets up the table.
   */
  getUserList() {
    this._userService.getUser().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        if (this.dataSource.data.length === 0) {
          this.showSnackbar("User hasn't fetched, please add a new user");
        }
        this.filteredUsers = this.dataSource.data;

        // ✅ Ensure paginator and sorting are set properly
        setTimeout(() => {
          if (this.paginator) {
            this.dataSource.paginator = this.paginator;
          }
          if (this.sort) {
            this.dataSource.sort = this.sort;
          }
        });
        // Keep a copy of all users
        this.filteredUsers = [...res];
        this.serverError = false;
        // ✅ Define a proper filter function for searching
        this.dataSource.filterPredicate = (data: any, filter: string) => {
          const userNameMatch = data.userName.toLowerCase().includes(filter);
          const emailMatch = data.email.toLowerCase().includes(filter);
          return userNameMatch || emailMatch;
        };
      },
      error: (err) => {
        this.serverError = true;
        this.showSnackbar('Failed to load user data.', 'error');
      },
    });
  }


  /**
   * Applies search filter to the user list.
   * @param event - Input event from the search field.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue;
    // ✅ Apply filter to Card UI
    this.filteredUsers = this.dataSource.data.filter(user =>
      user.userName.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue) ||
      user.role.toLowerCase().includes(filterValue)
    );

    // ✅ Reset to first page when filter is applied
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

  }
  sortCardsBy(property: string) {
    const direction = this.sortDirection ? 1 : -1;
    this.filteredUsers.sort((a, b) => {
      return a[property].toLowerCase() > b[property].toLowerCase() ? direction : -direction;
    });
    this.sortDirection = !this.sortDirection; // Toggle sort direction
  }


  /**
   * Opens a confirmation dialog before deleting a user.
   * @param id - The user ID to be deleted.
   */
  deleteEmployee(id: number) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this user?', actionLabel: 'Delete' },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this._userService.deleteUsers(id).subscribe({
          next: () => {
            this.getUserList();
            this.showSnackbar('User successfully deleted!');
          },
          error: (err) => this.showSnackbar('Failed to delete the user.', 'error'),
        });
      }
    });
  }

  /**
   * Opens the Add/Edit dialog with pre-filled data for updating user information.
   * @param data - The user object to be edited.
   */
  openEditForm(data: any) {
    const dialogRef = this._dialog.open(AddEditUserComponent, { data });
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getUserList();
          this.showSnackbar('User successfully updated!');
        }
      },
      error: (err) => this.showSnackbar('An error occurred while updating the user.', 'error'),
    });
  }

  /**
   * Displays a snackbar message at the bottom of the screen.
   * @param message - The message to display.
   * @param type - Optional type to modify the snackbar appearance.
   */
  private showSnackbar(message: string, type: 'success' | 'error' = 'success') {
    this._snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: [
        'custom-snackbar', // Always apply this class
        type === 'error' ? 'snackbar-error' : 'snackbar-success' // Add dynamic class
      ],
    });
  }
  toggleActions(user: any) {
    user.showActions = !user.showActions;
  }

}