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

  const handleCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  const calculateSize = (): { size: string; reason: string } => {
    let effectiveChest = chestInput;

    if (calcMode === "height_weight") {
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

    const targetAllowance = fitPreference === "slim" ? 2 : 4;
    const requiredShirtChest = effectiveChest + targetAllowance;

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
      className="v3-dialog w-[92vw] max-w-3xl rounded-xl border border-[#E7E5E4] bg-white p-0 text-[#0F172B] overflow-hidden"
      aria-labelledby="size-guide-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E4] bg-[#F9FAFB]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#E7E5E4] text-[#163666] flex items-center justify-center">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h2 id="size-guide-title" className="text-base font-bold text-[#0F172B]">
              คำนวณและดูตารางไซส์เสื้อเชิ้ต Highbury
            </h2>
            <p className="text-xs text-[#79716B]">
              คำนวณขนาดที่เหมาะกับสรีระคุณได้อย่างแม่นยำ
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-lg border border-[#E7E5E4] hover:bg-white text-[#79716B] hover:text-[#0F172B] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
        {/* Mode Selector */}
        <div className="flex border-b border-[#E7E5E4] pb-3 gap-3">
          <button
            type="button"
            onClick={() => setCalcMode("chest")}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              calcMode === "chest"
                ? "bg-[#163666] text-white"
                : "bg-[#F9FAFB] text-[#79716B] hover:text-[#0F172B]"
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
                ? "bg-[#163666] text-white"
                : "bg-[#F9FAFB] text-[#79716B] hover:text-[#0F172B]"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>คำนวณจากส่วนสูงและน้ำหนัก</span>
          </button>
        </div>

        {/* Calculator Form */}
        <div className="grid sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#F9FAFB] border border-[#E7E5E4]">
          {calcMode === "chest" ? (
            <div className="space-y-1.5">
              <label htmlFor="chest-input" className="text-xs font-semibold text-[#0F172B]">
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
                  className="flex-1 accent-[#163666] cursor-pointer"
                />
                <span className="text-sm font-bold text-[#0F172B] min-w-[50px] text-right">
                  {chestInput}&quot;
                </span>
              </div>
              <p className="text-[11px] text-[#79716B]">
                วัดแนบอกช่วงที่กว้างที่สุดโดยไม่รัดแน่นจนเกินไป
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:col-span-1">
              <div>
                <div className="flex justify-between text-xs font-semibold text-[#0F172B] mb-1">
                  <span>ส่วนสูง (cm)</span>
                  <span>{heightInput} cm</span>
                </div>
                <input
                  type="range"
                  min="155"
                  max="195"
                  value={heightInput}
                  onChange={(e) => setHeightInput(parseInt(e.target.value))}
                  className="w-full accent-[#163666] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-[#0F172B] mb-1">
                  <span>น้ำหนัก (kg)</span>
                  <span>{weightInput} kg</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="115"
                  value={weightInput}
                  onChange={(e) => setWeightInput(parseInt(e.target.value))}
                  className="w-full accent-[#163666] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Fit Preference */}
          <div className="space-y-2 flex flex-col justify-center">
            <span className="text-xs font-semibold text-[#0F172B]">ความกระชับที่ชอบ:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFitPreference("regular")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-center ${
                  fitPreference === "regular"
                    ? "border-[#163666] bg-white text-[#163666] font-semibold"
                    : "border-[#E7E5E4] hover:bg-white text-[#79716B]"
                }`}
              >
                ใส่สบาย (Regular Fit)
              </button>
              <button
                type="button"
                onClick={() => setFitPreference("slim")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-center ${
                  fitPreference === "slim"
                    ? "border-[#163666] bg-white text-[#163666] font-semibold"
                    : "border-[#E7E5E4] hover:bg-white text-[#79716B]"
                }`}
              >
                พอดีตัว (Slim Fit)
              </button>
            </div>
          </div>
        </div>

        {/* Recommendation Box */}
        <div className="p-4 rounded-xl bg-white border border-[#E7E5E4] flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#163666] text-white font-bold text-lg flex items-center justify-center shrink-0">
              {recommendation.size}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#163666]">
                  ไซส์แนะนำสำหรับคุณ
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-[#163666]" />
              </div>
              <p className="text-xs text-[#79716B] mt-0.5">
                {recommendation.reason}
              </p>
            </div>
          </div>

          <Link
            href="/products"
            onClick={onClose}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#163666] text-white text-xs font-semibold hover:bg-[#0A2B5E] transition-colors shrink-0"
          >
            เลือกดูสินค้า
          </Link>
        </div>

        {/* Full Size Chart Table */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-[#0F172B]">
            <TableIcon className="w-3.5 h-3.5 text-[#79716B]" />
            <span>ตารางขนาดมาตรฐาน Highbury (นิ้ว)</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#E7E5E4]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#F9FAFB] text-[#0F172B] font-semibold border-b border-[#E7E5E4]">
                <tr>
                  <th className="py-2.5 px-3">ไซส์</th>
                  <th className="py-2.5 px-3">รอบอกเสื้อ</th>
                  <th className="py-2.5 px-3">ไหล่กว้าง</th>
                  <th className="py-2.5 px-3">ความยาวเสื้อ</th>
                  <th className="py-2.5 px-3">แขนยาว</th>
                  <th className="py-2.5 px-3">รอบอกจริงที่แนะนำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4]">
                {SIZE_CHART.map((row) => {
                  const isCurrent = row.size === recommendation.size;
                  return (
                    <tr
                      key={row.size}
                      className={
                        isCurrent
                          ? "bg-[#F9FAFB] font-semibold text-[#163666]"
                          : "hover:bg-[#F9FAFB]/50"
                      }
                    >
                      <td className="py-2 px-3 font-bold">
                        <span className="inline-flex items-center gap-1.5">
                          {row.size}
                          {isCurrent && (
                            <span className="text-[10px] px-1.5 py-0.2 bg-[#163666] text-white rounded">
                              แนะนำ
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2 px-3">{row.chestInch}&quot;</td>
                      <td className="py-2 px-3">{row.shoulderInch}&quot;</td>
                      <td className="py-2 px-3">{row.lengthInch}&quot;</td>
                      <td className="py-2 px-3">{row.sleeveInch}&quot;</td>
                      <td className="py-2 px-3 text-[#79716B]">
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
      <div className="flex items-center justify-between px-6 py-3 border-t border-[#E7E5E4] bg-[#F9FAFB] text-xs">
        <span className="text-[#79716B]">
          หากไม่แน่ใจเรื่องขนาด สามารถปรึกษาทีมงานผ่าน LINE Official ได้ตลอดเวลา
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded-lg border border-[#E7E5E4] bg-white hover:bg-[#F9FAFB] font-semibold text-[#0F172B] transition-colors cursor-pointer"
        >
          ปิด
        </button>
      </div>
    </dialog>
  );
}
