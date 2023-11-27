import { useEffect } from 'react'
import { START_FLOOR, TOTAL_FLOORS } from '../constants/config'
import useElevatorReducer from '../reducers/useElevatorReducer'
import useActionContext from '../contexts/useActionContext'

export function useElevator() {
    const {
        eventAction,
        commandAction,
        dispatchEventAction,
        dispatchCommandAction,
    } = useActionContext()
    const { state, dispatch } = useElevatorReducer(START_FLOOR, TOTAL_FLOORS)

    useEffect(() => {
        if (state.nextCommand.type === 'NOOP') {
            return
        }

        dispatchCommandAction(state.nextCommand)
    }, [state.nextCommand])

    useEffect(() => {
        dispatch(eventAction)
    }, [eventAction])

    function callGoingUp(floor: number): void {
        const action = {
            type: 'ELEVATOR_CALLED',
            payload: { direction: 'UP', floor },
        }
        dispatchEventAction(action)
    }

    function callGoingDown(floor: number): void {
        const action = {
            type: 'ELEVATOR_CALLED',
            payload: { direction: 'DOWN', floor },
        }
        dispatchEventAction(action)
    }

    function selectFloor(floor: number): void {
        const action = {
            type: 'FLOOR_SELECTED',
            payload: { floor },
        }
        dispatchEventAction(action)
    }

    return {
        callGoingUp,
        callGoingDown,
        selectFloor,

        callsGoingUp: state.callsGoingUp,
        callsGoingDown: state.callsGoingDown,
        selectedFloors: state.selectedFloors,
    }
}
