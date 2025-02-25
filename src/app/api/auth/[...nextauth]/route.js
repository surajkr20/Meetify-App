import dbConnect from "@/lib/dbConntect";
import User from "@/models/User";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

// Ensure database connection at the start
dbConnect();

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async signIn({ user, account, profile }) {
      await dbConnect();

      let email = profile.email; // Default email

      // If email is missing (common for GitHub), fetch it manually
      if (!email && account.provider === "github") {
        const res = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `token ${account.access_token}`,
          },
        });
        const emails = await res.json();
        if (emails.length > 0) {
          email = emails.find((email) => email.primary)?.email || emails[0].email;
        }
      }

      if (!email) {
        throw new Error("Email is required but was not provided by the provider.");
      }

      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        dbUser = await User.create({
          name: profile.name || "GitHub User",
          email: email,
          profilePicture: profile.picture || "",
          isVerified: profile.email_verified ?? true, // GitHub doesn't provide `email_verified`
        });
      }

      user.id = dbUser._id.toString(); // Assign to `token.id` later
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 90 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/user-auth",
  },
};

const handle = NextAuth(authOptions);
export { handle as POST, handle as GET };
