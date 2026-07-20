import React, { useState, useEffect } from 'react';
import { supabase, installSupabaseStorage } from './supabaseStorage';
import TradingSystem, { LOGO_URI } from './TradingSystem';
import { Users, ArrowLeft, LogOut } from 'lucide-react';

installSupabaseStorage();

const inputStyle = {
  background: '#0a0e14',
  border: '1px solid #263042',
  color: '#e2e8f0',
};

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.3 26.9 36 24 36c-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.6 39.6 16.3 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.2-4.2 5.6l6.6 5.6C41.4 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

function LoginScreen() {
  const [mode, setMode] = useState('login'); // "login" | "signup"
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError('');
    setInfo('');

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp, kiểm tra lại nhé.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { phone, full_name: fullName } },
        });
        if (error) throw error;
        setInfo(
          'Đăng ký thành công! Nếu hệ thống yêu cầu xác nhận email, hãy kiểm tra hộp thư rồi quay lại đăng nhập.'
        );
      }
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra, thử lại nhé.');
    }
    setLoading(false);
  }

  async function signInWithGoogle() {
    setError('');
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Không thể kết nối với Google, thử lại nhé.');
      setGoogleLoading(false);
    }
  }

  return (
    <div
      style={{
        background:
          'radial-gradient(circle at 50% 0%, #1d1033 0%, #0a0e14 55%)',
        fontFamily: "'Inter', sans-serif",
      }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600&display=swap');`}</style>
      <div
        style={{
          background: '#0d1119',
          border: '1px solid #241a38',
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
        }}
        className="w-full max-w-sm rounded-2xl p-7"
      >
        <div className="flex flex-col items-center text-center mb-7">
          <img
            src={LOGO_URI}
            alt="Hoàng Địa Kim"
            className="w-16 h-16 rounded-full mb-3"
            style={{ boxShadow: '0 0 22px rgba(251,191,36,0.35)' }}
          />
          <div
            className="font-bold text-xl tracking-tight"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              background: 'linear-gradient(90deg, #fde68a, #fbbf24, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            HOÀNG ĐỊA KIM
          </div>
          <div className="text-xs text-slate-500 mt-1.5">
            {mode === 'login'
              ? 'Đăng nhập vào hệ thống đầu tư của bạn'
              : 'Tạo tài khoản mới, miễn phí'}
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={googleLoading}
          className="w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2.5 disabled:opacity-60"
          style={{ background: '#f8f9fa', color: '#1f1f1f' }}
        >
          <GoogleIcon />
          {googleLoading ? 'Đang chuyển hướng...' : 'Tiếp tục với Google'}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ background: '#241a38' }} />
          <span className="text-[11px] text-slate-600 uppercase tracking-wide">
            hoặc dùng email
          </span>
          <div className="flex-1 h-px" style={{ background: '#241a38' }} />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === 'signup' && (
            <input
              type="text"
              placeholder="Họ tên"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={inputStyle}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500/60"
            />
          )}
          <input
            type="email"
            required
            placeholder="Email (Gmail...)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500/60"
          />
          {mode === 'signup' && (
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500/60"
            />
          )}
          <input
            type="password"
            required
            minLength={6}
            placeholder="Mật khẩu (tối thiểu 6 ký tự)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500/60"
          />
          {mode === 'signup' && (
            <input
              type="password"
              required
              minLength={6}
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={inputStyle}
              className="w-full px-3.5 py-2.5 rounded-lg text-sm outline-none focus:border-amber-500/60"
            />
          )}
          {error && (
            <div
              className="text-xs text-red-400 rounded-md px-3 py-2"
              style={{
                background: 'rgba(248,113,113,0.08)',
                border: '1px solid rgba(248,113,113,0.2)',
              }}
            >
              {error}
            </div>
          )}
          {info && (
            <div
              className="text-xs text-emerald-400 rounded-md px-3 py-2"
              style={{
                background: 'rgba(52,211,153,0.08)',
                border: '1px solid rgba(52,211,153,0.2)',
              }}
            >
              {info}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
              color: '#1a1206',
            }}
            className="w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-60"
          >
            {loading
              ? 'Đang xử lý...'
              : mode === 'login'
              ? 'Đăng nhập'
              : 'Tạo tài khoản'}
          </button>
        </form>

        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
            setInfo('');
            setConfirmPassword('');
          }}
          className="text-xs text-slate-500 mt-5 w-full text-center hover:text-amber-400"
        >
          {mode === 'login'
            ? 'Chưa có tài khoản? Đăng ký ngay'
            : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </div>
    </div>
  );
}

