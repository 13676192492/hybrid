<template>
    <svg class="icon" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
</template>

<script>
    export default {
        name: "icon-svg",
        //props用于父子组件传值
        props: {
            name: {
                type: String,
                required: true
            }
        },
        computed: {
            iconName() {
                return `#icon-${this.name}`;
            }
        }
    }
</script>

<style lang="scss" scoped>
.icon {
    width:1em;
    height:1em;
    vertical-align:-0.15em;
    fill:currentColor;
    overflow:hidden;
}
</style>