import { ImageResponse } from "next/og"

export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#09090b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path
          d="M11 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h5M21 4h5a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2h-5"
          stroke="#fafafa"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <rect x="11" y="11" width="10" height="10" rx="2" fill="#FE7446" />
      </svg>
    </div>,
    size,
  )
}
