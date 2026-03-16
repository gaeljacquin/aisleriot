import { useEffect } from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import Footer from '@/components/Footer'
import { appInfo } from '@workspace/constants'
import '@workspace/ui/globals.css'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  useEffect(() => {
    document.title = appInfo.title
  }, [])

  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
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
