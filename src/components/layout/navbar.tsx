// import { Link, useNavigate } from '@tanstack/react-router'
// import { Sparkles, LogOut, Plus } from 'lucide-react'
// import { Button } from '#/components/ui/button'
// import { getSession } from '#/lib/auth-functions'
// import { authClient } from '#/lib/auth-client'
// import { useQuery } from '@tanstack/react-query'



// export function Navbar() {
//   const navigate = useNavigate()
//   const { data: session } = useQuery({
//     queryKey: ['session'],
//     queryFn: () => getSession(),
//   })

//   const handleLogout = async () => {
//     await authClient.signOut()
//     navigate({ to: '/login' })
//   }

//   return (
//     <header className="sticky top-0 z-50 w-full border-b border-border/30 glass">
//       <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2 group">
//           <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
//             <Sparkles className="size-4 text-primary" />
//           </div>
//           <span className="text-lg font-bold tracking-tight">
//             Pitch<span className="text-primary">Gen</span>
//           </span>
//         </Link>

//         {/* Nav Actions */}
//         <div className="flex items-center gap-3">
//           {session?.user ? (
//             <>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => navigate({ to: '/' })}
//               >
//                 <Plus className="size-4 mr-1.5" />
//                 New Pitch
//               </Button>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={handleLogout}
//               >
//                 <LogOut className="size-4" />
//               </Button>
//             </>
//           ) : (
//             <Button
//               size="sm"
//               onClick={() => navigate({ to: '/login' })}
//             >
//               Sign In
//             </Button>
//           )}
//         </div>
//       </div>
//     </header>
//   )
// }



import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { Sparkles, LogOut, Plus } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { getSession } from '#/lib/auth-functions'
import { authClient } from '#/lib/auth-client'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export function Navbar() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Know which page we're on
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isOnLogin = pathname === '/login'

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: () => getSession(),
  })

  const handleLogout = async () => {
    await authClient.signOut()
    queryClient.invalidateQueries({ queryKey: ['session'] })
    navigate({ to: '/login' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/30 glass">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
            <Sparkles className="size-4 text-primary" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Pitch<span className="text-primary">Gen</span>
          </span>
        </Link>

        {/* Nav Actions */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              <span className="text-sm text-muted-foreground hidden sm:block max-w-[160px] truncate">
                {session.user.name}
              </span>
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/' })}>
                <Plus className="size-4 mr-1.5" />
                New Pitch
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="size-4" />
              </Button>
            </>
          ) : (
            // Only show Sign In when NOT on the login page
            !isOnLogin && (
              <Button size="sm" onClick={() => navigate({ to: '/login' })}>
                Sign In
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  )
}