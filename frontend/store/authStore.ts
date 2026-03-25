import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
    id: number
    username: string
    email: string
    is_job_seeker: boolean
    is_admin: boolean
}

interface AuthState {
    user: User | null
    token: string | null
    setAuth: (user: User, token: string) => void
    logout: () => void
}

const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setAuth: (user, token) => set({ user, token }),
            logout: () => set({ user: null, token: null }),
        }),
        { name: 'auth-storage' }
    )
)

export default useAuthStore
