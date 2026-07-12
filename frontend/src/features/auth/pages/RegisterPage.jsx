import { Link } from 'react-router-dom'
import AuthLayout from '../components/AuthLayout'

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Create your account</h1>
            <p className="text-sm text-slate-500">Register to start using TransitOps.</p>
          </div>

          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-600">
            Registration form will be added here.
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
