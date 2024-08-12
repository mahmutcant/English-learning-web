import NextAuth, { NextAuthOptions, Session, User as NextAuthUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

// Kullanıcı tipi tanımı
interface User extends NextAuthUser {
  id: string;
  name?: string | null;
}

// JWT token tipi tanımı
interface Token extends JWT {
  id: string;
  email: string;
  name?: string | null;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials?.email || "",
            credentials?.password || ""
          );
          
          if (userCredential.user) {
            return {
              id: userCredential.user.uid,
              email: userCredential.user.email,
              name: userCredential.user.displayName || null,
            };
          }
          return null;
        } catch (error) {
          console.error("Login failed:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user = {
          email: (token as Token).email,
          name: (token as Token).name || null,
        };
      }
      return session;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name || null;
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);