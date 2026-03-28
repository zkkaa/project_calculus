'use client'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  className = '',
  type = 'button'
}: ButtonProps) {
  const base = 'px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer'

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-indigo-300',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 disabled:opacity-50',
    danger: 'bg-red-500 hover:bg-red-600 text-white disabled:opacity-50'
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? 'cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  )
}