import { act, renderHook, RenderHookResult } from '@testing-library/react'
import { Dispatch } from 'react'
import { doorReducer } from './doorReducer'

type DoorReducerTest = RenderHookResult<
    { state: DoorState; dispatch: Dispatch<Action> },
    unknown
>

describe('DOOR', () => {
    test('when door receive open command, it opens', () => {
        const { result }: DoorReducerTest = renderHook(() => doorReducer())

        act(() => {
            result.current.dispatch({ type: 'DOOR_CLOSED' })
            result.current.dispatch({ type: 'OPEN_DOOR' })
        })

        expect(result.current.state.status).toEqual('OPENING')
    })

    test('when door receive close command, it closes', () => {
        const { result }: DoorReducerTest = renderHook(() => doorReducer())

        act(() => {
            result.current.dispatch({ type: 'DOOR_OPENED' })
            result.current.dispatch({ type: 'CLOSE_DOOR' })
        })

        expect(result.current.state.status).toEqual('CLOSING')
    })
})
