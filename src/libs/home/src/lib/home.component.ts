import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chat, FirebaseService, LocalStorageService, Messages, PipesModule, User } from '@chat/share';
import { BehaviorSubject } from 'rxjs';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'lib-home',
  standalone: true,
  imports: [CommonModule, PipesModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  @ViewChild('scrollArea', { static: true }) scroll: any;
  rfMessages = new FormGroup({
    body: new FormControl('', Validators.required),
  });
  username$ = new BehaviorSubject<string>('')
  listChat$ = new BehaviorSubject<Chat[]>([])
  chatIndex$ = new BehaviorSubject<number>(0)
  user: User = {}
  constructor(private firebaseService: FirebaseService, private localStorageService: LocalStorageService) { }
  ngOnInit(): void {
    this.getListChat()
    setTimeout(() => {
      this.scrollToBottom();
    }, 1000)
  }
  scrollToBottom(): void {
    this.scroll.nativeElement.scrollTop = this.scroll.nativeElement.scrollHeight;
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
  }
  getTime(messages: Messages) {
    return String(messages.time) ?? ''
  }
  getFullNamePartner() {
    const chatIndex = this.chatIndex$.value
    return this.listChat$.value[chatIndex]?.fullNamePartner ?? ''
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
}
