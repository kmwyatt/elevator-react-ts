# useElevatorReducer.ts

엘리베이터 제어부의 핵심 로직을 구현한 코드이다.


### 리듀서 초기값 정의

리듀서의 초기값을 정의했다.

```typescript
const initialState: ElevatorState = {
    currentFloor: startFloor,
    callsGoingUp: new Array(totalFloors + 1).fill(false),
    callsGoingDown: new Array(totalFloors + 1).fill(false),
    selectedFloors: new Array(totalFloors + 1).fill(false),
    callDirection: null,
    runningDirection: null,
    isReadyToMove: true,
    nextCommand: { type: 'NOOP' },
}
```

- currentFloor: 현재 층의 값으로, 프로퍼티로 받은 시작 층의 값인 startFloor로 초기화 했다.
- callsGoingUp: 위로 올라가는 호출을 저장하는 배열로 모든 값을 false로 초기화 했다.
- callsGoingDown: 아래로 내려가는 호출을 저장하는 배열로 모든 값을 false로 초기화 했다.
- selectedFloors: 가고자 하는 층의 입력을 저장하는 배열로 모든 값을 false로 초기화 했다.
- callDirection: 현재 처리하고 있는 호출 방향의 값으로 null로 초기화 했다.
- runningDirection: 엘리베이터가 작동하고 있는 방향의 값으로 null로 초기화 했다.
- isReadyToMove: 움직일 준비가 되어있는지에 대한 값으로 false로 초기화 했다.
- nextCommand: 다음 커맨드 액션의 값으로 No Operation으로 초기화 했다.


### 리듀서 정의

이벤트 액션을 받아서 state를 업데이트 하는 리듀서의 코드를 작성했다.

```typescript
const reducer = (
    state: ElevatorState,
    action: EventAction
): ElevatorState => {
    switch (action.type) {
        case 'ELEVATOR_CALLED':
            return handleElevatorCalled(state, action.payload)
        case 'FLOOR_SELECTED':
            return handleFloorSelected(state, action.payload)
        case 'ELEVATOR_ARRIVED_ON':
            return handleElevatorArrivedOn(state, action.payload)
        case 'DOOR_CLOSED':
            return handleDoorClosed(state)
        default:
            return state
    }
}

const [state, dispatch] = useReducer(reducer, initialState)
```


- ELEVATOR_CALLED: 사용자가 각 층에 있는 버튼으로 엘리베이터를 호출할 때 발생하는 이벤트이다. payload로는 호출 방향의 값인 direction과 호출한 층의 값인 floor를 전달받는다.
- FLOOR_SELECTED: 사용자가 엘리베이터 내부에 있는 버튼으로 가고자 하는 층을 선택할 때 발생하는 이벤트이다. payload로는 희망 층의 값인 floor를 전달받는다.
- ELEVATOR_ARRIVED_ON: 엘리베이터 카가 움직이다가 해당 층에 도착할 때 발생하는 이벤트이다. payload로는 도착한 층의 값인 floor를 전달받는다.
- DOOR_CLOSED: 문이 작동하다가 닫혔을 때 발생하는 이벤트이다. payload는 없다.


### handleElevatorCalled

사용자가 각 층에 있는 버튼으로 엘리베이터를 호출할 때 발생하는 ELEVATOR_CALLED 이벤트를 처리하는 함수이다.

```typescript
function handleElevatorCalled(
    state: ElevatorState,
    {
        floor,
        direction,
    }: {
        floor: number
        direction: Direction
    }
): ElevatorState {
    const newState: ElevatorState = { ...state }

    if (floor === newState.currentFloor && !newState.runningDirection) {
        newState.isReadyToMove = false
        newState.nextCommand = { type: 'OPEN_DOOR' }

        return newState
    }

    if (direction === 'UP') {
        newState.callsGoingUp[floor] = true
    } else if (direction === 'DOWN') {
        newState.callsGoingDown[floor] = true
    }

    if (!newState.callDirection) {
        newState.callDirection = direction
        newState.runningDirection = getDirectionToMove(newState, floor)
        controlMovement(newState)

        return newState
    }

    newState.nextCommand = { type: 'NOOP' }

    return newState
}
```

호출 층이 현재 층과 같고 엘리베이터 카가 움직이지 않고 있다면, 아무것도 하지 않는다.

호출 방향이 UP이면 callsGoingUp에, DOWN이면 callsGoingDown 배열의 호출 층에 있는 값을 true로 바꿔준다.

현재 엘리베이터가 처리하고 있는 호출 방향이 없다면, 그 것을 입력받은 호출 방향으로 설정하고 작동 방향을 getDirectionToMove 함수로 새로 설정한다.
그 후에 controlMovement 함수로 다음에 발동할 MOVE 커맨드에 대한 설정을 한다.


