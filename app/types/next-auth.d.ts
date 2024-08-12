import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    discordId: string;
    pseudo: string;
    lastTimePull: number | null;
    lastTimeSummon: number | null;
  }

  interface Session {
    user: User;
  }
}
