import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
// import { QueryClientProvider } from '#/integrations/tanstack-query/root-provider'
import { QueryClientProviderWrapper as QueryClientProvider } from '#/integrations/tanstack-query/root-provider'
import { Toaster } from '#/components/ui/sonner'
import { Navbar } from '#/components/layout/navbar'
import appCss from '#/styles.css?url'

interface RouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'PitchGen — Make your story impossible to ignore' },
      { name: 'description', content: 'AI-powered presentation generator that makes your story impossible to ignore.' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
})

// function RootLayout() {
//   return (
//     <div className="min-h-svh flex flex-col">
//       <Navbar />
//       <main className="flex-1">
//         <Outlet />
//       </main>
//     </div>
//   )
// }

function RootLayout() {
  return (
    <div className="min-h-svh flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/20">
        <QueryClientProvider>
          {children}
          <Toaster closeButton position="top-center" richColors />
          <Scripts />
        </QueryClientProvider>
      </body>
    </html>
  )
}