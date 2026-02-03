import type { ReactElement } from "react"
import { MemoryRouter } from "react-router-dom"

export const renderWithRouter = (ui: ReactElement,routes: string[]) => {
    return (
        <MemoryRouter initialEntries={routes}>
           {ui}
        </MemoryRouter>
    )
}