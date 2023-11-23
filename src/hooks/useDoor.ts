import { useEffect, useState } from 'react'
import useDoorReducer from '../reducers/useDoorReducer'
import { DOOR_SPEED, DOOR_WIDTH } from '../constants/config'
import useActionContext from '../contexts/useActionContext'

export function useDoor() {
    const {
        eventAction,
        commandAction,
        dispatchEventAction,
        dispatchCommandAction,
    } = useActionContext()
    const { state, dispatch } = useDoorReducer()
    const [position, setPosition] = useState<number>(0)
    const [remainingTime, setRemainingTime] = useState<number>(0)

    useEffect(() => {
        if (state.nextCommand.type === 'NOOP') {
            return
        }

        dispatchCommandAction(state.nextCommand)
    }, [state.nextCommand])

    useEffect(() => {
        dispatch(eventAction)
    }, [eventAction])

    useEffect(() => {
        dispatch(commandAction)
    }, [commandAction])

    useEffect(() => {
        if (state.status === 'OPENED' || state.status === 'CLOSED') {
            return
        }

        if (position === DOOR_WIDTH && state.status === 'OPENING') {
            setRemainingTime(10)
            doorOpened()
            return
        }

        if (position === 0 && state.status === 'CLOSING') {
            doorClosed()
            return
        }

        setTimeout(() => {
            if (state.status === 'OPENING') {
                setPosition(position + DOOR_SPEED)
            } else if (state.status === 'CLOSING') {
                setPosition(position - DOOR_SPEED)
            }
        }, 10)
    }, [state.status, position])

    useEffect(() => {
        if (remainingTime === 0) {
            closeDoor()
            return
        }

        setTimeout(() => {
            setRemainingTime(remainingTime - 1)
        }, 100)
    }, [remainingTime])

    function doorOpened(): void {
        const action = {
            type: 'DOOR_OPENED',
        }
        dispatchEventAction(action)
    }

    function doorClosed(): void {
        const action = {
            type: 'DOOR_CLOSED',
        }
        dispatchEventAction(action)
    }

    function closeDoor(): void {
        const action = {
            type: 'CLOSE_DOOR',
        }
        dispatchCommandAction(action)
    }

    return { position }
}
