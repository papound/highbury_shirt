"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Ruler, CheckCircle, Calculator, Table as TableIcon } from "lucide-react";

interface SmartSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SizeRow {
  size: string;
  chestInch: number;
  chestCm: number;
  shoulderInch: number;
  lengthInch: number;
  sleeveInch: number;
  recommendedChestInch: string;
}

const SIZE_CHART: SizeRow[] = [
  { size: "S", chestInch: 38, chestCm: 96, shoulderInch: 17.0, lengthInch: 28.5, sleeveInch: 23.5, recommendedChestInch: "34 - 36" },
  { size: "M", chestInch: 40, chestCm: 101, shoulderInch: 17.5, lengthInch: 29.0, sleeveInch: 24.0, recommendedChestInch: "36 - 38" },
  { size: "L", chestInch: 42, chestCm: 106, shoulderInch: 18.0, lengthInch: 29.5, sleeveInch: 24.5, recommendedChestInch: "38 - 40" },
  { size: "XL", chestInch: 44, chestCm: 111, shoulderInch: 18.5, lengthInch: 30.0, sleeveInch: 25.0, recommendedChestInch: "40 - 42" },
  { size: "2XL", chestInch: 46, chestCm: 116, shoulderInch: 19.5, lengthInch: 30.5, sleeveInch: 25.5, recommendedChestInch: "42 - 44" },
  { size: "3XL", chestInch: 48, chestCm: 121, shoulderInch: 20.5, lengthInch: 31.0, sleeveInch: 26.0, recommendedChestInch: "44 - 46" },
  { size: "4XL", chestInch: 50, chestCm: 127, shoulderInch: 21.5, lengthInch: 31.5, sleeveInch: 26.5, recommendedChestInch: "46 - 48" },
];

