// Sources for this code:
// https://supabase.com/blog/building-a-realtime-trello-board-with-supabase-and-angular


import {Injectable} from "@angular/core"
import {createClient, SupabaseClient, User} from "@supabase/supabase-js"
import {environment} from "../../environments/environment"
import {BehaviorSubject, Observable} from "rxjs"
import {Router} from "@angular/router"
import {Users} from '../models/users.model';
import {Restaurant} from "../models/restaurant.model";

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

  async getUser(user_id: string): Promise<Users> {
    const { data, error } = await AuthService.supabase
      .from('users')
      .select('*')
      .eq('id', user_id)
      .single();
    if (error) throw error;
    return data as Users;
  }

  getCurrentUserId() {
    if (this.currentUser.value) {
      return (this.currentUser.value as User).id
    } else {
      return null
    }
  }

  async signUp(credentials: { firstName: string, lastName: string, email: string, phone: string | undefined, password: string }) {
    const { data, error } = await AuthService.supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: {
          firstName: credentials.firstName,
          lastName: credentials.lastName,
        }
      }
    });

    const user = data.user;

    if (user) {
      // Insert user details into the `users` table
      const { error: insertError } = await AuthService.supabase
        .from('users')
        .insert([{
          id: user.id,
          email: user.email,
          phone: credentials.phone,
          name: `${credentials.firstName} ${credentials.lastName}`
        }]);

      if (insertError) {
        throw insertError;
      }
    }

    return { user, error };
  }

  signIn(credentials: {email: string; password: string}) {
    return AuthService.supabase.auth.signInWithPassword(credentials)
  }

  async signOut() {
    await AuthService.supabase.auth.signOut()
    await this.router.navigateByUrl("/login", {replaceUrl: true})
  }

  static getSupabaseClient() {
    return AuthService.supabase
  }
}
