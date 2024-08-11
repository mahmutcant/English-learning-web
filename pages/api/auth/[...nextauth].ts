import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import NextAuth from "next-auth/next";
import CredentialProvider from "next-auth/providers/credentials";
export const authOptions = {
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials): Promise<any> {
        return await signInWithEmailAndPassword(
          auth,
          (credentials as any).email || "",
          (credentials as any).password || ""
        )
          .then((userCredential) => {
            if (userCredential.user) {
              return userCredential.user;
            }
            return null;
          })
      },
    }),
  ],
};
export default NextAuth(authOptions);
