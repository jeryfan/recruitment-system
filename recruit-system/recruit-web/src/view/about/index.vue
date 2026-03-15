<!-- 首页 -->
<template>
  <div id="app">
    <Top :isnow="1" />
    <Nav />
    <Search />
    <Work />
    <Company />
    <div class="friend">
      <el-tabs class="friendList">
        <el-tab-pane>
          <span slot="label" :class="{ 'fontSize': true, 'cur': true }">友情链接</span>
          <router-link to="/index" v-for="(list, index) in friend" :key="index" class="f_list">{{ list }}</router-link>
        </el-tab-pane>
      </el-tabs>
    </div>
    <ScrollTop />
    <Footer />
  </div>
</template>

<script>
import ScrollTop from '@/component/index/scrollTop.vue'
import Search from '@/component/index/Search.vue'
import Nav from '@/component/index/Nav.vue'
import Top from '@/component/index/index.vue'
import Work from '@/component/index/Work.vue'
import Company from '@/component/index/Company.vue'
import Footer from '@/component/index/footer.vue'

export default {
  components: {
    Search,
    Nav,
    Work,
    Company,
    Top,
    ScrollTop,
    Footer,
  },
  data() {
    return {
      activeName: 'first',
      friend: ["旅游招聘网", "酒店招聘", "导游协会", "旅行社招聘", "民航招聘", "景区招聘", "酒店管理人才网", "旅游人才网", "民族旅游", "线路设计师", "旅游培训", "旅游营销", "旅游电商", "自驾游"],
    }
  },

  methods: {

  },

}
</script>

<style lang="scss">
@import url("//at.alicdn.com/t/font_631781_4v61w1yz6y74x6r.css");
$nx-color: #0470b8;
$all-padding: 0;
$nx-width: 76.25rem;

#app {
  min-width: $nx-width;

  .friend {
    width: 100%;

    .friendList {
      width: 76rem;
      margin: 0 auto;

      .f_list {
        display: inline-block;
        font-size: 0.8rem;
        color: #777;
        padding: 1rem 1rem 4rem 0;

        &:hover {
          color: $nx-color;
          text-decoration: underline;
        }
      }
    }
  }
}

@media screen and (max-with: 76.25rem) {}
</style>
