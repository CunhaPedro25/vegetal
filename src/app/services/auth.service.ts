// Sources for this code:
// https://supabase.com/blog/building-a-realtime-trello-board-with-supabase-and-angular


/* eslint-disable @typescript-eslint/naming-convention */
import {Injectable} from "@angular/core"
import {createClient, SupabaseClient, User} from "@supabase/supabase-js"
import {environment} from "../../environments/environment"
import {BehaviorSubject, Observable} from "rxjs"
import {Router} from "@angular/router"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private static supabase: SupabaseClient
  private currentUser: BehaviorSubject<boolean | User | any> = new BehaviorSubject(null)

  constructor(private router: Router) {
    AuthService.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    )

    AuthService.supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        this.currentUser.next(session?.user)
      } else {
        this.currentUser.next(false)
      }
    })

    this.loadUser()
  }

  async loadUser() {
    if (this.currentUser.value) {
      return
    }

    const user = await AuthService.supabase.auth.getUser()

    if (user.data.user) {
      this.currentUser.next(user.data.user)
    } else {
      this.currentUser.next(false)
    }
  }

  getCurrentUser(): Observable<User> {
    return this.currentUser.asObservable();
  }

  getCurrentUserId() {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id
    } else {
      return null
    }
  }

  signUp(credentials: {name: string, email: string; password: string}) {
    return AuthService.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          name: credentials.name,
        }
      }
    })
  }

  signIn(credentials: {email: string; password: string}) {
    return AuthService.supabase.auth.signInWithPassword(credentials)
  }

  async signOut() {
    await AuthService.supabase.auth.signOut()
    await this.router.navigateByUrl("/welcome", {replaceUrl: true})
  }

  static getSupabaseClient() {
    return AuthService.supabase
  }
}
