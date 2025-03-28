import { useContext, useEffect } from 'react'
import ListContext from '../context'
import { ListLifeCycleTypes } from '@alist/core'
import useForceUpdate from './useForceUpdate'
import { IConsumerProps } from '../types'

export let useExpand = (props: IConsumerProps) => {
    let { form } = props
    let list = useContext(ListContext)
    let formInstance = form || list.getFilterInstance()
    let forceUpdate = useForceUpdate()
    let refresh = () => {
        forceUpdate()
    }

    useEffect(() => {
        let fnRef = formInstance.subscribe(({ type }) => {
            if ([ListLifeCycleTypes.ON_LIST_FILTER_ITEM_EXPAND,
                ListLifeCycleTypes.ON_LIST_FILTER_ITEM_COLLAPSE,
                ListLifeCycleTypes.ON_LIST_EXPAND_STATUS_SYNC,
            ].includes(type)) {
                refresh()
            }
        })
        return function cleanup() {
            formInstance.unsubscribe(fnRef)
        }
    }, [formInstance])

    let statsProps: any = {}
    if (list) {
        statsProps.expandStatus = list.getExpandStatus()
        statsProps.toggleExpandStatus = list.toggleExpandStatus
    } else if (formInstance) {
        statsProps.expandStatus = form.getFormState(state => state.expandStatus)
        statsProps.toggleExpandStatus = () => {
            formInstance.notify(statsProps.expandStatus === 'expand' ?
                ListLifeCycleTypes.ON_LIST_FILTER_ITEM_COLLAPSE : ListLifeCycleTypes.ON_LIST_FILTER_ITEM_EXPAND)
        }
    }

    return {
        ...statsProps,
        form: formInstance.
        list
    }
}

export default useExpand
