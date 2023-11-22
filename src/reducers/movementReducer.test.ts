import { act, renderHook, RenderHookResult } from '@testing-library/react'
import { Dispatch } from 'react'
import { movementReducer } from './movementReducer'

type MovementReducerTest = RenderHookResult<
    { state: MovementState; dispatch: Dispatch<Action> },
    unknown
>

describe('Movement', () => {
    test('when car stops, door will be opened', () => {
        const { result }: MovementReducerTest = renderHook(() =>
            movementReducer()
        )

        act(() => {
            result.current.dispatch({
                type: 'STOP',
            })
        })

        expect(result.current.state.nextCommand.type).toEqual('OPEN_DOOR')
    })

    test('when car is ready to move, it moves', () => {
        const { result }: MovementReducerTest = renderHook(() =>
            movementReducer()
        )

        act(() => {
            result.current.dispatch({ type: 'STOP' })
        })
        expect(result.current.state.direction).toEqual(null)
        expect(result.current.state.isReadyToMove).toEqual(false)

        act(() => {
            result.current.dispatch({
                type: 'MOVE',
                payload: { direction: 'UP' },
            })
            result.current.dispatch({
                type: 'READY_TO_MOVE',
            })
        })

        expect(result.current.state.direction).toEqual('UP')
        expect(result.current.state.isReadyToMove).toEqual(true)
    })

    test('when car is moving, it ignores additional move command', () => {
        const { result }: MovementReducerTest = renderHook(() =>
            movementReducer()
        )

        act(() => {
            result.current.dispatch({
                type: 'MOVE',
                payload: { direction: 'UP' },
            })
        })
        expect(result.current.state.direction).toEqual('UP')
        expect(result.current.state.isReadyToMove).toEqual(true)

        act(() => {
            result.current.dispatch({
                type: 'MOVE',
                payload: { direction: 'DOWN' },
            })
        })

        expect(result.current.state.direction).toEqual('UP')
        expect(result.current.state.isReadyToMove).toEqual(true)
    })
})