export default function SmartSizeGuideModal({ isOpen, onClose }: SmartSizeGuideModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Calculator State
  const [calcMode, setCalcMode] = useState<"chest" | "height_weight">("chest");
  const [chestInput, setChestInput] = useState<number>(38);
  const [heightInput, setHeightInput] = useState<number>(172);
  const [weightInput, setWeightInput] = useState<number>(68);
  const [fitPreference, setFitPreference] = useState<"slim" | "regular">("regular");

  // Sync open state with native <dialog>
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  // Handle native cancel event (Esc key)
  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  // Close on backdrop click (light dismiss)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  // Calculate recommended size
  const calculateSize = (): { size: string; reason: string } => {
    let effectiveChest = chestInput;

    if (calcMode === "height_weight") {
      // Standard estimation based on height & weight
      const bmi = weightInput / ((heightInput / 100) * (heightInput / 100));
      if (weightInput < 60) effectiveChest = 35;
      else if (weightInput <= 67) effectiveChest = 37;
      else if (weightInput <= 74) effectiveChest = 39;
      else if (weightInput <= 82) effectiveChest = 41;
      else if (weightInput <= 90) effectiveChest = 43;
      else if (weightInput <= 98) effectiveChest = 45;
      else effectiveChest = 47;

      if (bmi > 26) effectiveChest += 1;
    }

    // Add ease for fit preference
    const targetAllowance = fitPreference === "slim" ? 2 : 4;
    const requiredShirtChest = effectiveChest + targetAllowance;

    // Find closest size matching required chest
    let matched = SIZE_CHART[0];
    for (const row of SIZE_CHART) {
      if (row.chestInch >= requiredShirtChest) {
        matched = row;
        break;
      }
      matched = row;
    }

    const fitLabel = fitPreference === "slim" ? "ทรงพอดีตัว (Slim Fit)" : "ทรงใส่สบาย (Regular Fit)";
    return {
      size: matched.size,
      reason: `เหมาะสำหรับ${fitLabel} รอบอกเสื้อ ${matched.chestInch} นิ้ว (สำหรับรอบอกจริงประมาณ ${matched.recommendedChestInch} นิ้ว)`,
    };
  };

  const recommendation = calculateSize();

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      className="v3-dialog w-[92vw] max-w-3xl rounded-2xl border border-border bg-background p-0 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm text-foreground overflow-hidden"
      aria-labelledby="size-guide-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-slate-50 dark:bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h2 id="size-guide-title" className="text-base font-bold text-foreground">
              Smart Size Finder & ตารางไซส์เสื้อเชิ้ต
            </h2>
            <p className="text-xs text-muted-foreground">
              คำนวณและเลือกขนาดที่เหมาะกับสรีระคุณได้อย่างแม่นยำ
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        {/* Mode Selector */}
        <div className="flex border-b border-border/80 pb-3 gap-3">
          <button
            type="button"
            onClick={() => setCalcMode("chest")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              calcMode === "chest"
                ? "bg-[#0A2540] text-white dark:bg-blue-600"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>คำนวณจากรอบอกจริง</span>
          </button>
          <button
            type="button"
            onClick={() => setCalcMode("height_weight")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              calcMode === "height_weight"
                ? "bg-[#0A2540] text-white dark:bg-blue-600"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>คำนวณจากส่วนสูงและน้ำหนัก</span>
          </button>
        </div>

        {/* Calculator Form */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-border/80">
          {calcMode === "chest" ? (
            <div className="space-y-1.5">
              <label htmlFor="chest-input" className="text-xs font-semibold text-foreground">
                รอบอกจริงของคุณ (นิ้ว)
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="chest-input"
                  type="range"
                  min="32"
                  max="48"
                  step="0.5"
                  value={chestInput}
                  onChange={(e) => setChestInput(parseFloat(e.target.value))}
                  className="flex-1 accent-blue-600 cursor-pointer"
                />
                <span className="text-sm font-bold text-foreground min-w-[50px] text-right">
                  {chestInput}&quot;
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                วัดแนบอกช่วงที่กว้างที่สุดโดยไม่รัดแน่นจนเกินไป
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:col-span-1">
              <div>
                <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                  <span>ส่วนสูง (cm)</span>
                  <span>{heightInput} cm</span>
                </div>
                <input
                  type="range"
                  min="155"
                  max="195"
                  value={heightInput}
                  onChange={(e) => setHeightInput(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-foreground mb-1">
                  <span>น้ำหนัก (kg)</span>
                  <span>{weightInput} kg</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="115"
                  value={weightInput}
                  onChange={(e) => setWeightInput(parseInt(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Fit Preference */}
          <div className="space-y-2 flex flex-col justify-center">
            <span className="text-xs font-semibold text-foreground">ความกระชับที่ชอบ:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFitPreference("regular")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-center ${
                  fitPreference === "regular"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold"
                    : "border-border hover:bg-muted text-foreground"
                }`}
              >
                ใส่สบาย (Regular Fit)
              </button>
              <button
                type="button"
                onClick={() => setFitPreference("slim")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-center ${
                  fitPreference === "slim"
                    ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold"
                    : "border-border hover:bg-muted text-foreground"
                }`}
              >
                พอดีตัว (Slim Fit)
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Box */}
        <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
              {recommendation.size}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                  ไซส์แนะนำสำหรับคุณ
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {recommendation.reason}
              </p>
            </div>
          </div>

          <Link
            href="/products"
            onClick={onClose}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#0A2540] dark:bg-blue-600 text-white text-xs font-semibold hover:bg-[#16385e] transition-colors shrink-0"
          >
            เลือกสินค้า
          </Link>
        </div>

        {/* Full Size Chart Table */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <TableIcon className="w-3.5 h-3.5 text-muted-foreground" />
            <span>ตารางขนาดมาตรฐาน Highbury (นิ้ว)</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/70 text-foreground font-semibold border-b border-border">
                <tr>
                  <th className="py-2.5 px-3">ไซส์</th>
                  <th className="py-2.5 px-3">รอบอกเสื้อ</th>
                  <th className="py-2.5 px-3">ไหล่กว้าง</th>
                  <th className="py-2.5 px-3">ความยาวเสื้อ</th>
                  <th className="py-2.5 px-3">แขนยาว</th>
                  <th className="py-2.5 px-3">รอบอกจริงที่แนะนำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {SIZE_CHART.map((row) => {
                  const isCurrent = row.size === recommendation.size;
                  return (
                    <tr
                      key={row.size}
                      className={
                        isCurrent
                          ? "bg-blue-50/70 dark:bg-blue-950/40 font-semibold text-blue-900 dark:text-blue-200"
                          : "hover:bg-muted/30"
                      }
                    >
                      <td className="py-2 px-3 font-bold">
                        <span className="inline-flex items-center gap-1.5">
                          {row.size}
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-blue-600 text-white rounded">
                              แนะนำ
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2 px-3">{row.chestInch}&quot;</td>
                      <td className="py-2 px-3">{row.shoulderInch}&quot;</td>
                      <td className="py-2 px-3">{row.lengthInch}&quot;</td>
                      <td className="py-2 px-3">{row.sleeveInch}&quot;</td>
                      <td className="py-2 px-3 text-muted-foreground">
                        {row.recommendedChestInch}&quot;
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-6 py-3 border-t border-border/80 bg-slate-50 dark:bg-slate-900/60 text-xs">
        <span className="text-muted-foreground">
          หากไม่แน่ใจเรื่องไซส์ สามารถปรึกษาแอดมินผ่าน LINE OA ได้ตลอดเวลา
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg border border-border bg-card hover:bg-muted font-semibold text-foreground transition-colors cursor-pointer"
        >
          ปิด
        </button>
      </div>
    </dialog>
  );
}
