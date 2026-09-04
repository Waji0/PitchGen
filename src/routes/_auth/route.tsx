// import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
// import { getSession } from '#/lib/auth-functions'

// export const Route = createFileRoute('/_auth')({
//   beforeLoad: async () => {
//     const session = await getSession()
//     if (session) {
//       throw redirect({ to: '/' })
//     }
//   },
//   component: AuthLayout,
// })

// function AuthLayout() {
//   return (
//     <div className="min-h-svh flex items-center justify-center bg-background">
//       <div className="w-full max-w-md">
//         <Outlet />
//       </div>
//     </div>
//   )
// }

import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getSession } from '#/lib/auth-functions'

// FIX: Removed the trailing slash
export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const session = await getSession()
    if (session?.user) {
      throw redirect({ to: '/' })
    }
  },
  component: AuthLayout,
})

// function AuthLayout() {
//   return (
//     <div className="min-h-svh flex items-center justify-center bg-background">
//       <div className="w-full max-w-md px-4">
//         <Outlet />
//       </div>
//     </div>
//   )
// }

function AuthLayout() {
  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}