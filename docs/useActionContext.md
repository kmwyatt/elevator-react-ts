# useActionContext.ts

이벤트와 커맨드의 통로를 구현한 코드이다.


### 컨텍스트 생성

초기값을 정의하고, 컨텍스트를 생성했다.

```typescript
const initialState = {
    eventAction: { type: 'NONE' },
    commandAction: { type: 'NOOP' },
    dispatchEventAction: (() => {}) as Dispatch<SetStateAction<EventAction>>,
    dispatchCommandAction: (() => {}) as Dispatch<
        SetStateAction<CommandAction>
        >,
}

const ActionContext = createContext(initialState)
```

### ActionProvider

이벤트와 커맨드를 리듀서에 전달하기 위해 provider를 정의했다.

```typescript jsx
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
```

useState를 이용해서 이벤트와 커맨드를 set함으로써 dispatch 할 수 있도록 했다.

dispatchEvent라는 함수가 이미 존재하기 때문에 뒤에 Action을 붙여 이름을 지었다.

eventAction은 이벤트가 없다는 뜻의 NONE으로, commandAction은 아무 일도 하지 않는 뜻의 NOOP으로 초기화했다.

useEffect를 이용해서 이벤트가 발생하거나 커맨드가 발동할 때 로그를 찍어 콘솔을 통해 확인할 수 있도록 했다.

### useActionContext

액션 컨텍스트를 편하게 호출해서 사용할 수 있도록 정의했다.

```typescript
export default function useActionContext() {
    return useContext(ActionContext)
}
```
