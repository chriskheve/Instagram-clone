import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import {
  createOrUpdateUser,
  deleteUser,
  type clerkWebhookUserData,
  type clerkWebhookDeleteData,
} from "@/server/actions/user.actions";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    switch (evt.type) {
      case "user.created":
      case "user.updated":
        await createOrUpdateUser(evt.data as clerkWebhookUserData);
        break;
      case "user.deleted":
        if (evt.data.id) {
          await deleteUser((evt.data as clerkWebhookDeleteData).id);
        }
        break;
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
