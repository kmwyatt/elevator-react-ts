import { Dispatch, useReducer } from 'react'

export default function useMovementReducer(): {
    state: MovementState
    dispatch: Dispatch<Action>
} {
    const initialState = {
        direction: null,
        nextCommand: { type: 'NOOP' },
    }

    const reducer = (
        state: MovementState,
        action: CommandAction
    ): MovementState => {
        switch (action.type) {
            case 'MOVE':
                return handleMove(state, action.payload)
            case 'STOP':
                return handleStop(state)
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
        newState.nextCommand = { type: 'OPEN_DOOR' }

        return newState
    }

    function isMoving(state: MovementState): boolean {
        return state.direction !== null
    }

    return { state, dispatch }
}
