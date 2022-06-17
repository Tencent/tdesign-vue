import {
  ref, SetupContext, toRefs, watch,
} from '@vue/composition-api';
import { CreateElement } from 'vue';
import { useConfig } from '../../config-provider/useConfig';
import Pagination, { PageInfo } from '../../pagination';
import { TdBaseTableProps, TableRowData } from '../type';

export default function usePagination(props: TdBaseTableProps, context: SetupContext) {
  const { pagination, data, disableDataPage } = toRefs(props);
  const { classPrefix } = useConfig();

  const pageSize = pagination.value?.pageSize || pagination.value?.defaultPageSize || 10;
  const dataSource = ref<TableRowData[]>(props.data?.slice(0, pageSize) || []);
  const isPaginateData = ref(false);

  const updateDataSourceAndPaginate = (current = 1, pageSize = 10) => {
    const { data } = props;
    // data 数据数量超出分页大小时，则自动启动本地数据分页
    const t = Boolean(!disableDataPage.value && data.length > pageSize);
    isPaginateData.value = t;
    if (t) {
      const start = (current - 1) * pageSize;
      const end = current * pageSize;
      dataSource.value = data.slice(start, end);
    } else {
      dataSource.value = data;
    }
  };

  // 受控情况，只有 pagination.current 或者 pagination.pageSize 变化，才对数据进行排序
  watch(
    () => [pagination.value?.current, pagination.value?.pageSize, data.value.length, disableDataPage],
    () => {
      if (!pagination.value || !pagination.value.current) return;
      updateDataSourceAndPaginate(pagination.value.current, pagination.value.pageSize);
    },
    { immediate: true },
  );

  // 非受控情况，只执行一次 Props 数据更新（pagination.defaultCurrent 和 pagination.defaultPageSize）
  watch(
    [data],
    () => {
      if (!pagination.value || !pagination.value.defaultCurrent) return;
      updateDataSourceAndPaginate(pagination.value.defaultCurrent, pagination.value.defaultPageSize);
    },
    { immediate: true },
  );

  // eslint-disable-next-line
  const renderPagination = (h: CreateElement) => {
    if (!pagination.value) return null;
    return (
      <div class={`${classPrefix.value}-table__pagination`}>
        <Pagination
          {...{
            props: pagination.value,
            on: {
              change: (pageInfo: PageInfo) => {
                props.onPageChange?.(pageInfo, dataSource.value);
                // Vue3 ignore this line
                context.emit('page-change', pageInfo, dataSource.value);
                // 如果是非受控情况的分页变化，还需更新分页数据（data）
                if (pagination.value && !pagination.value.current && pagination.value.defaultCurrent) {
                  updateDataSourceAndPaginate(pageInfo.current, pageInfo.pageSize);
                }
              },
            },
          }}
        />
      </div>
    );
  };

  return {
    isPaginateData,
    dataSource,
    renderPagination,
  };
}
