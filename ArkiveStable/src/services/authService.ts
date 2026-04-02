export type GoogleAuthUser = {
  email: string;
  name?: string;
};

/**
 * Google login (stub).
 * Replace this with your preferred Google Sign-In + Firebase Auth flow.
 */
export async function signInWithGoogle(): Promise<GoogleAuthUser> {
  // Placeholder: mimic a successful login
  return Promise.resolve({
    email: 'admin@gmail.com',
    name: 'Admin',
  });
}
