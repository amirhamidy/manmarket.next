"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import PriceIcon from "@/components/icons/priceIcon";
import LoanTimeline from "./LoanTimeline";
import MainHeader from "@/base/mainHeader";

const BANKS = {
  blue: {
    name: "بلو بانک",
    color: "#1652F0",
    gradient: "from-[#1652F0] to-[#4f8ef7]",
    data: {
      10: {
        installment: 940764,
        interest: 1289160,
        total: 11289160,
        final: 12719160,
      },
      20: {
        installment: 1881527,
        interest: 2578318,
        total: 22578318,
        final: 25438318,
      },
      30: {
        installment: 2822290,
        interest: 3867477,
        total: 33867477,
        final: 38157477,
      },
      40: {
        installment: 3763053,
        interest: 5156635,
        total: 45156635,
        final: 50876635,
      },
      50: {
        installment: 4703817,
        interest: 6445794,
        total: 56445794,
        final: 63595794,
      },
      60: {
        installment: 5644580,
        interest: 7734952,
        total: 67734952,
        final: 76314952,
      },
      70: {
        installment: 6585343,
        interest: 9024110,
        total: 79024110,
        final: 89034110,
      },
      80: {
        installment: 7526106,
        interest: 10313270,
        total: 90313270,
        final: 101753270,
      },
      90: {
        installment: 8466869,
        interest: 11602428,
        total: 101602428,
        final: 114472428,
      },
      100: {
        installment: 9407633,
        interest: 12891587,
        total: 112891587,
        final: 127191587,
      },
    },
  },
  hi: {
    name: "های بانک",
    color: "#00C853",
    gradient: "from-[#00C853] to-[#69f0ae]",
    data: {
      10: {
        installment: 940764,
        interest: 1289160,
        total: 11289160,
        final: 12719160,
      },
      20: {
        installment: 1881527,
        interest: 2578318,
        total: 22578318,
        final: 25438318,
      },
      30: {
        installment: 2822290,
        interest: 3867477,
        total: 33867477,
        final: 38157477,
      },
      40: {
        installment: 3763053,
        interest: 5156635,
        total: 45156635,
        final: 50876635,
      },
      50: {
        installment: 4703817,
        interest: 6445794,
        total: 56445794,
        final: 63595794,
      },
      60: {
        installment: 5644580,
        interest: 7734952,
        total: 67734952,
        final: 76314952,
      },
      70: {
        installment: 6585343,
        interest: 9024110,
        total: 79024110,
        final: 89034110,
      },
      80: {
        installment: 7526106,
        interest: 10313270,
        total: 90313270,
        final: 101753270,
      },
      90: {
        installment: 8466869,
        interest: 11602428,
        total: 101602428,
        final: 114472428,
      },
      100: {
        installment: 9407633,
        interest: 12891587,
        total: 112891587,
        final: 127191587,
      },
    },
  },
};

const STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
const fmt = (n) => new Intl.NumberFormat("fa-IR").format(n);

export default function LoanCalculator() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [activeBank, setActiveBank] = useState("blue");
  const [amount, setAmount] = useState(30);

  const bank = BANKS[activeBank];
  const result = useMemo(() => bank.data?.[amount], [bank, amount]);
  const progress = ((amount - 10) / 90) * 100;

  const cards = result
    ? [
        { label: "مبلغ هر قسط", value: result.installment },
        { label: "سود تسهیلات", value: result.interest },
        { label: "مجموع اقساط", value: result.total },
        { label: "بازپرداخت نهایی", value: result.final },
      ]
    : [];

  return (
    <div dir="rtl" className="w-full max-w-[556px] mx-auto">
      <MainHeader />
      <LoanTimeline />
      <div
        className="flex rounded-2xl p-1 mb-5"
        style={{ backgroundColor: dark ? "#1e1f22" : "#f3f4f6" }}
      >
        {Object.entries(BANKS).map(([key, b]) => (
          <button
            key={key}
            onClick={() => setActiveBank(key)}
            className="relative flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors z-10"
            style={{
              color:
                activeBank === key ? "white" : dark ? "#9ca3af" : "#6b7280",
            }}
          >
            {activeBank === key && (
              <motion.div
                layoutId="tab-bg"
                className={`absolute inset-0 rounded-xl bg-gradient-to-r ${b.gradient}`}
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {b.name}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBank}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.2 }}
        >
          {/* Amount Card */}
          <div
            className="rounded-3xl p-5 mb-3"
            style={{
              backgroundColor: dark ? "#1e1f22" : "#f9fafb",
              border: `1px solid ${dark ? "#2a2b2e" : "#e5e7eb"}`,
            }}
          >
            <p
              className="text-xs mb-1"
              style={{ color: dark ? "#9ca3af" : "#6b7280" }}
            >
              اعتبار درخواستی
            </p>
            <AnimatePresence mode="wait">
              <motion.div
                key={amount}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2 text-2xl font-black mb-5"
                style={{ color: dark ? "white" : "#111827" }}
              >
                {fmt(amount * 1_000_000)}
                <PriceIcon />
              </motion.div>
            </AnimatePresence>

            {/* Progress */}
            <div
              className="h-1.5 rounded-full mb-3 relative overflow-hidden"
              style={{ backgroundColor: dark ? "#2a2b2e" : "#e5e7eb" }}
            >
              <motion.div
                className={`absolute h-full rounded-full bg-gradient-to-r ${bank.gradient}`}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>

            {/* Step dots */}
            <div className="flex justify-between mb-2">
              {STEPS.map((s) => (
                <button
                  key={s}
                  onClick={() => setAmount(s)}
                  className="flex flex-col items-center gap-0.5"
                >
                  <motion.div
                    animate={{
                      scale: amount === s ? 1.5 : 1,
                      backgroundColor:
                        amount === s
                          ? bank.color
                          : amount > s
                            ? dark
                              ? "#4b5563"
                              : "#9ca3af"
                            : dark
                              ? "#2a2b2e"
                              : "#d1d5db",
                    }}
                    className="w-2 h-2 rounded-full"
                  />
                  <span
                    className="text-[9px]"
                    style={{
                      color:
                        amount === s
                          ? bank.color
                          : dark
                            ? "#4b5563"
                            : "#d1d5db",
                    }}
                  >
                    {s}
                  </span>
                </button>
              ))}
            </div>

            <input
              type="range"
              min={10}
              max={100}
              step={10}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: bank.color }}
            />
          </div>

          {/* Result Cards */}
          {result ? (
            <div className="grid grid-cols-2 gap-2.5">
              {cards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-2xl p-4"
                  style={{
                    backgroundColor: dark ? "#1e1f22" : "#f9fafb",
                    border: `1px solid ${dark ? "#2a2b2e" : "#e5e7eb"}`,
                  }}
                >
                  <p
                    className="text-xs mb-1.5"
                    style={{ color: dark ? "#9ca3af" : "#6b7280" }}
                  >
                    {card.label}
                  </p>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${card.label}-${amount}`}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1 font-bold text-[15px]"
                      style={{ color: dark ? "white" : "#111827" }}
                    >
                      {fmt(card.value)}
                      <PriceIcon />
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <div
              className="rounded-2xl p-8 text-center"
              style={{
                backgroundColor: dark ? "#1e1f22" : "#f9fafb",
                border: `1px solid ${dark ? "#2a2b2e" : "#e5e7eb"}`,
              }}
            >
              <p
                className="text-sm"
                style={{ color: dark ? "#9ca3af" : "#6b7280" }}
              >
                اطلاعات این بانک به زودی اضافه می‌شود
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
