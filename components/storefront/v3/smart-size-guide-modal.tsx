"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { X, Ruler, CheckCircle, Calculator, Table as TableIcon, User, Shirt } from "lucide-react";

interface SmartSizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light";
}

export type Gender = "men" | "women";
export type SleeveType = "long" | "short" | "threeQuarter";

export interface HighburySizeRow {
  size: string;
  chestInch: number;
  lengthInch: number;
  sleeveInch: string | number;
  neckInch: number;
  shoulderInch: number;
  recommendedChestInch: string;
}

// 1. เสื้อเชิ้ตผู้ชายแขนยาว (Men Long Sleeve)
const MEN_LONG_SLEEVE: HighburySizeRow[] = [
  { size: "S", chestInch: 40, lengthInch: 28.5, sleeveInch: 23.5, neckInch: 15.5, shoulderInch: 17, recommendedChestInch: "35 - 37" },
  { size: "M", chestInch: 41.5, lengthInch: 29, sleeveInch: 24.5, neckInch: 16, shoulderInch: 17.5, recommendedChestInch: "37 - 38.5" },
  { size: "L", chestInch: 43, lengthInch: 30, sleeveInch: 25, neckInch: 16.5, shoulderInch: 18, recommendedChestInch: "38.5 - 40" },
  { size: "XL", chestInch: 44.5, lengthInch: 30.25, sleeveInch: 25, neckInch: 17, shoulderInch: 18.5, recommendedChestInch: "40 - 41.5" },
  { size: "2XL", chestInch: 46.5, lengthInch: 30.5, sleeveInch: 25.25, neckInch: 17.5, shoulderInch: 19, recommendedChestInch: "42 - 43.5" },
  { size: "3XL", chestInch: 49, lengthInch: 31.5, sleeveInch: 25.25, neckInch: 18, shoulderInch: 20, recommendedChestInch: "44 - 46" },
  { size: "4XL", chestInch: 50.5, lengthInch: 32, sleeveInch: 25.5, neckInch: 18.5, shoulderInch: 20.5, recommendedChestInch: "46 - 47.5" },
  { size: "5XL", chestInch: 52.5, lengthInch: 32.5, sleeveInch: 25.5, neckInch: 18.5, shoulderInch: 21, recommendedChestInch: "48 - 50" },
];

// 2. เสื้อเชิ้ตผู้ชายแขนสั้น (Men Short Sleeve)
const MEN_SHORT_SLEEVE: HighburySizeRow[] = [
  { size: "S", chestInch: 40, lengthInch: 28.5, sleeveInch: 8, neckInch: 15.5, shoulderInch: 17, recommendedChestInch: "35 - 37" },
  { size: "M", chestInch: 41.5, lengthInch: 29, sleeveInch: 8.5, neckInch: 16, shoulderInch: 17.5, recommendedChestInch: "37 - 38.5" },
  { size: "L", chestInch: 43, lengthInch: 30, sleeveInch: 9, neckInch: 16.5, shoulderInch: 18, recommendedChestInch: "38.5 - 40" },
  { size: "XL", chestInch: 44.5, lengthInch: 30.25, sleeveInch: 9.5, neckInch: 17, shoulderInch: 18.5, recommendedChestInch: "40 - 41.5" },
  { size: "2XL", chestInch: 46.5, lengthInch: 30.5, sleeveInch: 10, neckInch: 17.5, shoulderInch: 19, recommendedChestInch: "42 - 43.5" },
  { size: "3XL", chestInch: 49, lengthInch: 31.5, sleeveInch: 10.5, neckInch: 18, shoulderInch: 20, recommendedChestInch: "44 - 46" },
  { size: "4XL", chestInch: 50.5, lengthInch: 32, sleeveInch: 10.5, neckInch: 18.5, shoulderInch: 20.5, recommendedChestInch: "46 - 47.5" },
  { size: "5XL", chestInch: 52.5, lengthInch: 32.5, sleeveInch: 10.75, neckInch: 18.5, shoulderInch: 21, recommendedChestInch: "48 - 50" },
];

