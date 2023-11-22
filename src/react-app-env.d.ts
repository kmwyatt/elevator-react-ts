/// <reference types="react-scripts" />
type Event = ELEVATOR_CALLED | FLOOR_SELECTED | ELEVATOR_ARRIVED_ON

type Command = MOVE | STOP | NOOP | READY_TO_MOVE | OPEN_DOOR

type Direction = UP | DOWN

type Action = {
    type: Event | Command
    payload?: any
}

interface EventAction extends Action {
    type: Event
}

interface CommandAction extends Action {
    type: Command
}

type ElevatorState = {
    currentFloor: number
    callsGoingUp: boolean[]
    callsGoingDown: boolean[]
    selectedFloors: boolean[]
    runningDirection: Direction | null
    nextCommand: CommandAction
}
