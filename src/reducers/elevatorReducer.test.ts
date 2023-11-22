import { elevatorReducer } from './elevatorReducer'
import { act, renderHook, RenderHookResult } from '@testing-library/react'
import { Dispatch } from 'react'

type ElevatorReducerTest = RenderHookResult<
    { state: ElevatorState; dispatch: Dispatch<Action> },
    unknown
>

describe('Elevator', () => {
    test('elevator moves up when called to go down from 3rd floor while waiting on 1st floor', async () => {
        const { result }: ElevatorReducerTest = renderHook(() =>
            elevatorReducer(1, 5)
        )

        act(() => {
            result.current.dispatch({
                type: 'ELEVATOR_CALLED',
                payload: { floor: 3, direction: 'DOWN' },
            })
        })

        expect(result.current.state.nextCommand.type).toEqual('MOVE')
        expect(result.current.state.nextCommand.payload.direction).toEqual('UP')
    })

    test('elevator moves down when called to go up from 1st floor while waiting on 4th floor', () => {
        const { result }: ElevatorReducerTest = renderHook(() =>
            elevatorReducer(4, 5)
        )

        act(() => {
            result.current.dispatch({
                type: 'ELEVATOR_CALLED',
                payload: { floor: 1, direction: 'UP' },
            })
        })

        expect(result.current.state.nextCommand.type).toEqual('MOVE')
        expect(result.current.state.nextCommand.payload.direction).toEqual(
            'DOWN'
        )
    })

    test('elevator moves down when 2nd floor selected to go to while waiting on 5th floor', () => {
        const { result }: ElevatorReducerTest = renderHook(() =>
            elevatorReducer(5, 5)
        )

        act(() => {
            result.current.dispatch({
                type: 'FLOOR_SELECTED',
                payload: { floor: 2 },
            })
        })

        expect(result.current.state.nextCommand.type).toEqual('MOVE')
        expect(result.current.state.nextCommand.payload.direction).toEqual(
            'DOWN'
        )
    })

    test('elevator opens door when called to go up from 1st floor while waiting on same floor', async () => {
        const { result }: ElevatorReducerTest = renderHook(() =>
            elevatorReducer(1, 5)
        )

        act(() => {
            result.current.dispatch({
                type: 'ELEVATOR_CALLED',
                payload: { floor: 1, direction: 'UP' },
            })
        })

        expect(result.current.state.nextCommand.type).toEqual('OPEN_DOOR')
    })

    test('elevator do nothing when 1st floor selected while waiting on same floor', async () => {
        const { result }: ElevatorReducerTest = renderHook(() =>
            elevatorReducer(1, 5)
        )

        act(() => {
            result.current.dispatch({
                type: 'FLOOR_SELECTED',
                payload: { floor: 1 },
            })
        })

        expect(result.current.state.nextCommand.type).toEqual('NOOP')
    })

    test('elevator stops when it arrived on 2nd floor & 5th floor while going up', () => {
        const { result }: ElevatorReducerTest = renderHook(() =>
            elevatorReducer(1, 5)
        )
        act(() => {
            result.current.dispatch({
                type: 'ELEVATOR_CALLED',
                payload: { direction: 'DOWN', floor: 5 },
            })
            result.current.dispatch({
                type: 'FLOOR_SELECTED',
                payload: { floor: 2 },
            })
            result.current.dispatch({
                type: 'ELEVATOR_CALLED',
                payload: { direction: 'UP', floor: 3 },
            })
        })

        act(() => {
            result.current.dispatch({
                type: 'ELEVATOR_ARRIVED_ON',
                payload: { floor: 2 },
            })
        })
        expect(result.current.state.nextCommand.type).toEqual('STOP')

        act(() => {
            result.current.dispatch({
                type: 'ELEVATOR_ARRIVED_ON',
                payload: { floor: 3 },
            })
        })
        expect(result.current.state.nextCommand.type).toEqual('NOOP')

        act(() => {
            result.current.dispatch({
                type: 'ELEVATOR_ARRIVED_ON',
                payload: { floor: 4 },
            })
        })
        expect(result.current.state.nextCommand.type).toEqual('NOOP')

        act(() => {
            result.current.dispatch({
                type: 'ELEVATOR_ARRIVED_ON',
                payload: { floor: 5 },
            })
        })
        expect(result.current.state.nextCommand.type).toEqual('STOP')
    })
})
