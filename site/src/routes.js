import config from '../site.config';
import TdesignComponents from './components/page.vue';

const { docs } = config;

function getDocsRoutes(docs, type) {
  let docsRoutes = [];
  let docRoute;

  docs.forEach((item) => {
    const docType = item.type || type;
    let { children } = item;
    if (item.type === 'component') {
      children = item.children.sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });
    }
    if (children) {
      docsRoutes = docsRoutes.concat(getDocsRoutes(children, docType));
    } else {
      docRoute = { ...item };
      docsRoutes.push(docRoute);
    }
  });
  return docsRoutes;
}

const routes = [
  {
    path: '/vue',
    redirect: '/vue/overview',
    component: TdesignComponents,
    children: getDocsRoutes(docs),
  },
  {
    path: '*',
    redirect: '/vue/overview',
  },
  {
    name: 'demos',
    path: '/vue/demos/:componentName/',
    component: () => import('./components/demo-page.vue'),
  },
  {
    name: 'demos',
    path: '/vue/demos/:componentName/:demoName',
    component: () => import('./components/demo-page.vue'),
  },
];
export default routes;
