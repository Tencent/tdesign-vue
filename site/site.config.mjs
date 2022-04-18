/* eslint-disable */
export default {
  docs: [
    {
      title: '开始',
      type: 'doc', // 普通文档
      children: [
        {
          title: '快速开始',
          name: 'getting-started',
          path: '/vue/getting-started',
          component: () => import('@/site/docs/getting-started.md'),
        },
        {
          title: '最佳实践',
          name: 'quick-start',
          path: '/vue/quick-start',
          component: () => import('@/site/docs/starter.md'),
        },
        {
          title: '更新日志',
          name: 'changelog',
          path: '/vue/changelog',
          component: () => import('@/CHANGELOG.md'),
        },
        {
          title: '组件概览',
          name: 'overview',
          path: '/vue/overview',
          component: () => import('@common/docs/web/overview.md'),
        },
      ],
    },
    {
      title: '全局配置',
      name: 'configs',
      children: [
        {
          title: '全局特性配置',
          name: 'config',
          path: '/vue/config',
          component: () => import('@/examples/config-provider/config-provider.md'),
        },
        {
          title: '自定义主题',
          name: 'custom-theme',
          path: '/vue/custom-theme',
          component: () => import('@common/theme.md'),
        },
        {
          title: '暗黑模式',
          name: 'dark-mode',
          path: '/vue/dark-mode',
          component: () => import('@common/dark-mode.md'),
        },
      ],
    },
    {
      title: '基础',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Button 按钮',
          name: 'button',
          path: '/vue/components/button',
          component: () => import('@/examples/button/button.md'),
        },
        {
          title: 'Divider 分割线',
          name: 'divider',
          path: '/vue/components/divider',
          component: () => import('@/examples/divider/divider.md'),
        },
        {
          title: 'Icon 图标',
          name: 'icon',
          path: '/vue/components/icon',
          component: () => import('@/examples/icon/icon.md'),
        },
      ],
    },
    {
      title: '布局',
      type: 'component',
      children: [
        {
          title: 'Grid 栅格',
          name: 'grid',
          path: '/vue/components/grid',
          component: () => import('@/examples/grid/grid.md'),
        },
        {
          title: 'Layout 布局',
          name: 'layout',
          path: '/vue/components/layout',
          component: () => import('@/examples/layout/layout.md'),
        },
      ],
    },
    {
      title: '导航',
      type: 'component',
      children: [
        {
          title: 'Affix 固钉',
          name: 'affix',
          path: '/vue/components/affix',
          component: () => import('@/examples/affix/affix.md'),
        },
        {
          title: 'Anchor 锚点',
          name: 'anchor',
          path: '/vue/components/anchor',
          component: () => import('@/examples/anchor/anchor.md'),
        },
        {
          title: 'Breadcrumb 面包屑',
          name: 'breadcrumb',
          path: '/vue/components/breadcrumb',
          component: () => import('@/examples/breadcrumb/breadcrumb.md'),
        },
        {
          title: 'Dropdown 下拉菜单',
          name: 'dropdown',
          path: '/vue/components/dropdown',
          component: () => import('@/examples/dropdown/dropdown.md'),
        },
        {
          title: 'Menu 导航菜单',
          name: 'menu',
          path: '/vue/components/menu',
          component: () => import('@/examples/menu/menu.md'),
        },
        {
          title: 'Pagination 分页',
          name: 'pagination',
          path: '/vue/components/pagination',
          component: () => import('@/examples/pagination/pagination.md'),
        },
        {
          title: 'Steps 步骤条',
          name: 'steps',
          path: '/vue/components/steps',
          component: () => import('@/examples/steps/steps.md'),
        },
        {
          title: 'Tabs 选项卡',
          name: 'tabs',
          path: '/vue/components/tabs',
          component: () => import('@/examples/tabs/tabs.md'),
        },
      ],
    },
    {
      title: '输入',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Cascader 级联组件',
          name: 'cascader',
          path: '/vue/components/cascader',
          component: () => import('@/examples/cascader/cascader.md'),
        },
        {
          title: 'Checkbox 多选框',
          name: 'checkbox',
          path: '/vue/components/checkbox',
          component: () => import('@/examples/checkbox/checkbox.md'),
        },
        {
          title: 'DatePicker 日期选择器',
          name: 'date-picker',
          path: '/vue/components/date-picker',
          component: () => import('@/examples/date-picker/date-picker.md'),
        },
        {
          title: 'Form 表单',
          name: 'form',
          path: '/vue/components/form',
          component: () => import('@/examples/form/form.md'),
        },
        {
          title: 'Input 输入框',
          name: 'input',
          path: '/vue/components/input',
          component: () => import('@/examples/input/input.md'),
        },
        {
          title: 'InputNumber 数字输入框',
          name: 'input-number',
          path: '/vue/components/input-number',
          component: () => import('@/examples/input-number/input-number.md'),
        },
        {
          title: 'TagInput 标签输入框',
          name: 'tag-input',
          docType: 'form',
          path: '/vue/components/tag-input',
          component: () => import('@/examples/tag-input/tag-input.md'),
        },
        {
          title: 'Radio 单选框',
          name: 'radio',
          path: '/vue/components/radio',
          component: () => import('@/examples/radio/radio.md'),
        },
        {
          title: 'Select 选择器',
          name: 'select',
          path: '/vue/components/select',
          component: () => import('@/examples/select/select.md'),
        },
        {
          title: 'SelectInput 筛选器输入框',
          name: 'select-input',
          docType: 'form',
          path: '/vue/components/select-input',
          component: () => import('@/examples/select-input/select-input.md'),
        },
        {
          title: 'Slider 滑块',
          name: 'slider',
          path: '/vue/components/slider',
          component: () => import('@/examples/slider/slider.md'),
        },
        {
          title: 'Switch 开关',
          name: 'switch',
          path: '/vue/components/switch',
          component: () => import('@/examples/switch/switch.md'),
        },
        {
          title: 'Textarea 多行文本框',
          name: 'textarea',
          path: '/vue/components/textarea',
          component: () => import('@/examples/textarea/textarea.md'),
        },
        {
          title: 'Transfer 穿梭框',
          name: 'transfer',
          path: '/vue/components/transfer',
          component: () => import('@/examples/transfer/transfer.md'),
        },
        {
          title: 'TimePicker 时间选择器',
          name: 'time-picker',
          path: '/vue/components/time-picker',
          component: () => import('@/examples/time-picker/time-picker.md'),
        },
        {
          title: 'TreeSelect 树选择',
          name: 'tree-select',
          path: '/vue/components/tree-select',
          component: () => import('@/examples/tree-select/tree-select.md'),
        },
        {
          title: 'Upload 上传',
          name: 'upload',
          path: '/vue/components/upload',
          component: () => import('@/examples/upload/upload.md'),
        },
      ],
    },
    {
      title: '数据展示',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Avatar 头像',
          name: 'avatar',
          path: '/vue/components/avatar',
          component: () => import('@/examples/avatar/avatar.md'),
        },
        {
          title: 'Badge 徽标',
          name: 'badge',
          path: '/vue/components/badge',
          component: () => import('@/examples/badge/badge.md'),
        },
        {
          title: 'Calendar 日历',
          name: 'calendar',
          path: '/vue/components/calendar',
          component: () => import('@/examples/calendar/calendar.md'),
        },
        {
          title: 'Card 卡片',
          name: 'card',
          docType: 'data',
          path: '/vue/components/card',
          component: () => import('@/examples/card/card.md'),
        },
        {
          title: 'Collapse 折叠面板',
          name: 'collapse',
          docType: 'data',
          path: '/vue/components/collapse',
          component: () => import('@/examples/collapse/collapse.md')
        },
        {
          title: 'Comment 评论',
          name: 'comment',
          path: '/vue/components/comment',
          component: () => import('@/examples/comment/comment.md'),
        },
        {
          title: 'List 列表',
          name: 'list',
          path: '/vue/components/list',
          component: () => import('@/examples/list/list.md'),
        },
        {
          title: 'Loading 加载',
          name: 'loading',
          path: '/vue/components/loading',
          component: () => import('@/examples/loading/loading.md'),
        },
        {
          title: 'Progress 进度条',
          name: 'progress',
          path: '/vue/components/progress',
          component: () => import('@/examples/progress/progress.md'),
        },
        {
          title: 'Skeleton 骨架屏',
          name: 'skeleton',
          path: '/vue/components/skeleton',
          component: () => import('@/examples/skeleton/skeleton.md'),
        },
        {
          title: 'Swiper 轮播框',
          name: 'swiper',
          path: '/vue/components/swiper',
          component: () => import('@/examples/swiper/swiper.md'),
        },
        {
          title: 'Table 表格',
          name: 'table',
          path: '/vue/components/table',
          component: () => import('@/examples/table/table.md'),
        },
        {
          title: 'Tag 标签',
          name: 'tag',
          path: '/vue/components/tag',
          component: () => import('@/examples/tag/tag.md'),
        },
        {
          title: 'Tooltip 文字提示',
          name: 'tooltip',
          path: '/vue/components/tooltip',
          component: () => import('@/examples/tooltip/tooltip.md'),
        },
        {
          title: 'Tree 树',
          name: 'tree',
          path: '/vue/components/tree',
          component: () => import('@/examples/tree/tree.md'),
        },
      ],
    },
    {
      title: '消息提醒',
      type: 'component', // 组件文档
      children: [
        {
          title: 'Alert 警告提醒',
          name: 'alert',
          path: '/vue/components/alert',
          component: () => import('@/examples/alert/alert.md'),
        },
        {
          title: 'Dialog 对话框',
          name: 'dialog',
          path: '/vue/components/dialog',
          component: () => import('@/examples/dialog/dialog.md'),
        },
        {
          title: 'Drawer 抽屉',
          name: 'drawer',
          path: '/vue/components/drawer',
          component: () => import('@/examples/drawer/drawer.md'),
        },
        {
          title: 'Message 全局提示',
          name: 'message',
          path: '/vue/components/message',
          component: () => import('@/examples/message/message.md'),
        },
        {
          title: 'Notification 消息通知',
          name: 'notification',
          path: '/vue/components/notification',
          component: () => import('@/examples/notification/notification.md'),
        },
        {
          title: 'Popconfirm 气泡确认框',
          name: 'popconfirm',
          path: '/vue/components/popconfirm',
          component: () => import('@/examples/popconfirm/popconfirm.md'),
        },
        {
          title: 'Popup 弹出层',
          name: 'popup',
          path: '/vue/components/popup',
          component: () => import('@/examples/popup/popup.md'),
        },
      ],
    },
  ],
};
