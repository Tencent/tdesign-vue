import _Layout from './layout';
import _Header from './header';
import _Footer from './footer';
import _Aside from './aside';
import _Content from './content';
import withInstall from '../utils/withInstall';
import { TdHeaderProps, TdFooterProps, TdAsideProps } from './type';

import './style/';

export * from './type';
export type HeaderProps = TdHeaderProps;
export type FooterProps = TdFooterProps;
export type AsideProps = TdAsideProps;

export const Aside = withInstall('Aside', _Aside);
export const Layout = withInstall('Layout', _Layout);
export const Header = withInstall('Header', _Header);
export const Footer = withInstall('Footer', _Footer);
export const Content = withInstall('Content', _Content);
export default Layout;
