"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export type clerkWebhookUserData = {
  id: string;
  email_addresses: { email_address: string }[];
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
};

export type clerkWebhookDeleteData = {
  id: string;
};

export async function getUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    return user;
  } catch (error) {
    console.error("[getUser]", error);
    return null;
  }
}

export async function createOrUpdateUser(clerkUser: clerkWebhookUserData) {
  try {
    const email = clerkUser.email_addresses[0]?.email_address;
    const username = clerkUser.username ?? email?.split("@")[0] ?? clerkUser.id;
    const name =
      [clerkUser.first_name, clerkUser.last_name].filter(Boolean).join(" ") ||
      null;

    const user = await prisma.user.upsert({
      where: { clerkId: clerkUser.id },
      update: {
        email,
        username,
        name,
        image: clerkUser.image_url,
      },
      create: {
        clerkId: clerkUser.id,
        email,
        username,
        name,
        image: clerkUser.image_url,
      },
    });

    return user;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[createOrUpdateUser]", message);
    throw new Error(`Failed to create or update user: ${message}`);
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await prisma.user.delete({
      where: { clerkId },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[deleteUser]", message);
    throw new Error(`Failed to delete user: ${message}`);
  }
}
