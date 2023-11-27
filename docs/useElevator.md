# useElevator.ts

엘리베이터 제어부의 핵심 로직이 내려 준 state를 이용해서 버튼들을 렌더링하기 위한 뷰 로직을 구현한 코드이다.


### 필요한 것들

이벤트의 처리와 다음 커맨드 발동, state 업데이트를 위해 액션 컨텍스트와 엘리베이터 리듀서를 불러온다.

```typescript
const {
    eventAction,
    commandAction,
    dispatchEventAction,
    dispatchCommandAction,
} = useActionContext()
const { state, dispatch } = useElevatorReducer(START_FLOOR, TOTAL_FLOORS)
```


### 이벤트 처리와 다음 커맨드 발동

이벤트 액션을 받아서 처리하고 다음 커맨드를 발동한다.

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
```

state의 nextCommand가 변하면, NOOP이 아닐 때만 액션 컨텍스트의 commandAction을 업데이트 한다.

액션 컨텍스트의 eventAction이 변할 때, 그 이벤트를 엘리베이터 리듀서에 dispatch 한다.


### callGoingUp

각 층에 있는 버튼으로 위로 간다는 호출을 하기 위한 함수이다.

```typescript
function callGoingUp(floor: number): void {
    const action = {
        type: 'ELEVATOR_CALLED',
        payload: { direction: 'UP', floor },
    }
    dispatchEventAction(action)
}
```


### callGoingDown

각 층에 있는 버튼으로 아래로 간다는 호출을 하기 위한 함수이다.

```typescript
function callGoingDown(floor: number): void {
    const action = {
        type: 'ELEVATOR_CALLED',
        payload: { direction: 'DOWN', floor },
    }
    dispatchEventAction(action)
}
```


### selectFloor

엘리베이터 카 내부에 있는 버튼으로 희망 층을 입력하기 위한 함수이다.

```typescript
function selectFloor(floor: number): void {
    const action = {
        type: 'FLOOR_SELECTED',
        payload: { floor },
    }
    dispatchEventAction(action)
}
```


### 반환

버튼의 조작을 위한 함수들과, 버튼 렌더링을 위한 배열들을 반환한다.

```typescript
return {
    callGoingUp,
    callGoingDown,
    selectFloor,

    callsGoingUp: state.callsGoingUp,
    callsGoingDown: state.callsGoingDown,
    selectedFloors: state.selectedFloors,
}
```