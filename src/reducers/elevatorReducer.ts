import { Dispatch, useReducer } from 'react'

export function elevatorReducer(
    startFloor: number,
    totalFloors: number
): { state: ElevatorState; dispatch: Dispatch<Action> } {
    const initialState: ElevatorState = {
        currentFloor: startFloor,
        callsGoingUp: new Array(totalFloors + 1).fill(false),
        callsGoingDown: new Array(totalFloors + 1).fill(false),
        selectedFloors: new Array(totalFloors + 1).fill(false),
        runningDirection: null,
        nextCommand: { type: 'NOOP' },
    }

    const reducer = (state: ElevatorState, action: Action): ElevatorState => {
        switch (action.type) {
            case 'ELEVATOR_CALLED':
                return handleElevatorCalled(state, action.payload)
            case 'FLOOR_SELECTED':
                return handleFloorSelected(state, action.payload)
            case 'ELEVATOR_ARRIVED_ON':
                return handleElevatorArrivedOn(state, action.payload)
            case 'READY_TO_MOVE':
                return handleReadyToMove(state)
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
            newState.nextCommand = { type: 'OPEN_DOOR' }

            return newState
        }

        if (direction === 'UP') {
            newState.callsGoingUp[floor] = true
        } else if (direction === 'DOWN') {
            newState.callsGoingDown[floor] = true
        }

        if (!newState.runningDirection) {
            if (floor === newState.currentFloor) {
            }
            newState.nextCommand = {
                type: 'MOVE',
                payload: { direction: getDirectionToMove(newState, floor) },
            }

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
            newState.nextCommand = {
                type: 'MOVE',
                payload: { direction: newState.runningDirection },
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
            newState.nextCommand = { type: 'STOP' }

            return newState
        }

        newState.nextCommand = { type: 'NOOP' }

        return newState
    }

    function handleReadyToMove(state: ElevatorState): ElevatorState {
        const newState = { ...state }

        if (!newState.runningDirection) {
            newState.nextCommand = {
                type: 'NOOP',
            }

            return newState
        }

        newState.nextCommand = {
            type: 'MOVE',
            payload: { direction: newState.runningDirection },
        }

        return newState
    }

    function getDirectionToMove(
        state: ElevatorState,
        destination: number
    ): Direction {
        if (destination > state.currentFloor) {
            return 'UP'
        } else {
            return 'DOWN'
        }
    }

    function getCallDestination(state: ElevatorState): number | null {
        if (state.runningDirection === 'UP') {
            for (let i = totalFloors; i < 0; i--) {
                if (state.callsGoingUp[i]) {
                    return i
                }
            }
        } else if (state.runningDirection === 'DOWN') {
            for (let i = 1; i <= totalFloors; i++) {
                if (state.callsGoingDown[i]) {
                    return i
                }
            }
        }

        return null
    }

    function getSelectedDestination(state: ElevatorState): number | null {
        if (state.runningDirection === 'UP') {
            for (let i = state.currentFloor; i < totalFloors; i++) {
                if (state.selectedFloors[i]) {
                    return i
                }
            }
        } else if (state.runningDirection === 'DOWN') {
            for (let i = totalFloors - 1; i <= state.currentFloor; i++) {
                if (state.selectedFloors[i]) {
                    return i
                }
            }
        }

        return null
    }

    function deleteCurrentFloorFromArrays(state: ElevatorState): void {
        if (state.runningDirection === 'UP') {
            state.callsGoingUp[state.currentFloor] = false
        } else if (state.runningDirection === 'DOWN') {
            state.callsGoingDown[state.currentFloor] = false
        }

        state.callsGoingUp[state.currentFloor] = false
    }

    function controlDirection(state: ElevatorState): void {
        if (
            state.callsGoingUp.filter((v) => v).length === 0 &&
            state.callsGoingDown.filter((v) => v).length === 0 &&
            !getSelectedDestination(state)
        ) {
            state.runningDirection = null
            state.selectedFloors.fill(false)
            return
        }

        if (getCallDestination(state) !== null) {
            return
        }

        if (state.runningDirection === 'UP') {
            state.runningDirection = 'DOWN'
        } else if (state.runningDirection === 'DOWN') {
            state.runningDirection = 'UP'
        }

        state.selectedFloors.fill(false)
    }

    return { state, dispatch }
}