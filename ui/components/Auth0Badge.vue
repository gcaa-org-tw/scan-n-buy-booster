<template lang="pug">
  .badge.pa3.tc
    a.db.dim(
      width="150"
      height="50"
      href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss"
      target="_blank"
      ref="noopener"
      alt="Single Sign On & Token Based Authentication - Auth0"
    )
      img(width="150" height="50" alt="JWT Auth for open source projects" src="//cdn.auth0.com/oss/badges/a0-badge-light.png")
      .f6.gray 登入認證服務由 Auth0 提供
</template>
<style lang="scss" scoped>
.badge {
  background: #f6f6f6;
  a {
    text-decoration: none;
  }
}
</style>
