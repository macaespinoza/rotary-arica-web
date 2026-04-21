/**
 * Layout específico para /admin/login — sin verificación de sesión.
 * Este layout hace override del layout de /admin para la ruta de login,
 * evitando el redirect loop. La página hereda el root layout (Bootstrap CSS).
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
