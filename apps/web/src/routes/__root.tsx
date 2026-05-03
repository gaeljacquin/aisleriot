import { useEffect } from 'react'
import { Outlet, createRootRoute, useLocation } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Footer from '@/components/Footer'
import { appInfo } from '@workspace/constants'
import '@workspace/ui/globals.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    document.title = appInfo.title
  }, [])

  return (
    <>
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
        {!isHome && <Footer />}
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
    </>
  )
}
