import { Dispatch, useReducer } from 'react'

export default function useElevatorReducer(
    startFloor: number,
    totalFloors: number
): { state: ElevatorState; dispatch: Dispatch<EventAction> } {
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

    function handleDoorClosed(state: ElevatorState): ElevatorState {
        const newState = { ...state }

        newState.isReadyToMove = true
        controlMovement(newState)

        return newState
    }

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

    return { state, dispatch }
}
