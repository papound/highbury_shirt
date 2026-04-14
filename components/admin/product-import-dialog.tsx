"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, FileSpreadsheet, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

// ─── DB field definitions ────────────────────────────────────────────────────

interface DbField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  table: string;
  description?: string;
}

const DB_FIELDS: DbField[] = [
  { key: "nameTh", label: "ชื่อสินค้า (TH)", type: "String", required: true, table: "Product" },
  { key: "name", label: "ชื่อสินค้า (EN)", type: "String", required: true, table: "Product" },
  { key: "basePrice", label: "ราคาฐาน", type: "Float", required: true, table: "Product", description: "ตัวเลขทศนิยม เช่น 299.00" },
  { key: "categoryNameTh", label: "หมวดหมู่", type: "String", required: true, table: "Category", description: "จะสร้างใหม่อัตโนมัติหากยังไม่มี" },
  { key: "color", label: "สี", type: "String", required: true, table: "ProductVariant" },
  { key: "colorHex", label: "Hex สี", type: "String?", required: false, table: "ProductVariant", description: "เช่น #FF0000 (เว้นว่างได้)" },
  { key: "size", label: "ขนาด / Size", type: "String", required: true, table: "ProductVariant" },
  { key: "sku", label: "SKU", type: "String", required: true, table: "ProductVariant", description: "ต้องไม่ซ้ำกัน" },
  { key: "stock", label: "จำนวน Stock", type: "Int", required: false, table: "Inventory", description: "จำนวนเต็ม (เว้นว่าง = 0)" },
];

// ─── Color helpers ───────────────────────────────────────────────────────────

const TABLE_COLORS: Record<string, string> = {
  Product: "bg-blue-100 text-blue-700",
  Category: "bg-purple-100 text-purple-700",
  ProductVariant: "bg-green-100 text-green-700",
  Inventory: "bg-orange-100 text-orange-700",
};

