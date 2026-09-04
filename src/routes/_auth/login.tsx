// import { createFileRoute } from '@tanstack/react-router'
// import { authClient } from '#/lib/auth-client'
// import { Button } from '#/components/ui/button'
// import { Github, Chrome, Sparkles } from 'lucide-react'

// export const Route = createFileRoute('/_auth/login')({
//   component: LoginPage,
// })

// function LoginPage() {
//   const handleGoogleLogin = async () => {
//     await authClient.signIn.social({ provider: 'google' })
//   }

//   const handleGithubLogin = async () => {
//     await authClient.signIn.social({ provider: 'github' })
//   }

//   return (
//     <div className="glass rounded-2xl p-8 space-y-6">
//       {/* Header */}
//       <div className="text-center space-y-2">
//         <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
//           <Sparkles className="size-6 text-primary" />
//         </div>
//         <h1 className="text-2xl font-bold">Welcome to PitchGen</h1>
//         <p className="text-muted-foreground text-sm">
//           Make your story impossible to ignore
//         </p>
//       </div>

//       {/* Social Login */}
//       <div className="space-y-3">
//         <Button
//           variant="outline"
//           className="w-full h-11"
//           onClick={handleGoogleLogin}
//         >
//           <Chrome className="size-4 mr-2" />
//           Continue with Google
//         </Button>
//         <Button
//           variant="outline"
//           className="w-full h-11"
//           onClick={handleGithubLogin}
//         >
//           <Github className="size-4 mr-2" />
//           Continue with GitHub
//         </Button>
//       </div>

//       <p className="text-xs text-center text-muted-foreground">
//         By signing in, you agree to our Terms of Service and Privacy Policy.
//       </p>
//     </div>
//   )
// }



import { createFileRoute } from '@tanstack/react-router'
import { authClient } from '#/lib/auth-client'
import { Button } from '#/components/ui/button'
import { Github, Chrome, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({ provider: 'google' })
  }
  const handleGithubLogin = async () => {
    await authClient.signIn.social({ provider: 'github' })
  }

  return (
    <div className="glass rounded-2xl p-8 space-y-6 border border-border/30 bg-card/60 backdrop-blur-xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="size-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Welcome to PitchGen</h1>
        <p className="text-muted-foreground text-sm">Make your story impossible to ignore</p>
      </div>

      <div className="space-y-3">
        <Button variant="outline" className="w-full h-11" onClick={handleGoogleLogin}>
          <Chrome className="size-4 mr-2" /> Continue with Google
        </Button>
        <Button variant="outline" className="w-full h-11" onClick={handleGithubLogin}>
          <Github className="size-4 mr-2" /> Continue with GitHub
        </Button>
      </div>
    </div>
  )
}