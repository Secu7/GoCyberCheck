"use client";

/**
 * ⬇⬇⬇ v0.app에서 만든 '필드 마크업(인풋/라벨/그룹)'만 아래 주석 위치에 붙여넣으세요.
 * 주의: <form> 태그는 '여기'에 넣지 않습니다. (page.tsx에서 감쌉니다)
 * 필수 name 속성:
 *  - 이메일 입력: name="email"
 *  - 나머지 항목은 서버 요구에 맞게 name 지정 (예: name="q1", "q2"...)
 */
export default function V0FormFields() {
  return (
    <>
      {/* ===== PASTE FROM v0.app (fields only) — START ===== */}

      {/* 임시 예시(보이는지 확인용): 붙여넣은 뒤 지우세요 */}
      <div className="rounded-xl border p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            placeholder="you @example.com"
            className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/50"
          />
        </div>
      </div>

      {/* ===== PASTE FROM v0.app (fields only) — END ===== */}
    </>
  );
}