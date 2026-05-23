import { useEffect } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import { appInfo } from '@workspace/constants'
import { TooltipProvider } from '@workspace/ui/components/tooltip'
import '@workspace/ui/globals.css'
import NotFound from '@/components/NotFound'

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})

function RootComponent() {
  useEffect(() => {
    document.title = appInfo.title
  }, [])

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </div>
      <TanStackDevtools
        config={{
          position: 'bottom-right',
        }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </TooltipProvider>
  )
}
