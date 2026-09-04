// import {
//   HeadContent,
//   Outlet,
//   Scripts,
//   createRootRouteWithContext,
// } from '@tanstack/react-router'
// import type { QueryClient } from '@tanstack/react-query'
// // import { QueryClientProvider } from '#/integrations/tanstack-query/root-provider'
// import { QueryClientProviderWrapper as QueryClientProvider } from '#/integrations/tanstack-query/root-provider'
// import { Toaster } from '#/components/ui/sonner'
// import { Navbar } from '#/components/layout/navbar'
// import appCss from '#/styles.css?url'

// interface RouterContext {
//   queryClient: QueryClient
// }

// export const Route = createRootRouteWithContext<RouterContext>()({
//   head: () => ({
//     meta: [
//       { charSet: 'utf-8' },
//       { name: 'viewport', content: 'width=device-width, initial-scale=1' },
//       { title: 'PitchGen — Make your story impossible to ignore' },
//       { name: 'description', content: 'AI-powered presentation generator that makes your story impossible to ignore.' },
//     ],
//     links: [
//       { rel: 'stylesheet', href: appCss },
//       { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
//     ],
//   }),
//   component: RootLayout,
//   shellComponent: RootDocument,
// })

// function RootLayout() {
//   return (
//     <div className="min-h-svh flex flex-col">
//       <Navbar />
//       <main className="flex-1 flex flex-col">
//         <Outlet />
//       </main>
//     </div>
//   )
// }

// function RootDocument({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en" suppressHydrationWarning className="dark">
//       <head>
//         <HeadContent />
//       </head>
//       <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/20">
//         <QueryClientProvider>
//           {children}
//           <Toaster closeButton position="top-center" richColors />
//           <Scripts />
//         </QueryClientProvider>
//       </body>
//     </html>
//   )
// }




import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  Link,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProviderWrapper } from '#/integrations/tanstack-query/root-provider'
import { Toaster } from '#/components/ui/sonner'
import { Navbar } from '#/components/layout/navbar'
import { Button } from '#/components/ui/button'
import { Sparkles, Home } from 'lucide-react'
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
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootLayout,
  shellComponent: RootDocument,
  // FIX: Add a custom 404 component to silence the warning
  notFoundComponent: NotFoundComponent,
})

function NotFoundComponent() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
        <Sparkles className="size-8 text-primary" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">
          We couldn't find the slide deck you're looking for.
        </p>
      </div>
      <Link to="/">
        <Button>
          <Home className="size-4 mr-2" /> Back to Dashboard
        </Button>
      </Link>
    </div>
  )
}

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
      <body className="font-sans antialiased bg-background text-foreground">
        <QueryClientProviderWrapper>
          {children}
          <Toaster closeButton position="top-center" richColors />
          <Scripts />
        </QueryClientProviderWrapper>
      </body>
    </html>
  )
}