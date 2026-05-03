import type { ReactNode } from "react";

/**
 * Reference dashboard — frame 1565×1080
 * Sidebar 139, content cols ratio left:center:right = 464 : 464 : 428
 * Right column rows: gear 724 / battery+weather 189
 * Left column rows: traffic 523 / music 178 / aircond 189
 * Center column rows: map 584 / brightness 189
 *
 * In our 960×690 frame (sidebar 60, topbar 68, padding 12 around main):
 * content area ≈ 888 × 610
 */
interface CockpitLayoutProps {
  leftTop?: ReactNode;
  leftMiddle?: ReactNode;
  leftBottom?: ReactNode;
  leftTopLarge?: boolean;
  centerTop?: ReactNode;
  centerBottom?: ReactNode;
  rightTop?: ReactNode;
  rightBottom?: ReactNode;
}

// Computed sizes (px) — preserve ratios
const W_LEFT = 290;
const W_CENTER = 290;
const W_RIGHT = 268;
const GAP_X = 10;

const GAP_Y = 8;
const H_TOP_ROW = 470;
const H_BOTTOM_ROW = 120;
const H_CENTER_TOP = H_TOP_ROW; // map height (shared with right top)
const H_RIGHT_TOP = H_TOP_ROW; // gear height (must equal map)
const H_CENTER_BOT = H_BOTTOM_ROW;
const H_RIGHT_BOT = H_BOTTOM_ROW; // must match center bottom
const H_LEFT_TOTAL_TOP = 470; // leftTop + gap + leftMiddle
const H_LEFT_TOP = 340; // camera/traffic style top card
const H_LEFT_MID = H_LEFT_TOTAL_TOP - H_LEFT_TOP - GAP_Y;
const H_LEFT_BOT = 120;

export function CockpitLayout({
  leftTop,
  leftMiddle,
  leftBottom,
  leftTopLarge = false,
  centerTop,
  centerBottom,
  rightTop,
  rightBottom,
}: CockpitLayoutProps) {
  const totalW = W_LEFT + W_CENTER + W_RIGHT + GAP_X * 2;
  const hasLeftBottom = leftBottom !== undefined && leftBottom !== null;
  const showLeftMiddle = !leftTopLarge && leftMiddle !== undefined;
  const noLowerLeftCards = !showLeftMiddle && !hasLeftBottom;
  const fullLeftHeight = H_LEFT_TOTAL_TOP + GAP_Y + H_LEFT_BOT;
  const leftTopHeight = noLowerLeftCards ? fullLeftHeight : leftTopLarge ? H_LEFT_TOTAL_TOP : H_LEFT_TOP;
  // When `leftTopLarge` is true, the top card already consumes the combined top+middle space.
  // Keep the bottom card at its normal height so it doesn't get clipped.
  const leftBottomHeight = leftTopLarge ? H_LEFT_BOT : (showLeftMiddle ? H_LEFT_BOT : H_LEFT_MID + H_LEFT_BOT + GAP_Y);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex items-stretch" style={{ width: totalW, gap: GAP_X }}>
        {/* LEFT column */}
        <div className="flex flex-col" style={{ width: W_LEFT, gap: GAP_Y }}>
          <div className="relative z-10" style={{ height: leftTopHeight }}>{leftTop}</div>
          {showLeftMiddle && <div className="relative z-10" style={{ height: H_LEFT_MID }}>{leftMiddle}</div>}
          {hasLeftBottom && (
            <div className="relative z-20" style={{ height: leftBottomHeight }}>
              {leftBottom}
            </div>
          )}
        </div>
        {/* CENTER column */}
        <div className="flex flex-col" style={{ width: W_CENTER, gap: GAP_Y }}>
          <div style={{ height: H_CENTER_TOP }}>{centerTop}</div>
          <div style={{ height: H_CENTER_BOT }}>{centerBottom}</div>
        </div>
        {/* RIGHT column */}
        <div className="flex flex-col" style={{ width: W_RIGHT, gap: GAP_Y }}>
          <div style={{ height: H_RIGHT_TOP }}>{rightTop}</div>
          <div style={{ height: H_RIGHT_BOT }}>{rightBottom}</div>
        </div>
      </div>
    </div>
  );
}