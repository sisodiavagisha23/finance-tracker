import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api/axios.js';
import AuthLayout from '../components/AuthLayout.jsx';
import PasswordInput from '../components/PasswordInput.jsx';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[A-Za-z]{2,10}$/.test(form.name)) return toast.error('Name must be 2 to 10 letters only (no numbers or spaces)');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return toast.error('Enter a valid email');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start tracking income and expenses"
      footer={<>Already registered? <Link className="font-medium text-brand-600" to="/login">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input
            id="name"
            autoComplete="name"
            className="input"
            maxLength={10}
            placeholder="Letters only, max 10"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value.replace(/[^A-Za-z]/g, '').slice(0, 10) })}
          />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input id="email" type="email" autoComplete="email" className="input" value={form.email} onChange={set('email')} />
        </div>
        <div>
          <label className="label" htmlFor="password">Password</label>
          <PasswordInput id="password" autoComplete="new-password" value={form.password} onChange={set('password')} />
        </div>
        <button className="btn w-full" disabled={loading}>{loading ? 'Creating…' : 'Sign up'}</button>
      </form>
    </AuthLayout>
  );
}