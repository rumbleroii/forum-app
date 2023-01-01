import create from 'zustand';

import {devtools, persist} from 'zustand/middleware';

const userStore = (set) => ({
    authUser: null,
    sessionToken: null,
    loading: null,
    setUser: (user, token) => {
        set((state) => ({...state, authUser: user, sessionToken: token}))
    },
    setLoading: (status) => {
        set((state) => ({...state, loading: status}))
    }
})

const useUserStore = create(
    devtools(
        persist(userStore, {
            name: 'user'
        })
    )
)

export default useUserStore;