### handleFloorSelected

사용자가 엘리베이터 내부에 있는 버튼으로 가고자 하는 층을 선택할 때 발생하는 FLOOR_SELECTED 이벤트를 처리하는 함수이다.

```typescript
function handleFloorSelected(
    state: ElevatorState,
    { floor }: { floor: number }
): ElevatorState {
    const newState: ElevatorState = { ...state }

    if (floor === newState.currentFloor && !newState.runningDirection) {
        newState.nextCommand = { type: 'NOOP' }

        return newState
    }

    newState.selectedFloors[floor] = true

    if (!newState.runningDirection) {
        newState.runningDirection = getDirectionToMove(newState, floor)
        controlMovement(newState)

        if (!newState.callDirection) {
            newState.callDirection = newState.runningDirection
        }

        return newState
    }

    newState.nextCommand = { type: 'NOOP' }

    return newState
}
```
선택 층이 현재 층과 같고 엘리베이터 카가 움직이지 않고 있다면, 아무것도 하지 않는다.

selectedFloors 배열의 호출 층에 있는 값을 true로 바꿔준다.

현재 엘리베이터가 처리하고 있는 호출 방향이 없다면, 작동 방향을 새로 설정한다.
그 후에 발동할 MOVE 커맨드에 대한 설정을 한다.
현재 엘리베이터가 처리하고 있는 호출 방향이 없다면 작동 방향과 같이 설정한다.


### handleElevatorArrivedOn

엘리베이터 카가 움직이다가 해당 층에 도착할 때 발생하는 ELEVATOR_ARRIVED_ON 이벤트를 처리하는 함수이다.

```typescript
function handleElevatorArrivedOn(
    state: ElevatorState,
    { floor }: { floor: number }
): ElevatorState {
    const newState = { ...state }

    newState.currentFloor = floor

    if (
        floor === getCallDestination(newState) ||
        floor === getSelectedDestination(newState)
    ) {
        deleteCurrentFloorFromArrays(newState)
        controlDirection(newState)
        newState.isReadyToMove = false
        newState.nextCommand = { type: 'STOP' }

        return newState
    }

    newState.nextCommand = { type: 'NOOP' }

    return newState
}
```

현재 층을 업데이트 해준다.

현재 층이 처리하는 호출의 목적지이거나 희망 층의 목적지라면, 그 층에 대한 호출과 선택을 저장하는 배열에서 그 값을 false로 바꿔주고, 작동 방향을 새로 설정한다.
움직일 준비가 되지 않았다고 설정해놓고, STOP 커맨드를 발동한다.


### handleDoorClosed

엘리베이터 카가 움직이다가 해당 층에 도착할 때 발생하는 DOOR_CLOSED 이벤트를 처리하는 함수이다.

```typescript
function handleDoorClosed(state: ElevatorState): ElevatorState {
    const newState = { ...state }

    newState.isReadyToMove = true
    controlMovement(newState)

    return newState
}
```

문이 닫혔으니 움직일 준비가 되었다고 설정하고, 그 후에 발동할 MOVE 커맨드에 대한 설정을 한다.


### getDirectionToMove

이동할 방향을 반환하는 함수이다.

```typescript
function getDirectionToMove(
    state: ElevatorState,
    destination: number
): Direction | null {
    if (destination > state.currentFloor) {
        return 'UP'
    } else if (destination < state.currentFloor) {
        return 'DOWN'
    }

    return null
}
```

목적지가 현재 층보다 위에 있다면 UP을, 아래에 있다면 DOWN을, 둘 다 아니라면 null을 반환한다.


### getCallDestination

호출에 따른 목적지를 반환하는 함수이다.

```typescript
function getCallDestination(state: ElevatorState): number | null {
    if (state.callDirection === 'UP') {
        for (let i = 1; i <= totalFloors; i++) {
            if (state.callsGoingUp[i]) {
                return i
            }
        }
    } else if (state.callDirection === 'DOWN') {
        for (let i = totalFloors; i >= 1; i--) {
            if (state.callsGoingDown[i]) {
                return i
            }
        }
    }

    return null
}
```

현재 처리 중인 호출 방향이 UP이면 UP 호출의 최저 층수를, DOWN이면 DOWN 호출의 최고 층수를, 
처리 중인 방향이 설정되지 않았거나 해당 방향의 호출이 없다면 null을 반환한다.

### getSelectedDestination

사용자가 가기를 희망하는 층에 따른 목적지를 반환하는 함수이다.