// 3. เสื้อเชิ้ตผู้หญิงแขนยาว (Women Long Sleeve)
const WOMEN_LONG_SLEEVE: HighburySizeRow[] = [
  { size: "S", chestInch: 35, lengthInch: 24.5, sleeveInch: 22.5, neckInch: 14, shoulderInch: 14.5, recommendedChestInch: "31 - 33" },
  { size: "M", chestInch: 37, lengthInch: 25, sleeveInch: 23, neckInch: 14.5, shoulderInch: 15, recommendedChestInch: "33 - 35" },
  { size: "L", chestInch: 38.5, lengthInch: 25.5, sleeveInch: 23.5, neckInch: 15, shoulderInch: 15.5, recommendedChestInch: "35 - 36.5" },
  { size: "XL", chestInch: 40, lengthInch: 26, sleeveInch: 24, neckInch: 15.5, shoulderInch: 16, recommendedChestInch: "36.5 - 38" },
  { size: "2XL", chestInch: 42, lengthInch: 26.5, sleeveInch: 24.5, neckInch: 16, shoulderInch: 16.5, recommendedChestInch: "38 - 40" },
  { size: "3XL", chestInch: 44, lengthInch: 26.5, sleeveInch: 24.5, neckInch: 16.5, shoulderInch: 17, recommendedChestInch: "40 - 42" },
  { size: "4XL", chestInch: 46, lengthInch: 26.5, sleeveInch: 24.5, neckInch: 17, shoulderInch: 17.5, recommendedChestInch: "42 - 44" },
  { size: "5XL", chestInch: 48, lengthInch: 27, sleeveInch: 24.5, neckInch: 17, shoulderInch: 18, recommendedChestInch: "44 - 46" },
];

// 4. เสื้อเชิ้ตผู้หญิงแขนสั้น (Women Short Sleeve)
const WOMEN_SHORT_SLEEVE: HighburySizeRow[] = [
  { size: "S", chestInch: 35, lengthInch: 24.5, sleeveInch: "7.125", neckInch: 14, shoulderInch: 14.5, recommendedChestInch: "31 - 33" },
  { size: "M", chestInch: 37, lengthInch: 25, sleeveInch: "7.375", neckInch: 14.5, shoulderInch: 15, recommendedChestInch: "33 - 35" },
  { size: "L", chestInch: 38.5, lengthInch: 25.5, sleeveInch: "7.625", neckInch: 15, shoulderInch: 15.5, recommendedChestInch: "35 - 36.5" },
  { size: "XL", chestInch: 40, lengthInch: 26, sleeveInch: "7.875", neckInch: 15.5, shoulderInch: 16, recommendedChestInch: "36.5 - 38" },
  { size: "2XL", chestInch: 42, lengthInch: 26.5, sleeveInch: "8.125", neckInch: 16, shoulderInch: 16.5, recommendedChestInch: "38 - 40" },
  { size: "3XL", chestInch: 44, lengthInch: 26.5, sleeveInch: "8.625", neckInch: 16.5, shoulderInch: 17, recommendedChestInch: "40 - 42" },
  { size: "4XL", chestInch: 46, lengthInch: 26.5, sleeveInch: 9, neckInch: 17, shoulderInch: 17.5, recommendedChestInch: "42 - 44" },
  { size: "5XL", chestInch: 48, lengthInch: 27, sleeveInch: 9.5, neckInch: 17, shoulderInch: 18, recommendedChestInch: "44 - 46" },
];

