/* eslint-disable react-refresh/only-export-components */

import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/')({
  component: AuthIndexRedirect,
})

function AuthIndexRedirect() {
  return null
}
