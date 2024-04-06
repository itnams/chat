import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat, FirebaseService, LocalStorageService, Messages, PipesModule, User } from '@chat/share';
import { BehaviorSubject, combineLatest, distinctUntilChanged, map, shareReplay, startWith } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule, PipesModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  @ViewChild('scrollArea', { static: true }) scroll: any;
  isModalVisible: boolean = false;
  rfMessages = new FormGroup({
    body: new FormControl('', Validators.required),
  });
  username$ = new BehaviorSubject<string>('')
  listChat$ = new BehaviorSubject<Chat[]>([])
  listUser$ = new BehaviorSubject<User[]>([])
  chatIndex$ = new BehaviorSubject<number>(0)
  user: User = {}
  searchControl: FormControl = new FormControl("");
  searchUser: FormControl = new FormControl("");
  combinedUser$ = combineLatest(
    this.listUser$,
    this.searchUser.valueChanges.pipe(startWith(''))
  );
  combined$ = combineLatest(
    this.listChat$,
    this.searchControl.valueChanges.pipe(startWith(''))
  );
  filterListChat$ = this.combined$.pipe(
    map(([listChat, searchText]) => {
      return listChat.filter(chat => chat.fullNamePartner?.includes(searchText));
    })
  );
  filterListuser$ = this.combinedUser$.pipe(
    map(([listUser, searchText]) => {
      return listUser.filter(user => user.fullName?.includes(searchText));
    })
  );
  constructor(private firebaseService: FirebaseService, private localStorageService: LocalStorageService, private router: Router) {}
  ngOnInit(): void {
    this.getListChat()
    this.getListUser()
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000)
  }
  scrollToBottom(): void {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
  }
  getListUser() {
    this.firebaseService.getListUser((resp) => {
      this.listUser$.next(resp)
    })
  }
  getListChat() {
    const user = this.localStorageService.getItem<User>('user')
    this.user = user ?? {}
    this.username$.next(user?.username ?? '')
    this.firebaseService.getListChat(user?.username ?? '', (resp) => {
      this.listChat$.next(resp)
    })
  }
  selectChat(index: number) {
    this.chatIndex$.next(index)
    setTimeout(() => {
      this.scrollToBottom();
    }, 350)
  }
  getTime(messages: Messages) {
    return String(messages.time) ?? ''
  }
  getFullNamePartner() {
    const chatIndex = this.chatIndex$.value
    return this.listChat$.value[chatIndex]?.fullNamePartner ?? ''
  }
  getCharFirst(name: string): string {
    return name.charAt(0) ?? ''
  }
  getMessages() {
    const chatIndex = this.chatIndex$.value
    console.log(this.listChat$.value[chatIndex]?.messages)
    return this.listChat$.value[chatIndex]?.messages.sort((a, b) => {
      const dateA = new Date(String(a?.time) ?? '');
      const dateB = new Date(String(b.time));
      return dateA.getTime() - dateB.getTime();
    }) ?? []
  }
  sendMessages() {
    const chatIndex = this.chatIndex$.value
    const chat = this.listChat$.value[chatIndex]
    const body = this.rfMessages.value.body
    this.firebaseService.sendMessages(this.user.username ?? '', chat?.partner ?? '', this.user.fullName ?? '', chat.fullNamePartner ?? '', body ?? '')
    this.rfMessages.patchValue({
      body: ""
    })
    setTimeout(() => {
      this.scrollToBottom();
    }, 250)
  }
  sayHi(fromUser: User){
    this.firebaseService.sendMessages(this.user.username ?? '', fromUser?.username ?? '', this.user.fullName ?? '', fromUser.fullName ?? '', 'Hello!')
  }
  toggleModal() {
    this.isModalVisible = !this.isModalVisible;
    this.searchControl.setValue("")
    this.searchUser.setValue("")
  }
  logOut(){
    this.localStorageService.clear()
    this.router.navigate(['/login']);
  }
}
