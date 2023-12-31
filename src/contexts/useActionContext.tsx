import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react'

const initialState = {
    eventAction: { type: 'NONE' },
    commandAction: { type: 'NOOP' },
    dispatchEventAction: (() => {}) as Dispatch<SetStateAction<EventAction>>,
    dispatchCommandAction: (() => {}) as Dispatch<
        SetStateAction<CommandAction>
    >,
}

const ActionContext = createContext(initialState)

export function ActionProvider({ children }: { children: ReactNode }) {
    const [eventAction, dispatchEventAction] = useState<EventAction>({
        type: 'NONE',
    })
    const [commandAction, dispatchCommandAction] = useState<CommandAction>({
        type: 'NOOP',
    })

    useEffect(() => {
        console.log('Event', eventAction)
    }, [eventAction])

    useEffect(() => {
        console.log('Command', commandAction)
    }, [commandAction])

    return (
        <ActionContext.Provider
            value={{
                eventAction,
                commandAction,
                dispatchEventAction,
                dispatchCommandAction,
            }}
        >
            {children}
        </ActionContext.Provider>
    )
}

export default function useActionContext() {
    return useContext(ActionContext)
}
