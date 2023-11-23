import { Dispatch, useReducer } from 'react'

export function doorReducer(): {
    state: DoorState
    dispatch: Dispatch<Action>
} {
    const initialState: DoorState = {
        status: 'CLOSED',
        nextCommand: { type: 'NOOP' },
    }

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

    function handleOpenDoor(state: DoorState): DoorState {
        const newState = { ...state }

        newState.nextCommand = { type: 'NOOP' }

        if (newState.status === 'OPENED') {
            return newState
        }

        newState.status = 'OPENING'

        return newState
    }

    function handleCloseDoor(state: DoorState): DoorState {
        const newState = { ...state }

        newState.nextCommand = { type: 'NOOP' }

        if (newState.status === 'CLOSED') {
            return newState
        }

        newState.status = 'CLOSING'

        return newState
    }

    function handleDoorOpened(state: DoorState): DoorState {
        const newState = { ...state }

        newState.nextCommand = { type: 'NOOP' }

        newState.status = 'OPENED'

        return newState
    }

    function handleDoorClosed(state: DoorState): DoorState {
        const newState = { ...state }

        newState.nextCommand = { type: 'NOOP' }

        newState.status = 'CLOSED'

        return newState
    }

    return { state, dispatch }
}
