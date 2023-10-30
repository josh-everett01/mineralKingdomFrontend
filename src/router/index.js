import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Register from "../components/Register.vue"
// import Shop from '../views/Shop.vue';
// import Auctions from '../views/Auctions.vue';
// import ProductDetail from '../views/ProductDetail.vue';
// import UserProfile from '../views/UserProfile.vue';
import Login from "../views/Login.vue";
import VerifyEmail from "../views/VerifyEmail.vue";
import MineralsPage from "../components/MineralsPage.vue"
import MineralDetail from "../views/MineralDetail.vue"
// import Cart from '../views/Cart.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
  },
  {
    path: "/verify-email",
    name: "verify-email",
    component: VerifyEmail,
  },
  {
    path: "/store/minerals",
    name: "Minerals",
    component: MineralsPage,
  },
  {
    path: "/minerals/:id", // Add this new route
    name: "mineral-detail",
    component: MineralDetail,
    props: true, // This ensures that the :id param is passed as a prop to the component
  },
  // {
  //   path: "/shop",
  //   name: "Shop",
  //   component: Shop,
  // },
  // {
  //   path: "/auctions",
  //   name: "Auctions",
  //   component: Auctions,
  // },
  // {
  //   path: "/products/:id",
  //   name: "ProductDetail",
  //   component: ProductDetail,
  // },
  // {
  //   path: "/profile",
  //   name: "UserProfile",
  //   component: UserProfile,
  // },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  // {
  //   path: "/cart",
  //   name: "Cart",
  //   component: Cart,
  // },
  // Add any other routes as necessary
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;