```typescript
function getSelectedDestination(state: ElevatorState): number | null {
    if (state.runningDirection === state.callDirection) {
        if (state.callDirection === 'UP') {
            for (let i = state.currentFloor; i <= totalFloors; i++) {
                if (state.selectedFloors[i] || state.callsGoingUp[i]) {
                    return i
                }
            }
        } else if (state.callDirection === 'DOWN') {
            for (let i = state.currentFloor; i >= 1; i--) {
                if (state.selectedFloors[i] || state.callsGoingDown[i]) {
                    return i
                }
            }
        }
    } else {
        if (state.callDirection === 'UP') {
            for (let i = state.currentFloor; i <= totalFloors; i++) {
                if (state.selectedFloors[i]) {
                    return i
                }
            }
        } else if (state.callDirection === 'DOWN') {
            for (let i = state.currentFloor; i >= 1; i--) {
                if (state.selectedFloors[i]) {
                    return i
                }
            }
        }
    }

    return null
}
```

현재 처리 중인 호출 방향이 UP이면 현재 층부터의 최고 층까지의 희망 최저 층수를, DOWN이면 1층부터 현재 층까지의 희망 최고 층수를 반환한다.
처리 중인 방향이 설정되지 않았거나 값이 없다면 null을 반환한다.

엘리베이터 작동 방향과 처리 중인 호출 방향이 같다면, 그 호출들도 희망 층으로 선택된 것과 똑같은 역할을 하기 때문에 같이 찾아보고 값을 반환한다.


### deleteCurrentFloorFromArrays

현재 층에 대한 정보를 조건에 따라 false로 바꿔주며 없애는 함수이다.

```typescript
function deleteCurrentFloorFromArrays(state: ElevatorState): void {
    state.selectedFloors = state.selectedFloors.map((v, i) =>
        i === state.currentFloor ? false : v
    )

    if (state.callDirection === 'UP') {
        state.callsGoingUp = state.callsGoingUp.map((v, i) =>
            i === state.currentFloor ? false : v
        )
    } else if (state.callDirection === 'DOWN') {
        state.callsGoingDown = state.callsGoingDown.map((v, i) =>
            i === state.currentFloor ? false : v
        )
    }
}
```

가기를 희망하는 층들에서 현재 층을 없앤다.

처리 중인 호출 방향이 UP이면 올라가는 호출의 층들에서 현재 층을 없애고, DOWN이면 내려가는 호출의 층들에서 현재 층을 없앤다.


### controlDirection

조건에 따라 방향을 설정하는 함수이다.

```typescript
function controlDirection(state: ElevatorState): void {
    if (
        state.callsGoingUp.filter((v) => v).length === 0 &&
        state.callsGoingDown.filter((v) => v).length === 0 &&
        state.selectedFloors.filter((v) => v).length === 0
    ) {
        state.callDirection = null
        state.runningDirection = null

        return
    }

    const selectedDestination = getSelectedDestination(state)
    if (selectedDestination !== null) {
        state.runningDirection = getDirectionToMove(
            state,
            selectedDestination
        )
        return
    }

    const callDestination = getCallDestination(state)
    if (callDestination !== null) {
        state.runningDirection = getDirectionToMove(state, callDestination)
        return
    }

    state.selectedFloors.fill(false)

    if (state.callDirection === 'UP') {
        state.callDirection = 'DOWN'
        state.callsGoingDown[state.currentFloor] = false
    } else if (state.callDirection === 'DOWN') {
        state.callDirection = 'UP'
        state.callsGoingUp[state.currentFloor] = false
    }

    const newDestination = getCallDestination(state)

    if (!newDestination) {
        state.callDirection = null
        state.runningDirection = null
        return
    }

    state.runningDirection = getDirectionToMove(state, newDestination)
}
```

호출도, 사용자가 가기를 희망하는 층도 없다면 처리하는 호출 방향도, 작동하는 방향도 null로 바꾼다.

아니면, 사용자가 가기를 희망하는 층에 따른 목적지가 있다면 그 목적지를 향한 방향을 작동 방향으로 설정한다.

아니면, 호출에 따른 목적지가 있다면 그 목적지를 향한 방향을 작동 방향으로 설정한다.

아니면, 희망 층 목록을 비워주고 방향을 바꾼다.
그 방향에 대한 호출 목적지가 없다면 처리하는 호출 방향도, 작동하는 방향도 null로 바꾸고, 있다면 그 목적지를 향한 방향으로 작동 방향을 설정한다.


### controlMovement

이 후에 발동할 MOVE 커맨드를 설정하는 함수이다.

```typescript
function controlMovement(state: ElevatorState): void {
    if (state.isReadyToMove && state.runningDirection) {
        state.nextCommand = {
            type: 'MOVE',
            payload: { direction: state.runningDirection },
        }
        return
    }

    state.nextCommand = { type: 'NOOP' }
}
```

엘리베이터가 움직일 준비가 되어있고 작동 방향이 설정되어 있다면, 작동 방향으로 움직이라는 MOVE 커맨드를 발동시킨다.

