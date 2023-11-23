import { act, renderHook, RenderHookResult } from '@testing-library/react'
import { Dispatch } from 'react'
import { useMovementReducer } from './useMovementReducer'

type UseMovementReducerTest = RenderHookResult<
    { state: MovementState; dispatch: Dispatch<Action> },
    unknown
>

describe('Movement', () => {
    test('when elevator gives move up command, car will move up', () => {
        const { result }: UseMovementReducerTest = renderHook(() =>
            useMovementReducer()
        )

        act(() => {
            result.current.dispatch({
                type: 'MOVE',
                payload: { direction: 'UP' },
            })
        })

        expect(result.current.state.direction).toEqual('UP')
    })

    test('when elevator gives move down command, car will move down', () => {
        const { result }: UseMovementReducerTest = renderHook(() =>
            useMovementReducer()
        )

        act(() => {
            result.current.dispatch({
                type: 'MOVE',
                payload: { direction: 'DOWN' },
            })
        })

        expect(result.current.state.direction).toEqual('DOWN')
    })

    test('when elevator gives stop command, car will stop', () => {
        const { result }: UseMovementReducerTest = renderHook(() =>
            useMovementReducer()
        )

        act(() => {
            result.current.dispatch({
                type: 'STOP',
            })
        })

        expect(result.current.state.direction).toEqual(null)
    })
})
