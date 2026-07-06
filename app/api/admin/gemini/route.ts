import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ADMIN_ROLES = ["SUPERADMIN", "ADMIN"];

async function authorize() {
  const session = await auth();
  if (!session?.user?.role || !ADMIN_ROLES.includes(session.user.role)) return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const keys = [
      "gemini_model_name",
      "gemini_budget_limit",
      "gemini_total_input_tokens",
      "gemini_total_output_tokens",
      "gemini_total_calls",
      "gemini_total_cost",
      "gemini_credit_balance",
    ];

    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: keys } },
    });

    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    // สกัดข้อมูลและแปลงชนิดข้อมูล
    const model = settingsMap["gemini_model_name"] || "gemini-2.5-flash";
    const budgetLimit = parseFloat(settingsMap["gemini_budget_limit"] || "500.00");
    const creditBalance = parseFloat(settingsMap["gemini_credit_balance"] || "500.00");
    const totalInputTokens = parseInt(settingsMap["gemini_total_input_tokens"] || "0", 10);
    const totalOutputTokens = parseInt(settingsMap["gemini_total_output_tokens"] || "0", 10);
    const totalCalls = parseInt(settingsMap["gemini_total_calls"] || "0", 10);
    const totalCost = parseFloat(settingsMap["gemini_total_cost"] || "0.0");

    // ตรวจสอบการเชื่อมต่อ API ของ Gemini จริงๆ
    const apiKey = process.env.GEMINI_API_KEY || "";
    let status = "CONNECTED";
    if (!apiKey) {
      status = "MISSING_KEY";
    } else {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const testModel = genAI.getGenerativeModel({ model: model });
        await testModel.countTokens("ping");
      } catch (err: any) {
        console.error("[Gemini Connection Test Error]:", err);
        status = "ERROR";
      }
    }

    return NextResponse.json({
      model,
      status,
      totalCalls,
      inputTokens: totalInputTokens,
      outputTokens: totalOutputTokens,
      totalTokens: totalInputTokens + totalOutputTokens,
      totalCost: parseFloat(totalCost.toFixed(4)),
      budgetLimit,
      creditBalance: parseFloat(creditBalance.toFixed(2)),
      remainingBudget: parseFloat(creditBalance.toFixed(2)), // แมปคีย์เพื่อให้เข้ากันได้ง่าย
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await authorize())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { action, modelName, budgetLimit, creditBalance } = body;

    if (action === "reset") {
      // ดึงลิมิตมาเป็นค่าตั้งต้นของเครดิต
      const budgetSetting = await prisma.siteSetting.findUnique({
        where: { key: "gemini_budget_limit" }
      });
      const currentLimit = budgetSetting?.value || "500.00";

      // รีเซ็ตสถิติและซิงค์ยอดเงินคงเหลือให้เท่ากับ Prepay Limit
      await Promise.all([
        prisma.siteSetting.upsert({
          where: { key: "gemini_total_input_tokens" },
          update: { value: "0" },
          create: { key: "gemini_total_input_tokens", value: "0" },
        }),
        prisma.siteSetting.upsert({
          where: { key: "gemini_total_output_tokens" },
          update: { value: "0" },
          create: { key: "gemini_total_output_tokens", value: "0" },
        }),
        prisma.siteSetting.upsert({
          where: { key: "gemini_total_calls" },
          update: { value: "0" },
          create: { key: "gemini_total_calls", value: "0" },
        }),
        prisma.siteSetting.upsert({
          where: { key: "gemini_total_cost" },
          update: { value: "0.0" },
          create: { key: "gemini_total_cost", value: "0.0" },
        }),
        prisma.siteSetting.upsert({
          where: { key: "gemini_credit_balance" },
          update: { value: currentLimit },
          create: { key: "gemini_credit_balance", value: currentLimit },
        }),
      ]);
      return NextResponse.json({ success: true, message: "Reset usage statistics and credit balance successfully" });
    }

    const updates: Promise<any>[] = [];

    if (modelName) {
      updates.push(
        prisma.siteSetting.upsert({
          where: { key: "gemini_model_name" },
          update: { value: modelName },
          create: { key: "gemini_model_name", value: modelName },
        })
      );
    }

    if (budgetLimit !== undefined) {
      const parsedLimit = parseFloat(String(budgetLimit));
      if (isNaN(parsedLimit) || parsedLimit < 0) {
        return NextResponse.json({ error: "Invalid budget limit value" }, { status: 400 });
      }
      updates.push(
        prisma.siteSetting.upsert({
          where: { key: "gemini_budget_limit" },
          update: { value: parsedLimit.toFixed(2) },
          create: { key: "gemini_budget_limit", value: parsedLimit.toFixed(2) },
        })
      );
    }

    if (creditBalance !== undefined) {
      const parsedCredit = parseFloat(String(creditBalance));
      if (isNaN(parsedCredit) || parsedCredit < 0) {
        return NextResponse.json({ error: "Invalid credit balance value" }, { status: 400 });
      }
      updates.push(
        prisma.siteSetting.upsert({
          where: { key: "gemini_credit_balance" },
          update: { value: parsedCredit.toFixed(2) },
          create: { key: "gemini_credit_balance", value: parsedCredit.toFixed(2) },
        })
      );
    }

    if (updates.length > 0) {
      await Promise.all(updates);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
