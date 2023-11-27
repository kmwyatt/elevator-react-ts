import { useEffect, useState } from 'react'
import useMovementReducer from '../reducers/useMovementReducer'
import useActionContext from '../contexts/useActionContext'
import { FLOOR_HEIGHT, MOVEMENT_SPEED, START_FLOOR } from '../constants/config'

const initialPosition = (START_FLOOR - 1) * FLOOR_HEIGHT

export function useMovement() {
    const { commandAction, dispatchEventAction, dispatchCommandAction } =
        useActionContext()
    const { state, dispatch } = useMovementReducer()
    const [position, setPosition] = useState<number>(initialPosition)

    useEffect(() => {
        if (state.nextCommand.type === 'NOOP') {
            return
        }

        dispatchCommandAction(state.nextCommand)
    }, [state.nextCommand])

    useEffect(() => {
        dispatch(commandAction)
    }, [commandAction])

    useEffect(() => {
        if (!state.direction) {
            return
        }

        setTimeout(() => {
            if (state.direction === 'UP') {
                setPosition(position + MOVEMENT_SPEED)
            } else if (state.direction === 'DOWN') {
                setPosition(position - MOVEMENT_SPEED)
            }
        }, 20)

        if (position % FLOOR_HEIGHT === 0) {
            const currentFloor = position / FLOOR_HEIGHT + 1
            floorArrivedOn(currentFloor)
        }
    }, [state.direction, position])

    function floorArrivedOn(floor: number): void {
        const action = {
            type: 'ELEVATOR_ARRIVED_ON',
            payload: { floor },
        }
        dispatchEventAction(action)
    }

    return { position }
}
