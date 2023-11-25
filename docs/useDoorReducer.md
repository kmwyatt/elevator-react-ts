# useElevatorReducer.ts

엘리베이터 도어 개폐장치의 핵심 로직을 구현한 코드이다.


### 리듀서 초기값 정의

리듀서의 초기값을 정의했다.

```typescript
const initialState: DoorState = {
    status: 'CLOSED',
    nextCommand: { type: 'NOOP' },
}
```

- status: 도어 개폐장치의 상태 값으로, 처음에는 닫혀있기에 CLOSED로 초기화 했다.
- nextCommand: 다음 커맨드 액션의 값으로 No Operation으로 초기화 했다.


### 리듀서 정의

이벤트 액션과 커맨드 액션을 받아서 state를 업데이트 하는 리듀서의 코드를 작성했다.

```typescript
const reducer = (state: DoorState, action: Action): DoorState => {
    switch (action.type) {
        case 'OPEN_DOOR':
            return handleOpenDoor(state)
        case 'CLOSE_DOOR':
            return handleCloseDoor(state)
        case 'DOOR_OPENED':
            return handleDoorOpened(state)
        case 'DOOR_CLOSED':
            return handleDoorClosed(state)
        default:
            return state
    }
}

const [state, dispatch] = useReducer(reducer, initialState)
```

- OPEN_DOOR: 문을 열라는 의미의 커맨드이다. payload는 없다.
- CLOSE_DOOR: 문을 닫으라는 의미의 커맨드이다. payload는 없다.
- DOOR_OPENED: 문이 열렸을 때 발생하는 이벤트이다. payload는 없다.
- DOOR_CLOSED: 문이 닫혔을 때 발생하는 이벤트이다. payload는 없다.


### handleOpenDoor

문을 열라는 의미의 OPEN_DOOR 커맨드를 처리하는 함수이다.

```typescript
function handleOpenDoor(state: DoorState): DoorState {
    const newState = { ...state }

    newState.nextCommand = { type: 'NOOP' }

    if (newState.status === 'OPENED') {
        return newState
    }

    newState.status = 'OPENING'

    return newState
}
```

이미 열려있다면 아무것도 하지 않는다.

그게 아니라면 상태를 OPENING으로 바꾸어 문을 연다.


### handleCloseDoor

문을 닫으라는 의미의 CLOSE_DOOR 커맨드를 처리하는 함수이다.

```typescript
function handleCloseDoor(state: DoorState): DoorState {
    const newState = { ...state }

    newState.nextCommand = { type: 'NOOP' }

    if (newState.status === 'CLOSED') {
        return newState
    }

    newState.status = 'CLOSING'

    return newState
}
```

이미 닫혀있다면 아무것도 하지 않는다.

그게 아니라면 상태를 CLOSING으로 바꾸어 문을 닫는다.


### handleDoorOpened

문이 열렸을 때 발생하는 DOOR_OPENED 이벤트를 처리하는함수이다.

```typescript
function handleDoorOpened(state: DoorState): DoorState {
    const newState = { ...state }

    newState.nextCommand = { type: 'NOOP' }

    newState.status = 'OPENED'

    return newState
}
```

상태를 OPENED로 바꾸어 개폐장치를 멈춘다.


### handleDoorClosed

문이 닫혔을 때 발생하는 DOOR_CLOSED 이벤트를 처리하는함수이다.

```typescript
function handleDoorClosed(state: DoorState): DoorState {
    const newState = { ...state }

    newState.nextCommand = { type: 'NOOP' }

    newState.status = 'CLOSED'

    return newState
}
```

상태를 CLOSED로 바꾸어 개폐장치를 멈춘다.
