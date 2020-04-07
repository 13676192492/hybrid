<template>
  <div>
    <transition :name="transitionName">
      <router-view class="child-view"></router-view>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.child-view {
  position: absolute;
  width: 100%;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(100%, 0);
  transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-100%, 0);
  transform: translate(-100%, 0);
}
</style>

<script>
// window.onload = function() {
//   // document.addEventListener("touchstart", function(event) {
//   //   if (event.touches.length > 1) {
//   //     event.preventDefault();
//   //   }
//   // });
//   // document.addEventListener("gesturestart", function(event) {
//   //   event.preventDefault();
//   // });
//   // document.body.addEventListener(
//   //   "touchmove",
//   //   function(e) {
//   //      e.preventDefault();
//   //     e.stopPropagation()
//   //   },
//   //   { passive: false }
//   // );
//   var overscroll = function(el) {
//     if (el) {
//       el.addEventListener("touchstart", function() {
//         var top = el.scrollTop,
//           totalScroll = el.scrollHeight,
//           currentScroll = top + el.offsetHeight;

//         if (top === 0) {
//           el.scrollTop = 1;
//         } else if (currentScroll === totalScroll) {
//           el.scrollTop = top - 1;
//         }
//       });
//       el.addEventListener("touchmove", function(evt) {
//         if (el.offsetHeight < el.scrollHeight) evt._isScroller = true;
//       });
//     }
//   };
//   overscroll(document.querySelector(".van-pull-refresh")); //允许滚动的区域
//   document.body.addEventListener("touchmove", function(evt) {
//     //In this case, the default behavior is scrolling the body, which
//     //would result in an overflow.  Since we don't want that, we preventDefault.
//     if (!evt._isScroller) {
//       if (evt) evt.preventDefault();
//     }
//   },{ passive: false });
// };

export default {
  data() {
    return {
      transitionName: "slide-left"
    };
  },
  beforeRouteUpdate(to, from, next) {
    let isBack = this.$router.isBack;
    if (isBack) {
      this.transitionName = "slide-right";
    } else {
      this.transitionName = "slide-left";
    }
    this.$router.isBack = false;
    next();
  }
};
</script>
