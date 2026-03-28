'use client'

interface InputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  autoFocus?: boolean
}

export default function Input({
  value,
  onChange,
  placeholder = '',
  className = '',
  disabled = false,
  autoFocus = false
}: InputProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={`w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed transition-all ${className}`}
    />
  )
}