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
      className="v3-dialog w-[92vw] max-w-3xl rounded-2xl border border-[#262830] bg-[#0E1015] p-0 text-white overflow-hidden shadow-2xl backdrop:bg-black/80"
      aria-labelledby="size-guide-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#262830] bg-[#13161D]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10">
            <Ruler className="w-4 h-4 text-[#FFB900]" />
          </div>
          <div>
            <h2 id="size-guide-title" className="text-base font-semibold text-white tracking-tight">
              คำนวณและดูตารางไซส์เสื้อเชิ้ต Highbury
            </h2>
            <p className="text-xs text-[#9496A1]">
              คำนวณขนาดที่เหมาะกับสรีระคุณได้อย่างแม่นยำ
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full border border-[#262830] bg-white/5 hover:bg-white/10 text-[#9496A1] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body Content */}
      <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-[#0E1015] text-white">
        {/* Mode Selector */}
        <div className="flex border-b border-[#262830] pb-4 gap-2">
          <button
            type="button"
            onClick={() => setCalcMode("chest")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              calcMode === "chest"
                ? "bg-white text-[#07080B] shadow-sm"
                : "bg-[#13161D] text-[#9496A1] hover:text-white border border-[#262830]"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>คำนวณจากรอบอกจริง</span>
          </button>
          <button
            type="button"
            onClick={() => setCalcMode("height_weight")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              calcMode === "height_weight"
                ? "bg-white text-[#07080B] shadow-sm"
                : "bg-[#13161D] text-[#9496A1] hover:text-white border border-[#262830]"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>คำนวณจากส่วนสูงและน้ำหนัก</span>
          </button>
        </div>

        {/* Calculator Form */}
        <div className="grid sm:grid-cols-2 gap-4 p-5 rounded-xl bg-[#13161D] border border-[#262830]">
          {calcMode === "chest" ? (
            <div className="space-y-2">
              <label htmlFor="chest-input" className="text-xs font-medium text-white">
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
                  className="flex-1 accent-[#FFB900] cursor-pointer"
                />
                <span className="font-mono text-base font-bold text-white min-w-[55px] text-right">
                  {chestInput}&quot;
                </span>
              </div>
              <p className="text-[11px] text-[#9496A1]">
                วัดแนบอกช่วงที่กว้างที่สุดโดยไม่รัดแน่นจนเกินไป
              </p>
            </div>
          ) : (
            <div className="space-y-3 sm:col-span-1">
              <div>
                <div className="flex justify-between text-xs font-medium text-white mb-1">
                  <span>ส่วนสูง (cm)</span>
                  <span className="font-mono font-bold text-white">{heightInput} cm</span>
                </div>
                <input
                  type="range"
                  min="155"
                  max="195"
                  value={heightInput}
                  onChange={(e) => setHeightInput(parseInt(e.target.value))}
                  className="w-full accent-[#FFB900] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-white mb-1">
                  <span>น้ำหนัก (kg)</span>
                  <span className="font-mono font-bold text-white">{weightInput} kg</span>
                </div>
                <input
                  type="range"
                  min="45"
                  max="115"
                  value={weightInput}
                  onChange={(e) => setWeightInput(parseInt(e.target.value))}
                  className="w-full accent-[#FFB900] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Fit Preference */}
          <div className="space-y-2 flex flex-col justify-center">
            <span className="text-xs font-medium text-white">ความกระชับที่ชอบ:</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFitPreference("regular")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-center ${
                  fitPreference === "regular"
                    ? "border-white bg-white text-[#07080B] font-semibold"
                    : "border-[#262830] bg-[#181B24] text-[#9496A1] hover:text-white"
                }`}
              >
                ใส่สบาย (Regular Fit)
              </button>
              <button
                type="button"
                onClick={() => setFitPreference("slim")}
                className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors cursor-pointer text-center ${
                  fitPreference === "slim"
                    ? "border-white bg-white text-[#07080B] font-semibold"
                    : "border-[#262830] bg-[#181B24] text-[#9496A1] hover:text-white"
                }`}
              >
                พอดีตัว (Slim Fit)
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Recommendation Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13161D] border border-[#262830] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-white text-[#07080B] font-bold text-xl flex items-center justify-center shrink-0 shadow-md">
              {recommendation.size}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-[#FFB900]">
                  ไซส์แนะนำสำหรับคุณ
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-[#FFB900]" />
              </div>
              <p className="text-xs text-[#E7E7E7] mt-0.5">
                {recommendation.reason}
              </p>
            </div>
          </div>

          <Link
            href="/products"
            onClick={onClose}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white text-[#07080B] text-xs font-semibold hover:bg-white/90 transition-colors shrink-0 shadow-sm"
          >
            เลือกดูสินค้า
          </Link>
        </div>

        {/* Full Size Chart Table */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <TableIcon className="w-3.5 h-3.5 text-[#FFB900]" />
            <span>ตารางขนาดมาตรฐาน Highbury (นิ้ว)</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#262830] bg-[#13161D]">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181B24] text-[#E7E7E7] font-semibold border-b border-[#262830]">
                <tr>
                  <th className="py-2.5 px-3">ไซส์</th>
                  <th className="py-2.5 px-3">รอบอกเสื้อ</th>
                  <th className="py-2.5 px-3">ไหล่กว้าง</th>
                  <th className="py-2.5 px-3">ความยาวเสื้อ</th>
                  <th className="py-2.5 px-3">แขนยาว</th>
                  <th className="py-2.5 px-3">รอบอกจริงที่แนะนำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262830]">
                {SIZE_CHART.map((row) => {
                  const isCurrent = row.size === recommendation.size;
                  return (
                    <tr
                      key={row.size}
                      className={
                        isCurrent
                          ? "bg-white/10 font-semibold text-white"
                          : "text-[#E7E7E7] hover:bg-white/5 transition-colors"
                      }
                    >
                      <td className="py-2.5 px-3 font-bold">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-mono text-sm">{row.size}</span>
                          {isCurrent && (
                            <span className="text-[10px] px-2 py-0.5 bg-[#FFB900] text-[#07080B] font-bold rounded-full">
                              แนะนำ
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-white">{row.chestInch}&quot;</td>
                      <td className="py-2.5 px-3 font-mono text-white">{row.shoulderInch}&quot;</td>
                      <td className="py-2.5 px-3 font-mono text-white">{row.lengthInch}&quot;</td>
                      <td className="py-2.5 px-3 font-mono text-white">{row.sleeveInch}&quot;</td>
                      <td className="py-2.5 px-3 font-mono text-[#9496A1]">
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
      <div className="flex items-center justify-between px-6 py-4 border-t border-[#262830] bg-[#13161D] text-xs text-[#9496A1]">
        <span>
          หากไม่แน่ใจเรื่องขนาด สามารถปรึกษาทีมงานผ่าน{" "}
          <Link
            href="https://lin.ee/T8tlget"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FFB900] font-medium underline hover:text-white transition-colors"
          >
            LINE Official
          </Link>{" "}
          ได้ตลอดเวลา
        </span>
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 rounded-full border border-[#262830] bg-white/5 hover:bg-white/10 text-white font-medium transition-colors cursor-pointer"
        >
          ปิด
        </button>
      </div>
    </dialog>
  );
}