const TYPE_COLORS: Record<string, string> = {
  String: "bg-sky-50 text-sky-700 border border-sky-200",
  "String?": "bg-sky-50 text-sky-500 border border-sky-200",
  Float: "bg-amber-50 text-amber-700 border border-amber-200",
  Int: "bg-teal-50 text-teal-700 border border-teal-200",
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface PreviewData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

type Mapping = Record<string, number>; // key → 1-indexed column (0 = not mapped)

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminProductImportDialog() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [mapping, setMapping] = useState<Mapping>({});
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [importing, setImporting] = useState(false);

  // ── Auto-detect mapping from header names ─────────────────────────────────
  function autoDetectMapping(headers: string[]): Mapping {
    const normalise = (s: string) => s.toLowerCase().replace(/\s+/g, "");
    const candidates: Record<string, string[]> = {
      nameTh: ["ชื่อสินค้า(th)", "ชื่อth", "nameth", "ชื่อสินค้าth", "ชื่อภาษาไทย"],
      name: ["ชื่อสินค้า(en)", "ชื่อen", "name", "ชื่อสินค้าen", "ชื่อภาษาอังกฤษ"],
      basePrice: ["ราคา", "price", "baseprice", "ราคาฐาน"],
      categoryNameTh: ["หมวดหมู่", "category", "categorynameth", "หมวดหมู่th"],
      color: ["สี", "color"],
      colorHex: ["hexสี", "colorhex", "hex", "#"],
      size: ["ขนาด", "size"],
      sku: ["sku"],
      stock: ["stock", "จำนวน", "quantity", "qty"],
    };

    const detected: Mapping = {};
    headers.forEach((header, idx) => {
      const norm = normalise(header);
      for (const [fieldKey, aliases] of Object.entries(candidates)) {
        if (aliases.some((a) => norm.includes(a)) && !detected[fieldKey]) {
          detected[fieldKey] = idx + 1; // convert to 1-indexed
        }
      }
    });
    return detected;
  }

  // ── Handle file selection ─────────────────────────────────────────────────
  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setLoadingPreview(true);

    try {
      const fd = new FormData();
      fd.append("file", selected);
      const res = await fetch("/api/admin/products/import/preview", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "อ่านไฟล์ไม่สำเร็จ");

      const detected = autoDetectMapping(data.headers);
      setPreview(data);
      setMapping(detected);
      setStep(2);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
      resetState();
    } finally {
      setLoadingPreview(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  // ── Handle import ─────────────────────────────────────────────────────────
  async function handleImport() {
    if (!file) return;

    // Validate required fields are mapped
    const missingRequired = DB_FIELDS.filter((f) => f.required && !mapping[f.key]);
    if (missingRequired.length > 0) {
      toast.error(`กรุณา map field ที่จำเป็น: ${missingRequired.map((f) => f.label).join(", ")}`);
      return;
    }

    setImporting(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("mapping", JSON.stringify(mapping));
      const res = await fetch("/api/admin/products/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Import ล้มเหลว");

      if (data.errors?.length > 0) {
        toast.warning(`Import สำเร็จ ${data.imported} รายการ (มี ${data.errors.length} ข้อผิดพลาด)`);
      } else {
        toast.success(`Import สำเร็จ: ${data.imported} รายการ`);
      }
      handleClose();
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setImporting(false);
    }
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  function resetState() {
    setStep(1);
    setFile(null);
    setPreview(null);
    setMapping({});
    setLoadingPreview(false);
    setImporting(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleClose() {
    if (importing) return;
    setOpen(false);
    setTimeout(resetState, 300);
  }

  // ── Render: preview table showing mapped data ─────────────────────────────
  function getMappedValue(row: string[], fieldKey: string): string {
    const col = mapping[fieldKey];
    if (!col || col < 1) return "—";
    return row[col - 1] ?? "—";
  }

  const mappedFields = DB_FIELDS.filter((f) => mapping[f.key]);
  const unmappedRequired = DB_FIELDS.filter((f) => f.required && !mapping[f.key]);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={handleFileChange}
      />

      <Button variant="outline" onClick={() => setOpen(true)}>
        <Upload className="w-4 h-4 mr-1" />
        Import Excel
      </Button>

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-green-600" />
              Import สินค้าจาก Excel
              {step === 2 && preview && (
                <span className="text-sm font-normal text-muted-foreground">
                  — {file?.name} ({preview.totalRows} แถว)
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* ── Step 1: File picker ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="py-10 flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-xl text-muted-foreground hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => inputRef.current?.click()}>
              {loadingPreview ? (
                <>
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p>กำลังอ่านไฟล์...</p>
                </>
              ) : (
                <>
                  <Upload className="w-10 h-10" />
                  <div className="text-center">
                    <p className="font-medium text-foreground">คลิกเพื่อเลือกไฟล์ Excel</p>
                    <p className="text-sm mt-1">รองรับ .xlsx, .xls</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Step 2: Mapping + Preview ────────────────────────────────── */}
          {step === 2 && preview && (
            <div className="space-y-6">

              {/* Unmapped required warning */}
              {unmappedRequired.length > 0 && (
                <div className="flex items-start gap-2 rounded-lg bg-destructive/10 text-destructive px-4 py-3 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    Field ที่จำเป็นยังไม่ได้ map:{" "}
                    <strong>{unmappedRequired.map((f) => f.label).join(", ")}</strong>
                  </span>
                </div>
              )}

              {/* ── Mapping table ─────────────────────────────────────────── */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  กำหนด Field Mapping
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    Excel มี {preview.headers.length} คอลัมน์
                  </span>
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">DB Field</th>
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">ตาราง</th>
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Data Type</th>
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Required</th>
                        <th className="text-left px-4 py-2.5 font-medium text-muted-foreground w-56">
                          คอลัมน์ Excel
                          <ArrowRight className="inline w-3 h-3 ml-1" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DB_FIELDS.map((field) => (
                        <tr key={field.key} className="border-b last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-2.5">
                            <p className="font-medium">{field.label}</p>
                            {field.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{field.description}</p>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${TABLE_COLORS[field.table] ?? ""}`}>
                              {field.table}
                            </span>
                          </td>
                          <td className="px-4 py-2.5">
                            <code className={`text-xs px-2 py-0.5 rounded font-mono ${TYPE_COLORS[field.type] ?? "bg-muted"}`}>
                              {field.type}
                            </code>
                          </td>
                          <td className="px-4 py-2.5">
                            {field.required ? (
                              <Badge variant="destructive" className="text-xs">จำเป็น</Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">ไม่บังคับ</Badge>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <Select
                              value={String(mapping[field.key] ?? 0)}
                              onValueChange={(v) =>
                                setMapping((prev) => ({ ...prev, [field.key]: parseInt(v ?? "0") }))
                              }
                            >
                              <SelectTrigger className="h-8 text-xs w-full">
                                <SelectValue placeholder="-- ไม่เลือก --" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0">-- ไม่เลือก --</SelectItem>
                                {preview.headers.map((header, idx) => (
                                  <SelectItem key={idx} value={String(idx + 1)}>
                                    [{idx + 1}] {header}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Data preview table ────────────────────────────────────── */}
              {mappedFields.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">
                    ตัวอย่างข้อมูล (5 แถวแรก)
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      แสดงเฉพาะ field ที่ map แล้ว
                    </span>
                  </h3>
                  <div className="border rounded-lg overflow-x-auto">
                    <table className="text-xs w-full">
                      <thead>
                        <tr className="border-b bg-muted/40">
                          <th className="text-left px-3 py-2 font-medium text-muted-foreground w-8">#</th>
                          {mappedFields.map((f) => (
                            <th key={f.key} className="text-left px-3 py-2 font-medium">
                              <div className="text-foreground">{f.label}</div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <code className={`text-[10px] px-1.5 py-0 rounded font-mono ${TYPE_COLORS[f.type] ?? "bg-muted"}`}>
                                  {f.type}
                                </code>
                                <span className={`text-[10px] px-1.5 py-0 rounded-full ${TABLE_COLORS[f.table] ?? ""}`}>
                                  {f.table}
                                </span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {preview.rows.length === 0 ? (
                          <tr>
                            <td colSpan={mappedFields.length + 1} className="px-3 py-4 text-center text-muted-foreground">
                              ไม่มีข้อมูลตัวอย่าง
                            </td>
                          </tr>
                        ) : (
                          preview.rows.map((row, rowIdx) => (
                            <tr key={rowIdx} className="border-b last:border-0 hover:bg-muted/20">
                              <td className="px-3 py-2 text-muted-foreground">{rowIdx + 1}</td>
                              {mappedFields.map((f) => {
                                const val = getMappedValue(row, f.key);
                                const isEmpty = val === "—";
                                return (
                                  <td key={f.key} className={`px-3 py-2 ${isEmpty && f.required ? "text-destructive font-medium" : ""}`}>
                                    {isEmpty ? (
                                      <span className="text-muted-foreground italic">—</span>
                                    ) : (
                                      <span className="font-mono">{val}</span>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Footer ───────────────────────────────────────────────────── */}
          <DialogFooter className="gap-2 pt-2">
            <Button variant="ghost" onClick={handleClose} disabled={importing}>
              ยกเลิก
            </Button>
            {step === 1 ? (
              <Button onClick={() => inputRef.current?.click()} disabled={loadingPreview}>
                {loadingPreview ? (
                  <><Loader2 className="w-4 h-4 mr-1 animate-spin" />กำลังอ่าน...</>
                ) : (
                  <><Upload className="w-4 h-4 mr-1" />เลือกไฟล์</>
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setFile(null);
                    setPreview(null);
                    setMapping({});
                  }}
                  disabled={importing}
                >
                  เปลี่ยนไฟล์
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={importing || unmappedRequired.length > 0}
                >
                  {importing ? (
                    <><Loader2 className="w-4 h-4 mr-1 animate-spin" />กำลัง Import...</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-1" />Import {preview?.totalRows} แถว</>
                  )}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
