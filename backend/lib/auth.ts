import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import bcrypt from "bcryptjs";
import User from "@/models/Users";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found");
          }
          const isPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordMatch) {
            throw new Error("Password not matched");
          }
          return {
            id: user._id.toString(),
            email: user.email,
          };
        } catch (error) {
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string;
      return session;
    },
  },
  // pages:{
  //   signIn:'/auth/signin',
  //   // error:'/login',
  // },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24*60*60
  },
  secret: process.env.NEXTAUTH_SECRET
};
