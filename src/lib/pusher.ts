import Pusher from "pusher";
import PusherClient from "pusher-js";

export function isPusherServerConfigured(): boolean {
  return !!(
    process.env.PUSHER_APP_ID?.trim() &&
    process.env.PUSHER_KEY?.trim() &&
    process.env.PUSHER_SECRET?.trim()
  );
}

export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID || "",
  key: process.env.PUSHER_KEY || "",
  secret: process.env.PUSHER_SECRET || "",
  cluster: process.env.PUSHER_CLUSTER || "ap2",
  useTLS: true,
});

export const pusherClient =
  typeof window !== "undefined"
    ? new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY || "", {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "ap2",
      })
    : null;
