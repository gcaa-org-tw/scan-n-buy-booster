<template lang="pug">
  .vertical-step.min-vh-100.w-100.flex.flex-column.justify-between
    .vertical-step__head
      slot(name="head")
    .vertical-step__content.pv3
      slot
    .vertical-step__tail
      slot(name="tail")
</template>