// 5. เสื้อเชิ้ตผู้หญิงแขนสามส่วน (Women 3/4 Sleeve)
const WOMEN_THREE_QUARTER_SLEEVE: HighburySizeRow[] = [
  { size: "S", chestInch: 35, lengthInch: 24.5, sleeveInch: 16, neckInch: 14, shoulderInch: 14.5, recommendedChestInch: "31 - 33" },
  { size: "M", chestInch: 37, lengthInch: 25, sleeveInch: 16.5, neckInch: 14.5, shoulderInch: 15, recommendedChestInch: "33 - 35" },
  { size: "L", chestInch: 38.5, lengthInch: 25.5, sleeveInch: 17, neckInch: 15, shoulderInch: 15.5, recommendedChestInch: "35 - 36.5" },
  { size: "XL", chestInch: 40, lengthInch: 26, sleeveInch: 17.5, neckInch: 15.5, shoulderInch: 16, recommendedChestInch: "36.5 - 38" },
  { size: "2XL", chestInch: 42, lengthInch: 26.5, sleeveInch: 17.5, neckInch: 16, shoulderInch: 16.5, recommendedChestInch: "38 - 40" },
  { size: "3XL", chestInch: 44, lengthInch: 26.5, sleeveInch: 17.5, neckInch: 16.5, shoulderInch: 17, recommendedChestInch: "40 - 42" },
  { size: "4XL", chestInch: 46, lengthInch: 26.5, sleeveInch: 17.5, neckInch: 17, shoulderInch: 17.5, recommendedChestInch: "42 - 44" },
  { size: "5XL", chestInch: 48, lengthInch: 27, sleeveInch: 17.5, neckInch: 17, shoulderInch: 18, recommendedChestInch: "44 - 46" },
];

