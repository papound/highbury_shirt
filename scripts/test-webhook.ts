import crypto from "crypto";

// โหลดข้อมูลความลับแบบจำลองให้ตรงกับที่สร้างไว้ใน .env.local
const LINE_CHANNEL_SECRET = "PLACEHOLDER_LINE_CHANNEL_SECRET";

async function main() {
  console.log("=== Testing LINE Webhook Endpoint ===");

  const payload = JSON.stringify({
    destination: "U1234567890abcdef1234567890abc",
    events: [
      {
        type: "message",
        message: {
          type: "text",
          id: "325708",
          text: "สวัสดีครับ มีเสื้อเชิ้ตแนะนำไหมครับ"
        },
        timestamp: 1462629479859,
        source: {
          type: "user",
          userId: "U1234567890abcdef1234567890abcdef"
        },
        replyToken: "nH7w3O5g5a"
      }
    ]
  });

  const signature = crypto
    .createHmac("sha256", LINE_CHANNEL_SECRET)
    .update(payload)
    .digest("base64");

  console.log("Sending simulated webhook request (requiring next dev running on port 3000)...");
  
  try {
    const res = await fetch("http://localhost:3000/api/line/webhook", {
      method: "POST",
      headers: {
        "x-line-signature": signature,
        "Content-Type": "application/json"
      },
      body: payload
    });

    console.log(`Response Status: ${res.status}`);
    const text = await res.text();
    console.log("Response Body:", text);
  } catch (err: any) {
    console.log("Could not reach webhook server (ensure Next.js dev server is running on port 3000). Error:", err.message);
  }
}

main();
