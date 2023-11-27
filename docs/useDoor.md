# useDoor.ts

엘리베이터 도어 개폐장치의 핵심 로직이 내려 준 state를 이용해서 엘리베이터 문의 움직임을 렌더링하기 위한 뷰 로직을 구현한 코드이다.


### 필요한 것들

커맨드의 처리와 다음 커맨드 발동, state 업데이트를 위해 액션 컨텍스트와 도어 리듀서를 불러온다.

엘리베이터 문의 위치를 표현할 position state를 선언하고 0으로 초기화한다.

엘리베이터 문이 열리고 n초 후에 닫힌다. 그 남은 시간의 값인 remainingTime state를 선언하고 0으로 초기화한다.

```typescript
const {
    eventAction,
    commandAction,
    dispatchEventAction,
    dispatchCommandAction,
} = useActionContext()
const { state, dispatch } = useDoorReducer()
const [position, setPosition] = useState<number>(0)
const [remainingTime, setRemainingTime] = useState<number>(0)
```


### 이벤트, 커맨드 처리와 다음 커맨드 발동

커맨드 액션을 받아서 처리하고 다음 커맨드를 발동한다.

```typescript
useEffect(() => {
    if (state.nextCommand.type === 'NOOP') {
        return
    }

    dispatchCommandAction(state.nextCommand)
}, [state.nextCommand])

useEffect(() => {
    dispatch(eventAction)
}, [eventAction])

useEffect(() => {
    dispatch(commandAction)
}, [commandAction])
```

state의 nextCommand가 변하면, NOOP이 아닐 때만 액션 컨텍스트의 commandAction을 업데이트 한다.

액션 컨텍스트의 eventAction이 변할 때, 그 이벤트를 도어 리듀서에 dispatch 한다.

액션 컨텍스트의 commandAction이 변할 때, 그 커맨드를 도어 리듀서에 dispatch 한다.


### 엘리베이터 문의 작동

엘리베이터 문의 작동을 구현한 코드이다.

```typescript
useEffect(() => {
    if (state.status === 'OPENED' || state.status === 'CLOSED') {
        return
    }

    if (position === DOOR_WIDTH && state.status === 'OPENING') {
        setRemainingTime(10)
        doorOpened()
        return
    }

    if (position === 0 && state.status === 'CLOSING') {
        doorClosed()
        return
    }

    setTimeout(() => {
        if (state.status === 'OPENING') {
            setPosition(position + DOOR_SPEED)
        } else if (state.status === 'CLOSING') {
            setPosition(position - DOOR_SPEED)
        }
    }, 20)
}, [state.status, position])
```

개폐장치의 상태와 위치가 변할 때마다 작동한다.

문이 열려있거나(OPENED), 닫혀있으면(CLOSED) 아무 일도 하지 않는다.

문이 열리는 중(OPENING)에, 문의 위치가 문의 폭과 같다면 
문이 닫히기까지 남은 시간을 10(0.1초 * 10 = 1초)으로 할당하고, 문이 열렸다는 이벤트(OPENED)를 발생시킨다.

문이 닫히는 중(CLOSING)에, 문의 위치가 0과 같다면 문이 닫혔다는 이벤트(CLOSED)를 발생시킨다.

문이 열리는 중(OPENED)이라면 0.02초 뒤에 위치 값을 증가시키고, 닫히는 중(CLOSED)이라면 0.02초 뒤에 위치 값을 감소시킨다.


### 문이 열리고 닫히는 시간

엘리베이터 문이 열리고 나서 닫히는 시간을 구현한 코드이다.

```typescript
useEffect(() => {
    if (remainingTime === 0) {
        closeDoor()
        return
    }

    setTimeout(() => {
        setRemainingTime(remainingTime - 1)
    }, 100)
}, [remainingTime])
```

남은 시간이 변할 때마다 작동한다.

남은 시간이 0이라면 문을 닫으라는 커맨드를 발생시킨다.

그게 아니라면 0.1초 뒤에 남은 시간에서 1을 뺀다.


### doorOpened

문이 열렸다는 이벤트를 발생시키기 위한 함수이다.

```typescript
function doorOpened(): void {
    const action = {
        type: 'DOOR_OPENED',
    }
    dispatchEventAction(action)
}
```


### doorClosed

문이 닫혔다는 이벤트를 발생시키기 위한 함수이다.

```typescript
function doorClosed(): void {
    const action = {
        type: 'DOOR_CLOSED',
    }
    dispatchEventAction(action)
}
```


### closeDoor

문을 닫으라는 의미의 커맨드를 발생시키기 위한 함수이다.

```typescript
function closeDoor(): void {
    const action = {
        type: 'CLOSE_DOOR',
    }
    dispatchCommandAction(action)
}
```


### 반환

문의 위치를 렌더링하기 위한 position 값을 반환한다.

```typescript
return { position }
```