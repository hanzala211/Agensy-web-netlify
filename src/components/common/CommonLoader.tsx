import React from "react";
import { COLORS } from "@agensy/constants";

interface CommonLoaderProps {
  color?: string;
  size?: number;
  className?: string;
}

export const CommonLoader: React.FC<CommonLoaderProps> = ({
  color = COLORS.primaryColor,
  size = 40,
  className = "",
}) => {
  // Base size calculations - original was 112px
  const baseSize = size || 40;
  const scale = baseSize / 112;
  const loaderSize = 112 * scale;
  const boxSize = 48 * scale;
  const boxBorder = 16 * scale;
  const offset = 64 * scale;

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div
        className="relative"
        style={{
          width: `${loaderSize}px`,
          height: `${loaderSize}px`,
        }}
        aria-label="Loading"
        role="status"
      >
        {/* Box 1 */}
        <div
          className="absolute border-solid box-border block"
          style={{
            borderWidth: `${boxBorder}px`,
            borderColor: color,
            width: `${boxSize * 2.33}px`,
            height: `${boxSize}px`,
            marginTop: `${offset}px`,
            marginLeft: `0px`,
            animation: "abox1 2.5s 0s forwards ease-in-out infinite",
          }}
        />

        {/* Box 2 */}
        <div
          className="absolute border-solid box-border block"
          style={{
            borderWidth: `${boxBorder}px`,
            borderColor: color,
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            marginTop: `0px`,
            marginLeft: `0px`,
            animation: "abox2 2.5s 0s forwards ease-in-out infinite",
          }}
        />

        {/* Box 3 */}
        <div
          className="absolute border-solid box-border block"
          style={{
            borderWidth: `${boxBorder}px`,
            borderColor: color,
            width: `${boxSize}px`,
            height: `${boxSize}px`,
            marginTop: `0px`,
            marginLeft: `${offset}px`,
            animation: "abox3 2.5s 0s forwards ease-in-out infinite",
          }}
        />

        {/* CSS Keyframes */}
        <style>{`
          @keyframes abox1 {
            0% {
              width: ${boxSize * 2.33}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: 0px;
            }
            12.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: 0px;
            }
            25% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: 0px;
            }
            37.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: 0px;
            }
            50% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: 0px;
            }
            62.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: 0px;
            }
            75% {
              width: ${boxSize}px;
              height: ${loaderSize}px;
              margin-top: 0px;
              margin-left: 0px;
            }
            87.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: 0px;
            }
            100% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: 0px;
            }
          }
          
          @keyframes abox2 {
            0% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: 0px;
            }
            12.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: 0px;
            }
            25% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: 0px;
            }
            37.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: 0px;
            }
            50% {
              width: ${boxSize * 2.33}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: 0px;
            }
            62.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: ${offset}px;
            }
            75% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: ${offset}px;
            }
            87.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: ${offset}px;
            }
            100% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: ${offset}px;
            }
          }
          
          @keyframes abox3 {
            0% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: ${offset}px;
            }
            12.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: 0px;
              margin-left: ${offset}px;
            }
            25% {
              width: ${boxSize}px;
              height: ${loaderSize}px;
              margin-top: 0px;
              margin-left: ${offset}px;
            }
            37.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: ${offset}px;
            }
            50% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: ${offset}px;
            }
            62.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: ${offset}px;
            }
            75% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: ${offset}px;
            }
            87.5% {
              width: ${boxSize}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: ${offset}px;
            }
            100% {
              width: ${boxSize * 2.33}px;
              height: ${boxSize}px;
              margin-top: ${offset}px;
              margin-left: 0px;
            }
          }
        `}</style>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
};
