import _List from './list';
import _ListItem from './list-item';
import _ListItemMeta from './list-item-meta';
import withInstall from '../utils/withInstall';
import { TdListProps } from '../../types/list/TdListProps';

export * from '../../types/list/TdListProps';
export type ListProps = TdListProps;

export const List = withInstall('List', _List);
export const ListItem = withInstall('ListItem', _ListItem);
export const ListItemMeta = withInstall('ListItemMeta', _ListItemMeta);
