'use server'

import { signOut as authSignOut, signIn } from '@/server/auth'

export async function signOutAction() {
  return await authSignOut()
}
export async function signInGoogleAction() {
  return await signIn('google', {
    redirectTo: '/',
  })
}