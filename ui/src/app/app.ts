import {Component, inject, OnDestroy, signal, Signal, WritableSignal} from '@angular/core';
import {UserService} from './user.service';
import {map, of, shareReplay, startWith, Subject, switchMap, takeUntil} from 'rxjs';
import {toObservable, toSignal} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass} from '@angular/common';
import {CreateUserRequest, UpdateUserRequest, UserResponse} from './shared/models/user/user';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  private readonly unsubscribe = new Subject<void>();
  private readonly userService = inject(UserService);

  private readonly selectedUserId: WritableSignal<string | null> = signal(null)
  private readonly refresh: Subject<void> = new Subject();

  protected readonly users: Signal<UserResponse[]> = toSignal(this.refresh.pipe(
    startWith(null),
    switchMap(() =>
      this.userService.getUsers()
    ),
    shareReplay(1)
  ), {
    initialValue: []
  });

  protected readonly userFormGroup = new FormGroup({
    name: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
  });

  private readonly selectedUser = toObservable(this.selectedUserId).pipe(
    shareReplay(1),
    switchMap((id) => id !== null ? this.userService.getUser(id) : of({
      id: '',
      name: '',
      email: '',
    } as UserResponse)),
    map((userResponse: UserResponse) => {
      this.userFormGroup.controls.name.setValue(userResponse.name);
      this.userFormGroup.controls.email.setValue(userResponse.email);

      return userResponse;
    }));

  protected readonly editingMode: WritableSignal<'add' | 'edit'> = signal('add')

  constructor() {
    this.selectedUser.pipe(takeUntil(this.unsubscribe)).subscribe();
  }

  public ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  public selectAddMode(): void {
    this.editingMode.set('add');
    this.selectedUserId.set(null);
  }

  public selectEditingMode(): void {
    this.editingMode.set('edit');
    const firstUser = this.users()[0];
    this.selectedUserId.set(firstUser.id);
  }

  public selectUser(id: string): void {
    this.selectedUserId.set(id);
    this.editingMode.set('edit')
  }

  public updateUser(): void {
    const userId = this.selectedUserId();
    const updatedUser: UpdateUserRequest = {
      name: this.userFormGroup.controls.name.value,
      email: this.userFormGroup.controls.email.value,
    };

    if (!userId) return;

    this.userService.updateUser(userId, updatedUser).pipe(takeUntil(this.unsubscribe)).subscribe(
      (userResponse: UserResponse) => {
        this.selectedUserId.set(userResponse.id);
        this.refresh.next();
      }
    );
  }

  public createUser(): void {
    const createUser: CreateUserRequest = {
      name: this.userFormGroup.controls.name.value,
      email: this.userFormGroup.controls.email.value,
    };

    this.userService.createUser(createUser).pipe(takeUntil(this.unsubscribe)).subscribe(
      (userResponse: UserResponse) => {
        this.selectedUserId.set(userResponse.id);
        this.editingMode.set('edit');
        this.refresh.next();
      }
    )
  }
}
