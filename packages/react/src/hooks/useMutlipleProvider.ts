import { useContext, useEffect } from 'react'
import ListContext from '../context/'
import { ListLifeCycleTypes } from '@alist/core'
import useForceUpdate from '../hooks/useForceUpdate'
import { IMultipleProps, IMultipleHook } from '../types'

export let useMultipleProvider = (props: IMultipleProps): IMultipleHook => {
    let { id, pageSize = 10 } = props
    let list = useContext(ListContext)

    useEffect(() => {
        list && list.setMultiplePageSize({ [id]: pageSize })
    }, [])

    let forceUpdate = useForceUpdate()
    let refresh = () => {
        forceUpdate()
    }
    
    useEffect(() => {
        if (list) {
            let id = list.subscribe(ListLifeCycleTypes.ON_LIST_MULTIPLE_REFRESH, refresh)
            return function cleanup() {
                list.unSubscribe(id)
            }
        }
    }, [list])

    return {
        id,
        pageSize,
        list,
    }
}

export default useMultipleProvider
