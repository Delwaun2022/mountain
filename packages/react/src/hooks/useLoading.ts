import { useContext, useEffect } from 'react'
import ListContext from '../context'
import MultipleContext from '../context/multiple'
import { ListLifeCycleTypes, IList } from '@alist/core'
import useForceUpdate from './useForceUpdate'
import { ITableProps, ILoadingHook } from '../types'

export let useLoading = (props: ITableProps = {}, propList?: IList): ILoadingHook => {
    let { multipleId: propsMultipleId } = props
    let list = propList || useContext(ListContext)
    let { id: contextMultipleId } = useContext(MultipleContext) || {}
    let multipleId = propsMultipleId || contextMultipleId
    let loading = list ? list.getLoading() : props.loading
    
    let forceUpdate = useForceUpdate()
    let refresh = (opts) => {
        let { payload } = opts;
        let { notifyId } = payload || {}
        if (notifyId) {
            if (multipleId !== undefined) {
                if (notifyId && notifyId.some(id => id === multipleId)) {
                    forceUpdate()
                }
            } else {
                forceUpdate()
            }
        } else {
            forceUpdate()
        }
    }

    useEffect(() => {
        if (list) {
            let id = list.subscribe(ListLifeCycleTypes.ON_LIST_LOADING_REFRESH, refresh)
            return function cleanup () {
                list.unSubscribe(id)
            }
        }
    }, [list])

    return {
        loading,
    }
}

export default useLoading
