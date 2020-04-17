import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { AuthService } from "src/app/auth/auth.service";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";
import { Observable } from "rxjs";

@Component({
  selector: "app-sidenav-list",
  templateUrl: "./sidenav-list.component.html",
  styleUrls: ["./sidenav-list.component.css"],
})
export class SidenavListComponent implements OnInit {
  isAuth$: Observable<boolean>;

  @Output() closeSidenav = new EventEmitter<void>();

  constructor(
    private store: Store<fromRoot.State>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // this.authSubscription = this.authService.authChange.subscribe(
    //   authStatus => {
    //     this.isAuth = authStatus;
    //   }
    // );
    this.isAuth$ = this.store.select(fromRoot.getIsAuthenticated);
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  // ngOnDestroy() {
  //   this.authSubscription.unsubscribe();
  // }
}
