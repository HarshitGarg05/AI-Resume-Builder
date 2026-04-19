import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID?.trim(),
      clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim(),
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID?.trim(),
      clientSecret: process.env.GITHUB_SECRET?.trim(),
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async session({ session, token, user }) {
        return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};
