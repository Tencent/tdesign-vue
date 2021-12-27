<template>
  <t-steps :current="1" readonly>
    <t-step-item title="登录" content="已完成状态" :icon="renderLoginIcon"></t-step-item>
    <t-step-item title="购物" content="进行中状态" :icon="renderCartIcon"></t-step-item>
    <t-step-item title="支付" content="未开始" :icon="renderWalletIcon"></t-step-item>
    <t-step-item title="完成" content="未开始" :icon="renderSuccessIcon"></t-step-item>
  </t-steps>
</template>

<script lang="jsx">
import {
  LoginIcon, CartIcon, WalletIcon, CheckCircleIcon,
} from 'tdesign-icons-vue';

export default {
  methods: {
    renderLoginIcon() {
      return <LoginIcon />;
    },
    renderCartIcon() {
      return <CartIcon />;
    },
    renderWalletIcon() {
      return <WalletIcon />;
    },
    renderSuccessIcon() {
      return <CheckCircleIcon />;
    },
  },
};
</script>
