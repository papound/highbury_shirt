import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function POST(req: NextRequest) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    promptpayId,
    promptpayName,
    botCustomPrompt,
    botWelcomeMessage,
    botPausedMessage,
    botFallbackMessage,
  } = body;

  const updates: Promise<any>[] = [];

  if (promptpayId !== undefined) {
    updates.push(
      prisma.siteSetting.upsert({
        where: { key: "promptpay_id" },
        update: { value: String(promptpayId) },
        create: { key: "promptpay_id", value: String(promptpayId) },
      })
    );
  }

  if (promptpayName !== undefined) {
    updates.push(
      prisma.siteSetting.upsert({
        where: { key: "promptpay_name" },
        update: { value: String(promptpayName) },
        create: { key: "promptpay_name", value: String(promptpayName) },
      })
    );
  }

  if (botCustomPrompt !== undefined) {
    updates.push(
      prisma.siteSetting.upsert({
        where: { key: "bot_custom_prompt" },
        update: { value: String(botCustomPrompt) },
        create: { key: "bot_custom_prompt", value: String(botCustomPrompt) },
      })
    );
  }

  if (botWelcomeMessage !== undefined) {
    updates.push(
      prisma.siteSetting.upsert({
        where: { key: "bot_welcome_message" },
        update: { value: String(botWelcomeMessage) },
        create: { key: "bot_welcome_message", value: String(botWelcomeMessage) },
      })
    );
  }

  if (botPausedMessage !== undefined) {
    updates.push(
      prisma.siteSetting.upsert({
        where: { key: "bot_paused_message" },
        update: { value: String(botPausedMessage) },
        create: { key: "bot_paused_message", value: String(botPausedMessage) },
      })
    );
  }

  if (botFallbackMessage !== undefined) {
    updates.push(
      prisma.siteSetting.upsert({
        where: { key: "bot_fallback_message" },
        update: { value: String(botFallbackMessage) },
        create: { key: "bot_fallback_message", value: String(botFallbackMessage) },
      })
    );
  }

  if (updates.length > 0) {
    await Promise.all(updates);
  }

  return NextResponse.json({ success: true });
}
