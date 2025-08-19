// next.config.ts (루트)
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ★ 빌드에서 ESLint 에러 무시
  },
  typescript: {
    // (선택) 타입 에러 때문에 빌드 멈추지 않게 — 지금은 필요 없음
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
