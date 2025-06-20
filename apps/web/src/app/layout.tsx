import { AuthProvider } from '@/contexts/auth-context'
import { ProjectProvider } from '@/contexts/project-context'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ProjectProvider>
            {children}
            <Toaster />
          </ProjectProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
