import { Eye, EyeOff, Lock } from 'lucide-react'

export default function PasswordInput({
  id,
  name,
  label,
  value,
  onChange,
  error,
  showPassword,
  onToggle,
  disabled,
  autoComplete = 'current-password',
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="group relative">
        <Lock
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          aria-hidden="true"
        />

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-11 text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder="Enter your password"
        />

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          className="absolute right-2 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>

      <p id={`${id}-error`} className="min-h-5 text-sm text-rose-600">
        {error || ' '}
      </p>
    </div>
  )
}
