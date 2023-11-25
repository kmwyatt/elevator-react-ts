# Elevator with React & Typescript

Nov. 2023 [DEMO](https://superlative-praline-21a709.netlify.app/)

## 프로젝트 소개

미국의 소프트웨어 엔지니어 David M. Beazley가 제안한 엘리베이터 구현 프로젝트이다.
일상 속에서 흔하게 보이는, 어떻게 작동하고 있는지 누구도 궁금해하지 않는 엘리베이터를 오류 없이 제대로 작동하게 구현하는 것이 의외로 어렵다고 한다.

2023년 9월에 구현만을 목표로 작성한 코드가 있다.
그 코드에 문제가 있기도 했고, 초기에 규칙을 설정하지 않고 생각이 가는대로 코드를 작성했다가 완전히 꼬여버린 경험이 있다.
이 프로젝트는 이전 코드의 문제점을 분석하고, 규칙 설정을 미리 한 후에 개선된 엘리베이터 코드를 작성하는 것을 목표로 한다.


### 이전 코드의 문제점

[이전 코드 GitHub Repository](https://github.com/kmwyatt/elevator-react-typescript-prev)

useState와 useEffect로만 상태를 관리하고, 그 상태를 이용해서 렌더링을 하도록 구현했다.

관심사(concern)가 섞여 있어 코드를 통해 무엇을 얻으려고 했는지 분간이 가지 않는다.
엘리베이터 핵심 로직에 관련된 state와 렌더링을 위한 state가 무분별하게 섞여 있기에 ***가독성이 저하된다는 문제***가 생겼다.

어떻게 보여지는 지에만 집중하다보니, ***로직이 DOM구조에 종속*** 되어버렸다.
결국 엘리베이터를 구현하는 것보다 어떻게 엘리베이터를 보여줄지에 집중한 코드가 되어버렸다.
props drilling이 있고, 상위 컴포넌트가 해당 컴포넌트에는 필요가 없지만 하위 컴포넌트로 내려줄 목적의 state를 가지게 되었다.
엘리베이터 핵심 로직에 관련된 state와 렌더링을 위한 state 사이에 필요없지만 내려보내 줄 state까지 섞여버려서 ***더욱 읽기가 어려워졌다***.

DOM구조에 종속된 코드라는 점과, 꼬여버린 state들로 인해서 수정이 어렵고, 그에 따라서 ***유지보수가 쉽지 않을 것***으로 예상된다.

***확장성에 대한 문제***도 있다. 다른 무언가가 추가되어야 할 때, 코드 전반의 수정이 불가피하다.
지금으로서는 전반적인 코드 수정 없이 설정할 수 있는 것이 총 층수 말고는 없다.

***테스트의 어려움***이 있다. 비즈니스 로직과 뷰 로직이 뒤죽박죽 섞여 있어 테스트 코드를 작성하기가 까다로운 상황이다.
직접 조작하며 확인을 하는 수 밖에 없는데 코드를 작성한 나 조차도 이 엘리베이터가 제대로 작동하는지 확인하기가 어렵다.

이 코드를 여러 명이 다 같이 수정한다면 그게 가능할까? 이 코드로는 ***협업이 불가능***하다.


### 프로젝트 목표

- 규칙을 먼저 설정해서, 비즈니스 로직을 명확히 함으로써 ***규칙에 따라 제대로 작동하도록 구현***한다
- 비즈니스 로직에 대한 테스트 코드를 작성함으로써 ***테스트 가능한 코드***를 만든다
- 뷰 로직은 비즈니스 로직 작성을 완료하고 나서 작성함으로써 자연스럽게 관심사가 분리되도록 한다
- 비즈니스 로직와 뷰 로직을 분리함으로써 ***가독성을 확보***한다
- 역할별로 작동하는 코드를 작성함으로써 업무를 분배할 수 있는, ***협업이 가능한 코드***를 만든다
- 초기 값들을 설정할 수 있게 함으로써 ***확장이 가능한 코드***를 작성한다

정확한 구현과 테스트 가능성, 가독성, 협업 가능성, 확장성을 확보하는 것을 목표로 했다.


### 설정한 규칙

엘리베이터를 이용한 경험을 토대로 규칙을 설정했다.

- 엘리베이터를 호출(위로 가겠다, 아래로 가겠다)하면 그 층으로 이동하고 멈춘다.
- 그 호출이 여러 개이면 처리중인 호출과 같은 방향의 호출을 우선적으로 처리한다.
- 위로 가는 호출은 최하층부터, 아래로 가는 호출은 최상층부터 처리한다.
- 내부의 층 버튼을 누르면 이동하다가 그 층에서 멈춘다.
- 엘리베이터의 작동 진행방향의 변동이 생기면 내부 층수 버튼을 초기화한다. (ex. 위로 가는 호출을 했지만 현재 층보다 더 아래 층의 버튼을 누른 경우, 처리되지 않고 사라진다)
- 문이 열려있거나, 문이 열리고 있거나, 문이 닫히고 있으면 엘리베이터 카는 움직이지 않는다.
- 엘리베이터 카가 멈추면 일단 문이 한번 열린다.


## 구현 내용

### 디렉토리 구조

![directory](directory.png)

### 초기 값 설정

/src/constants/config.ts

```typescript
export const TOTAL_FLOORS = 5
export const START_FLOOR = 1
export const FLOOR_HEIGHT = 60
export const MOVEMENT_SPEED = 1
export const DOOR_SPEED = 1
export const DOOR_WIDTH = 13
```

- TOTAL_FLOORS: 총 층수는 5층이다
- START_FLOOR: 시작 층은 1층이다
- FLOOR_HEIGHT: 층고는 60이다
- MOVEMENT_SPEED: 엘리베이터 카의 이동속도는 1이다
- DOOR_SPEED: 문의 열리고 닫히는 속도는 1이다
- DOOR_WIDTH: 문 한 쪽의 너비는 13이다


### 타입 정의

/src/react-app-env.d.ts

#### AppEvent와 AppCommand

```typescript
type AppEvent =
    | ELEVATOR_CALLED
    | FLOOR_SELECTED
    | ELEVATOR_ARRIVED_ON
    | DOOR_OPENED
    | DOOR_CLOSED
    | NONE

type AppCommand = MOVE | STOP | NOOP | OPEN_DOOR | CLOSE_DOOR
```

이벤트와 커맨드의 타입을 정의했다.

Event라는 타입이 이미 존재해서 구분을 못 하는 문제가 있었다. 그래서 AppEvent, AppCommand로 이름을 지었다.

##### AppEvent

- ELEVATOR_CALLED: 사용자가 각 층에 있는 버튼으로 엘리베이터를 호출할 때 발생하는 이벤트이다. payload로는 호출 방향의 값인 direction과 호출한 층의 값인 floor를 전달받는다.
- FLOOR_SELECTED: 사용자가 엘리베이터 내부에 있는 버튼으로 가고자 하는 층을 선택할 때 발생하는 이벤트이다. payload로는 희망 층의 값인 floor를 전달받는다.
- ELEVATOR_ARRIVED_ON: 엘리베이터 카가 움직이다가 해당 층에 도착할 때 발생하는 이벤트이다. payload로는 도착한 층의 값인 floor를 전달받는다.
- DOOR_OPENED: 문이 열렸을 때 발생하는 이벤트이다. payload는 없다.
- DOOR_CLOSED: 문이 닫혔을 때 발생하는 이벤트이다. payload는 없다.
- NONE: 이벤트가 없다는 뜻이다. 없는 이벤트가 발생하지는 않지만, EventAction 초기화를 위해서 정의했다. payload는 없다.

##### AppCommand

- MOVE: 움직이라는 의미의 커맨드이다. payload로는 작동 방향의 값인 direction을 전달받는다.
- STOP: 멈추라는 의미의 커맨드이다. payload는 없다.
- NOOP: No Operation. 아무 일도 하지 않는다는 뜻이다. payload는 없다.
- OPEN_DOOR: 문을 열라는 의미의 커맨드이다. payload는 없다.
- CLOSE_DOOR: 문을 닫으라는 의미의 커맨드이다. payload는 없다.

#### Direction과 DoorStatus

```typescript
type Direction = UP | DOWN

type DoorStatus = OPENED | CLOSED | OPENING | CLOSING
```

방향과 도어 개폐장치 상태의 타입을 정의했다.

#### Action

```typescript
type Action = {
    type: AppEvent | AppCommand
    payload?: any
}

interface EventAction extends Action {
    type: AppEvent
}

interface CommandAction extends Action {
    type: AppCommand
}
```

액션의 타입을 정의했다.

#### ElevatorState

```typescript
type ElevatorState = {
    currentFloor: number
    callsGoingUp: boolean[]
    callsGoingDown: boolean[]
    selectedFloors: boolean[]
    callDirection: Direction | null
    runningDirection: Direction | null
    isReadyToMove: boolean
    nextCommand: CommandAction
}
```

엘리베이터 제어부의 핵심 로직 state의 타입을 정의했다.

- currentFloor: 현재 층의 값이다.
- callsGoingUp: 위로 올라가는 호출을 저장하는 배열이다.
- callsGoingDown: 아래로 내려가는 호출을 저장하는 배열이다.
- selectedFloors: 가고자 하는 층의 입력을 저장하는 배열이다.
- callDirection: 현재 처리하고 있는 호출 방향의 값이다.
- runningDirection: 엘리베이터가 작동하고 있는 방향의 값이다.
- isReadyToMove: 움직일 준비가 되어있는지에 대한 값이다.
- nextCommand: 다음에 발동할 커맨드 액션의 값이다.

#### MovementState

```typescript
type MovementState = {
    direction: Direction | null
    nextCommand: CommandAction
}
```

엘리베이터 구동장치의 핵심 로직 state의 타입을 정의했다.

- direction: 이동 방향의 값이다.
- nextCommand: 다음에 발동할 커맨드 액션의 값이다.

#### DoorState

```typescript
type DoorState = {
    status: DoorStatus
    nextCommand: CommandAction
}
```

엘리베이터 도어 개폐장치의 핵심 로직 state의 타입을 정의했다.

- status: 도어 개폐장치의 상태 값이다.
- nextCommand: 다음에 발동할 커맨드 액션의 값이다.

### reducers

엘리베이터의 핵심 로직(비즈니스 로직)을 구현한 코드이다.

- [useElevatorReducer.ts](https://github.com/kmwyatt/elevator-react-typescript/blob/main/docs/useElevatorReducer.md)

- [useMovementReducer.ts](https://github.com/kmwyatt/elevator-react-typescript/blob/main/docs/useMovementReducer.md)

- [useDoorReducer.ts](https://github.com/kmwyatt/elevator-react-typescript/blob/main/docs/useDoorReducer.md)


### contexts

이벤트와 커맨드의 통로를 구현한 코드이다.

- [useActionContext.ts](https://github.com/kmwyatt/elevator-react-typescript/blob/main/docs/useActionContext.md)


### hooks

렌더링을 위한 뷰 로직을 구현한 코드이다.

- useElevator.ts

- useMovement.ts

- useDoor.ts

- useFloorInfo.ts

