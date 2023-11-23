/// <reference types="react-scripts" />
type AppEvent =
    | ELEVATOR_CALLED
    | FLOOR_SELECTED
    | ELEVATOR_ARRIVED_ON
    | DOOR_CLOSED

type AppCommand = MOVE | STOP | NOOP | OPEN_DOOR | CLOSE_DOOR

type Direction = UP | DOWN

type DoorStatus = OPENED | CLOSED | OPENING | CLOSING

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

type ElevatorState = {
    currentFloor: number
    callsGoingUp: boolean[]
    callsGoingDown: boolean[]
    selectedFloors: boolean[]
    runningDirection: Direction | null
    nextCommand: CommandAction
}

type MovementState = {
    direction: Direction | null
    nextCommand: CommandAction
}

type DoorState = {
    status: DoorStatus
    nextCommand: CommandAction
}
