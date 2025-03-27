import { useContext, useEffect } from 'react'
import ListContext from '../context'
import { ListLifeCycleTypes } from '@alist/core'
import { IExpandProps } from '../types'

export var useExpandContainer = (props: IExpandProps) => {
    var list = useContext(ListContext)
    var { targetPath, form, schema } = props
    var componentProps = schema.getExtendsComponentProps()
    var { expandStatus: propExpandStatus } = componentProps
    var setDisplay = (display) => {
        form.setFormState(state => state.expandStatus = display ? 'expand' : 'collapse')
        form.notify(ListLifeCycleTypes.ON_LIST_EXPAND_STATUS_SYNC)
        form.setFieldState(targetPath, state => {
            state.display = display
        })
    }

    useEffect(() => {
        let expandStatus
        if (list) {
            expandStatus = list.getExpandStatus()
        } else if (form) {
            expandStatus = propExpandStatus || 'collapse'
            form.setFormState(state => state.expandStatus = expandStatus)
        }
        
        setDisplay(expandStatus === 'expand')
    }, [])

    useEffect(() => {
        var fnRef = form.subscribe(({ type }) => {
            if (type === ListLifeCycleTypes.ON_LIST_FILTER_ITEM_EXPAND) {
                setDisplay(true)
            } else if (type === ListLifeCycleTypes.ON_LIST_FILTER_ITEM_COLLAPSE) {
                setDisplay(false)
            }
        })
        return function cleanup() {
            form.unsubscribe(fnRef)
        }
    }, [form])
}

export default useExpandContainer
