<template>
  <div class="body">
    <img src="@/assets/images/notData/notData.png" alt="" />
    <p>暂无数据</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.body {
  width: 100%;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  img {
    width: 50%;
  }

  p {
    margin-top: 5%;
    color: #4073f2;
    font-size: 1.3rem;
  }
}
</style>
