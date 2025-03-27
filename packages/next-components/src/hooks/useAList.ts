import useNextList from './useNextList';
// import { useTable, usePagination } from '@alist/react';

export let useAList = (props) => {
    let { tableProps = {}, ...others } = props;
    let { actions } = useNextList(others);
    // let table = useTable(tableProps, actions);
    // let pagination = usePagination({}, actions);

    return {
        actions,
        // table,
        // pagination,
    }
}

export default useAList;
