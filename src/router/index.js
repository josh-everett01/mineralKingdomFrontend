import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Register from "../components/Register.vue";
// import Shop from '../views/Shop.vue';
// import Auctions from '../views/Auctions.vue';
// import ProductDetail from '../views/ProductDetail.vue';
// import UserProfile from '../views/UserProfile.vue';
import Login from "../views/Login.vue";
import VerifyEmail from "../views/VerifyEmail.vue";
import MineralsPage from "../components/MineralsPage.vue";
import MineralDetail from "../views/MineralDetail.vue";
import AuctionDetail from "../views/AuctionDetail.vue";
import PaymentSuccess from "../views/PaymentSuccess.vue";
import PaymentCancelled from "../views/PaymentCancelled.vue";
import EditMineral from "../components/EditMineral.vue";
import store from "../store/index";
import UserDashboard from "../views/UserDashboard.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import AddMineralForm from "../components/AddMineralForm.vue";
import UpdateAuctionForm from "../components/UpdateAuctionForm.vue";
import AddAuctionForm from "../components/AddAuctionForm.vue";
import Shop from "../views/Shop.vue";
import Auctions from "../views/Auctions.vue";
import Cart from "../views/Cart.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
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
  {
    path: "/auction/:id",
    name: "auction-detail",
    component: AuctionDetail, // Replace with your actual component
    props: true,
  },
  {
    path: "/payment-success/:orderId",
    name: "PaymentSuccess",
    component: PaymentSuccess,
    props: true,
  },
  {
    path: "/payment-cancelled/:orderId",
    name: "PaymentCancelled",
    component: PaymentCancelled,
    props: true,
  },
  {
    path: "/shop",
    name: "Shop",
    component: Shop,
  },
  {
    path: "/auctions",
    name: "Auctions",
    component: Auctions,
  },
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
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
  {
    path: "/user",
    component: UserDashboard,
    name: "user-dashboard",
    beforeEnter(to, from, next) {
      if (store.getters.isUser) {
        next();
      } else {
        next("/login"); // Redirect to login page if not admin
      }
    },
  },
  {
    path: "/admin",
    component: AdminDashboard,
    name: "admin-dashboard",
    beforeEnter(to, from, next) {
      if (store.getters.isAdmin) {
        next();
      } else {
        next("/login"); // Redirect to login page if not admin
      }
    },
  },
  {
    path: "/admin/add-mineral",
    component: AddMineralForm,
    name: "admin-add-mineral",
    beforeEnter(to, from, next) {
      if (store.getters.isAdmin) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/admin/add-auction",
    component: AddAuctionForm,
    name: "admin-add-auction",
    beforeEnter(to, from, next) {
      if (store.getters.isAdmin) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/admin/update-auction/:id",
    component: UpdateAuctionForm,
    name: "admin-update-auction",
    props: true,
    beforeEnter(to, from, next) {
      if (store.getters.isAdmin) {
        next();
      } else {
        next("/login");
      }
    },
  },
  {
    path: "/admin/edit-mineral/:id", // Include 'admin' in the path
    component: EditMineral,
    name: "admin-edit-mineral",
    props: true,
    beforeEnter(to, from, next) {
      if (store.getters.isAdmin) {
        next();
      } else {
        next("/login"); // Redirect to login page if not admin
      }
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  // Check if the minerals need to be fetched
  if (store.getters["minerals/availableMinerals"].length === 0) {
    store
      .dispatch("minerals/fetchMinerals")
      .then(() => next())
      .catch((error) => {
        console.error("Error fetching minerals:", error);
        next();
      });
  } else {
    next();
  }
});

export default router;
