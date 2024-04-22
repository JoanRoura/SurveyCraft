import { Component } from '@angular/core';
import { User } from '../../../auth/interfaces/user.interface';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../auth/services/auth.service';
import { Table } from 'primeng/table';
import { UserService } from '../../../auth/services/user.service';

@Component({
  selector: 'app-crud-user',
  templateUrl: './crud-user.component.html',
  styleUrl: './crud-user.component.css',
  providers: [MessageService]
})
export class CrudUserComponent {

  loadingUsers: boolean = true;

  userDialog: boolean = false;

  deleteUserDialog: boolean = false;

  deleteUsersDialog: boolean = false;

  users: User[] = [];

  user!: User;

  selectedUsers: User[] = [];

  submitted: boolean = false;

  cols: any[] = [];

  statuses: any[] = [];

  rowsPerPageOptions = [5, 10, 20];

  constructor(private userService: UserService, private messageService: MessageService) { }

  ngOnInit() {
    this.userService.getUsers().subscribe(users => {
      console.log(users);
      this.loadingUsers = false;
      this.users = users
    });

    this.cols = [
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
      { field: 'email', header: 'Email' },
      { field: 'city', header: 'City' },
      { field: 'password', header: 'Password' },
    ];
  }

  openNew() {
    this.user = {};
    this.submitted = false;
    this.userDialog = true;
  }

  deleteSelectedUsers() {
    this.deleteUsersDialog = true;
  }

  editUser(user: User) {
    this.user = { ...user };
    this.userDialog = true;
  }

  deleteUser(user: User) {
    this.deleteUserDialog = true;
    this.user = { ...user };
  }

  confirmDeleteSelected() {
    this.deleteUsersDialog = false;

    const deletedUserIds: number[] = [];

    this.selectedUsers.forEach(user => {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          deletedUserIds.push(user.id!);
          this.users = this.users.filter(val => val.id !== user.id);

          if (deletedUserIds.length === this.selectedUsers.length) {
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
            this.selectedUsers = [];
          }
        },
        error: error => {
          console.error('Error deleting user:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete users', life: 3000 });
        }
      });
    });
  }

  confirmDelete() {
    this.deleteUserDialog = false;

    const userTmp = { ...this.user };

    console.log({userTmp});

    this.userService.deleteUser(this.user.id!).subscribe({
      next: () => {
        this.users = this.users.filter(val => val.id !== userTmp.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
      },
      error: error => {
        console.error('Error deleting user:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user', life: 3000 });
      }
    });

    this.user = {};
  }

  hideDialog() {
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;

    if (this.user.name?.trim()) {
      // Hacer una copia del usuario antes de enviarlo al servidor
      const userTmp = { ...this.user };

      if (this.user.id) {
        this.userService.updateUser(this.user.id, userTmp)
          .subscribe({
            next: (resp) => {
              this.users[this.findIndexById(userTmp.id!)] = userTmp;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            },
            error: (error) => {
              console.error('Error updating user:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update user', life: 3000 });
            }
          });

      } else {
        this.userService.createUser(userTmp)
          .subscribe({
            next: (resp) => {
              this.users.push({ ...userTmp });
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            },
            error: (error) => {
              console.error('Error creating user:', error);
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create user', life: 3000 });
            }
          });
      }

      this.userDialog = false;
      this.user = {};
      this.submitted = false;
    }
  }


  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.users.length; i++) {
      if (this.users[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  // createId(): string {
  //     let id = '';
  //     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //     for (let i = 0; i < 5; i++) {
  //         id += chars.charAt(Math.floor(Math.random() * chars.length));
  //     }
  //     return id;
  // }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
}
