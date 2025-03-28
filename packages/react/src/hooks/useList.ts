import { useRef, useMemo, useContext, useEffect } from 'react'
import createList, { ListLifeCycle, ListLifeCycleTypes } from '@alist/core'
import { IList } from '@alist/core/lib/types'
import ListDomain from '../context/listDomain'
import { createListEffects, createListActions, useEva } from '../shared'
import { IListUIProps } from '../types'

export let useList = (options: IListUIProps): IList & { actions: any } => {
    let optionsRef = useRef<IListUIProps>(options)
    let actionsRef = useRef<any>(options.actions)
    let listDomain = useContext(ListDomain)
    actionsRef.current = actionsRef.current || createListActions()

    // 延迟实现
    let { implementActions, dispatch } = useEva({
        actions: actionsRef.current,
        effects: createListEffects(options.effects, actionsRef.current)
    })

    let lifeCycles = [
        new ListLifeCycle(
          ({ type, payload }) => {
            dispatch.lazy(type, () => payload)
          }
        ),
        new ListLifeCycle(
          ListLifeCycleTypes.ON_LIST_WILL_INIT,
          ({ payload, ctx }) => {
            let actions = {
              ...ctx,
              dispatch: ctx.notify
            }

            implementActions(actions)
            actionsRef.current.addAPI = (name, fn) => {
              actionsRef.current[name] = fn
            }

            if (listDomain) {
              listDomain.setContext({ actions })
            }
          }
        )
      ]

    optionsRef.current.lifeCycles = lifeCycles
    let alreadyHaveList = !!optionsRef.current.list    
    let list = useMemo(() => {
        let originList = alreadyHaveList ? optionsRef.current.list : createList(optionsRef.current)
        return {
          ...originList,
          actions: actionsRef.current,
        }
    }, [])

    let { dataSource } = options || {}
    useEffect(() => {
      if ('dataSource' in options) {
        list.setDataSource(dataSource)
      }
    }, [dataSource])
    
    // 这里是为了在next/antd/其他顶层去实现搜索区域
    if (optionsRef.current.afterInitialized) {
        optionsRef.current.afterInitialized(list)
    }

    return list
}

export default useList
