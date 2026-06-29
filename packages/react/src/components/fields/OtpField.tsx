/**
 * OtpField — N-digit OTP input for narrative-form.
 *
 * @remarks
 * Each digit is a separate focusable input. Auto-focuses the next box
 * on digit entry, auto-focuses previous on backspace. Paste distributes
 * across all boxes. Never logs or exposes the OTP value in console.
 *
 * CSS classes: `ns-otp-wrap`, `ns-otp-box`, `ns-otp-box--filled`,
 * `ns-otp-box--active`, `ns-otp-box--error`, `ns-otp-resend`,
 * `ns-otp-resend--disabled`, `ns-otp-timer`
 */

import React, { useState, useRef, useCallback, useEffect } from "react";

/** Props for the OtpField component. */
export interface OtpFieldProps {
  /** Unique field key. */
  fieldKey: string;
  /** Number of OTP digit boxes. Default: 6 */
  otpLength?: number;
  /** Whether to auto-submit when all digits are filled. Default: true */
  autoAdvance?: boolean;
  /** Called when the OTP field first appears — triggers OTP send. */
  onRequest?: () => void | Promise<void>;
  /** Called when all digits are filled. */
  onVerify?: (otp: string) => void | Promise<void>;
  /** Callback when the full OTP is confirmed. */
  onConfirm: (value: string) => void;
  /** Callback on value change. */
  onChange?: (value: string) => void;
  /** Label for the resend link. Default: "Resend code" */
  resendLabel?: string;
  /** Seconds before resend is allowed. Default: 30 */
  resendDelay?: number;
  /** Additional CSS class for the wrapper. */
  className?: string;
}

/**
 * An N-digit OTP input with auto-focus, paste distribution, and resend timer.
 *
 * @param props - OtpField configuration
 */
export const OtpField: React.FC<OtpFieldProps> = function OtpField({
  fieldKey,
  otpLength = 6,
  autoAdvance = true,
  onRequest,
  onVerify,
  onConfirm,
  onChange,
  resendLabel = "Resend code",
  resendDelay = 30,
  className,
}) {
  const [digits, setDigits] = useState<string[]>(Array.from({ length: otpLength }, () => ""));
  const [activeIndex, setActiveIndex] = useState(0);
  const [timer, setTimer] = useState(resendDelay);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasRequestedRef = useRef(false);

  // Call onRequest when field first mounts
  useEffect(() => {
    if (!hasRequestedRef.current) {
      hasRequestedRef.current = true;
      onRequest?.();
    }
  }, [onRequest]);

  // Start countdown timer
  useEffect(() => {
    if (resendDelay <= 0) {
      setCanResend(true);
      return;
    }

    setTimer(resendDelay);
    setCanResend(false);

    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resendDelay]);

  // Auto-focus first box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const getOtpString = useCallback(
    (d: string[]) => d.join(""),
    [],
  );

  const handleDigitChange = useCallback(
    (index: number, value: string) => {
      // Only allow single digits
      const digit = value.replace(/\D/g, "").slice(-1);

      setDigits((prev) => {
        const next = [...prev];
        next[index] = digit;

        const otpString = getOtpString(next);
        onChange?.(otpString);

        // Auto-advance to next box
        if (digit !== "" && index < otpLength - 1) {
          inputRefs.current[index + 1]?.focus();
          setActiveIndex(index + 1);
        }

        // Check if all digits are filled
        if (next.every((d) => d !== "")) {
          onVerify?.(otpString);
          if (autoAdvance) {
            // Use setTimeout to let state update first
            setTimeout(() => onConfirm(otpString), 0);
          }
        }

        return next;
      });
    },
    [otpLength, autoAdvance, onConfirm, onVerify, onChange, getOtpString],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        setDigits((prev) => {
          const next = [...prev];
          if (next[index] !== "") {
            // Clear current box
            next[index] = "";
            onChange?.(getOtpString(next));
          } else if (index > 0) {
            // Move to previous box and clear it
            next[index - 1] = "";
            inputRefs.current[index - 1]?.focus();
            setActiveIndex(index - 1);
            onChange?.(getOtpString(next));
          }
          return next;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const otpString = getOtpString(digits);
        if (digits.every((d) => d !== "")) {
          onConfirm(otpString);
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      } else if (e.key === "ArrowRight" && index < otpLength - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
        setActiveIndex(index + 1);
      }
    },
    [digits, otpLength, onConfirm, onChange, getOtpString],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength);

      if (pastedData.length === 0) return;

      setDigits((prev) => {
        const next = [...prev];
        for (let i = 0; i < pastedData.length; i++) {
          const char = pastedData[i];
          if (char !== undefined) {
            next[i] = char;
          }
        }

        const otpString = getOtpString(next);
        onChange?.(otpString);

        // Focus the next empty box or the last one
        const nextEmptyIndex = next.findIndex((d) => d === "");
        const focusIndex = nextEmptyIndex === -1 ? otpLength - 1 : nextEmptyIndex;
        inputRefs.current[focusIndex]?.focus();
        setActiveIndex(focusIndex);

        // Check if complete after paste
        if (next.every((d) => d !== "")) {
          onVerify?.(otpString);
          if (autoAdvance) {
            setTimeout(() => onConfirm(otpString), 0);
          }
        }

        return next;
      });
    },
    [otpLength, autoAdvance, onConfirm, onVerify, onChange, getOtpString],
  );

  const handleResend = useCallback(() => {
    if (!canResend) return;
    setCanResend(false);
    setTimer(resendDelay);
    setDigits(Array.from({ length: otpLength }, () => ""));
    setActiveIndex(0);
    inputRefs.current[0]?.focus();
    onRequest?.();

    // Restart timer
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [canResend, resendDelay, otpLength, onRequest]);

  const handleFocus = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const wrapClasses = ["ns-otp-wrap", className].filter(Boolean).join(" ");

  return (
    <span className={wrapClasses}>
      <span className="ns-otp-boxes">
        {digits.map((digit, index) => {
          const boxClasses = [
            "ns-otp-box",
            digit !== "" ? "ns-otp-box--filled" : undefined,
            activeIndex === index ? "ns-otp-box--active" : undefined,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              className={boxClasses}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => handleFocus(index)}
              autoComplete="one-time-code"
              aria-label={`Digit ${String(index + 1)}`}
            />
          );
        })}
      </span>

      {!autoAdvance && digits.every((d) => d !== "") && (
        <button
          type="button"
          className="ns-enter-btn"
          onClick={() => onConfirm(getOtpString(digits))}
          aria-label="Confirm"
        >
          ↵
        </button>
      )}

      <span className="ns-otp-resend-wrap">
        {canResend ? (
          <button
            type="button"
            className="ns-otp-resend"
            onClick={handleResend}
          >
            {resendLabel}
          </button>
        ) : (
          <span className="ns-otp-resend ns-otp-resend--disabled">
            <span className="ns-otp-timer">
              Resend in {String(timer)}s
            </span>
          </span>
        )}
      </span>
    </span>
  );
};
