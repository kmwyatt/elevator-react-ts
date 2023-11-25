# useMovementReducer.ts

엘리베이터 구동장치의 핵심 로직을 구현한 코드이다.


### 리듀서 초기값 정의

리듀서의 초기값을 정의했다.

```typescript
const initialState = {
    direction: null,
    nextCommand: { type: 'NOOP' },
}
```

- direction: 이동 방향의 값으로, 처음에는 멈춰있기에 null로 초기화 했다.
- nextCommand: 다음 커맨드 액션의 값으로 No Operation으로 초기화 했다.


### 리듀서 정의

커맨드 액션을 받아서 state를 업데이트 하는 리듀서의 코드를 작성했다.

```typescript
const reducer = (
    state: MovementState,
    action: CommandAction
): MovementState => {
    switch (action.type) {
        case 'MOVE':
            return handleMove(state, action.payload)
        case 'STOP':
            return handleStop(state)
        default:
            return state
    }
}

const [state, dispatch] = useReducer(reducer, initialState)
```

- MOVE: 움직이라는 의미의 커맨드이다. payload로는 작동 방향의 값인 direction을 전달받는다.
- STOP: 멈추라는 의미의 커맨드이다. payload는 없다


### handleMove

움직이라는 의미의 MOVE 커맨드를 처리하는 함수이다.

```typescript
function handleMove(
    state: MovementState,
    { direction }: { direction: Direction }
): MovementState {
    const newState = { ...state }

    newState.nextCommand = { type: 'NOOP' }

    if (isMoving(newState)) {
        return newState
    }

    newState.direction = direction

    return newState
}
```
이미 움직이고 있다면 아무것도 하지 않는다.

그게 아니라면 작동 방향인 direction을 변경하여 움직인다.


### handleStop

멈추라는 의미의 STOP 커맨드를 처리하는 함수이다.

```typescript
function handleStop(state: MovementState): MovementState {
    const newState = { ...state }

    newState.direction = null
    newState.nextCommand = { type: 'OPEN_DOOR' }

    return newState
}
```
작동 방향인 direction을 null로 설정함으로써 멈추고 문을 연다.


### isMoving

움직이고 있는지 알려주는 함수이다.

```typescript
function isMoving(state: MovementState): boolean {
    return state.direction !== null
}
```

작동 방향이 설정되어 있다면 움직이고 있는 것(true)이고, 그게 아니면 멈춰 있는 것(false)이다.