function AdminPanel({ onBack, onLogout }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) setErrorMsg(error.message);
      else setUsers(data || []);
      setLoading(false);
    })();
  }, []);

  return (
    <div
      style={{ background: '#0a0e14', fontFamily: "'Inter', sans-serif" }}
      className="min-h-screen text-slate-200"
    >
      <div
        className="px-6 md:px-10 py-6 flex items-center justify-between"
        style={{ borderBottom: '1px solid #1c2432' }}
      >
        <div className="flex items-center gap-3">
          <img
            src={LOGO_URI}
            alt="Hoàng Địa Kim"
            className="w-9 h-9 rounded-full"
          />
          <div>
            <div
              className="font-bold text-base"
              style={{
                background: 'linear-gradient(90deg, #fde68a, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Quản lý người dùng
            </div>
            <div className="text-[11px] text-slate-500">
              {users.length} tài khoản đã đăng ký
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-amber-400 px-3 py-1.5"
          >
            <ArrowLeft size={15} /> Quay lại hệ thống
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 px-3 py-1.5"
          >
            <LogOut size={15} /> Đăng xuất
          </button>
        </div>
      </div>

      <div className="px-6 md:px-10 py-6">
        {loading ? (
          <div className="text-sm text-slate-500">Đang tải danh sách...</div>
        ) : errorMsg ? (
          <div className="text-sm text-red-400">
            Lỗi: {errorMsg} (kiểm tra đã tạo bảng "admins" và thêm tài khoản của
            bạn vào đó chưa)
          </div>
        ) : users.length === 0 ? (
          <div className="text-sm text-slate-500">Chưa có ai đăng ký.</div>
        ) : (
          <div
            className="rounded-lg overflow-hidden"
            style={{ border: '1px solid #1c2432' }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr
                  style={{ background: '#0d1119' }}
                  className="text-left text-slate-500 text-xs uppercase"
                >
                  <th className="px-4 py-3 font-medium">Họ tên</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Số điện thoại</th>
                  <th className="px-4 py-3 font-medium">Ngày đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} style={{ borderTop: '1px solid #1c2432' }}>
                    <td className="px-4 py-3">{u.full_name || '—'}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-300">
                      {u.email}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-300">
                      {u.phone || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleString('vi-VN')
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(undefined);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState('app'); // "app" | "admin"

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) =>
      setSession(sess)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('admins')
        .select('user_id')
        .eq('user_id', session.user.id)
        .maybeSingle();
      setIsAdmin(!!data);
    })();
  }, [session]);

  if (session === undefined) {
    return (
      <div
        style={{ background: '#0a0e14' }}
        className="min-h-screen flex items-center justify-center text-slate-500 text-sm"
      >
        Đang tải...
      </div>
    );
  }
  if (!session) {
    return <LoginScreen />;
  }
  if (view === 'admin' && isAdmin) {
    return (
      <AdminPanel
        onBack={() => setView('app')}
        onLogout={() => supabase.auth.signOut()}
      />
    );
  }
  return (
    <TradingSystem
      key={session.user.id}
      userEmail={session.user.email}
      onLogout={() => supabase.auth.signOut()}
      isAdmin={isAdmin}
      onOpenAdmin={() => setView('admin')}
    />
  );
}
