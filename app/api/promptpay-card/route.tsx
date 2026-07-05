import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

// Read font files from local public/fonts directory
const getFontData = (fileName: string) => {
  const filePath = path.join(process.cwd(), "public", "fonts", fileName);
  return fs.readFileSync(filePath);
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const qr = searchParams.get("qr") || "";
  const amount = searchParams.get("amount") || "";
  const phone = searchParams.get("phone") || process.env.PROMPTPAY_ID || "0981466416";
  const name = searchParams.get("name") || process.env.PROMPTPAY_NAME || "นายประชา นาควังศาสตร์";

  // Format phone number to look like 098-146-6416
  const formattedPhone = phone.length === 10
    ? `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`
    : phone;

  // Render using JSX
  try {
    const fontRegular = getFontData("Prompt-Regular.ttf");
    const fontBold = getFontData("Prompt-Bold.ttf");

    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(qr)}`;

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "450px",
            height: "570px",
            backgroundColor: "#ffffff",
            position: "relative",
            fontFamily: "Prompt",
            border: "1px solid #e2e8f0",
            borderRadius: "24px",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          {/* Header Background */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "450px",
              height: "110px",
              backgroundColor: "#003D6D",
              position: "relative",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Thai QR Payment Logo Graphic */}
              <svg width="42" height="42" viewBox="0 0 100 100" fill="none" style={{ marginRight: "12px" }}>
                <rect width="100" height="100" rx="20" fill="#ffffff" />
                <rect x="20" y="20" width="60" height="60" rx="14" fill="#003D6D" />
                <rect x="42" y="28" width="16" height="44" rx="4" fill="#ffffff" />
                <rect x="28" y="42" width="44" height="16" rx="4" fill="#ffffff" />
                <rect x="46" y="32" width="8" height="36" fill="#003D6D" />
                <rect x="32" y="46" width="36" height="8" fill="#003D6D" />
                <circle cx="50" cy="50" r="10" fill="#ffffff" />
                <circle cx="50" cy="50" r="5" fill="#003D6D" />
              </svg>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ color: "#ffffff", fontSize: "20px", fontWeight: "bold", letterSpacing: "1px", lineHeight: "1.1" }}>THAI QR</span>
                <span style={{ color: "#ffffff", fontSize: "14px", fontWeight: "normal", letterSpacing: "2.5px", lineHeight: "1.1" }}>PAYMENT</span>
              </div>
            </div>
          </div>

          {/* Curved Wave SVG */}
          <svg width="450" height="25" viewBox="0 0 450 25" style={{ display: "flex", marginTop: "-1px" }}>
            <path d="M 0 0 L 450 0 L 450 10 Q 225 25 0 10 Z" fill="#003D6D" />
          </svg>

          {/* QR Code container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "290px",
              height: "290px",
              backgroundColor: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              position: "absolute",
              top: "95px",
              left: "80px",
              padding: "15px",
              boxSizing: "border-box",
            }}
          >
            <img
              src={qrImageUrl}
              width={260}
              height={260}
              alt="QR Code"
            />
          </div>

          {/* Details list */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "270px",
              width: "450px",
              padding: "0 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Phone Label */}
            <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "2px" }}>เบอร์โทรศัพท์พร้อมเพย์</div>
            {/* Phone Value */}
            <div style={{ color: "#0f172a", fontSize: "20px", fontWeight: "bold", marginBottom: "6px" }}>{formattedPhone}</div>

            {/* Name Label */}
            <div style={{ color: "#64748b", fontSize: "12px", marginBottom: "2px" }}>ชื่อบัญชี</div>
            {/* Name Value */}
            <div style={{ color: "#0f172a", fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>{name}</div>

            {/* Amount (only if valid) */}
            {amount && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ color: "#64748b", fontSize: "11px", marginBottom: "1px" }}>ยอดชำระเงิน (บาท)</div>
                <div style={{ color: "#0f766e", fontSize: "26px", fontWeight: "bold" }}>
                  {`฿ ${parseFloat(amount).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 450,
        height: 570,
        fonts: [
          {
            name: "Prompt",
            data: fontRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Prompt",
            data: fontBold,
            weight: 700,
            style: "normal",
          },
        ],
      }
    );
  } catch (error: any) {
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