export default function SmartSizeGuideModal({
  isOpen,
  onClose,
  theme = "dark",
}: SmartSizeGuideModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Category & Sleeve Selection
  const [gender, setGender] = useState<Gender>("men");
  const [sleeveType, setSleeveType] = useState<SleeveType>("long");

  // Calculator State
  const [calcMode, setCalcMode] = useState<"chest" | "height_weight">("chest");
  const [chestInput, setChestInput] = useState<number>(38);
  const [heightInput, setHeightInput] = useState<number>(172);
  const [weightInput, setWeightInput] = useState<number>(68);
  const [fitPreference, setFitPreference] = useState<"slim" | "regular">("regular");

  // When gender switches, adjust sleeve type and default chest slider if needed
  const handleGenderChange = (newGender: Gender) => {
    setGender(newGender);
    if (newGender === "men" && sleeveType === "threeQuarter") {
      setSleeveType("long");
    }
    if (newGender === "women" && chestInput > 44) {
      setChestInput(34);
    } else if (newGender === "men" && chestInput < 34) {
      setChestInput(38);
    }
  };

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

  // Resolve current active chart
  const getActiveChart = (): { title: string; chart: HighburySizeRow[] } => {
    if (gender === "men") {
      if (sleeveType === "short") {
        return { title: "เสื้อเชิ้ตผู้ชายแขนสั้น", chart: MEN_SHORT_SLEEVE };
      }
      return { title: "เสื้อเชิ้ตผู้ชายแขนยาว", chart: MEN_LONG_SLEEVE };
    } else {
      if (sleeveType === "short") {
        return { title: "เสื้อเชิ้ตผู้หญิงแขนสั้น", chart: WOMEN_SHORT_SLEEVE };
      }
      if (sleeveType === "threeQuarter") {
        return { title: "เสื้อเชิ้ตผู้หญิงแขนสามส่วน", chart: WOMEN_THREE_QUARTER_SLEEVE };
      }
      return { title: "เสื้อเชิ้ตผู้หญิงแขนยาว", chart: WOMEN_LONG_SLEEVE };
    }
  };

  const { title: chartTitle, chart: currentChart } = getActiveChart();

  // Size Recommendation calculation
  const calculateSize = (): { size: string; shirtChest: number; reason: string } => {
    let effectiveChest = chestInput;

    if (calcMode === "height_weight") {
      const heightM = heightInput / 100;
      const bmi = weightInput / (heightM * heightM);

      if (gender === "men") {
        // Tailored men formula
        effectiveChest = 32 + (weightInput - 50) * 0.28;
        if (bmi > 25) {
          effectiveChest += (bmi - 25) * 0.4;
        }
      } else {
        // Tailored women formula
        effectiveChest = 28 + (weightInput - 42) * 0.26;
        if (bmi > 24) {
          effectiveChest += (bmi - 24) * 0.35;
        }
      }
    }

    // Highbury ease allowance:
    // Men: Regular +3.5" to +4.0", Slim +2.0" to +2.5"
    // Women: Regular +3.0" to +3.5", Slim +1.5" to +2.0"
    const targetAllowance = fitPreference === "slim"
      ? (gender === "men" ? 2.5 : 2.0)
      : (gender === "men" ? 4.0 : 3.5);

    const requiredShirtChest = effectiveChest + targetAllowance;

    let matched = currentChart[0];
    for (const row of currentChart) {
      if (row.chestInch >= requiredShirtChest) {
        matched = row;
        break;
      }
      matched = row;
    }

    const fitLabel = fitPreference === "slim" ? "ทรงพอดีตัว (Slim Fit)" : "ทรงใส่สบาย (Regular Fit)";
    return {
      size: matched.size,
      shirtChest: matched.chestInch,
      reason: `เหมาะสำหรับ${fitLabel} รอบอกเสื้อ ${matched.chestInch} นิ้ว (สำหรับรอบอกจริงประมาณ ${matched.recommendedChestInch} นิ้ว)`,
    };
  };

  const recommendation = calculateSize();

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      data-theme={theme}
      className="v3-dialog w-[94vw] max-w-4xl rounded-2xl border border-[#262830] bg-[#0E1015] p-0 text-white overflow-hidden shadow-2xl backdrop:bg-black/80"
      aria-labelledby="size-guide-title"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4.5 border-b border-[#262830] bg-[#13161D]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/10 text-white flex items-center justify-center border border-white/10">
            <Ruler className="w-4 h-4 text-[#FFB900]" />
          </div>
          <div>
            <h2 id="size-guide-title" className="text-base font-semibold text-white tracking-tight">
              คำนวณและดูตารางไซส์เสื้อเชิ้ต Highbury
            </h2>
            <p className="text-xs text-[#9496A1]">
              อ้างอิงตารางขนาดมาตรฐานจริง 8 ไซส์ (S – 5XL) สำหรับสรีระคนไทยโดยเฉพาะ
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
      <div className="p-6 space-y-6 max-h-[78vh] overflow-y-auto bg-[#0E1015] text-white">
        
        {/* Gender & Sleeve Category Selectors */}
        <div className="p-4 rounded-xl bg-[#13161D] border border-[#262830] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Gender Toggle */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-[#9496A1] uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3 h-3 text-[#FFB900]" /> หมวดหมู่
              </span>
              <div className="inline-flex p-1 rounded-full bg-[#0E1015] border border-[#262830]">
                <button
                  type="button"
                  onClick={() => handleGenderChange("men")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    gender === "men"
                      ? "bg-white text-[#07080B] shadow-sm"
                      : "text-[#9496A1] hover:text-white"
                  }`}
                >
                  เสื้อเชิ้ตผู้ชาย
                </button>
                <button
                  type="button"
                  onClick={() => handleGenderChange("women")}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    gender === "women"
                      ? "bg-white text-[#07080B] shadow-sm"
                      : "text-[#9496A1] hover:text-white"
                  }`}
                >
                  เสื้อเชิ้ตผู้หญิง
                </button>
              </div>
            </div>

            {/* Sleeve Type Toggle */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-[#9496A1] uppercase tracking-wider flex items-center gap-1.5">
                <Shirt className="w-3 h-3 text-[#FFB900]" /> ความยาวแขน
              </span>
              <div className="inline-flex p-1 rounded-full bg-[#0E1015] border border-[#262830] flex-wrap gap-1">
                <button
                  type="button"
                  onClick={() => setSleeveType("long")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    sleeveType === "long"
                      ? "bg-white text-[#07080B] shadow-sm"
                      : "text-[#9496A1] hover:text-white"
                  }`}
                >
                  แขนยาว
                </button>
                <button
                  type="button"
                  onClick={() => setSleeveType("short")}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    sleeveType === "short"
                      ? "bg-white text-[#07080B] shadow-sm"
                      : "text-[#9496A1] hover:text-white"
                  }`}
                >
                  แขนสั้น
                </button>
                {gender === "women" && (
                  <button
                    type="button"
                    onClick={() => setSleeveType("threeQuarter")}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      sleeveType === "threeQuarter"
                        ? "bg-white text-[#07080B] shadow-sm"
                        : "text-[#9496A1] hover:text-white"
                    }`}
                  >
                    แขนสามส่วน
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b border-[#262830] pb-3 gap-2">
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
              <label htmlFor="chest-input" className="text-xs font-medium text-white flex justify-between">
                <span>รอบอกจริงของคุณ (นิ้ว)</span>
                <span className="font-mono text-xs font-bold text-[#FFB900]">
                  {chestInput}&quot;
                </span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  id="chest-input"
                  type="range"
                  min={gender === "men" ? "32" : "28"}
                  max={gender === "men" ? "52" : "48"}
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
                  min={gender === "men" ? "155" : "145"}
                  max={gender === "men" ? "198" : "185"}
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
                  min={gender === "men" ? "45" : "38"}
                  max={gender === "men" ? "125" : "105"}
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
            <p className="text-[11px] text-[#9496A1]">
              {fitPreference === "regular"
                ? "ทรงยอดนิยม สวมใส่สบาย คล่องตัวในทุกการเคลื่อนไหว"
                : "ทรงเข้ารูป กระชับ พอดีสัดส่วน เสริมบุคลิกให้ดูสมาร์ท"}
            </p>
          </div>
        </div>

        {/* Dynamic Recommendation Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#13161D] border border-[#262830] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-xl bg-white text-[#07080B] font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
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

        {/* Full Size Chart Table matching the exact image specs */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
            <div className="flex items-center gap-2 font-semibold text-white">
              <TableIcon className="w-3.5 h-3.5 text-[#FFB900]" />
              <span>ตารางเทียบขนาดไซส์: {chartTitle} (หน่วย: นิ้ว)</span>
            </div>
            <span className="text-[11px] text-[#9496A1]">
              ข้อมูลมาตรฐานทางการจาก Highbury
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#262830] bg-[#13161D]">
            <table className="w-full text-xs text-left min-w-[620px]">
              <thead className="bg-[#181B24] text-[#E7E7E7] font-semibold border-b border-[#262830]">
                <tr>
                  <th className="py-2.5 px-3">SIZE</th>
                  <th className="py-2.5 px-3">รอบอก</th>
                  <th className="py-2.5 px-3">ความยาวเสื้อ</th>
                  <th className="py-2.5 px-3">ความยาวแขน</th>
                  <th className="py-2.5 px-3">รอบคอ</th>
                  <th className="py-2.5 px-3">รอบไหล่</th>
                  <th className="py-2.5 px-3">รอบอกจริงที่แนะนำ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262830]">
                {currentChart.map((row) => {
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
                      <td className="py-2.5 px-3 font-mono text-white">{row.lengthInch}&quot;</td>
                      <td className="py-2.5 px-3 font-mono text-white">{row.sleeveInch}&quot;</td>
                      <td className="py-2.5 px-3 font-mono text-white">{row.neckInch}&quot;</td>
                      <td className="py-2.5 px-3 font-mono text-white">{row.shoulderInch}&quot;</td>
                      <td className="py-2.5 px-3 font-mono text-[#FFB900]">
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
