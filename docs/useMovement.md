# useMovement.ts

엘리베이터 구동장치의 핵심 로직이 내려 준 state를 이용해서 엘리베이터 카의 움직임을 렌더링하기 위한 뷰 로직을 구현한 코드이다.


### 위치 초기값

config에서 설정한 값들을 이용해서 위치의 초기값을 설정한다.

```typescript
const initialPosition = (START_FLOOR - 1) * FLOOR_HEIGHT
```


### 필요한 것들

커맨드의 처리와 다음 커맨드 발동, state 업데이트를 위해 액션 컨텍스트와 무브먼트 리듀서를 불러온다.

엘리베이터 카의 위치를 표현할 position state를 선언하고 위에서 설정한 초기값으로 초기화한다.

```typescript
const { commandAction, dispatchEventAction, dispatchCommandAction } =
    useActionContext()
const { state, dispatch } = useMovementReducer()
const [position, setPosition] = useState<number>(initialPosition)
```


### 커맨드 처리와 다음 커맨드 발동

커맨드 액션을 받아서 처리하고 다음 커맨드를 발동한다.

```typescript
useEffect(() => {
    if (state.nextCommand.type === 'NOOP') {
        return
    }

    dispatchCommandAction(state.nextCommand)
}, [state.nextCommand])

useEffect(() => {
    dispatch(commandAction)
}, [commandAction])
```

state의 nextCommand가 변하면, NOOP이 아닐 때만 액션 컨텍스트의 commandAction을 업데이트 한다.

액션 컨텍스트의 commandAction이 변할 때, 그 커맨드를 무브먼트 리듀서에 dispatch 한다.


### 엘리베이터 카의 이동

엘리베이터 카의 이동을 구현한 코드이다.

```typescript
useEffect(() => {
    if (!state.direction) {
        return
    }

    setTimeout(() => {
        if (state.direction === 'UP') {
            setPosition(position + MOVEMENT_SPEED)
        } else if (state.direction === 'DOWN') {
            setPosition(position - MOVEMENT_SPEED)
        }
    }, 20)

    if (position % FLOOR_HEIGHT === 0) {
        const currentFloor = position / FLOOR_HEIGHT + 1
        floorArrivedOn(currentFloor)
        return
    }
}, [state.direction, position])
```

이동 방향과 위치가 변할 때마다 작동한다.

이동 방향이 설정되어 있지 않다면 멈춰있다는 뜻으로 아무 일도 하지 않는다.

그게 아니면, 0.02초 뒤에 방향이 UP이면 위치를 증가시키고, DOWN이면 위치를 감소시키는 방식으로 이동한다.

만약 위치가 층고로 나누어 떨어진다면 어떤 층에 도착한 것이다. 그 층에 도착했다는 이벤트를 발생시킨다.


### floorArrivedOn

어떤 층에 도착했다는 이벤트를 발생시키기 위한 함수이다.

```typescript
function floorArrivedOn(floor: number): void {
    const action = {
        type: 'ELEVATOR_ARRIVED_ON',
        payload: { floor },
    }
    dispatchEventAction(action)
}
```


### 반환

엘리베이터의 위치를 렌더링하기 위한 position 값을 반환한다.

```typescript
    return { position }
```