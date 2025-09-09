"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Props = {
  open: boolean;
  onAccept: () => Promise<void>;
  onDecline: () => void;
};

export default function DisclaimerModal({ open, onAccept, onDecline }: Props) {
  const [checked, setChecked] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (open) {
      setChecked(false);
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative z-[1001] w-full max-w-2xl rounded-xl bg-zinc-900/50 backdrop-blur-md border border-zinc-800 shadow-2xl">
        <div className="px-6 py-6">
          <h2 className="text-3xl font-extrabold text-white mb-2 text-center">Vui lòng xác nhận điều khoản</h2>
          <p className="text-sm text-gray-400 mb-5 text-center">Bạn cần đọc và đồng ý trước khi tiếp tục sử dụng.</p>

          <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
            <p className="text-center">Vui lòng xem các tài liệu sau:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Link href="/terms" className="text-red-400 hover:text-red-300 underline">Điều khoản dịch vụ</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-red-400 hover:text-red-300 underline">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-red-400 hover:text-red-300 underline">Tuyên bố từ chối trách nhiệm</Link>
              </li>
            </ul>

            <label className="flex items-start gap-3 mt-3 select-none cursor-pointer">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-red-600"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              <span className="text-gray-300">
                Tôi đã đọc và đồng ý với Điều khoản dịch vụ, Chính sách bảo mật và Tuyên bố từ chối trách nhiệm.
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-800 bg-black/30">
          <button
            type="button"
            onClick={onDecline}
            className="px-4 py-2 rounded-md border border-zinc-700 text-gray-200 hover:bg-white/5 focus:outline-none focus:ring focus:ring-red-500/30"
          >
            Từ chối
          </button>
          <button
            type="button"
            onClick={async () => {
              if (!checked || accepting) return;
              setAccepting(true);
              try {
                await onAccept();
              } catch (error) {
                console.error('Error accepting terms:', error);
              } finally {
                setAccepting(false);
              }
            }}
            disabled={!checked || accepting}
            className={`px-4 py-2 rounded-md text-white focus:outline-none focus:ring focus:ring-red-500/30 ${checked && !accepting ? 'bg-red-600 hover:bg-red-700' : 'bg-red-600/50 cursor-not-allowed'}`}
            aria-disabled={!checked || accepting}
          >
            {accepting ? 'Đang lưu...' : 'Tôi đồng ý'}
          </button>
        </div>
      </div>
    </div>
  );
}
