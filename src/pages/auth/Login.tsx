import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Truck, Sun, Moon, Eye, EyeOff, Shield, Zap, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { alerts } from '../../utils/alerts';
import { useTheme } from '../../context/ThemeContext';
import logoIcon from '../../assets/logo-icon.png';

const loginSchema = z.object({
  email: z.string().email('Correo inválido').min(1, 'El correo es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema) as any,
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      const res = await authService.login(data);
      login(res.token, res.user);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      alerts.success('¡Bienvenido al sistema!');
    } catch {
      alerts.error('Credenciales incorrectas');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lp-root">
      {/* Background decoration */}
      <div className="lp-blob lp-blob--a" />
      <div className="lp-blob lp-blob--b" />
      <div className="lp-blob lp-blob--c" />

      {/* Theme toggle */}
      <button
        id="theme-toggle-btn"
        className="lp-theme-btn"
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
      >
        {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      </button>

      {/* Two-column layout */}
      <div className="lp-layout">

        {/* ── LEFT PANEL ── */}
        <aside className="lp-side">
          <div className="lp-side__inner">

            {/* Brand block */}
            <div className="lp-side__brand">
              <div className="lp-side__logo">
                <img src={logoIcon} alt="SAFV" width={36} height={36} />
              </div>
              <h1 className="lp-side__name">SAFV</h1>
              <p className="lp-side__tagline">
                Sistema de Administración<br />de Flotas Vehiculares
              </p>
            </div>

            {/* Divider */}
            <div className="lp-side__divider" />

            {/* Feature list */}
            <ul className="lp-side__features">
              <li className="lp-side__feat">
                <span className="lp-side__feat-icon"><Shield size={15} /></span>
                <div>
                  <strong>Gestión segura</strong>
                  <p>Control de accesos y permisos por rol</p>
                </div>
              </li>
              <li className="lp-side__feat">
                <span className="lp-side__feat-icon"><Zap size={15} /></span>
                <div>
                  <strong>Tiempo real</strong>
                  <p>Monitoreo continuo de la flota</p>
                </div>
              </li>
              <li className="lp-side__feat">
                <span className="lp-side__feat-icon"><Truck size={15} /></span>
                <div>
                  <strong>Control total</strong>
                  <p>Vehículos, conductores y rutas</p>
                </div>
              </li>
            </ul>

            {/* Bottom badge */}
            <div className="lp-side__badge">
              v2.0 &mdash; Plataforma empresarial
            </div>
          </div>
          {/* Decorative dot grid */}
          <div className="lp-side__dots" />
        </aside>

        {/* ── RIGHT PANEL ── */}
        <main className="lp-main">

          {/* Mobile-only logo */}
          <div className="lp-mob-header">
            <div className="lp-mob-logo"><img src={logoIcon} alt="SAFV" width={22} height={22} /></div>
            <span className="lp-mob-name">SAFV</span>
          </div>

          {/* Card */}
          <div className="lp-card">

            {/* Card header section */}
            <div className="lp-card__head">
              <h2 className="lp-card__title">Iniciar Sesión</h2>
              <p className="lp-card__desc">Ingresa tus credenciales para continuar</p>
            </div>

            {/* Separator */}
            <div className="lp-card__sep" />

            {/* Form section */}
            <form
              className="lp-card__body"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              {/* Email field */}
              <div className="lp-field">
                <label htmlFor="login-email" className="lp-field__label">
                  Correo Electrónico
                </label>
                <div className="lp-field__wrap">
                  <span className="lp-field__icon"><Mail size={15} /></span>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="ejemplo@empresa.com"
                    className={`lp-field__input${errors.email ? ' lp-field__input--err' : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <span className="lp-field__error">{errors.email.message}</span>
                )}
              </div>

              {/* Password field */}
              <div className="lp-field">
                <label htmlFor="login-password" className="lp-field__label">
                  Contraseña
                </label>
                <div className="lp-field__wrap">
                  <span className="lp-field__icon"><Lock size={15} /></span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`lp-field__input lp-field__input--pass${errors.password ? ' lp-field__input--err' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="lp-field__eye"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="lp-field__error">{errors.password.message}</span>
                )}
              </div>

              {/* Options row */}
              <div className="lp-options">
                <label className="lp-options__remember">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="lp-options__check"
                  />
                  <span>Recordarme</span>
                </label>
              </div>

              {/* Separator before button */}
              <div className="lp-card__sep lp-card__sep--light" />

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                className="lp-submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="lp-submit__spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </button>
            </form>

            {/* Card footer section */}
            <div className="lp-card__foot">
              <p className="lp-card__copy">
                &copy; {new Date().getFullYear()} SAFV &mdash; Todos los derechos reservados
              </p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
