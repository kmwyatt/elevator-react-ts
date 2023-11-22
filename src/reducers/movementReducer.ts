import { Dispatch, useReducer } from 'react'

export function movementReducer(): {
    state: MovementState
    dispatch: Dispatch<Action>
} {
    const initialState = {
        direction: null,
        isReadyToMove: true,
        nextCommand: { type: 'NOOP' },
    }

    const reducer = (state: MovementState, action: Action): MovementState => {
        switch (action.type) {
            case 'MOVE':
                return handleMove(state, action.payload)
            case 'STOP':
                return handleStop(state)
            case 'READY_TO_MOVE':
                return handleReadyToMove(state)
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

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

    function handleStop(state: MovementState): MovementState {
        const newState = { ...state }

        newState.direction = null
        newState.isReadyToMove = false
        newState.nextCommand = { type: 'OPEN_DOOR' }

        return newState
    }

    function handleReadyToMove(state: MovementState): MovementState {
        const newState = { ...state }

        newState.isReadyToMove = true
        newState.nextCommand = { type: 'NOOP' }

        return newState
    }

    function isMoving(state: MovementState): boolean {
        return state.direction !== null && state.isReadyToMove
    }

    return { state, dispatch }
}
